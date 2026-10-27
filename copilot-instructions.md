# TableBite Backend: Copilot Instructions (Django + PostgreSQL)

Project: **TableBite**, the Restaurant Customer Pre-Booking Management System.
The React frontend is built (UI, client-side validation, fake data, fake login).
Your job: help the student build the **Django + PostgreSQL** backend, then connect React to it.

**Where this file goes:** `.github/copilot-instructions.md` in the project root. GitHub Copilot reads it automatically.

**Start every session with this message:**

> Read .github/copilot-instructions.md and LEARNING_PROGRESS.md. Continue the backend from where we stopped. Explain simply.

If this file and `GEMINI.md` disagree about the backend, **this file wins** (GEMINI.md plans FastAPI first; the student now uses Django only).

---

## 1. Core rules (read first)

1. **Stack is fixed:** Python 3.11 + Django **5.2 LTS** + Django REST Framework + PostgreSQL (driver `psycopg` v3) + SimpleJWT + django-cors-headers. No FastAPI. Do **not** install Django 6.x: it needs Python 3.12+, and this computer has Python 3.11.9.
2. **Folders:** backend code goes in `backend/`. Do not edit `frontend/` unless the student asks. `reference/` is read-only.
3. **Small steps:** one piece at a time (a code chunk is at most about 40 lines). Then stop and wait for `done`.
4. **Explain every chunk** in simple English: what it does, why it is needed, how the data flows, what breaks without it, and how to test it.
5. **Install one package at a time.** Say why it is needed now, then show the new line in `requirements.txt`. Never install in a batch.
6. **Never trust the browser.** Every rule the frontend checks must be checked again on the server.
7. **Thin views, real logic in `services.py`.** Serializers check the shape of data. Services enforce business rules inside transactions.
8. **JSON keys are camelCase** (the frontend already uses `priceRange`, `openTime`, `partySize`). Use explicit `source=` in serializers. Do not add a camelCase library without asking.
9. **No double booking:** `transaction.atomic()` + `select_for_update()` on the table row + a 90-minute overlap check (Section 9 and Appendix D).
10. **Custom User model first.** Create it and set `AUTH_USER_MODEL` **before the first `migrate`**. Changing it later is painful.
11. **Secrets only in `backend/.env`** (ignored by Git). Commit `backend/.env.example`. Never hard-code or print passwords, tokens or `SECRET_KEY`.
12. **Windows PowerShell.** Give PowerShell commands. The project path has spaces, so always quote it. The `.venv` must be active. In PowerShell `curl` is an alias, so use `Invoke-RestMethod` or `curl.exe`.
13. **Git:** you may run read-only Git (`status`, `diff`, `log`). The student types `git add`, `git commit`, `git push`. Never force push.
14. **Ask before adding any library** that is not in the approved list (Section 7). Ask one question at a time.
15. **Check current docs** (docs.djangoproject.com, django-rest-framework.org, postgresql.org) before giving install commands or version-sensitive code. Tools change fast.

---

## 2. Project snapshot

Two kinds of users:
- **Customer:** signs up, browses restaurants, picks date/time/guests, picks a table on a floor plan, enters contact details, pays a mock ₹500 deposit, gets a confirmation.
- **Restaurant owner/staff** (`role = "restaurant"`): sees reservations for a date, sees 4 stats, confirms or cancels bookings, adds walk-in/phone reservations, edits the restaurant profile.
- **TableBite admin** = Django superuser using the Django admin site. Admin verifies new restaurants before they are public.

Frontend (React 19, Vite, React Router, CSS Modules, plain JavaScript) is in `frontend/src/pages/`:

| Route | Page file | Needs from the API |
|---|---|---|
| `/` | `LoginPage.jsx` | login |
| `/signup` | `SignupPage.jsx` | signup (customer or restaurant) |
| `/customer-dashboard` | `CustomerDashboard.jsx` | restaurant list, current user |
| `/restaurant/:id` | `RestuarantDetails.jsx` (the filename has a typo; do not rename silently) | restaurant detail, time slots |
| `/booking/:restaurantId` | `BookingPage.jsx` | floor plan (tables + availability), create booking |
| `/booking-confirmation` | `BookingConfirmation.jsx` | booking by code |
| `/restaurant-dashboard` | `RestaurantDashboard.jsx` | reservations, stats, confirm/cancel, add walk-in |
| `/restaurant-settings` | `RestaurantSettingsPage.jsx` | read and update own restaurant |
| `*` | `NotFoundPage.jsx` | nothing |

Today the frontend uses `data/restaurants.js`, hard-coded tables, `sessionStorage` drafts (`bookingDraft`, `bookingConfirmation`), and a fake login that picks the dashboard from the email text. The backend replaces all of that.

**Out of scope for now** (do not build unless the student asks): real payment gateway (deposit is mocked), SMS/email sending, reviews (rating and review count are plain stored numbers), image upload, customer "my bookings" or cancel page, forgot-password, email verification, deployment, background jobs.

---

## 3. About the student and the computer

- Knows HTML, CSS, React. **New to backend, databases and Django.** Wants to understand the **logic and what each part does**, not memorize every detail.
- Writes simple English. Use **short sentences and plain words**. Define a technical term the first time you use it. If the student writes in another language, answer in that language and keep code in English.
- Windows, PowerShell, VS Code. Project root: `D:\AI-ML\AI_Internship\Restaurant_Customer Pre_Booking Management System` (spaces in the name: quote paths).
- Existing: Git repo on `main`, `.venv` at the project root, `requirements.txt` (only a comment line so far), `frontend/` built.
- Verified tools: Node 24, npm 11, **Python 3.11.9**, Git 2.55.
- Analogy to reuse: **browser = customer, API = waiter, database = kitchen/storeroom.**

---

## 4. How to help (teaching style for the backend)

