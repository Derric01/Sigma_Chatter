import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary  from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({
                "message":"Please fill all the fields"
            });
        }
        if(password.length < 6) {
            return res.status(400).json({
                "message": "Password should be at least 6 characters"
            });
        }
        
        const user = await User.findOne({email});

        if(user) return res.status(400).json({
            "message": "User already exists"
        });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        
        if(newUser) {
            await newUser.save();
            generateToken(newUser._id, res);            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilepic
            });
        } else {
            res.status(400).json({
                "message": "User not created"
            });
        }
    } catch(error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                "message": "User not found"
            });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({
                "message": "Invalid credentials"
            });
        }
        
        // Generate token
        generateToken(user._id, res);
          res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilepic  // Use profilePic (uppercase P) for frontend consistency
        });
    } catch(error) {
        console.log("Error in the login controller", error.message);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};

export const logout = (req,res) => {
   try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({
        "message":"User Logged out successfully"
    })
   }catch(error){
     console.log("The error in the logout controller",error.message);
     res.status(500).json({
        "message":"Internal server error"
     })
   }
};


export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({
                "message": "Please provide a profile picture"
            });
        }
          console.log("Uploading profile picture to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        console.log("Cloudinary upload successful, URL:", uploadResponse.secure_url);
        
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilepic: uploadResponse.secure_url
        }, {new: true});
        
        console.log("User updated with new profile pic:", updatedUser.profilepic);
        
        res.status(200).json({            message: "Profile picture updated successfully",
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilepic  // Map the DB field to the expected frontend field name
            }
        });
        } catch (error) {
        console.log("Error in the update profile controller", error.message);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};


export const checkAuth = (req,res)=>{
    try{
        // Convert to plain object and add profilePic property that frontend expects
        const userObj = req.user.toObject ? req.user.toObject() : {...req.user};
        
        // Make sure the frontend gets profilePic (uppercase P) which it expects
        if (userObj.profilepic !== undefined) {
            userObj.profilePic = userObj.profilepic;
            // Log for debugging
            console.log(`User ${userObj._id} has profile pic: ${userObj.profilepic}`);
        } else {
            console.log(`User ${userObj._id} has no profile picture`);
        }
        
        // Include token in response for frontend to use
        const token = req.cookies.jwt;
        if (token) {
            userObj.token = token;
        }
        
        res.status(200).json(userObj);
    }catch(error){
        console.log("The error is:", error.message);
        res.status(500).json({
            "message":"Internal server error"
        });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.status(400).json({
                message: "Please provide your email address"
            });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal if email exists or not
            // Still return 200 to prevent email enumeration attacks
            return res.status(200).json({
                message: "If your email is registered, you will receive reset instructions."
            });
        }
        
        // In a real implementation, we would:
        // 1. Generate a password reset token with expiration
        // 2. Store the token in the database with the user
        // 3. Send an email with a link to reset password
        
        // For now, we'll just simulate success
        console.log(`Password reset requested for: ${email}`);
        
        return res.status(200).json({
            message: "If your email is registered, you will receive reset instructions."
        });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};