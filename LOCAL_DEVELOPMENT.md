# Sigma Chatter - Local Development Setup

This document explains the changes made to focus the application on local development only.

## Changes Made

### 1. Simplified Backend Configuration
- Removed deployment-specific CORS configurations
- Simplified to allow only localhost origins on various ports (5173-5176)
- Added a health check endpoint at the root URL
- Using port 5001 for backend
- Added cache control headers for better performance

### 2. Simplified Frontend Configuration
- Removed deployment-specific URLs and fallbacks
- Set fixed API URL to `http://localhost:5001/api` 
- Set fixed Socket URL to `http://localhost:5001`
- Removed production environment checks
- Disabled React StrictMode to prevent double rendering
- Added performance optimizations to prevent flickering

### 3. Performance Optimizations
- Created optimized ConnectionStatus component
- Added hardware acceleration for animations
- Improved socket connection management
- Implemented lazy loading for non-critical components
- Added browser performance hints and optimizations
- Fixed infinite reloading issues in the UI

### 4. Removed Deployment Files
- Removed vercel.json configuration
- Removed Netlify configuration files (_redirects, _headers)
- Removed deployment-related scripts
- Cleaned up unused documentation

### 4. Added Development Tools
- Created CORS diagnostic tool for testing connectivity
- Added convenient npm scripts for running both servers at once
- Created a health check endpoint for easy API testing
- Updated README with local development focus

### 5. Additional Improvements
- Added concurrently for running both services simultaneously
- Added helpful startup batch file
- Fixed port conflicts
- Added better error handling for socket connections

## Current Configuration

- **Backend:** Running on port 5001
- **Frontend:** Running on port 5173 (Vite default port)
- **MongoDB:** Using the MongoDB Atlas connection string from the .env file
- **Cloudinary:** Using Cloudinary for image uploads (configure in .env)

## How to Test

1. Use the CORS diagnostic tool at http://localhost:5173/cors-diagnostic.html
2. Check the health endpoint directly at http://localhost:5001
3. Use the built-in diagnostic UI via the button in the lower right corner
4. Monitor the browser console for connection status

## Performance Optimizations

For details about all performance optimizations implemented to fix reloading and flickering issues, please refer to these documents:

1. **PERFORMANCE_FIXES.md** - Specific changes to fix rendering issues
2. **OPTIMIZATION_SUMMARY.md** - Comprehensive overview of all optimizations

### Running the Application with Performance Fixes

1. **Terminal 1: Start Backend**
   ```powershell
   cd backend
   npm start
   ```

2. **Terminal 2: Start Frontend**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Testing the Performance**
   - Open http://localhost:5173 in your browser
   - Login with your credentials
   - Navigate between pages
   - Verify there's no flickering or constant reloading
   - Monitor network tab for proper API connections
