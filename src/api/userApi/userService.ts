import {api} from "@/lib/api.ts";
import {toApiRequestError} from "@/lib/apiErrors.ts";

export type UserProfile = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
};


export type UpdateUserMePayload = {
    first_name?: string;
    last_name?: string;
    email?: string;
};

/**
 * GET /auth/users/me
 */
export async function getCurrentUser(): Promise<UserProfile> {
    try {
        const response = await api.get<UserProfile>("/auth/users/me/");
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(error, "Failed to fetch user profile");
    }
}

/**
 * PATCH /auth/users/me
 */
export async function updateCurrentUser(
    payload: UpdateUserMePayload
): Promise<UserProfile> {
    try {
        const response = await api.patch<UserProfile>("/auth/users/me/", payload);
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(error, "Failed to update user profile");
    }
}
