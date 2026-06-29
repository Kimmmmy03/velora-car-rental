# Velora — Project Onboarding Brief

## 1. Project Overview

**Velora** is a premium luxury car rental web application. It allows customers to browse a curated fleet of high-end vehicles (Porsche, Ferrari, Lamborghini, Rolls-Royce, etc.), make date-based reservations, and track their booking history. Administrators can manage the fleet (add/edit/delete cars), review all booking requests, and approve, reject, or mark bookings as returned. The app is fully client-side — no backend exists yet; all data is persisted in `localStorage`.

---

## 2. Tech Stack & Dependencies

### Runtime Dependencies (`package.json`)
| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | DOM rendering |
| `react-router-dom` | ^6.30.3 | Client-side routing |
| `framer-motion` | ^12.38.0 | Page and component animations |
| `lucide-react` | ^1.7.0 | Icon library |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `date-fns` | ^4.1.0 | Date arithmetic and formatting |
| `bcryptjs` | ^3.0.3 | Client-side password hashing |
| `@supabase/supabase-js` | ^2.102.1 | Installed but not yet wired up (future backend) |

### Dev Dependencies
| Package | Purpose |
|---|---|
| `vite` ^8 | Build tool and dev server |
| `@vitejs/plugin-react` | React fast-refresh for Vite |
| `tailwindcss` ^4 + `@tailwindcss/vite` | Utility-first CSS (v4 via Vite plugin) |
| `eslint` ^9 (flat config) | Linting |
| `eslint-plugin-react-hooks` | Hooks lint rules |
| `eslint-plugin-react-refresh` | Refresh-safe component checks |

### Key Tooling Notes
- **Tailwind CSS v4** — uses the new Vite plugin integration; no `tailwind.config.js` needed
- **Path alias:** `@` → `src/` (configured in `vite.config.js`)
- **Module type:** `"type": "module"` (ESM throughout)
- No test framework is configured

---

## 3. Architecture & Structure

```
src/
├── App.jsx                   # Root component: routing tree + providers
├── main.jsx                  # Entry point: calls initializeData(), mounts app
├── index.css                 # Global styles, CSS custom properties, design tokens
│
├── context/
│   └── AuthContext.jsx       # Auth state, login/logout/register via useAuth()
│
├── pages/                    # Route-level components (one per page)
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx           # Hero + fleet browse with search/filter
│   ├── BookingPage.jsx        # 3-step booking wizard (dates → review → done)
│   ├── MyBookingsPage.jsx     # Customer booking history
│   ├── AdminDashboardPage.jsx # Fleet management (add/edit/delete cars + stats)
│   ├── AdminBookingsPage.jsx  # Admin booking management (approve/reject/return)
│   └── NotFoundPage.jsx
│
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx # Redirects unauthenticated users to /login
│   │   └── AdminRoute.jsx     # Redirects non-admins away from /admin/*
│   ├── layout/
│   │   ├── CustomerLayout.jsx # Wraps customer pages with Navbar + Footer
│   │   ├── AdminLayout.jsx    # Wraps admin pages with AdminNavbar
│   │   ├── Navbar.jsx
│   │   ├── AdminNavbar.jsx
│   │   └── Footer.jsx
│   ├── cars/
│   │   ├── CarCard.jsx        # Single vehicle card with image/status/book CTA
│   │   ├── CarGrid.jsx        # Responsive grid of CarCards
│   │   ├── CarFilter.jsx      # Search bar + status filter tabs
│   │   └── CarForm.jsx        # Add/edit vehicle form (shared between add and modal)
│   ├── bookings/
│   │   ├── BookingCard.jsx    # Customer-facing booking summary card
│   │   ├── BookingTable.jsx   # Admin-facing booking list with action buttons
│   │   ├── BookingPreview.jsx # Booking review summary shown at step 2
│   │   └── StatusBadge.jsx    # Colored badge for booking status
│   └── ui/                   # Shared primitives
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       ├── ConfirmDialog.jsx
│       ├── EmptyState.jsx
│       ├── LoadingSpinner.jsx
│       └── ErrorBoundary.jsx  # Class-based top-level error boundary
│
├── services/                 # Data access layer (all read/write localStorage)
│   ├── authService.js
│   ├── carService.js
│   ├── bookingService.js
│   └── supabaseClient.js     # Commented-out Supabase client + full SQL schema
│
├── data/                     # Seed data loaded on first visit
│   ├── mockCars.js           # 10 luxury vehicles (Porsche, Ferrari, etc.)
│   ├── mockBookings.js
│   └── mockUsers.js          # Includes default admin user
│
├── hooks/
│   └── useLocalStorage.js    # Reactive localStorage hook (not yet used by services)
│
└── utils/
    ├── constants.js          # ROLES, BOOKING_STATUSES, CAR_STATUSES, STORAGE_KEYS
    ├── validators.js         # Pure validation functions (email, phone, dates, etc.)
    ├── formatters.js         # formatCurrency (RM), formatDate, formatDateTime
    └── bookingCalculations.js # calculateDays, calculateTotalCost, overlap detection
```

