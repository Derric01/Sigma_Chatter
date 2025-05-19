// import express from 'express';
// import {connectDb} from "./lib/db.js";
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// // Load environment variables
// dotenv.config();

// // Initialize Express FIRST
// const app = express();

// // THEN add middleware
// app.use(express.json());

// //cookie parser
// app.use(cookieParser());

// //cors
// app.use(cors({
//     origin: "http://localhost:5173", // Replace with your frontend URL
//     credentials: true,
// }));

// // Routes
// app.use("/api/auth", authRoutes);
// // Make sure the route path is correct
// app.use("/api/messages", messageRoutes); // Not "/api/auth" for messages


// // Start server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log("Server is running on the port :" + PORT);
//     connectDb();
// });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {connectDb} from "./lib/db.js";
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Import your routes here
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
// Create HTTP server using Express app
const server = http.createServer(app);

// Add CORS middleware BEFORE other middleware
// Simplified for local development only
const allowedOrigins = [
    "http://localhost:5173",  // Local development with default Vite port
    "http://localhost:5174",  // Local development with alternate Vite port
    "http://localhost:5175",  // Local development with alternate Vite port
    "http://localhost:5176",  // Local development with alternate Vite port
    "http://127.0.0.1:5173",  // Local development with IP address
    "http://127.0.0.1:5174",  // Local development with IP address
    "http://127.0.0.1:5175",  // Local development with IP address
    "http://127.0.0.1:5176"   // Local development with IP address
];

console.log("CORS configured to allow origins:", allowedOrigins);

// More flexible CORS configuration with better error handling
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            // Still allow the request but warn about it
            return callback(null, true);
        }
    },
    credentials: true,  // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Length", "X-Requested-With"]
}));

// Simple health check endpoint
app.get("/", (req, res) => {
    res.send({
        status: "ok",
        message: "Sigma Chatter API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        port: process.env.PORT
    });
});

// Other middleware
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(cookieParser());

// Add cache control middleware for API responses
app.use((req, res, next) => {
    // Dynamic content should not be cached
    if (req.path.startsWith('/api/')) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
    next();
});

// Serve static files from the "uploads" directory with caching for better performance
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '1d', // Cache static files for 1 day
    etag: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Initialize Socket.IO with CORS settings matching Express
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Use the same origins we set for Express
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000 // Increase timeout for better connection stability
});

// Socket.IO event handlers
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Track online users
    // Use global Set to track online users across all socket connections
const onlineUsers = new Set();
    
    // Track connected clients for better debugging
    const totalConnections = io.engine.clientsCount;
    console.log(`Total socket connections: ${totalConnections}`);
    
    socket.on("userOnline", (userId) => {
      if (!userId) {
        console.log("User online event received without user ID");
        return;
      }
      
      console.log("User online:", userId);
      onlineUsers.add(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
      
      // Log current online users for debugging
      console.log(`Online users (${onlineUsers.size}):`, Array.from(onlineUsers));
    });
    
    socket.on("userOffline", (userId) => {
      console.log("User offline:", userId);
      if (userId) {
        onlineUsers.delete(userId);
      }
      io.emit("onlineUsers", Array.from(onlineUsers));
    });    // Handle new messages with improved duplicate detection and error handling
    socket.on("newMessage", (message) => {
        try {
            if (!message) {
                console.error("Received empty message object");
                return;
            }
            
            console.log("New message received:", message._id ? message._id : 'no ID');
            
            // Add server-side processing metadata to avoid duplicates
            message._serverProcessed = Date.now();
            message._serverProcessedId = socket.id + '_' + Date.now();
            
            // Track important fields for debugging
            const messageInfo = {
                id: message._id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                hasText: !!message.text,
                hasImage: !!message.image,
                clientId: message._clientId || 'none'
            };
            console.log("Broadcasting message:", messageInfo);
            
            // Broadcast to all clients except sender (to avoid echo)
            socket.broadcast.emit("newMessage", message);
        } catch (error) {
            console.error("Error handling socket message:", error);
        }
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log("Server is running on the port:", PORT);
    connectDb();
});