Default mode ("guided"), the same as Part B of `GEMINI.md`:
- Show code **in chat**, up to about 40 lines per message, with the file path above each block.
- The student pastes or types it, runs it, and tests it.
- Write directly into files **only** when the student says `apply it` (one step only). Do not run long autonomous multi-file edits in Agent mode. Do not run terminal commands that change the project; tell the student what to run.
- If the student says "I want to type this myself", switch to tiny steps (about 10 lines) and let them type.

**Step template:**

```
Step B<phase>.<n>: <short title>
Goal: 1 or 2 lines (use the waiter/kitchen analogy when it helps)
Picture: small ASCII data-flow when useful (browser -> API -> database -> API -> browser)
Code: <file path> + a short block
What each part does: line by line
How it runs: a short story in order (request arrives -> which function -> what data moves)
What breaks without it: 1 line
How to test it: exact PowerShell command or browser URL + the expected output
If it fails: the 1 or 2 most likely causes
Check question: ONE short question (skip if the step is tiny)
Reply "done" when it works, or paste the error.
```

**Shortcuts the student may type** (same as GEMINI.md): `done`, `explain more`, `why?`, `stuck` (hint first, not the answer), `show answer`, `apply it`, `review my code` (feedback only, no rewrite), `quiz me`, `recap`, `where are we?`, `what's installed?`, `git check`, `push code`.

**Errors:** teach the student to read them. Ask for the first line of the error and the file and line number. Give hints in levels: guiding question, then file/line/concept, then tiny example, then the fix. Name the bug type (wrong import, missing migration, wrong permission class...). Never silently fix the student's files.

**Progress:** at session start read `LEARNING_PROGRESS.md`. You may edit **only** that file, and only a section called `## Part B: Backend` (create it if missing). Keep a checklist of roadmap steps, notes "in my own words", a glossary, and open questions.

---

## 5. Roadmap (build in this order)

Do not jump ahead. Each step ends with the **Done when** test.

| Step | What to build | Done when |
|---|---|---|
| **B0** Big picture | Explain client/server, HTTP, JSON, REST, status codes (200, 201, 400, 401, 403, 404, 409), JWT in one paragraph. Draw: React -> Django API -> PostgreSQL -> API -> React. List which frontend files change later (Section 11). | Student explains the flow in own words |
| **B1** PostgreSQL | Install PostgreSQL (Windows installer). Open `psql` or pgAdmin. Teach table, row, column, primary key, foreign key, constraint, index. Have the student **derive the tables from the frontend data first**, then compare with Section 8. Create DB and user (below). | `psql` connects as `tablebite_user` and `\l` shows `tablebite` with UTF8 |
| **B2** Django project | Activate `.venv`. Install `Django`, `psycopg[binary]`, `python-dotenv` (one at a time). `mkdir backend`, `cd backend`, `django-admin startproject config .`. Create `.env` and `.env.example`. Create app `accounts` with the **custom User** (email login). Set `AUTH_USER_MODEL`, connect to PostgreSQL, then `makemigrations`, `migrate`, `createsuperuser`, `runserver`. | `/admin/` opens and the superuser logs in; the `accounts_user` table exists in `psql` |
| **B3** Models and admin | Apps `restaurants` and `bookings`. Models from Section 8, with constraints and indexes. Register in admin (list filters, search, verification actions). Write the `seed_demo` management command (Appendix A). | After `seed_demo`, the admin shows 5 restaurants with tables |
| **B4** DRF and auth | Install `djangorestframework`, then `djangorestframework-simplejwt`. Build `signup`, `login`, `token/refresh`, `me`. Role permissions. | PowerShell calls: signup, login, `me` with token work; wrong password returns 401 |
| **B5** Read APIs | Restaurant list (search, filter, sort), detail, slots, tables with availability. Only `approved` restaurants are public. | List and detail match the JSON in Section 10 |
| **B6** Booking | `POST /api/bookings/` with all rules, the conflict check in a transaction, booking code, mock deposit. `GET /api/bookings/{code}/`. Write tests. | Tests pass, including the double-booking tests (Section 14) |
| **B7** Owner APIs | Own restaurant read/update (with the admin-review rule), reservations by date, status change, walk-in create, stats. | Owner A cannot see or change owner B's data (tested) |
| **B8** Connect React | Install `django-cors-headers`. Add `frontend/.env` with `VITE_API_URL`, a small `src/api.js`, token storage, `AuthContext`/`ProtectedRoute`, replace fake data. Teach loading, error and empty states, and 401 -> back to login. Fix the gaps in Section 11. | Full customer journey and full owner journey work against the real API |
| **B9** Harden and wrap up | Re-read Section 9 rules, add throttling, run the security checklist (Section 13), update `README.md`, do the "fresh clone" test (`pip install -r requirements.txt`, migrate, seed, run). | A friend could clone the repo and run it using only the README |

**B1 PostgreSQL commands** (run in `psql` as the `postgres` superuser; the installer asks for its password):

```sql
CREATE USER tablebite_user WITH PASSWORD 'choose-a-dev-password' CREATEDB;
CREATE DATABASE tablebite OWNER tablebite_user ENCODING 'UTF8' TEMPLATE template0;
```

Why: `OWNER` avoids "permission denied for schema public" on `migrate` (PostgreSQL 15+ no longer lets normal users create tables in `public` by default). `CREATEDB` lets `python manage.py test` create its temporary test database. `UTF8` is needed for the `₹` sign and any non-English names. On Windows, `psql` may not be on PATH: use "SQL Shell (psql)" from the Start menu, pgAdmin, or add `C:\Program Files\PostgreSQL\<version>\bin` to PATH.

---

## 6. Target folder layout (grow into it; create things only when first needed)

