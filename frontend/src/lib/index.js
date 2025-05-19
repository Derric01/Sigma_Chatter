// Export all utilities from the lib directory

// API and networking
export { axiosInstance } from './axios.js';
export { default as socket } from './socket.js';

// Error handling
export { 
  handleApiError, 
  extractFieldError,
  showSuccess,
  showWarning,
  isNetworkFailure 
} from './errorHandling.js';

// General utilities
export * from './utils.js';
