/**
 * Connection testing utility for Sigma Chatter
 * 
 * This file provides functions to test connections to the backend API and Socket server
 * in a production environment.
 */

import axios from 'axios';
import { io } from 'socket.io-client';

/**
 * Test connection to the API server
 * @param {string} url - The API server URL to test
 * @returns {Promise<Object>} Test results
 */
export const testApiConnection = async (url) => {
  console.log(`Testing API connection to: ${url}`);
  const startTime = performance.now();
  
  try {
    const response = await axios.get(`${url}/auth/ping`, { 
      timeout: 5000,
      withCredentials: true 
    });
    
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      latency,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || null,
      data: null,
      latency: null,
      error: {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      }
    };
  }
};

/**
 * Test connection to the Socket.IO server
 * @param {string} url - The socket server URL to test
 * @returns {Promise<Object>} Test results
 */
export const testSocketConnection = (url) => {
  return new Promise((resolve) => {
    console.log(`Testing Socket.IO connection to: ${url}`);
    const startTime = performance.now();
    
    // Set a timeout in case the socket hangs
    const timeout = setTimeout(() => {
      if (socket) {
        socket.disconnect();
      }
      resolve({
        success: false,
        connected: false,
        error: { message: "Connection timeout after 5000ms" },
        latency: null
      });
    }, 5000);
    
    // Create socket connection
    const socket = io(url, { 
      withCredentials: true,
      reconnection: false,
      timeout: 5000
    });
    
    // Connection successful
    socket.on('connect', () => {
      clearTimeout(timeout);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      // Wait for a short time to ensure stable connection
      setTimeout(() => {
        const result = {
          success: true,
          connected: socket.connected,
          id: socket.id,
          latency,
          error: null
        };
        
        socket.disconnect();
        resolve(result);
      }, 500);
    });
    
    // Connection error
    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      resolve({
        success: false,
        connected: false,
        error: {
          message: error.message,
          type: error.type,
          description: error.description
        },
        latency: null
      });
    });
  });
};

/**
 * Run a full test suite on multiple endpoints
 * @returns {Promise<Object>} Combined test results
 */
export const runConnectionTests = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    tests: {}
  };
  
  // Only test local development endpoint
  results.tests.localhost = {
    api: await testApiConnection('http://localhost:5001/api'),
    socket: await testSocketConnection('http://localhost:5001')
  };
  
  console.log('Connection test results:', results);
  return results;
};

// Export a function to run a quick test on currently configured endpoints
export const quickTest = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 
    'http://localhost:5001/api';
    
  const socketUrl = import.meta.env.VITE_SOCKET_URL ||
    'http://localhost:5001';
  
  return {
    api: await testApiConnection(apiUrl),
    socket: await testSocketConnection(socketUrl)
  };
};
