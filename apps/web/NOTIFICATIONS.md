# Notifications (frontend demo)

- The shared header has a bell with the unread count. Open it for the four latest notifications, individual/all read actions, and a link to `/notifications`.
- `/notifications` lists all notifications, newest first, with All/Unread filters and an empty state. Opening the menu does not automatically mark notifications read.
- Completed checkout simulations generate success/failure notifications. Cancelled simulations do not. Entries use the demo transaction reference to prevent duplicates. There are no invented shipping updates, promotions or vouchers.
- The notification provider stores up to 100 entries per account in memory. Guests use a separate inbox. Signing in/out changes the visible inbox without changing the cart; returning to the same account in this tab restores its inbox. Reload clears all demo inboxes.
- No backend, Kafka, email, push permission or browser storage is used. The frontend should eventually fetch notifications and mark them read through authenticated backend endpoints; Kafka remains between backend services. Real-time delivery can be added through the backend when its API is implemented.
- Shared `NotificationMenu` and `NotificationList` use CSS Modules. State lives in `features/notifications`, the full page in `pages/notifications`.

Validated with frontend build/lint and browser checks: checkout events, unread counts, individual/all read actions, unread filtering, Escape dismissal, account transition preserving cart, and 320/390/768/1440px layouts. No runtime errors or API requests during demo checks.
