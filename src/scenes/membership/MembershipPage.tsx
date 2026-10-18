import {type ReactNode, useCallback, useEffect, useState} from "react";
import {Crown, ShieldCheck, Star} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {
    getMembershipPlans,
    type MembershipPlan,
    type MembershipPlanResponse,
} from "@/api/paymentsApi/paymentsService.ts";
import {getCurrentMembership, type Membership,} from "@/api/membershipApi/membershipService.ts";
import {toApiRequestError} from "@/lib/apiErrors.ts";

const PLAN_PRESENTATION: Record<
    MembershipPlan,
    { icon: ReactNode; features: string[]; highlight?: boolean }
> = {
    enter: {
        icon: <ShieldCheck className="w-6 h-6 text-sky-600"/>,
        features: [
            "Basic training access",
            "Schedule overview",
            "Profile management",
        ],
    },
    pro: {
        icon: <Star className="w-6 h-6 text-sky-600"/>,
        features: [
            "Everything in Enter",
            "Advanced scheduling",
            "Priority support",
            "More personalized experience",
        ],
        highlight: true,
    },
    elite: {
        icon: <Crown className="w-6 h-6 text-sky-600"/>,
        features: [
            "Everything in Pro",
            "Premium features",
            "Exclusive member benefits",
            "Top priority support",
        ],
    },
};

function formatPlanAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(amount / 100);
}

function getPlansErrorMessage(error: unknown): string {
    const apiError = toApiRequestError(
        error,
        "Unable to load membership plans."
    );

    if (apiError.status === 503) {
        return "Stripe is currently unavailable. Please try again shortly.";
    }

    if (apiError.status === 400) {
        return apiError.message || "The membership plans are invalid.";
    }

    return apiError.message;
}

function getMembershipErrorMessage(error: unknown): string {
    const apiError = toApiRequestError(
        error,
        "Unable to load your current membership."
    );

    if (apiError.status === 503) {
        return "Membership services are temporarily unavailable. Please try again.";
    }

    return apiError.message;
}

function MembershipSummary({membership}: { membership: Membership }) {
    const planName = membership.plan
        ? membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)
        : "No plan";

    return (
        <div className="mb-10 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Current membership
            </p>
            <p className="mt-2 text-xl font-bold text-gray-900">{planName}</p>
            <p className="mt-1 text-sm text-gray-600">
                Status: <span className="font-semibold capitalize">{membership.status.replace("_", " ")}</span>
            </p>
        </div>
    );
}

export function MembershipPage() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<MembershipPlanResponse[]>([]);
    const [membership, setMembership] = useState<Membership | null>(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [isLoadingMembership, setIsLoadingMembership] = useState(true);
    const [plansError, setPlansError] = useState<string | null>(null);
    const [membershipError, setMembershipError] = useState<string | null>(null);

    const loadPlans = useCallback(async () => {
        setIsLoadingPlans(true);
        setPlansError(null);

        try {
            const data = await getMembershipPlans();
            if (data.length === 0) {
                setPlansError("No membership plans are currently available.");
                setPlans([]);
                return;
            }
            setPlans(data);
        } catch (error: unknown) {
            const apiError = toApiRequestError(error, "Unable to load membership plans.");
            if (apiError.status === 401) {
                navigate("/login", {replace: true});
                return;
            }
            setPlans([]);
            setPlansError(getPlansErrorMessage(apiError));
        } finally {
            setIsLoadingPlans(false);
        }
    }, [navigate]);

    const loadMembership = useCallback(async () => {
        setIsLoadingMembership(true);
        setMembershipError(null);

        try {
            setMembership(await getCurrentMembership());
        } catch (error: unknown) {
            const apiError = toApiRequestError(
                error,
                "Unable to load your current membership."
            );
            if (apiError.status === 401) {
                navigate("/login", {replace: true});
                return;
            }
            setMembership(null);
            setMembershipError(getMembershipErrorMessage(apiError));
        } finally {
            setIsLoadingMembership(false);
        }
    }, [navigate]);

    useEffect(() => {
        void loadPlans();
        void loadMembership();
    }, [loadMembership, loadPlans]);

    const handleSelectPlan = (plan: MembershipPlan) => {
        navigate(`/payments?plan=${plan}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
                <div className="text-center mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                        Membership
                    </p>
                    <h1 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900">
                        Choose your plan
                    </h1>
                    <p className="mt-3 text-sm lg:text-base text-gray-500 max-w-2xl mx-auto">
                        Pick the membership that fits you best.
                        Upgrade anytime and enjoy a secure Stripe experience.
                    </p>
                </div>

                {isLoadingMembership && (
                    <p className="mb-8 text-center text-xs text-gray-400">
                        Loading your current membership...
                    </p>
                )}
                {membership && <MembershipSummary membership={membership}/>}
                {membershipError && !isLoadingMembership && (
                    <div
                        className="mb-8 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600">
                        <p>{membershipError}</p>
                        <button
                            type="button"
                            onClick={() => void loadMembership()}
                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {isLoadingPlans && (
                    <div className="py-16 text-center text-sm text-gray-500">
                        Loading latest plans...
                    </div>
                )}

                {plansError && !isLoadingPlans && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-600">
                        <p>{plansError}</p>
                        <button
                            type="button"
                            onClick={() => void loadPlans()}
                            className="mt-3 rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
                        >
                            Retry plans
                        </button>
                    </div>
                )}

                {!isLoadingPlans && !plansError && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {plans.map((plan) => {
                            const presentation = PLAN_PRESENTATION[plan.plan];

                            return (
                                <div
                                    key={plan.plan}
                                    className={`rounded-2xl border bg-white shadow-xl overflow-hidden transition-all ${
                                        presentation.highlight
                                            ? "border-sky-200 ring-2 ring-sky-100"
                                            : "border-gray-100"
                                    }`}
                                >
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-5">
                                            <div
                                                className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                                                {presentation.icon}
                                            </div>
                                            {presentation.highlight && (
                                                <span
                                                    className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">
                                                    Most popular
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {plan.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-500">
                                            {plan.description}
                                        </p>

                                        <div className="mt-6">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatPlanAmount(plan.amount, plan.currency)}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                / {plan.interval}
                                            </span>
                                        </div>

                                        <ul className="mt-6 space-y-3">
                                            {presentation.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="text-sm text-gray-600 flex items-start gap-2"
                                                >
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-500"/>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            type="button"
                                            onClick={() => handleSelectPlan(plan.plan)}
                                            className={`mt-8 w-full rounded-xl py-3 font-medium transition-all active:scale-[0.98] ${
                                                presentation.highlight
                                                    ? "bg-sky-600 text-white hover:bg-sky-700"
                                                    : "bg-gray-900 text-white hover:bg-gray-800"
                                            }`}
                                        >
                                            Choose {plan.name}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
