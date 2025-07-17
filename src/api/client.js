import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});

export const apiFetcher = async (url) => {
    const response = await apiClient.get(url);
    return response.data; 
}

export const signupUser = async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response;
};

export const verifyOTP = async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
    return response;
};

export const loginUser = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response;
};

export const imageBaseURL = import.meta.env.VITE_IMAGE_BASE_URL;