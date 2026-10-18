import {useEffect, useState} from "react";
import {CheckCircle, XCircle} from "lucide-react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {getSessionStatus, type SessionStatusResponse,} from "@/api/paymentsApi/paymentsService.ts";
import {getCurrentMembership, type Membership,} from "@/api/membershipApi/membershipService.ts";
import {toApiRequestError} from "@/lib/apiErrors.ts";

function getVerificationErrorMessage(error: unknown): string {
    const apiError = toApiRequestError(
        error,
        "Unable to verify the payment session."
    );

    if (apiError.status === 400) {
        return apiError.message || "The payment session is invalid.";
    }

    if (apiError.status === 503) {
        return "Payment verification is temporarily unavailable. Please try again.";
    }

    return apiError.message;
}

function MembershipStatus({membership}: { membership: Membership }) {
    const planName = membership.plan
        ? membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)
        : "No plan";

    return (
        <div className="mb-6 rounded-xl bg-sky-50 p-4 text-sm text-sky-900">
            <p className="font-semibold">Membership: {planName}</p>
            <p className="mt-1 capitalize">
                Status: {membership.status.replace("_", " ")}
            </p>
        </div>
    );
}

export function PaymentReturnPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [sessionStatus, setSessionStatus] = useState<SessionStatusResponse | null>(null);
    const [membership, setMembership] = useState<Membership | null>(null);
    const [membershipError, setMembershipError] = useState<string | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [missingSession, setMissingSession] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const verifyPayment = async () => {
            const sessionId = searchParams.get("session_id");
            if (!sessionId) {
                setMissingSession(true);
                setIsLoading(false);
                return;
            }

            try {
                const data = await getSessionStatus(sessionId);
                if (!isMounted) {
                    return;
                }

                setSessionStatus(data);
                const isPaid = data.status === "complete" && data.paymentStatus === "paid";

                if (isPaid) {
                    try {
                        const currentMembership = await getCurrentMembership();
                        if (isMounted) {
                            setMembership(currentMembership);
                        }
                    } catch (error: unknown) {
                        if (isMounted) {
                            const apiError = toApiRequestError(
                                error,
                                "Unable to refresh membership."
                            );
                            if (apiError.status === 401) {
                                navigate("/login", {replace: true});
                                return;
                            }
                            setMembershipError(
                                "Payment succeeded, but membership status is still synchronizing."
                            );
                        }
                    }
                }
            } catch (error: unknown) {
                if (!isMounted) {
                    return;
                }

                const apiError = toApiRequestError(
                    error,
                    "Unable to verify the payment session."
                );
                if (apiError.status === 401) {
                    navigate("/login", {replace: true});
                    return;
                }
                setVerificationError(getVerificationErrorMessage(apiError));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void verifyPayment();

        return () => {
            isMounted = false;
        };
    }, [navigate, searchParams]);

    const isSuccess =
        sessionStatus?.status === "complete" &&
        sessionStatus.paymentStatus === "paid";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
                {isLoading && (
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"/>
                        <p className="text-sm text-gray-500">Checking payment status...</p>
                    </div>
                )}

                {!isLoading && missingSession && (
                    <>
                        <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No Payment Session Found
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            We couldn&apos;t find a checkout session to verify. Please choose a
                            membership plan again.
                        </p>
                        <Link
                            to="/membership"
                            className="block w-full bg-sky-600 text-white py-3 rounded-xl font-medium hover:bg-sky-700 transition-colors"
                        >
                            Choose a plan
                        </Link>
                    </>
                )}

                {!isLoading && !missingSession && isSuccess && (
                    <>
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-sm text-gray-500 mb-1">
                            Confirmation sent to:
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-6">
                            {sessionStatus.customerEmail ?? "your email address"}
                        </p>
                        {membership && <MembershipStatus membership={membership}/>}
                        {membershipError && (
                            <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                                {membershipError}
                            </p>
                        )}
                        <Link
                            to="/"
                            className="block w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            Back to Home
                        </Link>
                        <Link
                            to="/profile"
                            className="mt-3 block w-full bg-sky-50 text-sky-700 py-3 rounded-xl font-medium hover:bg-sky-100 transition-colors"
                        >
                            View My Membership
                        </Link>
                    </>
                )}

                {!isLoading && !missingSession && !isSuccess && (
                    <>
                        <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Incomplete
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {verificationError ?? "Something went wrong or the session expired."}
                        </p>
                        <Link
                            to="/membership"
                            className="block w-full bg-sky-600 text-white py-3 rounded-xl font-medium hover:bg-sky-700 transition-colors"
                        >
                            Try Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
