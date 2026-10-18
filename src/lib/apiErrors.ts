import axios from "axios";

export class ApiRequestError extends Error {
    readonly status?: number;
    readonly details?: unknown;

    constructor(message: string, status?: number, details?: unknown) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.details = details;
    }
}

function getBackendMessage(data: unknown): string | undefined {
    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (!data || typeof data !== "object") {
        return undefined;
    }

    const payload = data as Record<string, unknown>;
    for (const key of ["detail", "error", "message"]) {
        const value = payload[key];
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }

    return undefined;
}

export function toApiRequestError(
    error: unknown,
    fallbackMessage: string
): ApiRequestError {
    if (error instanceof ApiRequestError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        return new ApiRequestError(
            getBackendMessage(error.response?.data) ??
            error.message ??
            fallbackMessage,
            error.response?.status,
            error.response?.data
        );
    }

    if (error instanceof Error) {
        return new ApiRequestError(error.message, undefined, error);
    }

    return new ApiRequestError(fallbackMessage);
}
