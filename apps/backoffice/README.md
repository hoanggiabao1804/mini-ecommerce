# Mini Ecommerce Backoffice

React + TypeScript + Vite admin UI. Dashboard and Products are implemented; other sidebar entries are placeholders for later services.

## Run locally

From the repository root:

```bash
npm install
npm run dev -w apps/backoffice
```

Copy `.env.example` to `.env` to customize the local setup. Backoffice defaults to `http://localhost:5174`, proxies `/api` to API Gateway (`http://localhost:3000`), and proxies `/images` to the storefront (`http://localhost:5173`). Run Gateway and Product Service to load the product list. Run storefront too if you want product images to appear; the UI shows an image placeholder otherwise.

```bash
npm run lint -w apps/backoffice
npm run build -w apps/backoffice
```

The dashboard currently gets only the visible-product count from Product Service. Order, revenue, user, notification, and other admin data are waiting for their backend APIs. Products is read-only and uses the public product-list response, which includes active variants only. Admin write actions need authentication and authorization before they are exposed in this UI.

For production, route both `/api` to API Gateway and `/images` to the storefront asset host (or a shared image host). Vite's `server.proxy` only applies during development.
