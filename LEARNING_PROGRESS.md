# Learning Progress

## Current position
Phase: Part B (Backend)   Step: B8 Connect React to Django REST API   Last thing finished: Steps B2 through B7 complete: PostgreSQL models, JWT Auth, REST APIs, 409 double-booking locking, and seed data   Next: B8 Wire React pages (LoginPage, CustomerDashboard, etc.) to call live Django REST API endpoints

## Roadmap checklist
- [x] 0.1 Meet the goal
- [x] 0.2 Tools check
- [x] 0.2a Git identity and the GitHub repo
- [x] 0.2b .gitignore
- [x] 0.2c Python virtual environment and requirements.txt
- [x] 0.2d First commit and first push
- [x] 0.3 Create the project
- [x] 0.4 JSX in 10 minutes
- [x] 0.5 Draw the plan
- [x] Page 1: Login Page (HTML + CSS)
- [x] Page 2: Customer Dashboard (HTML + CSS)
- [x] Page 3: Restaurant Details (HTML + CSS)
- [x] Page 4: Booking & Floor Plan (HTML + CSS)
- [x] Page 5: Booking Confirmation (HTML + CSS)
- [x] Page 6: Restaurant Staff Dashboard (HTML + CSS)
- [x] Page 7: 404 Not Found (HTML + CSS)
- [x] Page 8: Signup Page (Role toggle, Customer/Restaurant details)
- [x] Page 9: Restaurant Settings Page
- [x] Connect all pages: Routes table in App.jsx
- [x] Connect all pages: Clickable buttons & links (useNavigate / Link)
- [x] Phase 3: Working systems (Validation & logic)
- [x] Step B0: Backend Big picture & API architecture
- [x] Step B1: PostgreSQL setup (database `tablebite`, user `tablebite_user`)
- [x] Step B2: Django project setup & Custom User Model
- [x] Step B3: Models (Restaurant, Table, Booking) & Admin
- [x] Step B4: DRF and JWT Authentication
- [x] Step B5: Read APIs (Search, Filter, Slots, Tables)
- [x] Step B6: Booking creation & Conflict check
- [x] Step B7: Owner Dashboard APIs
- [ ] Step B8: Connect React frontend to Django API
- [ ] Step B9: Harden and final inspection

## Part B: Backend
### What I learned (in my own words)
- Web Page vs API URL: A web page URL serves HTML/CSS for human eyes, while an API URL (usually prefixed with `/api/`) serves raw structured JSON data for code to read.
- CDN (Content Delivery Network): External networks (like Pexels) that distribute static image/video media files across global edge servers so browsers load assets fast without burdening the application database.
- HTTP Methods: GET (read/fetch), POST (create new), PATCH (partial update), DELETE (remove).
- HTTP Status Codes: 200 (OK), 201 (Created), 400 (Validation/Bad Request), 401 (Not logged in/Unauthorized), 403 (Forbidden/Wrong role), 404 (Not Found), 409 (Conflict/Table already booked).
- JWT (JSON Web Tokens): Signed tokens sent in the Authorization header (`Bearer <token>`) so the backend knows who is making the request without keeping state in memory.
- PostgreSQL: Relational database with Tables, Columns, Rows, Primary Keys (unique ID), Foreign Keys (relationships), Constraints, and Indexes. Database `tablebite` and user `tablebite_user` configured with UTF8.

