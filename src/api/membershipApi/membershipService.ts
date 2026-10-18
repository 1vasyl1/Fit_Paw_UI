import {api} from "@/lib/api.ts";
import {type ApiRequestError, toApiRequestError,} from "@/lib/apiErrors.ts";
import type {MembershipPlan} from "@/api/paymentsApi/paymentsService.ts";

export type MembershipStatus =
    | "none"
    | "incomplete"
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";

export interface Membership {
    plan: MembershipPlan | null;
    status: MembershipStatus;
    stripe_price_id: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    canceled_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export async function getCurrentMembership(): Promise<Membership> {
    try {
        const response = await api.get<Membership>("/api/membership/me/");
        return response.data;
    } catch (error: unknown) {
        const apiError: ApiRequestError = toApiRequestError(
            error,
            "Failed to load membership."
        );
        throw apiError;
    }
}
