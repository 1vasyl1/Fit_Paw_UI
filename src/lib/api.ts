import axios, {type AxiosError, type InternalAxiosRequestConfig,} from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type FailedRequest = {
    resolve: (token: string) => void;
    reject: (reason?: unknown) => void;
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

const setAuthorizationHeader = (
    request: RetriableRequestConfig,
    token: string
) => {
    request.headers.set("Authorization", `Bearer ${token}`);
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | RetriableRequestConfig
            | undefined;
        const hasAccessToken = Boolean(localStorage.getItem("token"));

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            !hasAccessToken
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({resolve, reject});
            }).then((token) => {
                setAuthorizationHeader(originalRequest, token);
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshResponse = await axios.post<{ access: string }>(
                `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
                {},
                {withCredentials: true}
            );
            const newAccessToken = refreshResponse.data.access;

            if (!newAccessToken) {
                throw new Error("Token refresh did not return an access token.");
            }

            localStorage.setItem("token", newAccessToken);
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            setAuthorizationHeader(originalRequest, newAccessToken);

            return api(originalRequest);
        } catch (refreshError: unknown) {
            processQueue(refreshError);
            localStorage.removeItem("token");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
