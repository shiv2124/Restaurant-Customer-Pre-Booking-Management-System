# Restaurant Booking System

React.js (Vite) front end: components, React Router, CSS Modules and form
validation. Plain JavaScript (`.jsx`), no TypeScript, no Tailwind.

## Run it

Requires Node 20.19 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint
```

## Folder structure

```
src/
├── main.jsx                  entry: BrowserRouter + AuthProvider + <App />
├── App.jsx                   all routes
├── index.css                 global only: design tokens, reset, base styles
├── components/               reusable UI, one folder per component
│   └── Button/
│       ├── Button.jsx
│       └── Button.module.css     <- CSS Module, scoped to this component
├── pages/                    one folder per route (page + its CSS Module)
├── hooks/                    useAuth, useForm
├── context/                  AuthContext, AuthProvider
├── utils/                    validators, date, storage, id, classNames
├── constants/                routes, options (occasions, fees, storage keys)
└── data/                     mock restaurants, tables, reservations
```

## Component-based CSS (CSS Modules)

Each component imports its own stylesheet:

```jsx
import styles from './Button.module.css';
<button className={styles.primary} />
```

Vite appends a unique suffix to every class, so `.primary` in the browser
becomes something like `Button-module__primary___s1sM6`. Two components can
both have a `.title` class without clashing. Tokens such as colours live in
`:root` in `index.css` and are used with `var(--color-primary-600)`.

## Validation (`src/utils/validators.js` + `src/hooks/useForm.js`)

Rules are pure functions; `useForm` keeps the controlled inputs and shows
each error after the field is left or the form is submitted.

| Field | Rule |
|---|---|
| Email (the login ID) | required, valid format, max 254, no spaces |
| Password, sign-in | required, at least 8 characters |
| Password, sign-up | 8 to 64 characters, lowercase, uppercase, number, special character, no spaces (live checklist) |
| Confirm password | must match |
| Names | 2 to 50 characters, letters, spaces, `.` `'` `-` |
| Phone | Indian mobile: 10 digits starting 6 to 9, optional +91 / 91 / 0 |
| Booking date | real date, not in the past |
| Booking time | within the restaurant's opening hours; later than now if today |
| Party size / occasion | in the allowed list |
| Table | must be free and seat the whole party |
| Add reservation (restaurant) | all of the above, and no clash with another booking on the same table within 90 minutes |
| Special requests | max 300 characters |

## Notes

- Login and sign-up are still mocked (no backend), as in the original project:
  the form validates input, but no server checks the password.
- Routes are protected: customer pages need a customer login, the restaurant
  dashboard needs a restaurant login.
