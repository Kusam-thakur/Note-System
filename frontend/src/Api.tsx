
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token")
console.log(token);

const api = axios.create({
    baseURL: `${BASE_URL}`,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Example: Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

export default api;