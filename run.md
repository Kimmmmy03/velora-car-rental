I need you to act as an expert frontend developer and perform a comprehensive UI/UX audit and fix layout bugs across this React 19 / Tailwind CSS v4 project (Velora). I am seeing severe overlapping issues with text, icons, and buttons across multiple components.

Please execute the following fixes step-by-step:

Step 1: Fix Reusable UI Components (The Input Overlap Bug)

Locate the reusable input components in src/components/ui/ (look for Input, Datepicker, or any forms in src/components/auth/ and src/components/bookings/).

The Bug: Lucide React icons inside the inputs are overlapping with the placeholder and user-typed text (e.g., 'mm/dd/yyyy' overlapping with calendar icons, and user/email/lock icons overlapping in the auth forms).

The Fix: Ensure the wrapper <div> has relative positioning. Ensure the icon has absolute positioning, is vertically centered (top-1/2 -translate-y-1/2), and placed on the left (left-3 or left-4). Crucially, add left padding (e.g., pl-10 or pl-12) to the actual <input> tag so the text starts after the icon. Apply this universally.

Step 2: Fix Hero & Layout Sections (The Cramped/Overlapping Bug)

Locate the Hero section (likely in src/pages/ like Home or Fleet) and the Navbar in src/components/layout/Navbar.

The Bug: Text is cramping, and action buttons ('View Fleet', 'Explore', 'Check Availability') and feature lists ('Fully Insured', '24/7 Support', 'Premium Fleet') are stacking on top of each other and look incredibly small.

The Fix: Audit these sections for missing Flexbox utilities. Wrap overlapping inline elements in flex containers (flex flex-wrap items-center gap-4 or gap-6). Ensure buttons have proper padding (e.g., px-6 py-3) and readable text sizes (text-base or text-sm).

Step 3: Contrast & Accessibility

The dark theme with champagne accents is causing some text (like the 'CREATE YOUR ACCOUNT' subtitle or 'Select Your Dates' labels) to blend into the background.

Lighten up dark grey text on dark backgrounds (use text-gray-300 or text-gray-400) to improve readability against the black/dark-gray backgrounds.

Please scan the repository, apply these Tailwind class changes to the relevant files, and provide a summary of the files you modified and the exact fixes applied.