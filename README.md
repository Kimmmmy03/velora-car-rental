# Velora Rental

A web-based luxury car rental management system that lets customers browse, filter, and book premium vehicles, and submit post-rental reviews. Administrators manage the vehicle fleet, categories, and promotions, process the full booking lifecycle, and monitor platform performance through a central dashboard.

This project was developed for **ISB37904 – Software Quality and Configuration Management** under the **Bachelor of Information Technology (Hons) in Software Engineering** programme at **Universiti Kuala Lumpur (UniKL MIIT)**.

---

## Team

- Akmal Hakimi Bin Abd Rashid *(Team Lead / SCM Administrator)*
- Khairul Aqib Bin Jazrul Fuad
- Chan Boon Hong *(Documentation Lead)*
- Muhammad Akid Bin Azmi

**Lecturer:** Ts. Dr. Azaliza Zainal

---

## Problem Statement

The system was designed to address the following recurring problems in manual or spreadsheet-based luxury car rental operations:

1. **Availability conflicts** – without real-time date validation, the same vehicle can be double-booked for overlapping periods.
2. **Inefficient fleet management** – tracking car availability and categories through spreadsheets is error-prone and does not scale.
3. **Calculation errors** – manual computation of rental cost from daily rate, duration, and promotional discounts introduces mistakes.
4. **Lack of customer transparency** – renters cannot view their booking history, track statuses (PENDING, APPROVED, RETURNED), or read authentic reviews from previous renters.
5. **No administrative oversight** – without a central dashboard, admins have no consolidated view of fleet status, booking volume, or revenue.

---

## Features

### Customer

- Self-service registration and secure login via Supabase Auth
- Browse the full fleet with a Top 10 Popular Cars section
- Filter and search the catalogue by keyword, category, price range, and availability (UC-01)
- View a full car details page with specifications, daily rate, image, and review snippet before booking (UC-02)
- Read paginated ratings and written feedback from previous renters (UC-03)
- Submit a star rating (1–5) and written comment after a completed booking, once per booking (UC-04)
- Step-by-step booking flow: date selection, overlap checking, server-side cost calculation with discount, and confirmation
- View personal booking history and cancel eligible (PENDING) reservations

### Administrator

- Role-protected admin dashboard with platform-wide statistics: total bookings by status, fleet status, revenue snapshot, and pending approvals (UC-06)
- Add, edit, and delete vehicles; flag cars as promoted and assign a discount percentage
- Approve, reject, or mark bookings as RETURNED
- Create, rename, and delete car categories; deletion is blocked when a category still has linked cars (UC-05)

### System-Wide

- Role-based access control via `ProtectedRoute` and `AdminRoute` guards; admin routes are restricted to ADMIN users only
- Session persistence across page refreshes through Supabase Auth
- Fully responsive layout from a 360 px viewport width upward
- Cross-browser support on Chrome, Edge, and Firefox (latest two major versions)
- ESLint must pass with zero warnings before any merge to `develop` or `main`

---

## Technology Stack

| Layer              | Technology                                        |
| ------------------ | ------------------------------------------------- |
| Language           | JavaScript (ES Modules)                           |
| Framework          | React 19                                          |
| Build Tool         | Vite 8                                            |
| Styling            | Tailwind CSS v4                                   |
| Routing            | React Router DOM v6                               |
| Database           | PostgreSQL hosted on Supabase (Cloud)             |
| Authentication     | Supabase Auth (session-based)                     |
| Supabase Client    | @supabase/supabase-js 2.x                         |
| Animations         | Framer Motion 12.x                                |
| Icons              | Lucide React 1.x                                  |
| Notifications      | React Hot Toast 2.x                               |
| Date Utilities     | date-fns 4.x                                      |
| Linting            | ESLint 9.x                                        |

---

## Project Structure

The repository is a single React (Vite) application with a clearly separated service layer that keeps all Supabase data-access logic out of the UI components.

