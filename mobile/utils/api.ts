import axios, {AxiosInstance } from "axios"; 
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = "https://x-clone-rn-gamma.vercel.app/" // replace with your actual API base URL

// create an axios instance with custom request interceptor to make sure the token is added to the request headers, ensuring authenticated requests are made
export const createApiClient = (getToken:() => Promise<string | null>): AxiosInstance => { 
    const api = axios.create ({baseURL:API_BASE_URL});

    api.interceptors.request.use(async (config) => {
    const token = await getToken();
    console.log("Auth token:", token); // Add this line for debugging
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
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