import express from "express";
import { signup, login, logout, updateProfile, checkAuth, forgotPassword } from "../controler/auth.control.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Simple ping endpoint for diagnostics and health checking
router.get("/ping", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    message: "Sigma Chatter API is running"
  });
});

// Cloudinary status check endpoint for diagnostics
router.get("/cloudinary-status", (req, res) => {
  const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;
  
  res.status(200).json({
    status: cloudinaryConfigured ? "ok" : "unconfigured",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "not_set",
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    timestamp: new Date().toISOString()
  });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put("/update-profile", protectRoute, updateProfile);


router.get("/check",protectRoute,checkAuth);
export default router;