### Core Design Patterns
- **Service layer pattern:** All localStorage I/O is isolated in `src/services/`. Pages never touch `localStorage` directly (with one exception, noted in Tech Debt).
- **Context + hooks for auth:** `AuthContext` provides `useAuth()` hook consumed throughout.
- **Layout-as-route:** Layouts (`CustomerLayout`, `AdminLayout`) are nested `<Route>` elements using React Router's `<Outlet>`, wrapping protected route groups.
- **Guard routes:** `ProtectedRoute` and `AdminRoute` are wrapper `<Route>` elements that check auth state and redirect as needed.
- **Dark design system:** CSS custom properties define the color palette (`--color-accent`, `--bg-primary`, etc.). Reusable utility classes (`.surface-card`, `.glass`, `.shine-bar`) are defined in `index.css`.

---

## 4. Core Logic

### Routing (`App.jsx`)
Three route groups with nested layout components:
```
/login, /register                   → Public (no auth required)
/ , /booking/:carId, /my-bookings   → ProtectedRoute → CustomerLayout
/admin, /admin/bookings             → AdminRoute → AdminLayout
*                                   → NotFoundPage
```

### Auth Flow (`authService.js` + `AuthContext.jsx`)
1. On app load (`main.jsx`), `initializeData()` seeds localStorage if missing (versioned via `lcr_data_version`).
2. `AuthContext` reads `lcr_current_user` from localStorage on mount to restore session.
3. Login: `bcrypt.compareSync` against stored hashed password → writes safe user (no password) to `lcr_current_user`.
4. Register: hashes password with `bcrypt.hashSync(password, 10)` → appends to `lcr_users`.
5. IDs are generated as `Math.max(...existing ids) + 1` — a sequential integer strategy.

### Booking Flow (`BookingPage.jsx`)
A 3-step wizard with local component state:
1. **Step 1 — Dates:** User picks start/end date. Client validates via `validateDateRange()`, then checks availability via `isCarAvailable()` (overlap check against non-cancelled/non-rejected/non-returned bookings).
2. **Step 2 — Review:** Shows `BookingPreview` with computed days and total cost.
3. **Step 3 — Done:** Calls `createBooking()` → booking saved with status `PENDING`, awaiting admin approval.

### Admin Flows
- **`AdminDashboardPage`**: Fleet CRUD. Stats (total cars, available count, booking count, revenue from APPROVED+RETURNED bookings) are recomputed on every `loadCars()` call.
- **`AdminBookingsPage`**: Reads all bookings + enriches with car/user data from localStorage for display. Status transitions: `PENDING → APPROVED | REJECTED`, `APPROVED → RETURNED`.

### Availability Logic (`bookingCalculations.js`)
`isCarAvailableForDates()` filters active bookings for the given `carId` (excludes CANCELLED, REJECTED, RETURNED), then checks for any date overlap using inclusive boundary comparison: `eStart <= nEnd && eEnd >= nStart`.

