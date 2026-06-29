# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint flat config — some false positives with JSX member expressions like `motion.div`)
- **Preview production build:** `npm run preview`

No test framework is configured.

## Architecture

Velora — a premium car rental web app built with React 19, Vite 8, Tailwind CSS v4, and React Router v6.

### Data Layer

All persistence currently uses **localStorage** (no backend). Services in `src/services/` (`authService.js`, `carService.js`, `bookingService.js`) read/write localStorage via keys defined in `src/utils/constants.js` (`STORAGE_KEYS`). Mock seed data lives in `src/data/` and is loaded on first visit via `initializeData()` called in `main.jsx`.

`src/services/supabaseClient.js` contains commented-out Supabase setup and full SQL schema, ready for future migration.

### Auth

`AuthContext` (`src/context/AuthContext.jsx`) wraps the app and provides `useAuth()`. Auth uses bcryptjs for password hashing against localStorage-stored users. Two roles: `ADMIN` and `CUSTOMER` (defined in `src/utils/constants.js`).

### Routing

Defined in `App.jsx`. Three route groups:
- **Public:** `/login`, `/register`
- **Customer** (wrapped in `ProtectedRoute` + `CustomerLayout`): `/`, `/booking/:carId`, `/my-bookings`
- **Admin** (wrapped in `AdminRoute` + `AdminLayout`): `/admin`, `/admin/bookings`

### Path Alias

`@` maps to `src/` (configured in `vite.config.js`). All imports use this alias.

### Design System

Dark theme with warm champagne/copper accents. Key CSS classes defined in `src/index.css`:
- `.surface-card`, `.surface-elevated` — card backgrounds with subtle gradients
- `.glass`, `.glass-dark` — glassmorphism effects for nav and overlays
- `.text-gradient-accent` — gradient text for branding
- `.shine-bar` — decorative 1px gradient line used on cards and modals
- `.pattern-dots` — subtle dot pattern for backgrounds

### Key Libraries

- `framer-motion` — page/component animations
- `lucide-react` — icons
- `react-hot-toast` — toast notifications
- `date-fns` — date formatting and calculations
- `bcryptjs` — password hashing (client-side, for localStorage auth)
