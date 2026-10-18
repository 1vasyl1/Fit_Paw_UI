---
name: fitpaw-api-auth
description: "API client and JWT authentication pattern used in the fit_paw_ui repository (FitPaw frontend talking to a Django REST Framework backend). Use when adding a new API call/endpoint, wiring a component to the backend, debugging 401 / token refresh / login-logout issues, or touching src/lib/api.ts, src/api/**, or src/api/helpers/AuthContext.tsx."
metadata:
  project_path: /Users/vasyl/WebstormProjects/fit_paw_ui
  related_skill: fitpaw-ui-conventions
---

# FitPaw API & Auth Integration

## When to Use This Skill

Use this skill when working on anything that talks to the FitPaw backend
(Django REST Framework) from the `fit_paw_ui` frontend:

- Adding a new backend endpoint call
- Debugging login/logout, 401 errors, or silent token refresh issues
- Reviewing or extending `src/lib/api.ts` or any file under `src/api/`
- Explaining how auth state (`isAuthenticated`) is tracked in the app

## Core Pieces

| File                                     | Responsibility                                                                           |
|------------------------------------------|------------------------------------------------------------------------------------------|
| `src/lib/api.ts`                         | Single shared `axios` instance (`api`) with request/response interceptors                |
| `src/api/<domain>Api/<domain>Service.ts` | Thin functions wrapping `api.get/post/...` for one backend domain (auth, payments, user) |
| `src/api/helpers/AuthContext.tsx`        | React Context storing `isAuthenticated` + `loginUser`/`logoutUser`                       |
| `src/api/helpers/UseAuth.ts`             | Hook to consume `AuthContext` from components                                            |

**Never call `axios` directly from a component or scene.** Always go through
`api` from `src/lib/api.ts`, wrapped in a function inside the matching
`*Service.ts` file.

## The Axios Client (`src/lib/api.ts`)

```ts
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
});
```

- `baseURL` comes from `VITE_API_URL` — never hardcode the backend host.
- `withCredentials: true` — the backend also uses an httpOnly cookie for the refresh token, so cookies must always be
  sent.

### Request interceptor

Attaches the JWT access token from `localStorage["token"]` as a Bearer header
on every outgoing request.

### Response interceptor — silent refresh on 401

On a `401` response (and only if the request hasn't already been retried):

1. If a refresh is already in flight, the request is queued (`failedQueue`) instead of firing a duplicate refresh call.
2. Otherwise it POSTs to `${VITE_API_URL}/auth/token/refresh/` (cookie-based, `withCredentials: true`) to get a new
   access token.
3. On success: stores the new token in `localStorage`, updates the default `Authorization` header, replays all queued
   requests, then retries the original request.
4. On failure: clears `localStorage["token"]` and hard-redirects to `/login`.

**When adding new API calls, you do not need to handle 401/refresh yourself** —
it's centralized here. Just call `api.get/post/...` and let it propagate other
errors normally.

## Service Layer Pattern

Each backend domain gets its own folder + file under `src/api/`, exporting
typed request/response interfaces and one function per endpoint. Example
(`authService.ts`):

```ts
import {api} from "@/lib/api.ts";

export type LoginPayload = { username: string; password: string };
export type LoginResponse = { access: string; refresh?: string };

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>("/auth/login/", payload);
        return response.data;
    } catch (error: any) {
        const msg = error.response?.data?.detail || error.response?.data?.error || "Login failed";
        throw new Error(msg);
    }
}
```

**Conventions to follow for every new endpoint function:**

1. Define a `<Thing>Payload` type for the request body (if any) and a `<Thing>Response` type for the response shape.
2. Wrap the call in `try/catch`; extract the message with
   `error.response?.data?.detail || error.response?.data?.error || "<fallback message>"`
   and `throw new Error(msg)` — never let raw Axios errors leak to components.
3. Put the function in the matching domain folder: `src/api/<domain>Api/<domain>Service.ts`. Create a new domain folder
   if it doesn't exist yet (e.g. `src/api/scheduleApi/scheduleService.ts`).
4. Keep endpoint paths relative (no leading host, no `VITE_API_URL` — that's baked into `baseURL`), and match the
   trailing-slash style already used (DRF convention): `/auth/login/`, `/payments/plans/`.

## Known Backend Endpoints (Django REST Framework)

- `POST /auth/login/` → `{ access, refresh? }`
- `POST /auth/signup/`
- `POST /auth/token/refresh/` (cookie-based, called automatically by the interceptor)
- `GET /payments/plans/`
- `POST /payments/create-checkout-session/`
- `GET /payments/session-status/?session_id=...`

When adding a new frontend feature, check with the user/backend repo whether
the corresponding DRF endpoint already exists before assuming the path.

## Auth State in Components

Use the `AuthContext` (via `UseAuth.ts` hook), not `localStorage` directly, to
read/react to auth state in components:

```ts
const { isAuthenticated, loginUser, logoutUser } = useAuth();
```

- Call `loginUser(token)` right after a successful `loginApi()` call to store the token and flip `isAuthenticated`.
- Call `logoutUser()` to clear the token and flip `isAuthenticated` back to false — do this instead of manually touching
  `localStorage`.

## Debugging Checklist for Auth Issues

1. Confirm `VITE_API_URL` in `.env` matches where the Django backend is actually running (e.g. `http://localhost:8000`).
2. Check whether the failing request is missing the `Authorization` header (request interceptor issue) vs. getting a 401
   that isn't being refreshed (response interceptor / refresh-cookie issue).
3. If refresh loops or logs the user out unexpectedly, check that the backend's `/auth/token/refresh/` endpoint
   sets/reads its refresh cookie correctly and that `withCredentials` is set on both the main instance and the raw
   `axios.post` refresh call.
4. Remember `originalRequest._retry` prevents infinite retry loops — don't remove it when modifying the interceptor.
