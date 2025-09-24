import axios, {AxiosInstance, AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://x-clone-rn-gamma.vercel.app/" // replace with your actual API base URL

export const TIMEOUT_ERROR_MESSAGE = "Request timed out. Please check your network connection and try again.";

// create an axios instance with custom request interceptor to make sure the token is added to the request headers, ensuring authenticated requests are made
export const createApiClient = (getToken:() => Promise<string | null>, timeout: number = 15000): AxiosInstance => {
    const api = axios.create ({baseURL:API_BASE_URL, timeout});

    api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

    api.interceptors.response.use(
        response => response,
        error => {
            if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
                // Preserve AxiosError metadata by mutating the original error
                error.message = TIMEOUT_ERROR_MESSAGE;
                return Promise.reject(error);
            }
            return Promise.reject(error);
        }
    );

    return api;
};

// Use this hook to get the axios instance from the createApiClient function, ensuring the token is added to the request headers, ensuring authenticated requests are made
export const useApiClient = ():AxiosInstance => { 
    const {getToken} = useAuth();
    return createApiClient(getToken);
};

// Use this to make API calls to the user API

export const userApi = {
    syncUser: (api: AxiosInstance) => api.post("/api/users/sync"),
    getCurrentUser: (api: AxiosInstance) => api.get("/api/users/me"),
    updateProfile: (api: AxiosInstance, data: any) => api.put("/api/users/profile", data),
}