# CORS Configuration Fixes for Sigma Chatter

This document explains the CORS configuration fixes that were implemented to resolve issues with the Sigma Chatter application.

## The Problem

The application was experiencing the following CORS-related errors:

```
Access to XMLHttpRequest at 'http://localhost:5001/api/auth/check' from origin 'http://localhost:5173' has been blocked by CORS policy: Request header field cache-control is not allowed by Access-Control-Allow-Headers in preflight response.
```

This error occurred because:

1. The frontend was setting custom headers (`Cache-Control`, `Pragma`) in its axios requests
2. The backend CORS configuration wasn't configured to allow these headers
3. This resulted in failed preflight requests, preventing API communication
4. Performance optimizations inadvertently caused these CORS issues

## The Solution

### Backend CORS Configuration Update (Latest)

We updated the CORS configuration in `backend/src/index.js` to allow the necessary headers:

```javascript
app.use(cors({
    origin: allowedOrigins,
    credentials: true,  // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Length", "X-Requested-With"]
}));
```

The key changes were:
- Adding `"Cache-Control"`, `"Pragma"`, and `"Expires"` to the `allowedHeaders` array
- Adding `"X-Requested-With"` and `"Accept"` headers which are common in AJAX requests
- Adding `exposedHeaders` to allow the browser to access certain headers in the response

### Frontend Axios Configuration Update

We updated the frontend axios configuration in `frontend/src/lib/axios.js` to use only essential headers:

```javascript
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
```

By using only essential headers, we simplified the CORS requirements while maintaining functionality.

## Diagnostic Tools

We created new diagnostic tools to help debug CORS issues:

1. **CORS Diagnostic HTML**: A standalone page at `/cors-diagnostic.html` that tests various endpoints with different header configurations and provides recommendations

2. **Enhanced CORS Test Tool**: A new page at `/cors-test.html` with improved UI that runs four specific tests:
   - Basic health check to test API connectivity
   - Authentication endpoint test
   - Custom headers test
   - Credentials test 

3. **CORS Diagnostics JS**: A utility module at `src/lib/corsDiagnostics.js` that can be imported to run CORS tests programmatically

## Testing the Fix

You can verify that the CORS issues are resolved by:

1. Starting both the backend and frontend servers:
   ```bash
   # In one terminal
   cd backend
   npm start
   
   # In another terminal
   cd frontend
   npm run dev
   ```

2. Visiting http://localhost:5173/cors-test.html (the new enhanced test tool)

3. Running each test to ensure all endpoints return successful responses:
   - The health check should show "API is running" in green
   - The auth check should complete without CORS errors
   - The custom headers test should pass
   - The credentials test should pass

4. Opening the application at http://localhost:5173 and confirming:
   - Login works correctly
   - No CORS errors appear in the browser console
   - API requests complete successfully

## Best Practices for CORS Configuration

1. **Only allow necessary origins** - For production, limit to your specific domains
2. **Only allow required headers** - Don't blindly allow all headers
3. **Use credentials carefully** - Only enable if you need cookies/auth
4. **Set appropriate cache headers** - Different for static vs dynamic content
5. **Test thoroughly** - Use the diagnostic tools to verify configuration

## Further Resources

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Troubleshooting CORS Issues](https://httptoolkit.tech/blog/cors-debugging/)
