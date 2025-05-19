import { io } from 'socket.io-client';

// Simplified for local development only
const BASE_URL = 'http://localhost:5001';

console.log('Socket configuration initialized with:', BASE_URL);

// Create socket instance but don't connect immediately
// This prevents the socket from attempting to connect before we're ready
const socket = io(BASE_URL, {
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: false // Don't connect automatically - we'll connect when user is authenticated
});

// Add connection event listeners for debugging - these will run when we connect later
socket.on('connect', () => {
  console.log('Socket connected successfully with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

export default socket;
