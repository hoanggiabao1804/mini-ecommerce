# Home frontend

Run from the project root: `npm run dev -w apps/web`.

- `components/share/StoreLayout`: shared header/footer with an Outlet for pages.
- `components/share/Header`, `Footer`, `ProductCard`, `ProductImage`, `QuantityPicker`: reusable UI; each has its own TSX and CSS Module.
- `pages/home/components`: Home-only Hero, CategorySection and ProductSection.
- `pages/home/data/products.ts`: mock product data and illustrative prices. Replace with the Product Service API when available.
- `config/categories.ts`: shared category navigation.
- Search/category/brand are URL parameters (`q`, `category`, `brand`). Sorting is local UI state.
- Account controls now link to Login/Register/Profile and support demo sign-out; the cart now links to /cart. See CART.md for product details and SKU selection. See AUTH.md for the frontend-only account flow. Account behavior is a frontend demo; checkout is simulated (see CHECKOUT.md); stock and vouchers are not implemented.
- `public/logo.png`: original project logo, unchanged.
- Product images are local copies from the referenced CellphoneS catalog; source URLs are recorded in `public/images/products/sources.json`. No remote image requests are needed at runtime.

Validation: `npm run build -w apps/web`, `npm run lint -w apps/web`.

Product listing: initially displays up to 8 products; “Xem thêm” appends up to 8 more from the filtered, sorted catalog. The count shows displayed/total results, and the button is disabled when all are visible. Changing category, brand, query or sort resets the visible limit. This is client-side pagination of local data, not API pagination. Brand navigation remains independent. ProductResults owns the grid and pagination CSS Modules.
