# 💬 Sigma Chatter - MERN Chat Application

**Sigma Chatter** is a blazing-fast 💥, real-time 🕒 chat application built using the powerful **MERN stack** (MongoDB, Express, React, Node.js). Designed for modern communication — real-time, secure, and responsive.

---

## 🚀 Features

### 💡 Real-time Messaging
- ⚡ Instant delivery with **Socket.IO**
- 📝 Send **text** and 📸 **image** messages
- ✅ **Read receipts** and ✍️ **typing indicators**

### 🔐 User Authentication
- 🔑 Secure **login** and **registration**
- 🔄 Password **recovery**
- 🛡️ JWT-based **authentication**

### 👤 Profile Management
- 📷 Upload/manage **profile pictures**
- 🧑‍🎨 Customize your **user profile**
- 🟢🟠 Online/offline **status indicators**

### ⚙️ Performance Optimizations
- 🚫 No flickering – optimized rendering
- 🎞️ **Hardware-accelerated** smooth animations
- 🧠 State managed efficiently via **Zustand**
- 💤 Lazy loading for non-critical components

### 🎨 UI Features
- 📱 **Responsive design** for all screens
- 🌙🌞 Light/Dark **theme support**
- ✨ Intuitive and modern **interface**
- 🔌 Real-time **connection status** indicators

---

## 🛠️ Setting Up the Project (Local Development)

### ⚡ Quick Setup

Run both frontend and backend in one go:

1. 📦 Install all dependencies:
   ```bash
   npm run install-all
   ```

2. 🛠️ Create a `.env` file in `backend/` with the following:
   ```env
   PORT=5003
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5174
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. ▶️ Start both servers:
   ```bash
   npm run dev
   ```

---

### ⚙️ Manual Setup

#### 🔙 Backend

1. Go to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add `.env` file (see Quick Setup above)

4. Start backend:
   ```bash
   npm run dev
   ```

#### 🖥️ Frontend

1. Go to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend server:
   ```bash
   npm run dev
   ```

---

## 🧩 Troubleshooting

If things go wrong, try this checklist:

1. ✅ Make sure **both** frontend and backend are running
2. 🔎 Backend must run on `http://localhost:5003`
3. 🌐 Frontend must connect to backend properly
4. 🧪 Ensure MongoDB URI and `.env` are correct
5. 🛠️ Use the **Diagnostic UI** (bottom-right corner of the app)
6. 🌐 Test CORS & socket with:
   ```
   http://localhost:5173/cors-diagnostic.html
   ```

7. 🧪 Cloudinary test:
   ```bash
   cd backend
   node src/test-cloudinary.js
   ```

8. 🧰 Check browser dev tools for errors
9. 🔁 Restart servers after environment changes

---

## 🧾 Summary of Core Features

- 💬 Real-time chat with **Socket.IO**
- 🔒 Secure **auth** with JWT
- 📸 Share **images**
- 🧑‍💼 Manage **user profiles**
- 🌐 Fully **responsive UI**
- 🟢 Online/offline **presence status**
