import {api} from "@/lib/api.ts";

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
    } catch (error: any) {
        const msg = error.response?.data?.detail || error.response?.data?.error || "Login failed";
        throw new Error(msg);
    }
}

export async function signUpApi(payload: SignUpPayload): Promise<void> {
    try {
        await api.post("/auth/signup/", payload);
    } catch (error: any) {
        const msg = error.response?.data?.detail || error.response?.data?.error || "Sign up failed";
        throw new Error(msg);
    }
}
