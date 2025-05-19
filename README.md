# Sigma Chatter - MERN Chat Application

Sigma Chatter is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js). This version has been simplified for local development.

## Features

1. **Real-time Messaging**
   - Instant message delivery using Socket.IO
   - Support for text and image messages
   - Message read receipts and typing indicators

2. **User Authentication**
   - Secure login and registration
   - Password recovery
   - JWT-based authentication

3. **Profile Management**
   - Profile picture upload and management
   - User profile customization
   - Online/offline status indicators

4. **Performance Optimizations**
   - Optimized rendering to prevent flickering and reloads
   - Hardware acceleration for smooth animations
   - Efficient state management with Zustand
   - Lazy loading for non-critical components

5. **UI Features**
   - Responsive design for all device sizes
   - Dark/light theme support
   - Modern and intuitive interface
   - Real-time connection status indicators

## Setting Up the Project (Local Development)

### Quick Setup

The easiest way to run both frontend and backend simultaneously:

1. First, install dependencies for both projects:
   ```
   npm run install-all
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5003
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5174
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Start both servers at once:
   ```
   npm run dev
   ```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with required environment variables (see above)

4. Start the server:
   ```
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Troubleshooting

If you encounter any issues:

1. Make sure both frontend and backend are running
2. Check that backend is running on port 5003
3. Verify that frontend can access backend on http://localhost:5003
4. Ensure MongoDB connection string is valid in backend .env file
5. Use the Diagnostic UI (button in lower right corner) to check connections
6. Try the CORS diagnostic tool at http://localhost:5173/cors-diagnostic.html to test API and socket connectivity

2. Check for errors in the browser console

3. Verify that all environment variables are properly set

4. Ensure MongoDB and Cloudinary credentials are correct

5. Check the Cloudinary connection with:
   ```
   cd backend
   node src/test-cloudinary.js
   ```

## Features

- Real-time messaging with Socket.IO
- User authentication
- Profile management
- Image sharing
- Responsive design
- Online/offline user status
