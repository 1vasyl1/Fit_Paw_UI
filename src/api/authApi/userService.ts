import {api} from "@/lib/api.ts";

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
    } catch (error: any) {
        const msg =
            error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to fetch user profile";
        throw new Error(msg);
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
    } catch (error: any) {
        const msg =
            error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to update user profile";
        throw new Error(msg);
    }
}
