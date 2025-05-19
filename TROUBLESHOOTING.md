# Sigma Chatter Troubleshooting Guide

This document provides detailed troubleshooting steps for common issues encountered with Sigma Chatter.

## Connection Issues

### API Connection Failures

If you're seeing "ERR_CONNECTION_REFUSED" or other API connection errors:

1. **Check Environment Variables**
   - Verify that `VITE_API_URL` is correctly set in the frontend environment
   - For local development, ensure the backend server is running on the expected port

2. **CORS Issues**
   - Check that the backend has CORS properly configured to allow requests from the frontend domain
   - In development, ensure the backend allows requests from `localhost` on the frontend port

3. **API URL Format**
   - Ensure the API URL ends with `/api` (e.g., `https://sigmachatter-server.onrender.com/api`)
   - Check for any typos in the domain or protocol

4. **Firewall or Network Issues**
   - Check if a firewall is blocking connections to the backend server
   - Try accessing the API directly in a browser to test connectivity

### Socket Connection Failures

If real-time messaging or online status isn't working:

1. **Socket URL Configuration**
   - Verify `VITE_SOCKET_URL` is correctly set in the frontend environment
   - The socket URL should NOT include '/api' (e.g., `https://sigmachatter-server.onrender.com`)

2. **WebSocket Support**
   - Some proxies or hosting environments may block WebSocket connections
   - Check if your hosting provider supports WebSocket connections

3. **Socket Server Running**
   - Verify the Socket.IO server is correctly initialized in the backend
   - Check server logs for any socket-related errors

## Deployment Issues

### 404 Errors on Page Refresh

If you're getting 404 errors when refreshing pages or accessing routes directly:

1. **Vercel Deployment**
   - Ensure `vercel.json` exists with the following content:
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```

2. **Netlify Deployment**
   - Ensure `_redirects` file exists in the `public` directory with:
     ```
     /* /index.html 200
     ```

3. **Other Hosting**
   - Configure your hosting provider to redirect all requests to index.html for SPA support

### Authentication Issues

If login, signup, or session persistence isn't working:

1. **Cookie Settings**
   - Ensure cookies are being properly set with correct domain and path
   - For production, verify secure and sameSite cookie configurations

2. **JWT Secret**
   - Check that the `JWT_SECRET` environment variable is properly set on the backend
   - Ensure the secret hasn't changed between server restarts

3. **Session Expiry**
   - Check for an expiring JWT token or session
   - Verify client-side storage of authentication tokens

## Diagnostic Tools

Sigma Chatter includes several built-in diagnostic tools to help troubleshoot issues:

### In-App Diagnostics

1. **Connection Status Indicator**
   - Click the info button in the bottom-right corner to see connection status
   - Run diagnostics to check API, Socket, and Cloudinary connectivity

2. **Connection Testing**
   - Click "Test Connection" in the status panel to run detailed connectivity tests
   - Results will show exact error messages and connection latency

### Diagnostic Page

Access the dedicated diagnostic page at `/check.html` on your deployed frontend to:

1. **Test API Connection**
   - Verifies connectivity to the backend API server
   - Tests authentication endpoints

2. **Test Socket Connection**
   - Checks WebSocket connectivity to the real-time server
   - Reports connection latency and socket ID

3. **Test Routes**
   - Verifies that critical application routes are accessible
   - Checks for SPA routing configuration issues

4. **Generate Full Report**
   - Creates a comprehensive diagnostic report with system details
   - Useful for sharing when seeking support

### Backend Diagnostics

From the backend directory, run:

```
node src/test-diagnostics.js
```

This script will:
1. Verify environment variables
2. Test MongoDB connection
3. Check Cloudinary configuration
4. Validate JWT secret
5. Test file system permissions

## Environment Variables

### Required Frontend Variables

```
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_APP_VERSION=1.0.0
```

### Required Backend Variables

```
PORT=5001
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://your-frontend-url.com
```

## Still Having Issues?

If the above troubleshooting steps don't resolve your issue:

1. Check the application logs in both frontend and backend
2. Generate a diagnostic report using the `/check.html` page
3. Verify all network requests in the browser's developer tools
4. Ensure your hosting provider supports all required features (WebSockets, etc.)
