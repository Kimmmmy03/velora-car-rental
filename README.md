# Velora — Premium Car Rental

A modern luxury car rental web application built with React 19, featuring a sleek dark UI with warm champagne accents. Manage a premium vehicle fleet, handle customer bookings, and provide a seamless rental experience.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue?logo=tailwindcss)

## Features

### Customer Portal
- **Browse Fleet** — View all available luxury vehicles with search and status filters
- **Book a Vehicle** — Step-by-step booking flow with date selection, price preview, and confirmation
- **Manage Reservations** — View booking history, track statuses, and cancel pending reservations

### Admin Console
- **Dashboard** — Overview statistics (fleet size, availability, total bookings, revenue)
- **Fleet Management** — Add, edit, and remove vehicles from the inventory
- **Booking Management** — Approve, reject, or mark bookings as returned

### General
- **Role-based Access** — Separate customer and admin interfaces with protected routes
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Animated UI** — Smooth page transitions and micro-interactions with Framer Motion
- **Toast Notifications** — Real-time feedback for user actions

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Date Utilities | date-fns |
| Auth (client-side) | bcryptjs |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd luxury-car-rental-react

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@velora.com` | `admin123` |
| Customer | `john@example.com` | `password123` |   
| Customer | `sarah@example.com` | `password123` |

## Project Structure

```
src/
├── components/
│   ├── auth/           # ProtectedRoute, AdminRoute
│   ├── bookings/       # BookingTable, BookingCard, BookingPreview, StatusBadge
│   ├── cars/           # CarCard, CarGrid, CarFilter, CarForm
│   ├── layout/         # Navbar, AdminNavbar, Footer, layouts
│   └── ui/             # Button, Input, Modal, ConfirmDialog, etc.
├── context/            # AuthContext (React Context for authentication)
├── data/               # Mock seed data (cars, users, bookings)
├── hooks/              # Custom hooks (useLocalStorage)
├── pages/              # Page components for each route
├── services/           # Data layer services (auth, car, booking)
└── utils/              # Constants, validators, formatters, calculations
```

## Data Persistence

The application currently uses **localStorage** for data persistence. Mock seed data is loaded on first visit. A Supabase migration path is prepared in `src/services/supabaseClient.js` with full SQL schema and RLS policies.

## Path Alias

The `@` alias maps to `src/` for clean imports:

```js
import Button from '@/components/ui/Button'
```

## License

This project is for educational purposes.
