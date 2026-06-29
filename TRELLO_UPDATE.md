# Trello Board: Velora - Luxury Car Rental

This document represents our project progress structured as a Kanban/Trello board.

---

## 💡 Ideas / Backlog

**Card: Backend Migration**
* **Description:** Migrate data persistence from `localStorage` to a real database.
* **Details:** The Supabase SQL schema exists and client setup is prepared in `supabaseClient.js`, but it needs to be wired up to the service layer.

**Card: File Upload for Cars**
* **Description:** Allow admins to upload physical images rather than pasting Unsplash URLs.
* **Details:** Update `CarForm.jsx` to support image file uploads.

**Card: Add Unit Testing framework**
* **Description:** Implement testing framework for critical logic.
* **Details:** Specifically target `bookingCalculations.js` to ensure the date-overlap and pricing logic is 100% accurate.

**Card: Pagination for Admin Tables**
* **Description:** Support scaling for large amounts of bookings.
* **Details:** Support scaling for large amounts of bookings..

**Card: Customer Profile Manager**
* **Description:** Allow users to manage their own personal details.
* **Details:** Provide a dedicated screen where customers can update their driving license number, phone numbers, and change their password.

**Card: Enhanced Form Validation**
* **Description:** Improve data integrity on submissions.
* **Details:** Replace basic manual checks with a robust validation library like Zod or Yup for forms (Car formulation, User registration).

---

## 🏃 In Progress / Current Sprint (Week 6)

**Card: 2nd Review Preparation (16/4/2026)**
* **Description:** Finalize and polish the Week 6 modules based on Madam's recommendations for Thursday's review.
* **Checklist:**
  - [x] Integrate Category Manager (Akid)
  - [x] Integrate Promotions System (Akmal)
  - [x] Integrate Customer Reviews (Chan)
  - [x] Integrate Popular Cars Sorting (Khairul)

**Card: UX / UI Polish & QA**
* **Description:** Polish the UI and perform system-wide testing.
* **Checklist:**
  - [ ] Test mobile responsiveness of the Admin Dashboard grids.
  - [ ] Validate empty states (e.g. what happens when there are 0 popular cars or 0 bookings).
  - [ ] Perform a full E2E user walk-through on a fresh browser preventing existing localStorage bias.

---

## ✅ Implemented / Done

### Week 6 Modules

**Card: Module - Browse Available Cars & Top 10 Popular (Assignee: Khairul)**
* **Description:** Provide a way for users to see trendy/popular cars easily.
* **Details:** 
  - Added "Most Popular" sort option to `CarFilter.jsx`.
  - Updated `HomePage.jsx` to dynamically fetch and aggregate total booking counts.
  - Sorting logic correctly ranks Top 10 cars by highest reservation frequency.

**Card: Module - Submit Review & Feedback (Assignee: Chan)**
* **Description:** Let customers rate and provide feedback on their rentals.
* **Details:** 
  - Engineered `reviewService.js` for data management.
  - Customers can submit ratings/comments via `ReviewModal` inside `MyBookingsPage.jsx`.
  - Added public visibility via a `ReviewsModal` on the car listing cards.

**Card: Module - Admin Manage Category (Assignee: Akid)**
* **Description:** Categorize fleet vehicles (e.g., SUV, Sports, Sedan).
* **Details:** 
  - Created `categoryService.js` for full CRUD.
  - Implemented `CategoryManagerModal.jsx` within the Admin Dashboard.
  - Updated `CarForm` and `HomePage` to allow attaching and filtering by these categories.

**Card: Module - Admin Manage Promotion (Assignee: Akmal)**
* **Description:** Allow admins to offer promotional discounts on specific vehicles.
* **Details:** 
  - Added `isPromoted` and `discountPercentage` fields to the Car model.
  - Form integration added in `CarForm.jsx`.
  - Created `priceUtils.js` which dynamically applies the percentage discount across the site, recalculating effective daily rates and displaying "Promotion Discount" at the final checkout (`BookingPreview.jsx`).

### Week 4 & 5 Core Fundamentals

**Card: Project Foundation & Use Cases (Week 4)**
* **Description:** Initial project setup.
* **Details:** Instantiated React 19 + Vite app. Developed baseline UI with Tailwind CSS v4. Drafted initial system use-case diagrams.

**Card: Core UI Component Library**
* **Description:** Created the aesthetic foundation of the application.
* **Details:** Built reusable glassmorphic components (`Card`, `Button`, `Modal`, `StatusBadge`) with Framer Motion animations.

**Card: Local Authentication System**
* **Description:** Login and register management.
* **Details:** Created `AuthContext.jsx` globally managing sessions. Engineered `AdminRoute` and `ProtectedRoute` guards. Utilized `bcryptjs` to mock secure local password hashing.

**Card: Booking Availability Engine**
* **Description:** The core business logic ensuring smooth rentals.
* **Details:** Programmed `bookingCalculations.js` that checks proposed dates against historical bookings (excluding rejected/cancelled statuses) to strictly prevent date overlaps across vehicles.

**Card: 1st Madam Review & Pivot (Week 5)**
* **Description:** Present MVP to the reviewer.
* **Details:** Got feedback and finalized the system scope by committing to expanding the Category, Promotion, Review, and Sorting modules.

---

## 🐛 Bugs / Tech Debt

**Card: [BUG] Phone Number Format Limitation**
* **Description:** The `validatePhone()` utility strictly enforces Malaysian local prefixes (`+60`).
* **Impact:** International users are currently blocked from registering an account or making bookings.

**Card: [UX] Missing Empty Data States**
* **Description:** When rendering tables with 0 items (e.g., 0 Bookings or 0 Cars in a Category), the UI appears blank.
* **Impact:** Users might think the application is broken or still loading. We need to design friendly "No items found" empty-state illustrations.

**Card: [BUG] Car "Status" doesn't auto-update**
* **Description:** Booking a car creates a checkout status, but the global Car fleet status (`AVAILABLE`/`RESERVED`) stays stagnant.
* **Impact:** Admins currently have to manually change vehicle availability statuses.

**Card: [TECH DEBT] UI Duplication in Dashboard**
* **Description:** `SpotlightStatCard` and `MiniStatCard` are hard-coded and duplicated across multiple admin pages. 
* **Impact:** Violates DRY (Don't Repeat Yourself). Needs extraction into a reusable component inside `src/components/ui/StatCard.jsx`.

**Card: [BUG] Missing Global Loading States**
* **Description:** Fast synchronous `localStorage` fetches hide the lack of loading spinners. 
* **Impact:** Right now data loads instantly, but when migrating to an async database eventually, the UI might freeze or look broken during data fetching.

**Card: [BUG] Missing Fallback Images**
* **Description:** The system relies on external Unsplash image URLs for the car fleet display.
* **Impact:** If an external URL link breaks or fails to load, it results in an ugly broken image icon that ruins the glassmorphic aesthetic. Needs an `onError` fallback image handler.
