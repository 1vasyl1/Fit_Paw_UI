import {useCallback, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {EmbeddedCheckout, EmbeddedCheckoutProvider,} from "@stripe/react-stripe-js";
import {createCheckoutSession, type MembershipPlan,} from "@/api/paymentsApi/paymentsService.ts";
import {ShieldCheck} from "lucide-react";
import {toApiRequestError} from "@/lib/apiErrors.ts";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
    ? loadStripe(stripePublishableKey)
    : null;

const VALID_PLANS: MembershipPlan[] = ["enter", "pro", "elite"];

function parsePlan(rawPlan: string | null): MembershipPlan | null {
    if (rawPlan && (VALID_PLANS as string[]).includes(rawPlan)) {
        return rawPlan as MembershipPlan;
    }
    return null;
}

function getCheckoutErrorMessage(error: unknown): string {
    const apiError = toApiRequestError(
        error,
        "Failed to initialize payment."
    );

    if (apiError.status === 400) {
        return apiError.message || "The selected membership plan is invalid.";
    }

    if (apiError.status === 409) {
        return "You already have an active membership. Manage it from your profile.";
    }

    if (apiError.status === 503) {
        return "Stripe is currently unavailable. Please retry shortly.";
    }

    return apiError.message;
}

export function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const plan = parsePlan(searchParams.get("plan"));
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initCheckout = useCallback(async () => {
        setIsLoading(true);
        setServerError(null);
        setClientSecret(null);

        if (!plan) {
            setServerError("Please select a membership plan before checkout.");
            setIsLoading(false);
            return;
        }

        if (!stripePromise) {
            setServerError(
                "Stripe checkout is not configured. Please contact support."
            );
            setIsLoading(false);
            return;
        }

        try {
            const data = await createCheckoutSession({plan});
            setClientSecret(data.clientSecret);
        } catch (error: unknown) {
            const apiError = toApiRequestError(
                error,
                "Failed to initialize payment."
            );
            if (apiError.status === 401) {
                navigate("/login", {replace: true});
                return;
            }
            setServerError(getCheckoutErrorMessage(apiError));
        } finally {
            setIsLoading(false);
        }
    }, [navigate, plan]);

    useEffect(() => {
        void initCheckout();
    }, [initCheckout]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 lg:py-12">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-full mb-4">
                        <ShieldCheck className="w-6 h-6 text-sky-600"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        FitPaw Membership
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Secure payment powered by Stripe
                    </p>
                </div>

                {/* checkout*/}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6">

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div
                                className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"/>
                            <p className="text-sm text-gray-500">
                                Preparing checkout...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {serverError && !isLoading && (
                        <div
                            className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                            <p>{serverError}</p>
                            <button
                                type="button"
                                onClick={() => void initCheckout()}
                                className="mt-4 rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Stripe Embedded Checkout */}
                    {clientSecret && !isLoading && stripePromise && (
                        <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{clientSecret}}
                        >
                            <EmbeddedCheckout/>
                        </EmbeddedCheckoutProvider>
                    )}
                </div>
            </div>
        </div>
    );
}