---

## 5. State & Data Management

### Storage Architecture
All persistence is **`localStorage`** only. Four keys:
| Key | Content |
|---|---|
| `lcr_users` | Array of user objects (passwords bcrypt-hashed) |
| `lcr_cars` | Array of car objects |
| `lcr_bookings` | Array of booking objects |
| `lcr_current_user` | Single logged-in user object (no password field) |

A `lcr_data_version` key (currently `"4"`) triggers a full data wipe and re-seed on version bumps — useful during development but destructive in production.

### React State
- **Global:** `AuthContext` (user identity, auth actions)
- **Local:** All page and component state is plain `useState`. No global state library (no Redux, Zustand, etc.)
- **No server state / caching layer:** No React Query, SWR, or equivalent — data is read synchronously from localStorage on each `useEffect` mount.

### Data Model Summary
```
User:    { userId, fullName, email, password(hashed), role, phoneNumber, driverLicenseNumber }
Car:     { carId, brand, model, licensePlate, dailyRate, status, imageUrl }
Booking: { bookingId, userId, carId, startDate, endDate, totalCost, bookingStatus, createdAt }
```

### Future Backend Path
`supabaseClient.js` contains the full SQL schema (users, cars, bookings tables with RLS policies) and a TODO comment listing exactly which service methods need replacing. The `@supabase/supabase-js` package is already installed.

---

## 6. Current State & Tech Debt

### Structural / Architecture Issues

**No real backend or auth security.** `bcryptjs` runs entirely in the browser. Any user can open DevTools and read/write all `localStorage` data, impersonate any user, or bypass role checks. This is a demo/prototype constraint by design, but critical before any real use.

**ID generation is fragile.** `Math.max(...ids) + 1` will throw if the array is empty (though guarded with a ternary) and produces duplicate IDs if two tabs write simultaneously. Should use `crypto.randomUUID()` or a proper auto-increment from a real DB.

**`useLocalStorage` hook is unused by services.** The hook exists in `src/hooks/useLocalStorage.js` but all three services directly call `localStorage.getItem/setItem`. The hook is dead code relative to the current data flow.

**Direct `localStorage` access leaks into a page.** `AdminBookingsPage.jsx:49` reads `localStorage.getItem(STORAGE_KEYS.USERS)` directly instead of calling a service function — breaks the service-layer abstraction.

**`SpotlightStatCard` and `MiniStatCard` are duplicated.** Both `AdminDashboardPage.jsx` and `AdminBookingsPage.jsx` define nearly identical local stat card components with the same mouse-spotlight pattern. Should be extracted to `src/components/ui/StatCard.jsx`.

**Car status (`AVAILABLE`/`RESERVED`/`RENTED`) is never automatically updated.** Creating a booking sets status `PENDING`, but the car's own `status` field is never mutated by the booking service. The admin manually changes booking status but that doesn't flip the car status either. The fleet inventory status appears to be manually managed only.

### Missing Standard Practices

**No test suite.** Zero unit, integration, or E2E tests. The booking calculation and overlap logic in `bookingCalculations.js` is the clearest candidate for unit tests.

**No loading or error states for data fetches.** Pages call synchronous localStorage reads inside `useEffect` with no loading skeleton or error handling — currently fine, but will break immediately on Supabase migration (async calls).

**No pagination.** `AdminBookingsPage` renders all bookings in a single table with no pagination or virtualization. Will degrade at scale.

**No environment variable validation.** `supabaseClient.js` calls `createClient(undefined, undefined)` if env vars are absent (no `.env` file). This silently fails at runtime.

**`data_version` wipe strategy is destructive.** The version-bump mechanism wipes all user data including registered accounts. Needs a proper migration strategy for production.

**Phone validation is Malaysia-specific.** `validatePhone()` uses a regex for Malaysian numbers (`+60` prefix). This is fine for the apparent target market but worth noting.

**No image upload.** Car images are referenced by URL string only (Unsplash links). There is no file upload support in `CarForm`.
