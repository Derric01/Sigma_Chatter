import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { handleApiError, showSuccess, showWarning } from "../lib/errorHandling.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      // In checkAuth, we don't show toast errors as this happens on initial load
      // and it's expected to fail if the user is not logged in
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      showSuccess("Account created successfully");
      return { success: true };
    } catch (error) {
      const result = handleApiError(error, "signup", {
        statusHandlers: {
          400: (response) => {
            const errorData = response.data;
            const message = errorData?.message || "";
            
            // Determine which field had an error based on the error message
            if (message.toLowerCase().includes('email')) {
              return {
                message: "Email format is invalid. Please check and try again.",
                details: { field: "email" }
              };
            } else if (message.toLowerCase().includes('password')) {
              return {
                message: "Password doesn't meet requirements. It should be at least 6 characters.",
                details: { field: "password" }
              };
            } else if (message.toLowerCase().includes('username')) {
              return {
                message: "Username format is invalid or already taken.",
                details: { field: "username" }
              };
            } else {
              return {
                message: message || "Please check your information and try again."
              };
            }
          },
          409: () => ({
            message: "This email is already registered. Please use a different email or login.",
            details: { field: "email" }
          })
        }
      });
      
      return { 
        success: false, 
        error: result.error, 
        details: result.details 
      };
    } finally {
      set({ isSigningUp: false });
    }
  },  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      showSuccess("Logged in successfully");
      return { success: true };
    } catch (error) {
      const result = handleApiError(error, "login", {
        statusHandlers: {
          400: () => ({
            message: "Invalid email or password format."
          }),
          401: () => ({
            message: "Incorrect email or password. Please try again."
            // Don't specify which field is wrong for security reasons
          }),
          404: () => ({
            message: "Account not found. Please check your email or sign up.",
            details: { field: "email" }
          }),
          429: () => ({
            message: "Too many login attempts. Please try again later."
          })
        }
      });
      
      return { 
        success: false, 
        error: result.error, 
        details: result.details 
      };
    } finally {
      set({ isLoggingIn: false });
    }
  },  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      showSuccess("Logged out successfully");
      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Special handling for logout - we want to log out locally even if server fails
      
      // For 401 errors or network issues, still logout locally
      if (
        (error.response && error.response.status === 401) || 
        !error.response || 
        error.message?.includes('Network Error')
      ) {
        set({ authUser: null });
        showSuccess("Logged out successfully");
        return { success: true };
      }
      
      // For server errors, logout locally but show a warning
      if (error.response && error.response.status >= 500) {
        set({ authUser: null });
        const message = "Server error during logout. You've been logged out locally.";
        showWarning(message);
        return { success: true, warning: message };
      }
      
      // For network issues, logout locally but show a warning
      if (!error.response && error.request) {
        set({ authUser: null });
        const message = "Unable to reach the server. You've been logged out locally.";
        showWarning(message);
        return { success: true, warning: message };
      }
      
      // For other errors, use the standard error handler but don't logout
      const result = handleApiError(error, "logout");
      return { success: false, error: result.error };
    }
  },  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      showSuccess("Profile updated successfully");
      return { success: true };
    } catch (error) {
      const result = handleApiError(error, "updating profile", {
        statusHandlers: {
          400: (response) => {
            const errorData = response.data;
            const message = errorData?.message || "";
            
            // Field-specific error messages
            if (message.toLowerCase().includes('username')) {
              return {
                message: "Username format is invalid. Please use only letters, numbers, and underscores.",
                details: { field: "username" }
              };
            } else if (message.toLowerCase().includes('fullname')) {
              return {
                message: "Full name format is invalid. Please check and try again.",
                details: { field: "fullName" }
              };
            } else if (message.toLowerCase().includes('bio')) {
              return {
                message: "Bio text is too long. Maximum 200 characters allowed.",
                details: { field: "bio" }
              };
            } else if (message.toLowerCase().includes('image')) {
              return {
                message: "Image upload failed. Please try with a smaller image (max 2MB).",
                details: { field: "image" }
              };
            } else {
              return {
                message: message || "Please check your information and try again."
              };
            }
          },
          401: () => ({
            message: "Session expired. Please log in again."
          }),
          409: () => ({
            message: "This username is already taken. Please choose a different one.",
            details: { field: "username" }
          }),
          413: () => ({
            message: "Image file is too large. Please use a smaller image (max 2MB).",
            details: { field: "image" }
          })
        }
      });
      
      return { 
        success: false, 
        error: result.error, 
        details: result.details 
      };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Method to update the list of online users (would be called by socket connection)
  setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
  }
}));