```
Restaurant_Customer Pre_Booking Management System/
├── .github/copilot-instructions.md     <- this file
├── GEMINI.md, LEARNING_PROGRESS.md     <- existing
├── requirements.txt                    <- Python packages (root, one file)
├── .venv/                              <- virtual environment (ignored by Git)
├── frontend/                           <- React app (already built)
└── backend/
    ├── manage.py
    ├── .env                            <- real secrets (ignored by Git)
    ├── .env.example                    <- fake values, committed
    ├── config/                         <- settings.py, urls.py, wsgi.py, asgi.py
    ├── common/                         <- validators.py (phone, GST...), constants.py
    ├── accounts/                       <- User model, signup/login/me
    │   └── models.py, managers.py, serializers.py, views.py, urls.py, admin.py, tests/
    ├── restaurants/                    <- Restaurant, Table, public read APIs, owner profile API
    │   └── models.py, serializers.py, services.py, views.py, urls.py, admin.py, tests/
    │   └── management/commands/seed_demo.py
    └── bookings/                       <- Booking, create/confirm/status, owner reservations, stats
        └── models.py, serializers.py, services.py, views.py, urls.py, admin.py, tests/
```

Run all `python manage.py ...` commands from `backend/` with `.venv` active.

---

## 7. Approved packages (install one at a time, at the step shown)

| Step | Package (pip name) | Why it is needed |
|---|---|---|
| B2 | `Django>=5.2,<5.3` | The web framework (5.2 LTS, security fixes until April 2028; supports Python 3.11) |
| B2 | `psycopg[binary]` | Driver that lets Django talk to PostgreSQL (version 3; ready-made Windows wheels, no compiler) |
| B2 | `python-dotenv` | Reads `backend/.env` |
| B4 | `djangorestframework` | Builds the JSON API |
| B4 | `djangorestframework-simplejwt` | Login tokens (JWT) |
| B8 | `django-cors-headers` | Lets React at `localhost:5173` call the API |
| **Ask first** | `drf-spectacular` (Swagger UI), `django-filter`, `Pillow` (image upload), `gunicorn` + `whitenoise` (deploy) | Only if the student wants them |

After **each** install: run `python -m pip show <package>` to see the version, then add one line to the root `requirements.txt` by hand (for example `Django>=5.2,<5.3`, and later the exact versions that were installed). Open the file and check it is plain text.
Warning: in Windows PowerShell 5.1, `pip freeze > requirements.txt` can write UTF-16 and break `pip install -r`. If you use freeze, use `python -m pip freeze | Out-File -Encoding ascii requirements.txt` and open the file to check it.

---

## 8. Data model (PostgreSQL tables via Django models)

Django creates the tables from the models. Table names are `app_model` in lowercase (for example `bookings_booking`). Use `constraints = [...]` and `indexes = [...]` in `Meta`. Never edit a migration that has already been applied; make a new one.

**Rule: do not store what can be calculated.** `totalTables` = number of active tables. `maxCapacity` = sum of seats of active tables. Stats are calculated per request.

### accounts.User (custom, email login)

| Field | Type / notes |
|---|---|
| `email` | `EmailField`, unique, saved lowercase, `USERNAME_FIELD` |
| `full_name` | `CharField(100)` |
| `phone` | `CharField(10)`, digits only (normalized) |
| `role` | choices `customer` / `restaurant`, default `customer` |
| password, `is_active`, `is_staff`, `is_superuser`, `date_joined` | from `AbstractUser`. Staff/superuser = TableBite admin |

Build it as `AbstractUser` with `username = None`, plus a **custom manager** (`create_user`, `create_superuser`) because the default manager expects a username. `REQUIRED_FIELDS = ["full_name"]`. `AUTH_USER_MODEL = "accounts.User"`.

### restaurants.Restaurant

| Field | Type / notes |
|---|---|
| `owner` | `OneToOneField(User, on_delete=PROTECT)` (one owner = one restaurant for now) |
| `name` | `CharField(120)` |
| `cuisine` | choices: `indian`, `italian`, `chinese`, `mexican`, `japanese`, `other` |
| `location` | choices: `downtown`, `uptown`, `suburb` (the dashboard filters by it) |
| `price_range` | choices: `budget`, `moderate`, `fine` |
| `address` | `CharField(255)` |
| `phone` | `CharField(10)` |
| `contact_email` | `EmailField`, blank |
| `description` | `TextField`, blank |
| `image_url` | `URLField`, blank (no upload yet) |
| `open_time`, `close_time` | `TimeField` |
| `gst_number` | `CharField(15)`, blank |
| `fssai_license` | `CharField(14)`, blank |
| `rating` | `DecimalField(2,1)`, default 0, between 0 and 5 |
| `reviews_count` | `PositiveIntegerField`, default 0 |
| `verification_status` | choices `pending` (default) / `approved` / `rejected` |
| `pending_changes` | `JSONField`, default `dict` (edits waiting for admin approval) |
| `created_at`, `updated_at` | auto timestamps |

Indexes: `(verification_status, cuisine, location)`.

### restaurants.Table

| Field | Type / notes |
|---|---|
| `restaurant` | `ForeignKey(Restaurant, on_delete=CASCADE, related_name="tables")` |
| `number` | `PositiveSmallIntegerField` (the number guests see) |
| `seats` | `PositiveSmallIntegerField` |
| `label` | `CharField(50)`, blank (for example "Window Side", "Garden View", "Booth") |
| `is_active` | `BooleanField`, default `True` (deactivate instead of delete) |

Constraints: `UniqueConstraint(restaurant, number)`, `CheckConstraint(seats >= 1)`.
Show the table **number** to users, never the internal `id` (a known teachable bug).

### bookings.Booking

