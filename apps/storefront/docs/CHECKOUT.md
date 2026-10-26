# Checkout (frontend demo)

- Cart → **Tiến hành thanh toán** → `/checkout`. Guests and signed-in users can check out; an empty cart shows a link back to products.
- Enter recipient, phone, email, street address, city/province and optional delivery note. Signed-in users can select a saved Profile address (default selected initially) or enter another address. Checkout edits do not update Profile.
- Review the exact SKU specifications, quantities and total. Delivery costs 0đ for this demo.
- Choose the successful or failed payment scenario. Submitting validates delivery fields and disables the form while processing to prevent duplicate submissions.
- Success displays a demo receipt and removes the submitted quantities from the cart. Failure preserves the cart and delivery information and provides a retry button.
- Leaving checkout during processing cancels the simulation and keeps the cart intact.
- Payment is a one-second local simulation in `src/features/checkout/demoPayment.ts`. No Payment Service/API request, real charge, payment credentials or real order is involved. Cart, form and receipt state are in memory and reset on reload.
- Future API integration should replace the simulation adapter and use server-validated prices, order IDs and payment status; the current result selector is only for exercising demo states.
- Page-specific UI is in `src/pages/checkout/components/`; each visual component has its own TSX and CSS Module.

Validation: build, lint and browser checks for empty cart, validation, guest checkout, saved/custom addresses, pending state, failure/retry, success/cart updates, cancellation on navigation and layouts at 320/390/768/1440px. Browser checks assert no API requests or runtime errors.

Completed payment simulations also appear in the header notification bell and `/notifications`; see NOTIFICATIONS.md.
