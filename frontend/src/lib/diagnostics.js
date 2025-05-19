/**
 * Diagnostics utility for Sigma Chatter
 * 
 * This file provides functions to detect and troubleshoot common issues with the application
 */

import { axiosInstance } from './axios';

/**
 * Runs a basic connectivity diagnostic
 * @returns {Object} Results of the tests
 */
export const runConnectionDiagnostics = async () => {
  const results = {
    serverConnection: { status: 'unknown', details: null },
    socketConnection: { status: 'unknown', details: null },
    cloudinaryConnection: { status: 'unknown', details: null },
    authStatus: { status: 'unknown', details: null }
  };
    // Test server connection
  try {
    const response = await axiosInstance.get('/auth/ping');
    if (response.status === 200) {
      results.serverConnection.status = 'success';
      results.serverConnection.details = response.data;
    } else {
      results.serverConnection.status = 'error';
      results.serverConnection.details = `Unexpected status: ${response.status}`;
    }
  } catch (error) {
    results.serverConnection.status = 'error';
    results.serverConnection.details = {
      message: error.message,
      code: error.code || 'unknown',
      baseURL: axiosInstance.defaults.baseURL
    };
  }
  
  // Check authentication status
  try {
    const authUser = window.authStore?.authUser;
    if (authUser && authUser._id) {
      results.authStatus.status = 'success';
      results.authStatus.details = {
        userId: authUser._id,
        hasProfilePic: !!authUser.profilePic || !!authUser.profilepic
      };
    } else {
      results.authStatus.status = 'error';
      results.authStatus.details = 'Not authenticated';
    }
  } catch (error) {
    results.authStatus.status = 'error';
    results.authStatus.details = error.message;
  }
    // Socket connection
  try {
    const socket = (await import('./socket')).default;
    results.socketConnection.status = socket.connected ? 'success' : 'error';
    results.socketConnection.details = {
      connected: socket.connected,
      id: socket.id || null,
      url: socket.io.uri
    };
  } catch (error) {
    results.socketConnection.status = 'error';
    results.socketConnection.details = error.message;
  }
  
  // Check Cloudinary connection (via a test upload capability check)
  try {
    const response = await axiosInstance.get('/auth/cloudinary-status');
    if (response.status === 200 && response.data.status === 'ok') {
      results.cloudinaryConnection.status = 'success';
      results.cloudinaryConnection.details = response.data;
    } else {
      results.cloudinaryConnection.status = 'warning';
      results.cloudinaryConnection.details = 'Cloudinary may not be properly configured';
    }
  } catch {
    // This is okay to fail - just means the endpoint doesn't exist yet
    results.cloudinaryConnection.status = 'unknown';
    results.cloudinaryConnection.details = 'Not supported by this server';
  }
  
  return results;
};

/**
 * Check for permissions and API access
 */
export const checkPermissions = async () => {
  return {
    camera: await checkCameraPermission(),
    notifications: await checkNotificationPermission()
  };
};

/**
 * Check camera permission
 */
const checkCameraPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state;
  } catch (error) {
    return 'unsupported';
  }
};

/**
 * Check notification permission
 */
const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  
  return Notification.permission;
};

/**
 * Log useful debugging information to console
 */
export const logDiagnosticInfo = () => {
  console.group('Sigma Chatter Diagnostic Info');
  console.log('User Agent:', navigator.userAgent);
  console.log('App Version:', import.meta.env.VITE_APP_VERSION || 'dev');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Build Date:', new Date().toISOString());
  console.log('Window Size:', `${window.innerWidth}x${window.innerHeight}`);
  console.log('Connection Type:', navigator.connection ? navigator.connection.effectiveType : 'unknown');
  console.groupEnd();
};

/**
 * Export diagnostic data for use in UI components
 * @returns {Promise<Object>} Combined diagnostic data
 */
export const getDiagnosticData = async () => {
  const connectionData = await runConnectionDiagnostics();
  const permissionsData = await checkPermissions();
  
  return {
    connections: connectionData,
    permissions: permissionsData,
    environment: {
      mode: import.meta.env.MODE,
      production: import.meta.env.PROD,
      apiUrl: axiosInstance.defaults.baseURL,
      version: import.meta.env.VITE_APP_VERSION || 'dev',
      buildDate: new Date().toISOString()
    }
  };
};

// Run diagnostics on load in development
if (import.meta.env.DEV) {
  console.log('Running Sigma Chatter diagnostics in development mode');
  runConnectionDiagnostics().then(results => {
    console.log('Diagnostic results:', results);
  });
  logDiagnosticInfo();
}