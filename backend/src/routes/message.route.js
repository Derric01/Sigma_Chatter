import express from "express";
import { getUsersForSidebar, getMessages, sendMessage } from "../controler/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../lib/fileupload.js';

// Create the router object
const router = express.Router();

// Route for getting all users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Route for getting messages with a specific user
router.get("/:id", protectRoute, getMessages);

// Route for sending a message to a specific user
// Use multer middleware to handle file uploads
router.post("/:id", protectRoute, upload.single('image'), sendMessage);

export default router;