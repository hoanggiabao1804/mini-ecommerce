# Login / Register / Profile — frontend demo

Run from the repository root: `npm run dev -w apps/web`.

## Routes and flow

- `/login`: username or email + password, visibility toggle and invalid-credentials error.
- `/register`: full name, username, birth date, gender, personal address, phone, email, password and password confirmation. Success signs in and returns to Home.
- `/profile`: requires a signed-in demo account. Edit personal details and manage multiple delivery addresses.
- The shared account menu links to Profile/delivery addresses and signs out to Home. Header search and category links return to Home from all pages.
- Delivery addresses support add, edit, delete with confirmation, and exactly one default when the list is nonempty. Deleting the default promotes the first remaining address. Personal address and delivery addresses are separate.

## Demo boundary

Accounts, profiles and delivery addresses live ONLY in the tab's JavaScript memory. Signing out retains registered demo accounts so they can sign in again during that page session. Reloading, closing the tab, opening another tab or restarting the page clears the demo. Development hot updates may reset it too.

No backend requests, OAuth, localStorage/sessionStorage persistence, cookies or real authentication are implemented. Password inputs are not persisted in browser storage; the in-memory mock stores a SHA-256 digest solely for demo credential comparison. This is not a production password-hashing or security implementation, and the route guard is only UI navigation.

Create a demo account first; no hard-coded login is provided. Use fictional information for the prototype.

## Structure

- `features/auth/`: types, validation, context/provider, UI guard and `demoAuth.ts` adapter. Replace the adapter with API calls when Auth Service is implemented.
- `components/share/`: AccountMenu, AuthLayout, FormField, PasswordInput, PersonalFields, plus the existing store layout/header/footer.
- `pages/login/`, `pages/register/`, `pages/profile/`: route pages and their CSS Modules.
- `pages/profile/components/`: personal details, address list and address form dialog; each has its own TSX/CSS Module.

## Validation

`npm run build -w apps/web` and `npm run lint -w apps/web`.

Browser smoke checks cover registration validation/duplicates, username/email login, profile editing, address lifecycle/default invariant, logout, protected routes, cross-page navigation, dialog focus/Escape, empty/error states and responsive widths 320/390/768/1440.
