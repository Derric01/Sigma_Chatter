import axios from 'axios';

// Simplified for local development only
const API_URL = 'http://localhost:5001/api';

// Log the API URL for debugging purposes (only once)
console.log(`API configured with: ${API_URL} (local development mode)`);

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Removed Cache-Control headers as they're causing CORS issues
    }
});

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        // Handle 401 errors by redirecting to login
        if (error.response && error.response.status === 401) {
            console.log('Authentication error detected. Redirecting to login...');
            
            // Get the global auth store
            const authStore = window.authStore;
            
            // If we can access the auth store, log the user out
            if (authStore && typeof authStore.logout === 'function') {
                await authStore.logout();
            } else {
                // Fallback: redirect to login manually
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);