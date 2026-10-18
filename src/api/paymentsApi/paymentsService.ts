import {api} from "@/lib/api.ts";
import {toApiRequestError} from "@/lib/apiErrors.ts";
import type {Membership} from "@/api/membershipApi/membershipService.ts";

export type MembershipPlan = "enter" | "pro" | "elite";

export interface CreateCheckoutSessionPayload {
    plan: MembershipPlan;
}

export interface CheckoutSessionResponse {
    clientSecret: string;
    sessionId: string;
}

export interface SessionStatusResponse {
    sessionId: string;
    status: "complete" | "open" | "expired" | string;
    paymentStatus: "paid" | "unpaid" | "no_payment_required" | string | null;
    customerEmail: string | null;
    subscriptionId: string | null;
    membership: Membership | null;
}

export async function createCheckoutSession(
    payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> {
    try {
        const response = await api.post<CheckoutSessionResponse>(
            "/api/payments/create-checkout-session/",
            payload
        );
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(
            error,
            "Failed to create checkout session."
        );
    }
}

export async function getSessionStatus(
    sessionId: string
): Promise<SessionStatusResponse> {
    try {
        const response = await api.get<SessionStatusResponse>(
            "/api/payments/session-status/",
            {
                params: {session_id: sessionId},
            }
        );
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(error, "Failed to fetch session status.");
    }
}

export interface MembershipPlanResponse {
    plan: MembershipPlan;
    price_id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    interval: string;
}

export async function getMembershipPlans(): Promise<MembershipPlanResponse[]> {
    try {
        const response = await api.get<MembershipPlanResponse[]>(
            "/api/payments/plans/"
        );
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(error, "Failed to fetch membership plans.");
    }
}

const paymentService = {
    createCheckoutSession,
    getSessionStatus,
    getMembershipPlans,
};

export default paymentService;
