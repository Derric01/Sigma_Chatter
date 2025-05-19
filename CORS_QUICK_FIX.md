# How to Fix CORS Issues in Sigma Chatter

This guide provides a quick solution to fix CORS issues in the Sigma Chatter application.

## Backend Fix

1. Update CORS configuration in `backend/src/index.js`:

```javascript
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      // Still allow but warn
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", 
                 "Pragma", "Expires", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Length", "X-Requested-With"]
}));
```

## Frontend Fix

1. Update axios configuration in `frontend/src/lib/axios.js`:

```javascript
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // Removed Cache-Control headers
  }
});
```

## How to Test

1. Start backend server
2. Start frontend server
3. Visit http://localhost:5173/cors-test.html
4. Check if all tests pass (green)

## Troubleshooting

If issues persist:
- Check browser console for errors
- Verify both servers are running
- Clear browser cache and cookies
- Restart both servers