| Field | Type / notes |
|---|---|
| `restaurant` | `ForeignKey(Restaurant, on_delete=PROTECT)` |
| `table` | `ForeignKey(Table, on_delete=PROTECT)` |
| `customer` | `ForeignKey(User, null=True, on_delete=SET_NULL)`; `NULL` for walk-in/phone bookings |
| `booking_code` | `CharField(12)`, unique, like `TB-7K3QXA`. Random (use `secrets`), not sequential. Retry on collision. No `#` in the database (the UI adds it) |
| `customer_name` | `CharField(100)` (online: first + last name joined) |
| `email` | `EmailField`, blank (walk-ins may have none) |
| `phone` | `CharField(10)` |
| `booking_date` | `DateField` (restaurant-local date) |
| `booking_time` | `TimeField` (restaurant-local time) |
| `party_size` | `PositiveSmallIntegerField` |
| `occasion` | choices `casual_dining`, `birthday`, `anniversary`, `business_meal`, blank |
| `special_requests` | `CharField(300)`, blank |
| `status` | choices `pending`, `confirmed`, `cancelled` |
| `source` | choices `online`, `walk_in`, `phone` |
| `deposit_amount` | `DecimalField(8,2)`. **Never float for money.** |
| `deposit_status` | choices `none`, `paid`, `refunded` |
| `created_at`, `updated_at` | auto timestamps |

Indexes: `(restaurant, booking_date)` and `(table, booking_date, status)`. Constraint: `CheckConstraint(party_size >= 1)`.
Store date and time as **local** values (`TIME_ZONE = "Asia/Kolkata"`). This avoids the UTC "wrong day" bug that `toISOString()` causes in the frontend.

---

## 9. Business rules (enforce on the server)

| Area | Rule |
|---|---|
| Email | Required, valid, at most 254 chars, saved lowercase, unique ignoring case |
| Phone (user, restaurant, guest) | Strip spaces and dashes; drop a leading `+91`, `91` (if 12 digits) or `0` (if 11 digits). Then exactly 10 digits, first digit 6 to 9. Store the 10 digits. (The frontend only checks "10 digits" today; update its regex to match later.) |
| Password | At least 8 chars, at most 128, at least one letter, at least one special character (same set as `SignupPage.jsx`), `password == confirmPassword`, plus Django's built-in validators (not too common, not all numbers, not similar to the email/name) |
| Names | Required, trimmed, at most 100 chars |
| Role at signup | Only `customer` or `restaurant`. Nobody can sign up as admin |
| Restaurant signup | Required: `restaurantName`, `cuisine`, `priceRange`, `address`, `openTime`, `closeTime`, `totalTables` (1 to 200), `restaurantPhone`. Optional: `gst`, `description`. `closeTime` must be after `openTime` (overnight hours are not supported yet). GST, if given: uppercase, matches `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`. FSSAI, if given: exactly 14 digits |
| On restaurant signup | Create the User + Restaurant (`pending`) + `totalTables` Table rows (numbers 1..N, 4 seats each, editable later) in **one transaction** |
| Public visibility | Customers see only restaurants with `verification_status = approved` |
| Booking date | A real date, not in the past (Asia/Kolkata), at most 60 days ahead (constant `BOOKING_MAX_DAYS_AHEAD`) |
| Booking time | `HH:MM`. Start must be at or after `open_time`, and `start + 90 min` must be at or before `close_time`. If the date is today, start must be later than now. (Example: Dragon Wok closes 22:00, so a 21:00 start is refused) |
| Party size | Integer, 1 or more, and at most `table.seats` |
| Table | Belongs to this restaurant, `is_active`, and **free**: no non-cancelled booking on the same table and date whose 90-minute span overlaps. Overlap means `new_start < other_end and other_start < new_end`. So 19:00 blocks 17:31 to 20:29; 20:30 is allowed |
| Occasion | One of the codes or blank |
| Special requests | At most 300 characters |
| Deposit (online) | `DEPOSIT_AMOUNT = Decimal("500.00")` from settings. Mock payment: set `deposit_status = "paid"` immediately (`# TODO: real gateway`). Walk-in/phone: `none` and `0.00` |
| Initial status | Setting `BOOKING_AUTO_CONFIRM = True` (matches the current UI, which says "Reservation Confirmed" right away): online bookings start `confirmed`. If `False`, they start `pending` and the owner confirms. Walk-in/phone bookings made by staff start `confirmed` |
| Status changes | Only the owner of that restaurant. Allowed: `pending -> confirmed`, `pending -> cancelled`, `confirmed -> cancelled`. `cancelled` is final (the UI shows no buttons). Anything else: 400 |
| Ownership | Owner endpoints always use `request.user.restaurant`. Never trust a restaurant id from the URL or body. A customer sees only their own bookings |
| Profile edits (owner) | Fields `name`, `address`, `gst_number`, `fssai_license` are **sensitive**: save them to `pending_changes` and return `pendingReview: true`; admin approves in Django admin and the changes are applied. Other fields apply immediately. Changing table count: create or deactivate tables; refuse with 409 if a table to deactivate has future non-cancelled bookings |
| Stats (owner, per date) | `bookingsCount` and `guestsExpected` ignore cancelled bookings. `tablesTotal` = active tables. `tablesFree` = total minus distinct tables with a non-cancelled booking that date (a simple default; confirm with the student). `peakHour` = hour with the most bookings (earliest wins ties), or `null` |

**Concurrency (important lesson):** two guests can click the same table at the same moment. Without a lock both checks pass and both bookings are saved. Inside `transaction.atomic()` call `Table.objects.select_for_update()` for the chosen table first; the second request waits, then sees the first booking and gets 409. See Appendix D. (Optional hardening later: store `start_at`/`end_at` and add a PostgreSQL `ExclusionConstraint` with the `btree_gist` extension so the database itself refuses overlaps.)

---

## 10. API contract (base path `/api/`, JSON, trailing slashes)

Auth header: `Authorization: Bearer <access token>`. Default permission is "logged in". Only signup, login and refresh are public.

