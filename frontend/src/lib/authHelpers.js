/**
 * Authentication helper functions for Sigma Chatter
 */

import { axiosInstance } from './axios';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Checks token validity and authentication status
 * @returns {Promise<boolean>} True if authenticated with valid token
 */
export const validateSession = async () => {
  try {
    const response = await axiosInstance.get('/auth/check');
    return response.status === 200;
  } catch (error) {
    console.error('Authentication validation error:', error);
    return false;
  }
};

/**
 * Refreshes auth session if there are auth related issues
 * @returns {Promise<boolean>} True if session was successfully refreshed
 */
export const refreshSession = async () => {
  try {
    // Try to perform a token refresh
    const response = await axiosInstance.post('/auth/refresh-token');
    if (response.status === 200) {
      // Update auth store with refreshed user data
      const authStore = useAuthStore.getState();
      if (authStore && authStore.setAuthUser && response.data) {
        authStore.setAuthUser(response.data);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Session refresh error:', error);
    return false;
  }
};

/**
 * Add authorization headers to requests
 * @param {Object} config - Axios request config
 * @returns {Object} Updated config with authorization headers
 */
export const addAuthHeader = (config) => {
  const authStore = useAuthStore.getState();
  const user = authStore?.authUser;
  
  if (user?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  
  return config;
};

/**
 * Interceptor to handle 401 responses by refreshing session
 * @param {Object} error - Axios error object
 * @returns {Promise} Promise that resolves to the original request or rejects
 */
export const handleAuthError = async (error) => {
  const originalRequest = error.config;
  
  // Only attempt refresh once to avoid infinite loops
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    // Try to refresh the session
    const refreshed = await refreshSession();
    if (refreshed) {
      return axiosInstance(originalRequest);
    }
    
    // If refresh failed, logout
    const authStore = useAuthStore.getState();
    if (authStore && authStore.logout) {
      await authStore.logout();
    }
  }
  
  return Promise.reject(error);
};
