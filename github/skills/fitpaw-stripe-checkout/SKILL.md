---
name: fitpaw-stripe-checkout
description: "Stripe embedded-checkout payment flow used in the fit_paw_ui repository (FitPaw membership payments). Use when working on payments, membership plans, checkout, or subscription status features, or touching src/scenes/payments/**, src/scenes/membership/**, or src/api/paymentsApi/paymentsService.ts."
metadata:
  project_path: /Users/vasyl/WebstormProjects/fit_paw_ui
  related_skill: fitpaw-api-auth
---

# FitPaw Stripe Checkout Flow

## When to Use This Skill

Use this skill when working on FitPaw's payment/membership feature:

- Adding or changing a membership plan
- Modifying the checkout page or return/confirmation page
- Debugging Stripe embedded checkout issues (blank iframe, stuck loading, wrong plan charged)
- Adding new payment-related API calls

This project uses Stripe's **embedded checkout** (not Checkout redirect, not
Payment Element built by hand) via `@stripe/stripe-js` +
`@stripe/react-stripe-js`.

## Flow Overview

1. Frontend calls `POST /payments/create-checkout-session/` with `{ plan }` → backend (Django) creates a Stripe Checkout
   Session in `embedded` UI mode and returns `{ clientSecret, sessionId }`.
2. Frontend mounts `<EmbeddedCheckoutProvider>` + `<EmbeddedCheckout/>` using that `clientSecret`, rendering Stripe's
   hosted checkout UI inline (no redirect to a Stripe-hosted page).
3. After payment, Stripe redirects the user to the app's return page (`/returnpage` → `PaymentsReturnPage.tsx`), which
   calls `GET /payments/session-status/?session_id=...` to confirm payment status and show a result.

## Key Files

| File                                         | Role                                                                    |
|----------------------------------------------|-------------------------------------------------------------------------|
| `src/api/paymentsApi/paymentsService.ts`     | `createCheckoutSession()`, `getSessionStatus()`, `getMembershipPlans()` |
| `src/scenes/payments/CheckOut.tsx`           | Mounts the embedded Stripe checkout                                     |
| `src/scenes/payments/PaymentsReturnPage.tsx` | Post-payment confirmation page                                          |
| `src/scenes/membership/MembershipPage.tsx`   | Membership plan selection page                                          |

## Stripe Client Setup

```ts
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);
```

- Only ever use the **publishable** key (`pk_...`) on the frontend — the secret key lives only in the Django backend.
- `loadStripe(...)` should be called once at module scope (as it already is in `CheckOut.tsx`), not on every render.

## Payment Types (`paymentsService.ts`)

```ts
export type MembershipPlan = "enter" | "pro" | "elite";

export interface CreateCheckoutSessionPayload { plan: MembershipPlan; }
export interface CheckoutSessionResponse { clientSecret: string; sessionId: string; }
export interface SessionStatusResponse {
    sessionId: string;
    status: "complete" | "open" | "expired" | string;
    paymentStatus: "paid" | "unpaid" | "no_payment_required" | string | null;
    customerEmail: string | null;
    subscriptionId: string | null;
}
```

When adding a new plan, extend the `MembershipPlan` union type here — this is
the single source of truth used by both the checkout call and (should be) the
membership selection UI.

## Checkout Page Pattern

```tsx
const [clientSecret, setClientSecret] = useState<string | null>(null);

useEffect(() => {
    const initCheckout = async () => {
        try {
            const data = await createCheckoutSession({ plan: /* selected plan */ });
            setClientSecret(data.clientSecret);
        } catch (err: any) {
            setServerError(err.message || "Failed to initialize payment.");
        } finally {
            setIsLoading(false);
        }
    };
    initCheckout();
}, []);
```

Then render:

```tsx
<EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
    <EmbeddedCheckout />
</EmbeddedCheckoutProvider>
```

Always guard rendering with the `isLoading` / `serverError` / `clientSecret`
states already established in `CheckOut.tsx` (loading spinner, error message,
then the embedded checkout) — don't render `<EmbeddedCheckout/>` before
`clientSecret` is available.

## Known Gap (as of last review)

`CheckoutPage` currently hardcodes `plan: "enter"` with a `//TODO: add here
membership plan` comment — it does not yet read the plan the user actually
selected on `MembershipPage`. When implementing plan selection end-to-end:

1. Pass the chosen `MembershipPlan` from `MembershipPage` to `CheckoutPage` (e.g. via route state, a query param, or a
   shared context) — check current routing (`AppRouter.tsx`) for the mechanism already in place before adding a new one.
2. Replace the hardcoded `"enter"` with the passed-in plan.
3. Remove the TODO comment once done.

## Verifying Payment Status

`PaymentsReturnPage.tsx` should call `getSessionStatus(sessionId)` (reading
`session_id` from the URL query params that Stripe appends on redirect) and
branch UI on `status`/`paymentStatus` — treat `status !== "complete"` or
`paymentStatus !== "paid"` as not-yet-successful rather than assuming success
just because the user landed on the return page.

## Environment & Backend Assumptions

- `VITE_STRIPE_PUBLISHABLE_KEY` must match the same Stripe account/mode (test vs live) as the Django backend's secret
  key — mismatches cause silent failures or "No such customer/session" errors.
- Backend endpoints expected: `POST /payments/create-checkout-session/`, `GET /payments/session-status/`,
  `GET /payments/plans/`.
- If testing payments, use [Stripe's test card numbers](https://docs.stripe.com/testing) — never real card data — since
  `VITE_STRIPE_PUBLISHABLE_KEY` in `.env` is a `pk_test_...` key.
