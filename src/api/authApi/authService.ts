import {api} from "@/lib/api.ts";
import {toApiRequestError} from "@/lib/apiErrors.ts";

export type LoginPayload = {
    username: string;
    password: string;
};

export type LoginResponse = {
    access: string;
    refresh?: string;
};

export type SignUpPayload = {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
};

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>("/auth/login/", payload);
        return response.data;
    } catch (error: unknown) {
        throw toApiRequestError(error, "Login failed");
    }
}

export async function signUpApi(payload: SignUpPayload): Promise<void> {
    try {
        await api.post("/auth/signup/", payload);
    } catch (error: unknown) {
        throw toApiRequestError(error, "Sign up failed");
    }
}
