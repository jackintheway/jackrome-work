# The Shop room (built and deployed 2026-09-30)

Moved out of `CLAUDE.md` on 2026-10-11 during an instruction-file audit, so it loads only when a task touches it. Dated decisions; verify against the current files before acting on them.

A seventh Wayspace room at `/wayspace/shop`, drawn live from Jack's
Fourthwall shop through the Storefront API. Fourthwall stays the backend:
products, samples, payment, tax, fulfillment. Planning notes from the
session that led here live outside this repo in `../wayspace-store/`.

- **Two front-ends, one backend.** Phase 1 is this room. Phase 2 is a
  standalone wayspace.store in a "deluxe" expression of the design system,
  with a footer link back here. wayspace.store keeps redirecting to
  Fourthwall until Phase 2 ships. Carts do not cross domains, by design.
- **`js/fourthwall.js` holds every Fourthwall call and no page code**, so
  Phase 2 reuses it unchanged. `js/shop.js` draws the room.
- **Live fetch is a scoped exception to the facade rule.** Opening the room
  counts as the visitor asking, like pressing play. No other page calls
  Fourthwall; other rooms only link to the Shop.
- **The token never enters this public repo.** `build-site.py` writes
  `js/fourthwall.config.js` into `_site/` from the Netlify variable
  `FW_STOREFRONT_TOKEN` (not marked secret: Netlify's secret scanning would
  fail a deploy that publishes it, and publishing it is the point; the
  token can only read the shop and keep carts). Locally the same file is
  gitignored. Without a token the room says it is closed.
- **Fourthwall's docs are wrong in two places, checked live:** the token is a
  `storefront_token` query parameter, not a Bearer header, and a product's
  `state` and `access` arrive as `{ type: "..." }`, not a string. Cart add,
  change and remove are POSTs to `/carts/{id}/add`, `/change`, `/remove`.
  There is no product-level price; the room shows the lowest variant price.
- **No webhook in Phase 1.** Live fetch shows a new product the moment it is
  published. A webhook only matters for a pre-rendered catalog, where each
  change would cost a 15-credit deploy.
- **No Open API user.** Jack manages products in Fourthwall's dashboard.
- **The room is black with paper text**, per Jack. Fourthwall's own checkout
  is also black with the Wayspace logo, so the handoff feels continuous.
- **Designs and garments cross-link through one field**: a DESIGN entry in
  `js/wayspace.js` may carry `shop: ["<fourthwall-slug>", ...]`. The Design
  card shows a black "Wear it" button: one product links to it, several link
  to `/wayspace/shop?design=<anchor>`, which shows only those pieces. The
  Shop reads the field backwards for "See the design". Only the puzzle logo
  family is mapped (hoodie, tank, tee, hat, trucker), per Jack: "That's
  really it."
- **Checkout opens in a new tab**, following the standing rule, per Jack:
  a visitor should always be able to get back to the site. The Shop
  refreshes the cart when its tab becomes visible again.
- **Photos sit on gray, `#e4e4e4`.** 18 of 23 lead photos have that studio
  gray baked in and 5 are transparent squares, which showed the page's
  beige through them. Jack chose gray over re-exporting the mockups on
  paper. Photos are contained, not cropped. One value, `--shop-photo`.
- **Copy is Jack's choice (2026-09-30):** hero "These are pieces I designed
  and wear myself. You can browse and fill your cart here, and when you're
  ready, checkout opens on Fourthwall in a new tab." Lobby row "Wayspace
  designs you can wear."
- **Still open:** what Fourthwall's "External Store URL" setting does
  before anyone sets it.
