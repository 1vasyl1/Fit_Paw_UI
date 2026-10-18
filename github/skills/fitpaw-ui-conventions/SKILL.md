---
name: fitpaw-ui-conventions
description: "Project conventions for the fit_paw_ui repository (React 19 + TypeScript + Vite frontend for the FitPaw app). Use when adding, editing, or reviewing any page, component, route, or config file inside /Users/vasyl/WebstormProjects/fit_paw_ui, or when the user mentions FitPaw UI, FitPaw frontend, or fit_paw_ui. Covers folder structure, path aliases, shadcn/ui + Tailwind v4 usage, routing, and the lint/format/pre-commit pipeline."
metadata:
  project_path: /Users/vasyl/WebstormProjects/fit_paw_ui
  stack: React 19, TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui, react-router-dom 7
---

# FitPaw UI Conventions

## When to Use This Skill

Use this skill whenever working inside the `fit_paw_ui` repository (local path
`/Users/vasyl/WebstormProjects/fit_paw_ui`), for example:

- Adding a new page/route ("scene") or component
- Wiring up a new feature to the UI
- Reviewing or refactoring existing frontend code
- Answering questions about how this specific frontend is structured
- Fixing lint/format/build errors in this repo

This is the frontend-only repo for FitPaw. The backend is a separate Django
REST Framework (DRF) API the UI calls over HTTP (see `fitpaw-api-auth` skill
for the API client and auth pattern, and `fitpaw-stripe-checkout` for payments).

## Tech Stack

- React 19 + TypeScript, bundled with Vite 7
- Routing: `react-router-dom` v7 (`createBrowserRouter` / `createRoutesFromElements`)
- Styling: Tailwind CSS v4 (via `@tailwindcss/postcss`) + `shadcn/ui` components (style: `new-york`, base color:
  `neutral`, icon library: `lucide-react`)
- Forms: `react-hook-form`
- HTTP: `axios` (see `fitpaw-api-auth` skill)
- Payments: `@stripe/stripe-js` + `@stripe/react-stripe-js` (see `fitpaw-stripe-checkout` skill)
- Tooling: ESLint 9 (flat config) + Prettier + Husky (pre-commit) + lint-staged
- Code quality: JetBrains Qodana runs in CI (`.github/workflows/qodana_code_quality.yml`)

## Folder Structure

```
src/
  api/                    # API service layer, one subfolder per domain
    authApi/authService.ts
    paymentsApi/paymentsService.ts
    userApi/userService.ts
    helpers/AuthContext.tsx, UseAuth.ts
  components/             # Shared, reusable components (not full pages)
    ui/                   # shadcn/ui primitives (button.tsx, select.tsx, ...) — generated, avoid hand-editing internals
    scheduleComponents/    # feature-specific shared components grouped by feature
    hooks/                 # shared hooks, e.g. useFilterlessons.ts
    Layout.tsx             # root layout: Navbar + <Outlet/> + footer
  scenes/                 # Page-level components ("screens"), one folder per feature
    home/HomePage.tsx
    about/AboutPage.tsx
    authorise/LoginPage.tsx, SignPageUp.tsx
    schedule/SchedulePage.tsx
    payments/CheckOut.tsx, PaymentsReturnPage.tsx
    membership/MembershipPage.tsx
    user/UserPage.tsx
    navbar/NavBar.tsx
  routes/AppRouter.tsx     # single source of truth for all routes
  lib/api.ts               # axios instance + interceptors (see fitpaw-api-auth)
  lib/utils.ts             # shadcn's cn() helper, generic utils
  main.tsx                 # app entry point
```

Rules of thumb:

- **New full page/feature** → create a new folder under `src/scenes/<feature>/`, name the component `<Feature>Page.tsx`,
  and register it in `src/routes/AppRouter.tsx`.
- **New shared/reusable UI piece** (not a full page) → `src/components/`. If it's specific to one feature, nest it under
  `src/components/<feature>Components/`.
- **New shadcn primitive** → generate via the shadcn CLI (do not hand-write in `src/components/ui/`) so it stays
  consistent with `components.json`.
- **New API call** → add it to the relevant file in `src/api/<domain>Api/<domain>Service.ts` (see `fitpaw-api-auth`
  skill), never call `axios` directly from a component.
- **New shared hook** → `src/components/hooks/`.

## Path Aliases

Configured in `components.json` and the TS/Vite config — always use the `@/` alias instead of relative `../../` chains:

```ts
import { api } from "@/lib/api.ts";
import { LoginPage } from "@/scenes/authorise/LoginPage.tsx";
```

Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.

## Routing Pattern

All routes are declared in one place, `src/routes/AppRouter.tsx`, nested under the
root `<Layout />` route so every page gets the shared `Navbar` + footer:

```tsx
<Route element={<Layout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/schedule" element={<SchedulePage />} />
  {/* new routes go here, alphabetically-ish grouped by feature */}
</Route>
```

When adding a page: create the scene component, import it at the top of
`AppRouter.tsx`, and add a `<Route path="..." element={<...Page/>} />` line.
Keep the catch-all `path="*"` route last.

## Styling Conventions

- Use Tailwind utility classes directly in JSX; avoid separate CSS files except `src/index.css` (global styles/Tailwind
  layers).
- Use shadcn/ui components (`@/components/ui/*`) instead of building primitives (buttons, selects, dropdowns) from
  scratch.
- Use `cn()` from `@/lib/utils` to conditionally merge Tailwind classes instead of manual string concatenation.
- Use `lucide-react` for icons (already a dependency) — don't add a second icon library.

## Lint, Format, and Pre-commit

- `npm run lint` — ESLint check
- `npm run lint:fix` — ESLint `--fix` + Prettier write
- `npm run build` — `tsc -b && vite build` (type-check before building)
- Husky + lint-staged run `eslint`/`prettier` automatically on staged files at commit time — do not bypass with
  `--no-verify` unless the user explicitly asks.
- Always run `npm run lint` (and `npm run build` for larger changes) before considering a change done in this repo.

## Environment Variables

Defined in `.env` (not committed) and consumed via `import.meta.env.*`:

- `VITE_API_URL` — base URL of the Django REST Framework backend (e.g. `http://localhost:8000`)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable (public) key
- `VITE_MAP_API_KEY` — Google Maps API key

Never hardcode these values in source files — always read them from `import.meta.env`.