| Method and path | Who | Purpose | OK | Errors |
|---|---|---|---|---|
| `POST /api/auth/signup/` | public | Create account (+ restaurant + tables if `role = restaurant`). Returns tokens and user (auto-login) | 201 | 400 |
| `POST /api/auth/login/` | public | `email` + `password` -> tokens + user (with `role`) | 200 | 400, 401 |
| `POST /api/auth/token/refresh/` | public | New access token from refresh token | 200 | 401 |
| `GET /api/auth/me/` | logged in | Current user | 200 | 401 |
| `GET /api/restaurants/?search=&cuisine=&location=&sort=` | logged in | Approved restaurants. `search` matches name or cuisine (contains, ignore case). `sort` is `rating` (default, high first) or `name` (A to Z) | 200 | 401 |
| `GET /api/restaurants/{id}/` | logged in | One approved restaurant | 200 | 404 |
| `GET /api/restaurants/{id}/slots/?date=YYYY-MM-DD` | logged in | Allowed start times (hourly by default, rules from Section 9) | 200 | 400 |
| `GET /api/restaurants/{id}/tables/?date=&time=&partySize=` | logged in | Floor plan with availability | 200 | 400 |
| `POST /api/bookings/` | customer | Create booking | 201 | 400, 403, 409 |
| `GET /api/bookings/{bookingCode}/` | owner of the booking, or the restaurant's owner | Confirmation data | 200 | 403, 404 |
| `GET /api/owner/restaurant/` | restaurant | Own profile | 200 | 403 |
| `PATCH /api/owner/restaurant/` | restaurant | Update profile (sensitive-field rule) | 200 | 400, 409 |
| `GET /api/owner/reservations/?date=&status=` | restaurant | Reservations for a date (default today), sorted by time | 200 | 403 |
| `POST /api/owner/reservations/` | restaurant | Walk-in/phone reservation | 201 | 400, 409 |
| `PATCH /api/owner/reservations/{id}/status/` | restaurant | Body `{"status": "confirmed" \| "cancelled"}` | 200 | 400, 403, 404 |
| `GET /api/owner/stats/?date=` | restaurant | The four dashboard cards | 200 | 403 |
| Later | restaurant | `/api/owner/tables/` CRUD (seats and labels). Until then use Django admin | | |

Status codes: 201 created, 400 validation error, 401 not logged in or bad token, 403 wrong role or not yours, 404 not found, **409 table already booked** (the frontend should reload the floor plan).

**Error shape:** validation errors use DRF's default `{"fieldName": ["message"]}`. Other errors use `{"detail": "message"}`. **Signup serializer field names equal the frontend input ids** (`fullName`, `email`, `phone`, `password`, `confirmPassword`, `restaurantName`, `cuisine`, `priceRange`, `address`, `openTime`, `closeTime`, `totalTables`, `restaurantPhone`, `gst`, `description`), so server errors can be shown under the right input without mapping. Login says only "Invalid email or password" (do not reveal which part is wrong).

### Signup request (flat)

```json
{
  "role": "restaurant",
  "fullName": "Ravi Shah", "email": "ravi@example.com", "phone": "9876543210",
  "password": "Str0ng!pass", "confirmPassword": "Str0ng!pass",
  "restaurantName": "Spice Garden", "cuisine": "indian", "priceRange": "fine",
  "location": "downtown", "address": "123 Main Street, Downtown",
  "openTime": "11:00", "closeTime": "22:30", "totalTables": 10,
  "restaurantPhone": "9876543211", "gst": "", "description": ""
}
```
Restaurant fields are required only when `role = "restaurant"`. `location` is not in the signup form yet (see Section 11, gap 1): until it is, default it to `downtown` and leave `# TODO(frontend)`.

### Auth response (signup and login)

```json
{
  "access": "<jwt>", "refresh": "<jwt>",
  "user": { "id": 7, "fullName": "Ravi Shah", "email": "ravi@example.com", "phone": "9876543210",
            "role": "restaurant", "restaurantId": 3, "verificationStatus": "pending" }
}
```
For a customer, `restaurantId` and `verificationStatus` are `null`.

### Restaurant (list item and detail; same shape)

```json
{
  "id": 1, "name": "Spice Garden", "cuisine": "indian", "location": "downtown",
  "address": "123 Main Street, Downtown", "rating": 4.8, "reviewsCount": 124,
  "priceRange": "fine", "openTime": "11:00", "closeTime": "22:30",
  "phone": "9876543210", "description": "...", "image": "https://..."
}
```
Output `rating` with `serializers.FloatField` (DRF sends decimals as strings, and the frontend sorts by `a.rating - b.rating`). Money fields stay as strings. The frontend formats `openTime`/`closeTime` to "11:00 AM - 10:30 PM" and the phone to "+91 98765 43210".

### Tables with availability (floor plan)

```json
[ { "id": 31, "number": 1, "seats": 2, "label": "Window Side",
    "isAvailable": true, "fitsParty": true, "isRecommended": false } ]
```
`isAvailable` = no overlapping booking at that date and time. `fitsParty` = `seats >= partySize`. `isRecommended` = the smallest available table that fits the party (one table at most).

### Create booking (customer)

```json
{ "restaurantId": 1, "tableId": 34, "date": "2026-10-30", "time": "19:00", "partySize": 4,
  "occasion": "birthday", "firstName": "John", "lastName": "Doe",
  "email": "john@example.com", "phone": "9876543210", "specialRequests": "" }
```

### Booking / reservation (same flat shape for customer and owner)

```json
{ "id": 12, "bookingCode": "TB-7K3QXA", "status": "confirmed", "source": "online",
  "restaurantId": 1, "restaurantName": "Spice Garden",
  "date": "2026-10-30", "time": "19:00", "partySize": 4, "occasion": "birthday",
  "tableId": 34, "tableNumber": 4,
  "customerName": "John Doe", "email": "john@example.com", "phone": "9876543210",
  "specialRequests": "", "depositAmount": "500.00", "depositStatus": "paid",
  "createdAt": "2026-10-26T10:15:00+05:30" }
```