```
velora-car-rental/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute, AdminRoute
│   │   ├── bookings/       # BookingTable, BookingCard, BookingPreview, StatusBadge
│   │   ├── cars/           # CarCard, CarGrid, CarFilter, CarForm
│   │   ├── layout/         # Navbar, AdminNavbar, Footer, layout wrappers
│   │   └── ui/             # Button, Input, Modal, ConfirmDialog, etc.
│   ├── context/            # AuthContext — session state and role checking
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page-level components for each route
│   ├── services/           # Data-access service layer (Supabase calls)
│   │   ├── supabaseClient.js
│   │   ├── carService.js
│   │   ├── reviewService.js
│   │   ├── categoryService.js
│   │   └── bookingService.js
│   └── utils/              # Constants, validators, formatters, cost calculation
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The `@` alias maps to `src/` for clean imports throughout the codebase (e.g. `import Button from '@/components/ui/Button'`).

---

## Architecture Overview

The application follows a component–service architecture. React pages and components handle only presentation and user interaction; all Supabase queries are routed through dedicated service modules (`carService`, `reviewService`, `categoryService`, `bookingService`). `AuthContext` is a React context provider that exposes the authenticated user and their role to all components without prop drilling.

Route protection is layered: `ProtectedRoute` redirects unauthenticated users to the login page, and `AdminRoute` additionally redirects CUSTOMER users away from admin-only paths. Both guards read their state from `AuthContext`.

### Domain Model

| Entity       | Key Fields                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `users`      | `userId`, `fullName`, `email`, `role` (`CUSTOMER` / `ADMIN`), `phoneNumber`, `driverLicenceNumber`                 |
| `cars`       | `carId`, `brand`, `model`, `licensePlate`, `dailyRate`, `status`, `imageUrl`, `categoryId`, `isPromoted`, `discount` |
| `bookings`   | `bookingId`, `startDate`, `endDate`, `totalCost`, `bookingStatus`, `createdAt`, `userId` (FK), `carId` (FK)        |
| `reviews`    | `reviewId`, `rating`, `comment`, `createdAt`, `userId` (FK), `carId` (FK), `bookingId` (FK)                       |
| `categories` | `categoryId`, `name`                                                                                               |

Booking statuses follow the lifecycle: `PENDING → APPROVED → RETURNED`, or `PENDING → REJECTED / CANCELLED`. A customer may submit one review per booking only after that booking reaches `RETURNED` status.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project with the five-table schema applied (SQL migration scripts are included in the repository)

### Database Setup

1. Create a new Supabase project and open the SQL Editor.
2. Run the migration scripts from the repository to create the `users`, `cars`, `bookings`, `reviews`, and `categories` tables with their foreign-key constraints, CHECK constraints, and RLS policies.
3. Create at least one ADMIN account directly in the Supabase `users` table (or via the Auth dashboard) with `role = 'ADMIN'`.

### Installation

```bash
# Clone the repository
git clone https://github.com/Kimmmmy03/velora-car-rental.git
cd velora-car-rental

# Install dependencies
npm install

