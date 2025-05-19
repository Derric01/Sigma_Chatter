import toast from 'react-hot-toast';

/**
 * Handles Axios errors with detailed error handling and logging
 * @param {Error} error - The error object from axios
 * @param {string} context - Context where the error occurred (e.g., 'login', 'sending message')
 * @param {Object} options - Additional options
 * @param {boolean} options.showToast - Whether to show a toast notification
 * @param {Object} options.statusHandlers - Custom handlers for specific status codes
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, context, options = {}) => {
  const { showToast = true, statusHandlers = {} } = options;
  
  console.error(`Error ${context}:`, error);
  
  let errorMessage = "Something went wrong. Please try again.";
  let errorDetails = {};
  let statusCode = null;
  
  if (error.response) {
    // The server responded with a status code outside of 2xx range
    statusCode = error.response.status;
    const errorData = error.response.data;
    
    console.error(`Server error ${statusCode} during ${context}:`, errorData);
    
    // Check if there's a custom handler for this status code
    if (statusHandlers[statusCode]) {
      const handlerResult = statusHandlers[statusCode](error.response);
      errorMessage = handlerResult.message;
      errorDetails = handlerResult.details || {};
    } else {
      // Default handling based on status code
      if (statusCode === 400) {
        errorMessage = errorData?.message || "Invalid request. Please check your input.";
      } else if (statusCode === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (statusCode === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (statusCode === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (statusCode === 409) {
        errorMessage = errorData?.message || "A conflict occurred with your request.";
      } else if (statusCode === 413) {
        errorMessage = "The file you're uploading is too large.";
      } else if (statusCode === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (statusCode >= 500) {
        errorMessage = "Server error. Our team has been notified.";
      } else {
        errorMessage = errorData?.message || `Server error: ${statusCode}`;
      }
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error(`Network error during ${context}: No response received`);
    errorMessage = "Unable to reach the server. Please check your internet connection.";
  } else if (error.message && error.message.includes('Network Error')) {
    console.error(`Network connection error during ${context}:`, error);
    errorMessage = "Network error. Please check your internet connection and try again.";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(`Request setup error during ${context}:`, error.message);
    errorMessage = `Error during ${context}. Please try again later.`;
  }
  
  if (showToast) {
    toast.error(errorMessage);
  }
  
  return {
    success: false,
    error: errorMessage,
    details: errorDetails,
    statusCode
  };
};

/**
 * Helper function for extracting field-specific errors from API responses
 * @param {Object} errorData - The error data from the API response
 * @param {Array} fieldMapping - Mapping of error messages to fields
 * @returns {Object} Field and error message
 */
export const extractFieldError = (errorData, fieldMapping) => {
  const message = errorData?.message || "";
  
  for (const { field, keywords } of fieldMapping) {
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        return { field, message };
      }
    }
  }
  
  return { field: null, message };
};

/**
 * Shows a success toast message
 * @param {string} message - The success message
 * @returns {string} The toast ID
 */
export const showSuccess = (message) => {
  return toast.success(message);
};

/**
 * Shows a warning toast message
 * @param {string} message - The warning message
 * @returns {string} The toast ID
 */
export const showWarning = (message) => {
  return toast.warning ? toast.warning(message) : toast(message, { icon: '⚠️' });
};

/**
 * Check if a network failure is happening
 * @param {Error} error - The error object
 * @returns {boolean} True if network is down
 */
export const isNetworkFailure = (error) => {
  return !error.response && !!error.request || 
         (error.message && error.message.includes('Network Error'));
};
