# Product details and cart

The frontend Product type mirrors the Product Service response: numeric product `id`, URL `slug`, product information and `variants[]`. Each active variant has a numeric `id`, SKU, color, storage, RAM, image and price. Images remain in `public/`; their relative paths come from the API.

`src/api/products.ts` calls `/api/products` and `/api/products/:slug` through the gateway. `CatalogProvider` fetches all catalog pages (limit 50 per request), with loading/error/retry states and cancellation on unmount, then shares the data across Home, product detail, cart and checkout. This preserves the existing local search/brand controls and “Xem thêm 8 sản phẩm” behavior. The catalog is currently small; for a large catalog, migrate filtering and incremental listing to backend pagination.

Product details select one actual storage/RAM configuration and one available color. The selected variant sets image, price and SKU. The demo cart stores `variantId` and quantity, so different colors/configurations are separate lines. The cart and checkout display the exact variant and use its price. Cart data remains in tab memory; checkout/payment and authentication are still demos. No frontend mock product list remains.

Run product-service and api-gateway, then `npm run dev -w apps/web`. Vite proxies `/api` to `localhost:3000`. For production hosting, route `/api` to the gateway there as well.