# Copy the environment template and fill in your Supabase credentials
cp .env.example .env
```

Open `.env` and set the two required variables — both values are available in your Supabase project under **Settings → API**:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. The default landing page is the login screen; customers can self-register, while the ADMIN account must be seeded manually as described above.

### Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server with HMR    |
| `npm run build`   | Build for production output (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint (must exit with 0 warnings) |

---

## Usage

### Customer Flow

1. Register a new account or log in with existing credentials.
2. Browse the fleet on the home page; use the filter and search controls to narrow results by keyword, category, price range, or availability.
3. Click a car card to open the full details page. Check specifications, the daily rate, and existing reviews before proceeding.
4. Click **Book Now**, choose pickup and return dates, and review the server-calculated total cost on the booking preview page.
5. Confirm the booking; a record is created with status `PENDING`.
6. Track all reservations under **My Bookings** and cancel any that are still PENDING.
7. Once the admin marks a booking as `RETURNED`, the option to submit a review becomes available — click **Leave a Review**, select a star rating, and add a written comment.

### Administrator Flow

1. Log in with an account that has the `ADMIN` role.
2. From the dashboard, review the summary tiles: total bookings by status, fleet availability, revenue snapshot, and pending approvals.
3. Open **Fleet Management** to add new vehicles (brand, model, licence plate, daily rate, image URL, and category), edit existing entries, flag a vehicle as promoted with a discount, or remove a vehicle from the fleet.
4. Open **Manage Categories** to create, rename, or delete vehicle categories. The system will reject deletion of a category that still has cars linked to it.
5. Open **Booking Management** to approve or reject PENDING bookings, and to mark APPROVED bookings as RETURNED once the rental is complete.

---

## Configuration Notes

- **Environment variables** – All Supabase credentials are loaded at build time via Vite's `import.meta.env`. Never commit a populated `.env` file; the `.gitignore` already excludes it. Use `.env.example` as the template.
- **Role-based routing** – `AuthContext` reads the `role` field from the `users` table after login. If the role is not present or cannot be retrieved, the user is treated as unauthenticated.
- **Cost calculation** – Total booking cost is computed as `dailyRate × numberOfDays × (1 − discount)` on the server side through `bookingService`; the final amount is not editable from the booking form.
- **Review eligibility** – The `bookingService` checks `booking.hasReviewed` before allowing a review submission. The `userId` is always sourced from `AuthContext`, never from form input.
- **Image handling** – Car images are referenced by URL. Broken external URLs currently result in a missing image (tracked as D-03); a fallback image handler is noted as a future enhancement.
- **Reviewer privacy** – Review display is limited to the reviewer's first name and last initial; full names and email addresses are not exposed.

---

## Use Cases

The system implements 24 use cases across three actors. The six added after the formal Week 6 design review are marked ★ and correspond to functional requirements FR-06, FR-08, FR-09, FR-10, FR-26, and FR-27 in the Documentation Report.

| UC ID    | Use Case                   | Actor    | Sprint |
| -------- | -------------------------- | -------- | ------ |
| —        | Register                   | Guest    | Week 4 |
| —        | Login                      | Guest    | Week 4 |
| —        | Perform Logout             | Customer | Week 4 |
| —        | Browse Available Cars      | Customer | Week 4 |
| —        | Top 10 Popular Cars        | Customer | Week 4 |
| —        | Preview Booking            | Customer | Week 4 |
| —        | Check Date Availability    | Customer | Week 4 |
| —        | Calculate Total Cost       | Customer | Week 4 |
| —        | Confirm Booking            | Customer | Week 4 |
| —        | View My Bookings           | Customer | Week 4 |
| —        | Cancel Booking             | Customer | Week 4 |
| —        | View All Cars              | Admin    | Week 4 |
| —        | Add Car                    | Admin    | Week 4 |
| —        | Edit Car                   | Admin    | Week 4 |
| —        | Delete Car                 | Admin    | Week 4 |
| —        | Admin Manage Promotion     | Admin    | Week 4 |
| —        | View All Bookings          | Admin    | Week 4 |
| —        | Approve / Reject Booking   | Admin    | Week 4 |
| —        | Mark as Returned           | Admin    | Week 4 |
| UC-01 ★  | Filter / Search Cars       | Customer | Week 6 |
| UC-02 ★  | View Car Details           | Customer | Week 6 |
| UC-03 ★  | View Car Reviews           | Customer | Week 6 |
| UC-04 ★  | Submit Review              | Customer | Week 6 |
| UC-05 ★  | Manage Categories          | Admin    | Week 6 |
| UC-06 ★  | View Dashboard Stats       | Admin    | Week 6 |

---

## Known Issues

The following defects were logged during development and remain open at the v1.0.0 release. All are tracked on the Velora Rental Trello board under **Defects / Issues**.

| ID   | Description                                                                  | Severity | Workaround                        |
| ---- | ---------------------------------------------------------------------------- | -------- | --------------------------------- |
| D-01 | Car fleet status (`AVAILABLE`/`RESERVED`) does not auto-update after booking | Major    | Admin updates the status manually |
| D-02 | Phone-number validation enforces Malaysian (+60) prefixes only               | Minor    | Enter a local-format number       |
| D-03 | No fallback image when an external image URL is broken                       | Minor    | Provide a valid image URL         |
| D-04 | Some admin tables display a blank area when empty (no empty-state message)   | Minor    | Cosmetic only; no functional impact |

---

## SCM & Branching

This project follows the configuration management practices defined in the Software Configuration Management Plan (SCMP v1.0), adapted from IEEE Std. 828-1998.

**Branching strategy:** `main` / `develop` / `feature/<task-name>`

- Feature work is done on branches created from `develop`, named after the corresponding Trello card (e.g. `feature/uc-04-submit-review`).
- Every pull request from a feature branch to `develop` requires at least one peer approval before merging.
- ESLint must pass with zero warnings on every push to `develop` and `main`; builds that fail the lint check are blocked from merging.
- All proposed changes are raised as Trello cards and approved by the Team Lead (acting as Change Control Board) before work begins.
- Completed changes must be traceable: commit messages reference the corresponding Trello card identifier.
- Merges to `main` are tagged with a semantic version number (e.g. `v1.0.0`) by the Team Lead.

A configuration audit was performed by the Team Lead on 21 May 2026. It confirmed that all Trello action items (A1–A9 and DA1–DA8) were resolved, all work was merged, and ESLint passed on `develop` with zero warnings.

---

## Release History

| Tag       | Date         | Branch  | Built by     | Notes                                                                |
| --------- | ------------ | ------- | ------------ | -------------------------------------------------------------------- |
| v1.0.0-rc | 18 Apr 2026  | develop | Khairul Aqib | Verification build for internal feature testing                      |
| v1.0.0    | 21 May 2026  | main    | Akmal Hakimi | Production baseline — all 24 use cases integrated; DR reports finalised |

v1.0.0 incorporates change requests CR-01 through CR-04, resolves all design review action items from the Use Case Diagram review (30 April 2026), Use Case Documentation review (30 April 2026), and Database Schema review (21 May 2026), and has passed the Team Lead's configuration audit.

---

## Future Enhancements

Drawn from the open items in the Trello Ideas / Backlog column and observations made during the Week 6 sprint review:

1. **Automated unit testing** – adopt Jest for the front-end service layer with a minimum 60% coverage target for business-logic functions (booking overlap checks, cost calculation, review eligibility).
2. **Server-side pagination for admin tables** – Cars, Bookings, and Users currently load all records in a single query; server-side pagination with configurable page sizes (20 / 50 / 100) is needed as the dataset grows.
3. **Customer profile manager** – allow customers to update their name, phone number, email, and driver licence number after registration, removing the need for admin intervention.
4. **Improved form validation** – introduce a shared validation library such as Zod or Yup so that all forms enforce consistent rules for email format, phone number, date ranges, and required fields.
5. **Direct image upload** – let administrators upload car images from their machine instead of manually entering external URLs, and implement a fallback image for broken URL references (D-03).
6. **Automatic fleet status update** – resolve D-01 by triggering a Supabase database function that transitions a car's status to `RESERVED` when a booking is confirmed, and back to `AVAILABLE` when it is returned or cancelled.

---

## Acknowledgements

Developed as coursework for **ISB37904 – Software Quality and Configuration Management**, Bachelor of Information Technology (Hons) in Software Engineering, **Universiti Kuala Lumpur (UniKL MIIT)**. All third-party packages are open-source under permissive licences; no royalties or licence fees are payable.
