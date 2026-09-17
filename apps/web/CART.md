# Product details and cart (frontend demo)

- Click a product card to open `/products/:productId`. Product descriptions and local images come from `src/pages/home/data/products.ts`.
- `specs` describes one complete SKU configuration. Related SKUs have the same optional `variantGroup`; selecting a configuration navigates to its own ID and updates price, image, description and specs.
- The existing iPhone 16 128/256GB and Galaxy S24 Ultra 256/512GB records are grouped. Other records offer only the configuration already present in the catalog. No extra configurations, prices or colors are invented.
- To add another configuration, create a new record with a unique ID, local image, price, specs and description, then set the same `variantGroup` on the related records.
- Each cart line is keyed by product ID. Repeated additions merge quantities for that SKU; different SKUs remain separate.
- Add to cart stays on the detail page with confirmation. Buy now adds the selected SKU/quantity and opens `/cart`.
- `/cart` supports quantity changes, item removal, line subtotals, overall total and an empty state. Quantity is limited to integers 1–99 per SKU as a demo UI limit, not an inventory check. Direct quantity entry commits on blur or Enter; invalid entries revert.
- The header displays the total number of units. Cart data is kept in this tab's memory across client-side navigation, including Login/Profile. It is a tab-scoped guest basket, not a per-account server cart; reload/closing the tab clears it. The checkout button opens `/checkout` for simulated payment; see CHECKOUT.md. No inventory checks or backend requests are implemented.
- Reusable UI lives in `components/share/`; detail-specific components are in `pages/product/components/`, cart items in `pages/cart/components/`. Every visual component has its own TSX and CSS Module.
- The former ProductPreview dialog is removed. The existing brand pagination/filter UI is preserved.

Validation: frontend build/lint and browser smoke checks for routes, descriptions, variant selection, merged/separate SKU lines, buy-now navigation, quantities/totals, empty state, invalid IDs, history navigation and widths 320/390/768/1440.
