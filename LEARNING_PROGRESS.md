# Learning Progress

## Current position
Phase: 1   Step: 1.1   Last thing finished: Checkpoint 0 (Phase 0 complete)   Next: 1.1 The staircase (Install react-router-dom & route placeholders)

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
- [ ] Phase 1: Raw structure
- [ ] Phase 2: Finishing
- [ ] Phase 3: Working systems
- [ ] Phase 4: Final inspection
- [ ] Part B: Back end

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

## Glossary
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
- 2026-10-23: Phase 0: project setup, gitignore, and venv (pushed)
- 2026-10-23: first Push (pushed)

## Open questions / things to revisit
- None currently
