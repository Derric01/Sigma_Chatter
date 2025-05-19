import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");
        
        // Normalize profile picture field names for frontend consistency
        const normalizedUsers = filteredUsers.map(user => {
            const userObj = user.toObject();
            // Add profilePic field (with capital P) that frontend expects
            if (userObj.profilepic !== undefined) {
                userObj.profilePic = userObj.profilepic;
            }
            return userObj;
        });
        
        res.status(200).json(normalizedUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages", error);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        console.log("sendMessage called with body:", req.body.text ? "text message" : "no text");
        console.log("File received:", req.file ? `File present (${req.file.size} bytes)` : "no file");
        
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        
        // Simplify - don't need clientMessageId handling on server for now
        // Focus on fixing the core message sending functionality        let imageUrl = "";
        // Check if a file was uploaded using multer
        try {
            if (req.file) {
                console.log("Processing uploaded file:", req.file.path);
                // Make sure the file exists before trying to upload it
                if (!fs.existsSync(req.file.path)) {
                    console.error("File does not exist at path:", req.file.path);
                    return res.status(400).json({
                        success: false,
                        message: "File upload failed - temporary file not found"
                    });
                }
                
                // Upload the file from disk to Cloudinary with enhanced error handling
                try {
                    // Use our enhanced uploader with better error handling
                    const uploadResponse = await cloudinary.enhancedUpload(req.file.path, {
                        resource_type: 'auto',
                        timeout: 60000,
                        folder: 'chat_app_messages'
                    });
                    
                    console.log("Cloudinary upload success, URL:", uploadResponse.secure_url);
                    imageUrl = uploadResponse.secure_url;
                    
                    // Clean up the local file after successful upload
                    try {
                        fs.unlinkSync(req.file.path);
                        console.log("Removed temporary file:", req.file.path);
                    } catch (cleanupError) {
                        console.log("Failed to clean up file, but upload was successful:", cleanupError.message);
                        // Non-critical error, continue with the message
                    }                } catch (cloudinaryError) {
                    console.error("Cloudinary upload failed:", cloudinaryError);
                    
                    // Return a more specific error message to the client
                    if (cloudinaryError.http_code === 413) {
                        return res.status(413).json({
                            success: false,
                            message: "Image file is too large. Please use a smaller image (max 5MB)."
                        });
                    } else if (cloudinaryError.http_code === 401 || cloudinaryError.http_code === 403) {
                        console.error("Cloudinary authentication error. Check your API credentials.");
                        return res.status(500).json({
                            success: false,
                            message: "Image upload service unavailable. Please try again later."
                        });
                    } else {
                        // Continue without the image if Cloudinary upload fails for other reasons
                        console.error("Error details:", cloudinaryError.message);
                    }
                }
            } else if (req.body.image) {
                // Handle base64 image data (fallback)
                console.log("Received base64 image data (length: " + req.body.image.length + ")");
                
                try {
                    // Only process if it seems like valid base64 data
                    if (req.body.image && req.body.image.startsWith('data:image')) {
                        // Use enhanced upload for base64 data too
                        const uploadResponse = await cloudinary.enhancedUpload(req.body.image, {
                            timeout: 60000,
                            folder: 'chat_app_messages'
                        });
                        imageUrl = uploadResponse.secure_url;
                        console.log("Base64 image upload success");
                    } else {
                        console.log("Invalid base64 image data received, skipping");
                        return res.status(400).json({
                            success: false,
                            message: "Invalid image data format"
                        });
                    }
                } catch (base64Error) {
                    console.error("Base64 image upload failed:", base64Error.message);
                    // Continue without the image
                }
            }        } catch (imageProcessingError) {
            console.error("Error during image processing:", imageProcessingError);
            // Return an error response instead of continuing silently
            return res.status(500).json({
                success: false,
                message: "Failed to process image. Please try again with a different image.",
                error: imageProcessingError.message
            });
        }
          
        // Check if we have enough information to create a message
        if (!text && !imageUrl) {
            console.log("Attempted to send an empty message");
            return res.status(400).json({
                success: false,
                message: "Message must contain either text or an image"
            });
        }        // Extract clientMessageId for duplicate checking
        const { clientMessageId } = req.body;
        
        // Check if a message with this clientMessageId already exists
        if (clientMessageId) {
            const existingMessage = await Message.findOne({ clientMessageId });
            if (existingMessage) {
                console.log("Duplicate message detected with clientMessageId:", clientMessageId);
                return res.status(200).json({
                    success: true,
                    newMessage: existingMessage,
                    message: "Message already sent",
                    isDuplicate: true
                });
            }
        }
        
        // Create a new message with the clientMessageId if provided
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || "", // Ensure text is at least an empty string if undefined
            image: imageUrl,
            ...(clientMessageId && { clientMessageId }) // Only add if defined
        });

        // Try saving with better error handling
        try {
            await newMessage.save();
            console.log("Message saved successfully with ID:", newMessage._id);
            
            // Send response back to client with success indicator
            res.status(201).json({
                success: true,
                newMessage,
                message: "Message sent successfully"
            });
        } catch (saveError) {
            console.error("Failed to save message to database:", saveError);
            return res.status(500).json({
                success: false,
                message: "Failed to save message to database",
                error: saveError.message
            });
        }
    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({
            message: "Error sending message: " + error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, username, bio } = req.body;
        let { profilePic } = req.body;

        console.log("Update profile request received:", { 
            userId,
            fullName: fullName ? "provided" : "not provided",
            username: username ? "provided" : "not provided",
            bio: bio ? "provided" : "not provided",
            profilePic: profilePic ? "provided" : "not provided"
        });

        // Less strict validation - allow updates even if just one field is provided
        // And profilePic might be empty string or null which is valid for removing a profile pic
        if (!fullName && !username && bio === undefined && profilePic === undefined) {
            console.log("Validation failed - nothing to update");
            return res.status(400).json({ message: "No valid fields to update" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User not found with ID: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }

        // If username is being updated, check if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                console.log(`Username ${username} is already taken`);
                return res.status(400).json({ message: "Username is already taken" });
            }
        }        // Handle profile picture upload if provided and it's a valid data URL
        let profilePicUrl = user.profilepic; // Changed from profilePic to profilepic to match database field
        if (profilePic !== undefined) {
            if (profilePic && profilePic.startsWith('data:image')) {
                try {
                    console.log("Uploading new profile picture to Cloudinary");
                    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                        folder: "chat_app_profile_pics",
                    });
                    profilePicUrl = uploadResponse.secure_url;
                    console.log("Profile picture uploaded successfully");
                } catch (error) {
                    console.error("Error uploading profile picture:", error);
                    return res.status(400).json({ 
                        message: "Error uploading profile picture",
                        details: error.message
                    });
                }
            } else if (profilePic === null || profilePic === "") {
                // Allow removing the profile pic
                profilePicUrl = "";
                console.log("Removing profile picture");
            }
        }

        // Prepare update object with only defined fields
        const updateFields = {};        if (fullName !== undefined) updateFields.fullName = fullName;
        if (username !== undefined) updateFields.username = username;
        if (bio !== undefined) updateFields.bio = bio;
        if (profilePic !== undefined) updateFields.profilepic = profilePicUrl; // Changed from profilePic to profilepic to match database field

        console.log("Updating user with fields:", Object.keys(updateFields));

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        ).select("-password -__v");

        console.log("User updated successfully");        // Map the database profilepic field to the profilePic field expected by the frontend
        const userResponse = updatedUser.toObject();
        userResponse.profilePic = userResponse.profilepic;
        
        res.status(200).json({
            message: "Profile updated successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};