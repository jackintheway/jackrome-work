/* ============================================================
   SHOP : the Wayspace room for the merch

   Draws the Shop room with the shared Fourthwall layer in
   js/fourthwall.js. This file owns the page; that one owns the
   conversation with Fourthwall. Keep that line where it is, so the
   standalone wayspace.store can bring its own page to the same layer.

   WHAT HAPPENS HERE
   Browsing, the product view and the cart all happen on this page.
   Only the final Checkout goes to Fourthwall, which is Jack's call as
   much as the API's: he wants visitors told plainly that it does.

   A PRODUCT HAS AN ADDRESS
   Opening a product puts ?product=<slug> in the address bar, and
   arriving with one opens that product. That is how the Design room
   links to a garment, and how a single piece can be shared.

   DESIGNS AND GARMENTS
   An entry in the DESIGN array (js/wayspace.js) may carry
   `shop: ["<fourthwall-slug>", ...]`. The Design room shows a link
   here, and this room reads the same field backwards to link a
   garment to its design. One map, kept on Jack's side, because the
   Storefront API cannot write to products.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const FW = window.Fourthwall;
  const grid = document.getElementById("shopGrid");
  const status = document.getElementById("shopStatus");
  const productDialog = document.getElementById("productDialog");
  const cartDialog = document.getElementById("cartDialog");
  const cartOpen = document.getElementById("cartOpen");
  const cartCount = document.getElementById("cartCount");
  if (!FW || !grid) return;

  const SHOP_URL = "https://wayspace-shop.fourthwall.com/";
  let products = [];
  let cart = null;
  let busy = false;

  /* ---------- Small helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  // The lowest price across a product's variants. Fourthwall sends no
  // product-level price, only one per variant.
  function fromPrice(product) {
    const prices = (product.variants || []).map(v => v.unitPrice).filter(Boolean);
    if (!prices.length) return null;
    return prices.reduce((low, p) => (p.value < low.value ? p : low));
  }

  function priceLabel(product) {
    const variants = product.variants || [];
    const low = fromPrice(product);
    if (!low) return "";
    const varies = variants.some(v => v.unitPrice && v.unitPrice.value !== low.value);
    return (varies ? "From " : "") + FW.formatMoney(low);
  }

  // The API documents state as a string and sends { type: "..." }.
  // Accept either, so a fix on their side does not break this.
  function stateOf(thing) {
    const s = thing && thing.state;
    return typeof s === "string" ? s : (s && s.type) || null;
  }

  function variantInStock(v) {
    if (!v || !v.stock) return true;
    if (v.stock.type === "UNLIMITED") return true;
    return (v.stock.inStock || 0) > 0;
  }

  function productSoldOut(product) {
    if (stateOf(product) === "SOLD_OUT") return true;
    const variants = product.variants || [];
    return variants.length > 0 && !variants.some(variantInStock);
  }

  /* Fourthwall's detail sections arrive as HTML written in its
     dashboard. Only plain text structure survives: lists, paragraphs,
     emphasis, line breaks. Everything else becomes its text, and no
     attribute of any kind is kept, so nothing in that field can run a
     script or restyle this page. */
  const ALLOWED = new Set(["P", "UL", "OL", "LI", "STRONG", "EM", "B", "I", "BR"]);
  function cleanHtml(html) {
    const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    function walk(node, out) {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          out.appendChild(document.createTextNode(child.textContent));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (ALLOWED.has(child.tagName)) {
            const el = document.createElement(child.tagName.toLowerCase());
            walk(child, el);
            out.appendChild(el);
          } else if (!["SCRIPT", "STYLE", "IFRAME", "OBJECT", "TEMPLATE"].includes(child.tagName)) {
            walk(child, out);
          }
        }
      });
      return out;
    }
    return walk(doc.body, document.createDocumentFragment());
  }

  // DESIGN entries that name this product in their `shop` field.
  function designsFor(slug) {
    if (typeof DESIGN === "undefined") return [];
    return DESIGN.filter(d => Array.isArray(d.shop) && d.shop.includes(slug));
  }

  function setStatus(html) {
    status.innerHTML = html;
    status.hidden = !html;
  }

  /* ---------- The grid ---------- */

  function cardImage(product) {
    const img = (product.images || [])[0];
    if (!img) return `<div class="shop-cover is-placeholder" aria-hidden="true"><span>Photo coming</span></div>`;
    return `<img class="shop-cover" src="${esc(img.transformedUrl || img.url)}" alt="" loading="lazy"
      width="${esc(img.width || 600)}" height="${esc(img.height || 800)}">`;
  }

  // The title is the card's one control, stretched over the whole card
  // the way the lyric cards in Writing are. A button, not a link: it
  // opens something on this page rather than going anywhere.
  function productCard(product) {
    const soldOut = productSoldOut(product);
    return `
      <li class="work-card shop-card${soldOut ? " is-sold-out" : ""}">
        ${cardImage(product)}
        <div class="work-body">
          <h3 class="work-title shop-card-title">
            <button type="button" class="shop-card-open" data-slug="${esc(product.slug)}">${esc(product.name)}</button>
          </h3>
          <p class="work-meta shop-card-price">${soldOut ? "Sold out" : esc(priceLabel(product))}</p>
        </div>
      </li>`;
  }

  function renderGrid() {
    grid.innerHTML = products.map(productCard).join("");
  }

  grid.addEventListener("click", e => {
    const btn = e.target.closest(".shop-card-open");
    if (btn) openProduct(btn.dataset.slug, true);
  });

  /* ---------- The product view ---------- */

  // Colors and sizes as the visitor picks them. A variant is the one
  // whose color and size both match.
  let current = null;

  function optionLists(product) {
    const colors = [];
    const sizes = [];
    (product.variants || []).forEach(v => {
      const a = v.attributes || {};
      if (a.color && !colors.some(c => c.name === a.color.name)) colors.push(a.color);
      if (a.size && !sizes.includes(a.size.name)) sizes.push(a.size.name);
    });
    return { colors, sizes };
  }

  function findVariant(product, color, size) {
    return (product.variants || []).find(v => {
      const a = v.attributes || {};
      const colorOk = !a.color || a.color.name === color;
      const sizeOk = !a.size || a.size.name === size;
      return colorOk && sizeOk;
    }) || null;
  }

  function imagesFor(product, variant) {
    const own = variant && variant.images && variant.images.length ? variant.images : null;
    return own || product.images || [];
  }

  function renderProduct() {
    const { product, color, size, imageIndex, note } = current;
    const { colors, sizes } = optionLists(product);
    const variant = findVariant(product, color, size);
    const images = imagesFor(product, variant);
    const shown = images[Math.min(imageIndex, images.length - 1)];
    const inStock = variant ? variantInStock(variant) : false;
    const needsPick = (colors.length > 1 && !color) || (sizes.length > 1 && !size);
    const designs = designsFor(product.slug);

    const colorPicker = colors.length > 1 ? `
      <fieldset class="shop-options">
        <legend>Color${color ? `: <span class="shop-picked">${esc(color)}</span>` : ""}</legend>
        <div class="shop-option-row">
          ${colors.map(c => `
            <button type="button" class="shop-swatch" data-color="${esc(c.name)}"
              aria-pressed="${c.name === color}" aria-label="${esc(c.name)}"
              style="--swatch: ${esc(/^#[0-9a-f]{3,8}$/i.test(c.swatch || "") ? c.swatch : "#cccccc")}"></button>`).join("")}
        </div>
      </fieldset>` : "";

    const sizePicker = sizes.length > 1 ? `
      <fieldset class="shop-options">
        <legend>Size</legend>
        <div class="shop-option-row">
          ${sizes.map(s => {
            const v = findVariant(product, color || (colors[0] && colors[0].name), s);
            const out = v && !variantInStock(v);
            return `<button type="button" class="shop-size" data-size="${esc(s)}"
              aria-pressed="${s === size}"${out ? ' disabled aria-describedby="soldOutNote"' : ""}>${esc(s)}</button>`;
          }).join("")}
        </div>
      </fieldset>` : "";

    const price = variant ? FW.formatMoney(variant.unitPrice) : priceLabel(product);
    const compare = variant && variant.compareAtPrice && variant.compareAtPrice.value > variant.unitPrice.value
      ? ` <s class="shop-compare">${esc(FW.formatMoney(variant.compareAtPrice))}</s>` : "";

    let addLabel = "Add to cart";
    if (productSoldOut(product)) addLabel = "Sold out";
    else if (needsPick) addLabel = sizes.length > 1 && !size ? "Choose a size" : "Choose a color";
    else if (!inStock) addLabel = "Sold out";
    const canAdd = !busy && !needsPick && variant && inStock && !productSoldOut(product);

    productDialog.innerHTML = `
      <button type="button" class="shop-close" data-close>Close</button>
      <div class="shop-product-layout">
        <div class="shop-gallery">
          ${shown ? `<img class="shop-gallery-main" src="${esc(shown.transformedUrl || shown.url)}"
            alt="${esc(product.name)}${color ? ", " + esc(color) : ""}" width="${esc(shown.width || 600)}" height="${esc(shown.height || 800)}">` : ""}
          ${images.length > 1 ? `
            <div class="shop-thumbs">
              ${images.map((img, i) => `
                <button type="button" class="shop-thumb" data-image="${i}" aria-pressed="${img === shown}"
                  aria-label="Photo ${i + 1} of ${images.length}">
                  <img src="${esc(img.transformedUrl || img.url)}" alt="" loading="lazy" width="80" height="106">
                </button>`).join("")}
            </div>` : ""}
        </div>
        <div class="shop-info">
          <h2 class="shop-product-name" id="productName">${esc(product.name)}</h2>
          <p class="shop-product-price">${esc(price)}${compare}</p>
          ${product.description ? `<div class="shop-desc" data-desc></div>` : ""}
          ${colorPicker}
          ${sizePicker}
          <p class="shop-sold-note" id="soldOutNote" hidden>Sold out in this color.</p>
          <div class="shop-actions">
            <button type="button" class="btn shop-add" data-add${canAdd ? "" : " disabled"}>${esc(addLabel)}</button>
            <button type="button" class="btn btn-secondary" data-view-cart${cart && FW.cartCount(cart) ? "" : " hidden"}>View cart</button>
          </div>
          <p class="shop-note" role="status">${note ? esc(note) : ""}</p>
          ${designs.length ? `<p class="shop-design-link">${designs.map(d =>
            `<a class="watch-btn crossref-btn to-design" href="/wayspace/design#${esc(d.anchor)}">See the design: ${esc(d.title)}</a>`).join(" ")}</p>` : ""}
          ${(product.additionalInformation || []).map(sec => `
            <details class="shop-details">
              <summary>${esc(sec.title)}</summary>
              <div class="shop-details-body" data-section="${esc(sec.type)}"></div>
            </details>`).join("")}
        </div>
      </div>`;

    const desc = productDialog.querySelector("[data-desc]");
    if (desc) desc.appendChild(cleanHtml(product.description));
    (product.additionalInformation || []).forEach(sec => {
      const body = productDialog.querySelector(`[data-section="${CSS.escape(sec.type)}"]`);
      if (body) body.appendChild(cleanHtml(sec.bodyHtml));
    });
  }

  function openProduct(slug, pushHistory) {
    const product = products.find(p => p.slug === slug);
    if (!product) return false;
    const { colors, sizes } = optionLists(product);
    // One choice is no choice: preselect it. Several: the visitor picks,
    // except color, which starts on the first so the photos match.
    current = {
      product,
      color: colors.length ? colors[0].name : null,
      size: sizes.length === 1 ? sizes[0] : null,
      imageIndex: 0,
      note: ""
    };
    renderProduct();
    if (!productDialog.open) productDialog.showModal();
    if (pushHistory) {
      const url = new URL(location.href);
      url.searchParams.set("product", slug);
      history.pushState({ product: slug }, "", url);
    }
    return true;
  }

  productDialog.addEventListener("click", e => {
    if (e.target === productDialog || e.target.closest("[data-close]")) { productDialog.close(); return; }
    if (!current) return;
    const swatch = e.target.closest(".shop-swatch");
    const sizeBtn = e.target.closest(".shop-size");
    const thumb = e.target.closest(".shop-thumb");
    if (swatch) {
      current.color = swatch.dataset.color;
      current.imageIndex = 0;
      const v = current.size && findVariant(current.product, current.color, current.size);
      if (v && !variantInStock(v)) current.size = null;
      current.note = "";
      renderProduct();
      productDialog.querySelector(`.shop-swatch[data-color="${CSS.escape(current.color)}"]`)?.focus();
    } else if (sizeBtn && !sizeBtn.disabled) {
      current.size = sizeBtn.dataset.size;
      current.note = "";
      renderProduct();
      productDialog.querySelector(`.shop-size[data-size="${CSS.escape(current.size)}"]`)?.focus();
    } else if (thumb) {
      current.imageIndex = Number(thumb.dataset.image);
      renderProduct();
      productDialog.querySelector(`.shop-thumb[data-image="${current.imageIndex}"]`)?.focus();
    } else if (e.target.closest("[data-add]")) {
      addCurrent();
    } else if (e.target.closest("[data-view-cart]")) {
      productDialog.close();
      openCart();
    }
  });

  // Leaving the product view takes ?product= back off the address, so
  // a reload does not reopen something the visitor already closed.
  productDialog.addEventListener("close", () => {
    current = null;
    const url = new URL(location.href);
    if (url.searchParams.has("product")) {
      url.searchParams.delete("product");
      history.replaceState(null, "", url);
    }
  });

  window.addEventListener("popstate", () => {
    const slug = new URL(location.href).searchParams.get("product");
    if (slug) openProduct(slug, false);
    else if (productDialog.open) productDialog.close();
  });

  function addCurrent() {
    const variant = findVariant(current.product, current.color, current.size);
    if (!variant || busy) return;
    busy = true;
    current.note = "Adding…";
    renderProduct();
    FW.addToCart(variant.id, 1).then(updated => {
      cart = updated;
      renderCartButton();
      if (current) current.note = "Added to your cart.";
    }).catch(() => {
      if (current) current.note = "That didn't go through. Please try again.";
    }).finally(() => {
      busy = false;
      if (current) {
        renderProduct();
        productDialog.querySelector("[data-view-cart]:not([hidden])")?.focus();
      }
    });
  }

  /* ---------- The cart ---------- */

  function renderCartButton() {
    const n = FW.cartCount(cart);
    cartCount.textContent = String(n);
    cartOpen.setAttribute("aria-label", `Cart, ${n} ${n === 1 ? "item" : "items"}`);
  }

  function cartLine(item) {
    const v = item.variant;
    const img = (v.images || [])[0];
    const desc = (v.attributes && v.attributes.description) || "";
    return `
      <li class="shop-line">
        ${img ? `<img class="shop-line-img" src="${esc(img.transformedUrl || img.url)}" alt="" width="72" height="96" loading="lazy">` : `<span class="shop-line-img"></span>`}
        <div class="shop-line-body">
          <p class="shop-line-name">${esc(v.product ? v.product.name : v.name)}</p>
          ${desc ? `<p class="shop-line-meta">${esc(desc)}</p>` : ""}
          <p class="shop-line-meta">${esc(FW.formatMoney(v.unitPrice))} each</p>
          <div class="shop-qty">
            <button type="button" data-qty="-1" data-variant="${esc(v.id)}"
              aria-label="One fewer ${esc(v.name)}"${busy ? " disabled" : ""}>&minus;</button>
            <span class="shop-qty-n" aria-label="Quantity">${esc(item.quantity)}</span>
            <button type="button" data-qty="1" data-variant="${esc(v.id)}"
              aria-label="One more ${esc(v.name)}"${busy ? " disabled" : ""}>+</button>
            <button type="button" class="shop-remove" data-remove="${esc(v.id)}"${busy ? " disabled" : ""}>Remove</button>
          </div>
        </div>
      </li>`;
  }

  let cartNote = "";

  function renderCart() {
    const items = (cart && cart.items) || [];
    const subtotal = FW.cartSubtotal(cart);
    const checkout = FW.checkoutUrl();
    cartDialog.innerHTML = `
      <button type="button" class="shop-close" data-close>Close</button>
      <h2 class="shop-cart-title" id="cartTitle">Your cart</h2>
      ${items.length ? `
        <ul class="shop-lines">${items.map(cartLine).join("")}</ul>
        <p class="shop-subtotal"><span>Subtotal</span> <strong>${esc(FW.formatMoney(subtotal))}</strong></p>
        <p class="shop-checkout-note">Checkout happens on Fourthwall, where you pay and add shipping. Tax and shipping are worked out there.</p>
        <div class="shop-actions">
          <a class="btn shop-checkout" href="${esc(checkout)}">Check out on Fourthwall</a>
          <button type="button" class="btn btn-secondary" data-close>Keep browsing</button>
        </div>` : `
        <p class="shop-empty">Your cart is empty.</p>
        <div class="shop-actions">
          <button type="button" class="btn btn-secondary" data-close>Keep browsing</button>
        </div>`}
      <p class="shop-note" role="status">${esc(cartNote)}</p>`;
  }

  function openCart() {
    cartNote = "";
    renderCart();
    cartDialog.showModal();
    // Refresh from Fourthwall, so prices and stock are current.
    FW.getCart().then(fresh => { cart = fresh; renderCartButton(); if (cartDialog.open) renderCart(); })
      .catch(() => {});
  }

  cartOpen.addEventListener("click", openCart);

  function cartChange(promise, focusSelector) {
    busy = true;
    cartNote = "Updating…";
    renderCart();
    promise.then(updated => {
      cart = updated;
      cartNote = "Cart updated.";
    }).catch(() => {
      cartNote = "That didn't go through. Please try again.";
    }).finally(() => {
      busy = false;
      renderCartButton();
      renderCart();
      const target = focusSelector && cartDialog.querySelector(focusSelector);
      (target || cartDialog.querySelector(".shop-close")).focus();
    });
  }

  cartDialog.addEventListener("click", e => {
    if (e.target === cartDialog || e.target.closest("[data-close]")) { cartDialog.close(); return; }
    if (busy) return;
    const qty = e.target.closest("[data-qty]");
    const remove = e.target.closest("[data-remove]");
    if (qty) {
      const id = qty.dataset.variant;
      const line = cart.items.find(i => i.variant.id === id);
      if (!line) return;
      const next = line.quantity + Number(qty.dataset.qty);
      const selector = `[data-qty="${qty.dataset.qty}"][data-variant="${CSS.escape(id)}"]`;
      cartChange(FW.setQuantity(id, next), next > 0 ? selector : null);
    } else if (remove) {
      cartChange(FW.removeFromCart(remove.dataset.remove), null);
    }
  });

  /* ---------- Opening the shop ---------- */

  if (!FW.isOpen()) {
    setStatus(`The shop is closed for the moment. You can still browse it on <a href="${SHOP_URL}" target="_blank" rel="noopener">Fourthwall</a>.`);
    return;
  }

  Promise.all([FW.getCollectionProducts(), FW.getCart().catch(() => null)])
    .then(([list, existingCart]) => {
      products = list.filter(p => stateOf({ state: p.access }) !== "HIDDEN");
      cart = existingCart;
      cartOpen.hidden = false;
      renderCartButton();
      if (!products.length) {
        setStatus("Nothing in the shop right now. New pieces are on the way.");
        return;
      }
      setStatus("");
      renderGrid();
      const slug = new URL(location.href).searchParams.get("product");
      if (slug && !openProduct(slug, false)) {
        const url = new URL(location.href);
        url.searchParams.delete("product");
        history.replaceState(null, "", url);
      }
    })
    .catch(() => {
      setStatus(`The shop didn't load. Try again in a moment, or browse it on <a href="${SHOP_URL}" target="_blank" rel="noopener">Fourthwall</a>.`);
    });
});