### Walk-in/phone reservation (owner)

```json
{ "customerName": "Priya Sharma", "phone": "9123456789", "date": "2026-10-30",
  "time": "20:00", "partySize": 2, "tableId": 31, "source": "phone", "email": "" }
```

### Owner stats

```json
{ "date": "2026-10-30", "bookingsCount": 18, "guestsExpected": 64,
  "tablesTotal": 10, "tablesFree": 4, "peakHour": "19:00" }
```

---

## 11. Connecting React (step B8) and known gaps

### Setup for the connection

- Django runs at `http://127.0.0.1:8000`. Vite runs at `http://localhost:5173`. These are different **origins**, so the browser blocks calls until `django-cors-headers` allows the frontend origin. List both `http://localhost:5173` and `http://127.0.0.1:5173` (no trailing slash). Never use `CORS_ALLOW_ALL_ORIGINS = True`.
- `frontend/.env`: `VITE_API_URL=http://127.0.0.1:8000/api` (read with `import.meta.env.VITE_API_URL`; restart `npm run dev` after changing it).
- One small `frontend/src/api.js` with a `request(path, options)` helper: adds the JSON header and the `Authorization: Bearer` header, tries the refresh token once on 401, then sends the user to `/`. Pages never call `fetch` directly.
- Add `AuthContext` + `ProtectedRoute` (planned as GEMINI Phase 3.6 but not built yet). Be honest with the student: the React route guard is only for user experience. The **server permissions are the real protection**.
- Token storage: `localStorage` is simple and fine for learning, but any XSS bug can read it. For production, mention httpOnly cookies as the safer option.
- Teach **loading, error and empty states** for every fetch. Use `useEffect` for fetching, and cancel or ignore stale responses.

### Which frontend file changes

| File | Change |
|---|---|
| `LoginPage.jsx` | Call login. Remove the "email contains owner" trick: go to the dashboard by `user.role`. Show server errors |
| `SignupPage.jsx` | Call signup with the flat payload. Show server errors under inputs (ids match field names) |
| `CustomerDashboard.jsx` | Fetch `/restaurants/` (send `search`, `cuisine`, `location`, `sort` as query params). Replace the hard-coded "Shiv Patel" with `/auth/me/`. Real logout (clear tokens) |
| `RestuarantDetails.jsx` | Fetch one restaurant. Fetch slots after a date is chosen. Remove the "fallback to first restaurant" |
| `BookingPage.jsx` | Fetch tables using the draft's date, time, party size. Render from the list, not 6 hard-coded buttons. `POST /bookings/`. On 409 reload tables and show a message |
| `BookingConfirmation.jsx` | Use the server `bookingCode` (delete the `Math.random()` id). Fetch the booking by code |
| `RestaurantDashboard.jsx` | Real reservations, stats, confirm/cancel, add walk-in. Hard-coded name and date go away |
| `RestaurantSettingsPage.jsx` | Load and save the profile. Show "pending admin review" when `pendingReview` is true |
| `data/restaurants.js` | Delete after the list and detail pages use the API |

### Gaps between the current frontend and the backend (decide with the student, one at a time)

1. **`location` is missing from signup and settings**, but the customer dashboard filters by Downtown/Uptown/Suburb. Add a `location` select to both. Until then the backend defaults to `downtown`.
2. **Display strings are used as values** (`"07:00 PM (Dinner)"`, `"4 Guests"`, `"Birthday"`). Change each `<option value>` to the API value and keep the visible text: time `19:00`, party size `4` (`8+ Guests` becomes `8`), occasion `birthday`.
3. **Time slots are the same six for every restaurant**, but opening hours differ (Tokyo Table opens at 13:00, Dragon Wok closes at 22:00). Use `GET .../slots/`.
4. **Owner "Quick Add" form is incomplete and not wired:** it has no date and no party size, `Assign Table` is hard-coded, and the button is `type="button"`. Add `partySize` and use the selected date; load tables from the API.
5. **Status flow conflict:** the customer sees "Reservation Confirmed" at once, but the owner dashboard has "Pending Review" with a Confirm button. The setting `BOOKING_AUTO_CONFIRM` decides. Ask the student which flow they want.
6. **Phone rule:** frontend accepts any 10 digits, the server requires an Indian mobile (starts 6 to 9). Update the frontend regex to match.
7. **Settings page:** `Max Seating Capacity` is derived (sum of seats), so make it read-only. `Number of Tables` creates or deactivates tables (Section 9). There is no per-table seat editor yet.
8. **Restaurant image:** the signup form has no image field. Use `image_url` (seed data uses URLs). Upload is out of scope.
9. **Rating and review count** are stored numbers. There is no review feature.
10. **Deposit** is mocked (₹500). A real gateway for India (for example Razorpay) is a future step.

---

## 12. Code conventions and key settings

**Python:** PEP 8, 4 spaces, f-strings, small functions, clear names. Type hints are welcome but optional. Comments explain **why**, not what.

**Structure:**
- Plain generic views (`ListAPIView`, `RetrieveAPIView`, `CreateAPIView`, `APIView`) and explicit `urls.py`. Do **not** use ViewSets/routers: they hide too much for a beginner.
- Query with `select_related`/`prefetch_related` to avoid the N+1 problem. Filter in `get_queryset()` with the ORM only (no `django-filter` unless the student agrees).
- Permission classes in `accounts/permissions.py`: `IsCustomer`, `IsRestaurantOwner`. Object-level checks in the view or service.
- Business errors are small exception classes (for example `TableUnavailable`, `InvalidBookingTime`) raised in `services.py` and turned into 400/409 in the view.
- Shared validators (phone, GST, password) in `common/validators.py`, used by serializers.