## Page blueprints
(the tables from the Page Blueprint ritual will be added before each page's Phase 3 work)

## What I learned (in my own words)
- Customer flow: search & filter restaurants, choose date/time/party/occasion, pick a table on the floor plan, fill contact details, get a printable confirmation.
- Restaurant staff flow: view date-wise bookings, monitor key stats (today's bookings, total, available tables, peak hours), confirm/cancel bookings, and manually add reservations.
- Tools verified: Node v24.22.0, npm 11.19.1, Python 3.11.9, Git 2.55.0.
- Git identity verified: Shiv Patel (`shivsp2004@gmail.com`), branch `main`, remote `origin`.
- `.gitignore`: Ignores `.venv/`, caches, `.env`, and untracked `reference/` so only student-built code is kept in the repository.
- Python virtual environment: creates an isolated `.venv` space for project packages without touching global Python.
- Git push routine: stage with `git add`, snapshot with `git commit`, upload to remote with `git push`.
- Project structure: `src` (source) holds all raw application code that Vite bundles for the browser; outside `src` are configs and public files.
- Single Page App (SPA) entry flow: `index.html` has `<div id="root"></div>`, `main.jsx` uses `createRoot` to render `<App />` into that root div.
- JSX Rules: `className` instead of `class` (because `class` is a reserved JS keyword), `htmlFor` instead of `for`, self-closing tags (`<input />`), one root element, `{}` for JavaScript expressions, `{/* */}` for comments.
- Vite: converts React/JSX files to standard JavaScript for the browser to execute and handles hot reloading.
- Page 1 (Login): complete structure and styling with CSS Modules, responsive card layout, interactive role selector pill, and styled form fields.
- Page 2 (Customer Dashboard): navbar, responsive search and filter bar, auto-fitting CSS grid (`repeat(auto-fill, minmax(300px, 1fr))`) for restaurant cards.
- Page 3 (Restaurant Details): edge-to-edge hero banner, connected restaurant information card, and full-width reservation section.
- Page 4 (Booking & Floor Plan): interactive table grid with status indicators (Available, Selected, Occupied), contact inputs, and responsive breakpoints using `@media`.
- Page 5 (Booking Confirmation): clean printable receipt card with checkmark badge, itemized booking details, deposit status, and print media query (`@media print`).
- Page 6 (Staff Dashboard): manager view, stats grid, date-filtered reservations list with status badges, action controls, and quick-add reservation card.
- Page 7 (404 Not Found): friendly error card with bold 404 code and return button.
- Routes Switchboard: `<Routes>` and `<Route>` configure all paths (`/`, `/customer-dashboard`, `/restaurant/:id`, `/booking/:restaurantId`, `/booking-confirmation`, `/restaurant-dashboard`, `*`).

## Glossary
- `useNavigate`: A React Router hook that returns a function enabling programmatic navigation between pages in response to button clicks or form submissions.
- `<Link to="...">`: A React Router component used instead of regular `<a>` tags to change the URL without a browser page reload.
- `<Routes>` and `<Route>`: React Router components that map specific URL paths to specific page components.
- `@media print`: A CSS media query that applies styles only when a page is being printed (e.g. hiding navbars and buttons so only the receipt prints).
- `@media` (Media Query): A CSS rule that applies different styles depending on the screen size, orientation, or device type (essential for mobile responsiveness).
- CSS Grid `auto-fit`: Fits as many columns as possible into a container while stretching items to fill any remaining space.
- CSS Grid `auto-fill`: Automatically creates as many grid columns as will fit within the container width without overflowing.
- Semantic HTML: Using tags that convey meaning (`<header>`, `<main>`, `<section>`, `<article>`) rather than generic `<div>` tags everywhere, improving accessibility and SEO.
- CSS Modules: A CSS file where all class names are scoped locally to the component (named `[Name].module.css`), preventing styling conflicts across pages.
- `:focus`: A CSS pseudo-class that targets an element when it receives user interaction (keyboard tab or mouse click).
- `box-sizing: border-box`: CSS box model property that includes padding and border within the element's total width and height.
- SPA (Single Page Application): A web app that loads a single HTML page and dynamically updates the page as the user interacts with it, without full page reloads.
- `createRoot`: React 18 API that creates a root container to display React components inside a browser DOM node.
- JSX: JavaScript XML — a syntax extension for JavaScript that looks like HTML and lets you write UI markup inside React components.
- `src`: Short for "source". The folder holding the human-written raw code (JSX, CSS, components) before the build tool packages it.
- Virtual environment (`venv`): An isolated folder containing a private Python runtime and libraries for one specific project.
- `requirements.txt`: The standard file listing Python dependencies for a project.
- Git: Offline version control system (save history on your computer).
- GitHub: Cloud hosting platform for Git repositories.
- `origin`: The default nickname for your remote GitHub repository URL.
- `.gitignore`: A configuration file specifying deliberately untracked files that Git should ignore.
- Node.js: JavaScript runtime engine outside the browser.
- npm: Node Package Manager, downloads and manages project packages.
- Dev server: A local web server that automatically updates the page in the browser as you edit code (hot reload).

## Git
Repo: https://github.com/shiv2124/Restaurant-Customer-Pre-Booking-Management-System.git   Branch: main
- 2026-10-23: Phase 0 complete: clean Vite React setup (pushed)
- 2026-10-23: Phase 0: project setup, gitignore, and venv (pushed)
- 2026-10-23: first Push (pushed)

## Open questions / things to revisit
- None currently
