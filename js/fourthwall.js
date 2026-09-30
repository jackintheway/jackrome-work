/* ============================================================
   FOURTHWALL : the shared shop layer

   Everything that talks to Fourthwall's Storefront API lives here,
   and nothing here touches the page. The Shop room (js/shop.js)
   draws with it now; the standalone wayspace.store is meant to reuse
   this same file later with its own look on top. Keep it free of DOM
   code so that stays true.

   WHAT IT CAN DO
   Read published products and collections, and keep a cart: create
   it, add, change, remove. Checkout is not ours. The Storefront API
   only hands a cart to Fourthwall's hosted checkout, which is also
   what keeps Fourthwall responsible for payment, tax and shipping.

   THE TOKEN
   The Storefront token is built to be public: anyone can read it in
   the browser, and it can only read the shop and keep carts. Even so
   it is kept out of this public repository. The Netlify build writes
   js/fourthwall.config.js from an environment variable (see
   tools/build-site.py), and locally that same file is gitignored.
   With no token the shop reports itself closed rather than failing
   in pieces.

   Fourthwall takes the token as a `storefront_token` query parameter,
   not an Authorization header. Checked against their API reference on
   2026-09-30; an earlier planning note had it as a header.

   THE CART
   Only the cart id is stored, in localStorage, so a visitor's cart
   survives a reload. The cart itself always comes back from
   Fourthwall, so prices and stock are never stale. Carts do not
   travel between domains, and that is fine: someone shops here or on
   wayspace.store, not both.
   ============================================================ */