**camelCase serializers (pattern):**

```python
class RestaurantSerializer(serializers.ModelSerializer):
    reviewsCount = serializers.IntegerField(source="reviews_count", read_only=True)
    priceRange = serializers.CharField(source="price_range", read_only=True)
    openTime = serializers.TimeField(source="open_time", format="%H:%M", read_only=True)
    closeTime = serializers.TimeField(source="close_time", format="%H:%M", read_only=True)
    rating = serializers.FloatField(read_only=True)
    image = serializers.CharField(source="image_url", read_only=True)

    class Meta:
        model = Restaurant
        fields = ["id", "name", "cuisine", "location", "address", "rating", "reviewsCount",
                  "priceRange", "openTime", "closeTime", "phone", "description", "image"]
```

**Key settings** (`backend/config/settings.py`, shape only; build it up step by step):

```python
import os
from datetime import timedelta
from decimal import Decimal
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"
ALLOWED_HOSTS = [h for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h]

AUTH_USER_MODEL = "accounts.User"          # set BEFORE the first migrate

DATABASES = {"default": {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": os.environ["DB_NAME"], "USER": os.environ["DB_USER"],
    "PASSWORD": os.environ["DB_PASSWORD"],
    "HOST": os.environ.get("DB_HOST", "127.0.0.1"), "PORT": os.environ.get("DB_PORT", "5432"),
}}

TIME_ZONE = "Asia/Kolkata"
USE_TZ = True

# MIDDLEWARE: put "corsheaders.middleware.CorsMiddleware" above CommonMiddleware.
CORS_ALLOWED_ORIGINS = [o for o in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",") if o]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_THROTTLE_RATES": {"login": "10/min", "signup": "10/hour"},  # use ScopedRateThrottle
}
SIMPLE_JWT = {"ACCESS_TOKEN_LIFETIME": timedelta(minutes=30), "REFRESH_TOKEN_LIFETIME": timedelta(days=7)}

# TableBite rules
BOOKING_DURATION_MINUTES = 90
BOOKING_MAX_DAYS_AHEAD = 60
BOOKING_AUTO_CONFIRM = True
DEPOSIT_AMOUNT = Decimal("500.00")
```

**Definition of done for every endpoint:** serializer validation, the right permission class, an ownership check, `select_related` where needed, at least one success test and one failure test, and a PowerShell example in the explanation.

---

## 13. Security checklist (review at B9, and whenever you touch auth or bookings)

- Passwords are hashed by Django (never store or log plain text). Do not return `password` in any response.
- `SECRET_KEY`, DB password and seed password come from `.env`. Run `git ls-files` and `git status` to prove `.env` is not tracked. If a secret was ever committed, tell the student to **rotate it** (deleting the line is not enough).
- `DEBUG=False` and a real `ALLOWED_HOSTS` outside local development. Before any deployment run `python manage.py check --deploy`.
- CORS lists only the frontend origins.
- The database user is **not** a superuser (it only owns `tablebite`).
- Only the ORM or parameterized queries. Never build SQL with f-strings.
- Role and ownership checks on **every** owner/booking endpoint (tests prove it). Anonymous requests get 401.
- Login and signup are throttled. Login errors do not reveal whether the email exists.
- No personal data (phone, email) in logs or error messages. Owners see only their own restaurant's guests.
- Keep access tokens short (30 minutes). Rotate refresh tokens later if needed.
- Remind the student again: **front-end validation is for user experience, not security.**

---

## 14. Testing

Use Django's built-in tools (`APITestCase`, `APIClient`, `force_authenticate`). Run from `backend/`:

```powershell
python manage.py test
python manage.py test bookings            # one app
python manage.py test bookings.tests.test_rules.TestDoubleBooking   # one class
```

The user `tablebite_user` needs `CREATEDB` (Section 5, B1) because Django builds a temporary test database.

Write tests with the feature, not at the end. Must-have cases:

- **Signup/login:** customer signup 201; duplicate email 400; weak password 400; `role=admin` refused; restaurant signup creates 1 pending restaurant + N tables atomically; login returns role; wrong password 401 with a generic message.
- **Permissions:** anonymous 401; customer on owner endpoints 403; owner on `POST /bookings/` 403; **owner A cannot read or change owner B's reservations**; customer cannot read someone else's booking code.
- **Visibility:** `pending`/`rejected` restaurants are not listed and return 404 on detail.
- **Booking rules:** success; past date; more than 60 days ahead; time before opening; `start + 90 min` after closing (Dragon Wok 21:00); party larger than seats; inactive table; table from another restaurant.
- **Double booking:** same table same time -> 409; 19:00 booked then 20:29 -> 409, 20:30 -> 201; a cancelled booking frees the table; other table or other date is fine.
- **Status changes:** each allowed transition works; `cancelled -> confirmed` is 400.
- **Profile review:** editing `name`/`address`/`gst`/`fssai` goes to `pending_changes` and is not applied until admin approval; other fields apply at once.
- **Stats:** known data gives known numbers (ignoring cancelled).
- **Optional, advanced:** a `TransactionTestCase` with two threads booking the same table, to show the lock works.

---

## 15. Git and GitHub

- Repo: `https://github.com/shiv2124/Restaurant-Customer-Pre-Booking-Management-System.git`, branch `main`. Do not change the Git identity.
- Follow the push routine in `GEMINI.md` Section 15 (G1 to G8): check account and remote, read `git status`, review `git diff --stat`, then the **student** types `git add`, `git commit`, `git push`.
- Commit at the end of each roadmap step. Message style: `Backend B3: add Restaurant and Table models`.
- Before every commit `git status` must **not** list: `.venv/`, `backend/.env`, `__pycache__/`, `*.pyc`, `node_modules/`. `backend/.env.example` **must** be committed. Add `backend/staticfiles/` and `backend/media/` to `.gitignore` only when those folders first appear.
- Commit migration files (`*/migrations/0001_initial.py`, ...). They are part of the code.

