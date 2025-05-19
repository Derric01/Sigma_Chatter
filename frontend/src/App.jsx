import Navbar from "./Components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingPage from "./Pages/SettingPage";
import ProfilePage from "./Pages/ProfilePage";
import HomePage from "./Pages/HomePage";
import ForgotPassword from "./Pages/ForgotPassword";
// Import optimized connection status with lazy loading
const OptimizedConnectionStatus = lazy(() => import("./Components/OptimizedConnectionStatus"));
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import "./theme-overrides.css"; // Import custom theme overrides
import "./pattern-overlay.css"; // Import pattern overlay for auth pages
import "./animation-fixes.css"; // Import animation performance fixes
import "./enhanced-animation-fixes.css"; // Enhanced animation performance optimizations
import socket from "./lib/socket.js"; // Import socket

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, setOnlineUsers } = useAuthStore();
  // We access the theme store to subscribe to changes but set theme on document directly
  useThemeStore();

  useEffect(() => {
    // Only run checkAuth once when component mounts
    checkAuth();
    
    // Theme is now handled by theme-preload.js before React loads
    // We just need to ensure it's properly synced in case we missed anything
    const syncThemeIfNeeded = () => {
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const storedTheme = localStorage.getItem('theme-storage');
      
      if (storedTheme) {
        try {
          const themeData = JSON.parse(storedTheme);
          if (themeData.state?.theme && themeData.state.theme !== htmlTheme) {
            document.documentElement.setAttribute('data-theme', themeData.state.theme);
          }
        } catch (e) {
          console.error('Error parsing stored theme:', e);
        }
      }
    };
    
    // Sync once and set a one-time timeout to check again after other components have loaded
    syncThemeIfNeeded();
    const timeoutId = setTimeout(syncThemeIfNeeded, 500);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove dependency to prevent infinite loop
  
  // Setup socket connection when auth user changes
  useEffect(() => {
    let isActive = true; // Flag to prevent race conditions
    
    if (authUser) {
      // Connect socket if not already connected
      if (!socket.connected) {
        socket.connect();
      }
      
      // Listen for online users (safe with flag)
      const handleOnlineUsers = (onlineUserIds) => {
        if (isActive) {
          setOnlineUsers(onlineUserIds);
        }
      };
      
      socket.on("onlineUsers", handleOnlineUsers);
      
      // Make the auth store available globally for the socket listeners in useChatStore
      window.authStore = useAuthStore.getState();
      
      // Emit that this user is online
      socket.emit("userOnline", authUser._id);
      
      // Cleanup on unmount or when auth changes
      return () => {
        isActive = false;
        socket.off("onlineUsers", handleOnlineUsers);
        socket.emit("userOffline");
        if (socket.connected) {
          socket.disconnect();
        }
      };
    }
  }, [authUser, setOnlineUsers]);

  console.log('AuthUser:', authUser, 'isCheckingAuth:', isCheckingAuth);
  
  // Only show loader while actually checking auth
  if (isCheckingAuth) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
  
  // Don't set data-theme here since we now set it on the document.documentElement
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      {/* Only show connection status if not disabled in environment */}
      {import.meta.env.VITE_DISABLE_CONNECTION_STATUS !== 'true' && (
        <Suspense fallback={null}>
          <OptimizedConnectionStatus />
        </Suspense>
      )}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/forgot-password"
          element={!authUser ? <ForgotPassword /> : <Navigate to="/" replace />}
        />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;