(function () {
  "use strict";

  var API = "https://storefront-api.fourthwall.com/v1";
  var CART_KEY = "fw-cart-id";

  var settings = {
    token: null,
    // The Fourthwall shop's own domain, where checkout happens.
    checkoutDomain: "wayspace-shop.fourthwall.com",
    // Every Fourthwall shop has an "all" collection holding every
    // published product.
    collection: "all",
    currency: "USD"
  };

  var fromBuild = window.FOURTHWALL_CONFIG || {};
  if (typeof fromBuild.token === "string" && fromBuild.token) {
    settings.token = fromBuild.token;
  }

  function configure(overrides) {
    Object.keys(overrides || {}).forEach(function (key) {
      if (key in settings) settings[key] = overrides[key];
    });
  }

  function isOpen() {
    return Boolean(settings.token);
  }

  // An error that carries Fourthwall's own code, so a caller can tell a
  // cart that expired (CART_NOT_FOUND) from a network failure.
  function FourthwallError(status, code, message) {
    this.name = "FourthwallError";
    this.status = status;
    this.code = code || null;
    this.message = message || "Fourthwall request failed";
  }
  FourthwallError.prototype = Object.create(Error.prototype);

  function request(method, path, params, body) {
    if (!settings.token) {
      return Promise.reject(new FourthwallError(0, "NO_TOKEN", "The shop has no storefront token"));
    }
    var query = new URLSearchParams(params || {});
    query.set("storefront_token", settings.token);
    query.set("currency", settings.currency);
    var init = { method: method, headers: { Accept: "application/json" } };
    if (body) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    return fetch(API + path + "?" + query.toString(), init).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        if (!res.ok) {
          var code = data && (data.code || data.error || data.type);
          throw new FourthwallError(res.status, code, data && data.message);
        }
        return data;
      });
    });
  }

  /* ---------- Reading the shop ---------- */

  function getShop() {
    return request("GET", "/shop");
  }

  // Walks every page, so the caller gets the whole collection at once.
  // A small shop is one request; the page size keeps a large one sane.
  function getCollectionProducts(slug) {
    var collection = slug || settings.collection;
    var all = [];
    function page(n) {
      return request("GET", "/collections/" + encodeURIComponent(collection) + "/products",
        { page: String(n), size: "50" })
        .then(function (data) {
          all = all.concat((data && data.results) || []);
          var paging = data && data.paging;
          if (paging && paging.hasNextPage && n < 20) return page(n + 1);
          return all;
        });
    }
    return page(0);
  }

  function getProduct(slug) {
    return request("GET", "/products/" + encodeURIComponent(slug));
  }

  /* ---------- The cart ---------- */

  function readCartId() {
    try { return window.localStorage.getItem(CART_KEY); } catch (e) { return null; }
  }

  function writeCartId(id) {
    try {
      if (id) window.localStorage.setItem(CART_KEY, id);
      else window.localStorage.removeItem(CART_KEY);
    } catch (e) { /* private window: the cart lasts for this page only */ }
  }

  var memoryCartId = null;
  function cartId() { return memoryCartId || readCartId(); }
  function rememberCart(cart) {
    memoryCartId = cart && cart.id ? cart.id : null;
    writeCartId(memoryCartId);
    return cart;
  }

  function forgetCart() {
    memoryCartId = null;
    writeCartId(null);
  }

  // The visitor's current cart, or null if they have not started one.
  // A cart Fourthwall no longer knows (expired, or checked out) is
  // forgotten quietly rather than shown as an error.
  function getCart() {
    var id = cartId();
    if (!id) return Promise.resolve(null);
    return request("GET", "/carts/" + encodeURIComponent(id)).then(rememberCart, function (err) {
      if (err.status === 404) { forgetCart(); return null; }
      throw err;
    });
  }

  function addToCart(variantId, quantity) {
    var items = [{ variantId: variantId, quantity: quantity || 1 }];
    var id = cartId();
    if (!id) return request("POST", "/carts", null, { items: items }).then(rememberCart);
    return request("POST", "/carts/" + encodeURIComponent(id) + "/add", null, { items: items })
      .then(rememberCart, function (err) {
        // The stored cart went away. Start a fresh one with this item.
        if (err.status === 404) {
          forgetCart();
          return request("POST", "/carts", null, { items: items }).then(rememberCart);
        }
        throw err;
      });
  }

  // Sets a line to an exact quantity. Zero removes it.
  function setQuantity(variantId, quantity) {
    var id = cartId();
    if (!id) return Promise.resolve(null);
    if (quantity <= 0) return removeFromCart(variantId);
    return request("POST", "/carts/" + encodeURIComponent(id) + "/change", null,
      { items: [{ variantId: variantId, quantity: quantity }] }).then(rememberCart);
  }

  // Fourthwall's remove call takes a quantity too. Passing the line's
  // full quantity is what takes it out of the cart entirely.
  function removeFromCart(variantId) {
    var id = cartId();
    if (!id) return Promise.resolve(null);
    return getCart().then(function (cart) {
      if (!cart) return null;
      var line = (cart.items || []).filter(function (item) {
        return item.variant && item.variant.id === variantId;
      })[0];
      if (!line) return cart;
      return request("POST", "/carts/" + encodeURIComponent(cart.id) + "/remove", null,
        { items: [{ variantId: variantId, quantity: line.quantity }] }).then(rememberCart);
    });
  }

  function checkoutUrl() {
    var id = cartId();
    if (!id) return null;
    return "https://" + settings.checkoutDomain + "/checkout/?cartCurrency=" +
      encodeURIComponent(settings.currency) + "&cartId=" + encodeURIComponent(id);
  }

  /* ---------- Small shared helpers ---------- */

  function cartCount(cart) {
    return ((cart && cart.items) || []).reduce(function (sum, item) {
      return sum + (item.quantity || 0);
    }, 0);
  }

  function cartSubtotal(cart) {
    var items = (cart && cart.items) || [];
    if (!items.length) return null;
    var currency = items[0].variant.unitPrice.currency;
    var value = items.reduce(function (sum, item) {
      return sum + item.variant.unitPrice.value * item.quantity;
    }, 0);
    return { value: value, currency: currency };
  }

  function formatMoney(money) {
    if (!money || typeof money.value !== "number") return "";
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: money.currency })
        .format(money.value);
    } catch (e) {
      return money.value.toFixed(2) + " " + money.currency;
    }
  }

  window.Fourthwall = {
    configure: configure,
    isOpen: isOpen,
    getShop: getShop,
    getCollectionProducts: getCollectionProducts,
    getProduct: getProduct,
    getCart: getCart,
    addToCart: addToCart,
    setQuantity: setQuantity,
    removeFromCart: removeFromCart,
    checkoutUrl: checkoutUrl,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    formatMoney: formatMoney,
    FourthwallError: FourthwallError
  };
})();