---

## 16. Never do this

- Never use FastAPI, SQLite, or Django 6.x in this project. Never skip the custom User model.
- Never install packages in a batch, or add a library that is not in Section 7 without asking.
- Never put secrets in code, in chat, in logs or in Git.
- Never trust a restaurant id, role or price sent by the browser.
- Never put business rules inside views or serializers when they belong in `services.py`.
- Never use float for money, or UTC conversions for booking date/time.
- Never edit an applied migration, delete a table to "fix" a migration problem, or run `migrate --fake` without explaining the risk and asking.
- Never edit `frontend/` or write files without the student asking (`apply it`).
- Never run `git add`, `git commit`, `git push`, `git reset --hard`, or force push.
- Never skip the explanation or the "How to test it" part of a step.
- Never continue to the next step before the student says `done`.

---

## Appendix A: seed data (`python manage.py seed_demo`)

A management command in `restaurants/management/commands/seed_demo.py`. It must be **idempotent** (running twice does not duplicate rows: use `update_or_create`/`get_or_create`) and must refuse to run when `DEBUG` is false. Copy image URLs and descriptions from `frontend/src/data/restaurants.js`.

| # | Name | Cuisine | Location | Price | Open - Close | Phone | Address | Rating | Reviews |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Spice Garden | indian | downtown | fine | 11:00 - 22:30 | 9876543210 | 123 Main Street, Downtown | 4.8 | 124 |
| 2 | Pasta Bella | italian | uptown | moderate | 12:00 - 23:00 | 9876543211 | 45 Olive Way, Uptown | 4.6 | 98 |
| 3 | Dragon Wok | chinese | downtown | budget | 11:30 - 22:00 | 9876543212 | 88 Market Road, Downtown | 4.5 | 110 |
| 4 | Taco Fiesta | mexican | suburb | budget | 12:00 - 22:30 | 9876543213 | 12 Sun Boulevard, Suburb | 4.7 | 85 |
| 5 | Tokyo Table | japanese | uptown | fine | 13:00 - 23:30 | 9876543214 | 7 Blossom Lane, Uptown | 4.9 | 142 |

All five are `approved`. Give each the same demo floor plan (copied from `BookingPage.jsx`):

| Table | Seats | Label |
|---|---|---|
| 1 | 2 | Window Side |
| 2 | 2 | Center |
| 3 | 4 | Garden View |
| 4 | 4 | Booth |
| 5 | 6 | Family Area |
| 6 | 8 | Large Booth |

Demo users (password from `SEED_PASSWORD` in `.env`, development only): `owner1@example.com` to `owner5@example.com` (role `restaurant`, one per restaurant), and `customer@example.com` (role `customer`). Create the admin with `python manage.py createsuperuser`, not in the seed. Optional flag `--with-bookings` adds a few sample bookings.

## Appendix B: `backend/.env.example` (commit this; real values go in `backend/.env`)

```
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=tablebite
DB_USER=tablebite_user
DB_PASSWORD=change-me
DB_HOST=127.0.0.1
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SEED_PASSWORD=change-me-dev-only
```

Make a new secret key with:
`python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`

## Appendix C: testing the API from PowerShell

```powershell
# 1. log in and keep the access token
$r = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/api/auth/login/" `
  -ContentType "application/json" `
  -Body '{"email":"customer@example.com","password":"<SEED_PASSWORD>"}'
$token = $r.access

# 2. call a protected endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/restaurants/?cuisine=indian&sort=rating" `
  -Headers @{ Authorization = "Bearer $token" }

# 3. read the real error body of a 400 or 409
try { Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/api/bookings/" `
        -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $json }
catch { $_.ErrorDetails.Message }
```

During development the DRF browsable API (open the URL in a browser) and the Django admin at `/admin/` are also good ways to look at data. Tell the student to check the table in `psql` too (`SELECT * FROM bookings_booking;`) so they see the API and the database agree.

## Appendix D: the double-booking check (shape only; write the real code in small steps)

```python
# bookings/services.py
from datetime import datetime, timedelta
from django.conf import settings
from django.db import transaction

def _span(booking_date, booking_time):
    start = datetime.combine(booking_date, booking_time)          # local, naive: fine for comparing
    return start, start + timedelta(minutes=settings.BOOKING_DURATION_MINUTES)

@transaction.atomic
def create_booking(*, restaurant, table_id, booking_date, booking_time, party_size, **guest):
    # 1) Lock the table row. A second guest booking the same table waits here, then sees our booking.
    table = Table.objects.select_for_update().get(pk=table_id, restaurant=restaurant, is_active=True)

    # 2) Other rules: date not in the past (use timezone.make_aware for "now" checks),
    #    inside opening hours, party_size <= table.seats.

    # 3) Overlap check: same table, same date, not cancelled.
    new_start, new_end = _span(booking_date, booking_time)
    for other in Booking.objects.filter(table=table, booking_date=booking_date).exclude(status="cancelled"):
        other_start, other_end = _span(other.booking_date, other.booking_time)
        if new_start < other_end and other_start < new_end:
            raise TableUnavailable()                              # the view turns this into 409

    # 4) Create the booking: random booking_code, status from BOOKING_AUTO_CONFIRM,
    #    deposit fields from settings.DEPOSIT_AMOUNT (mock payment).
```

Teach why: `select_for_update()` only works inside a transaction (`atomic`), the check and the insert must happen **inside the same lock**, and the loop is fine because one table has only a handful of bookings per day.

---

*End of instructions. The student's understanding is the product: go slowly, stay small, explain everything, and test every step.*
