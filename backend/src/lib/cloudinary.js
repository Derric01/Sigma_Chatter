// import {v2 as cloudinary} from 'cloudinary';
// import {config} from 'dotenv';


// config();
// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY, 
//     api_secret:process.env.CLOUDINARY_API_SECRET
// });

// export default cloudinary;
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Enhanced debug logging for Cloudinary configuration (without exposing secrets)
console.log("Cloudinary Configuration Status:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "Not set",
  api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
  environment: process.env.NODE_ENV || "development"
});

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("WARNING: Missing Cloudinary configuration. Image uploads will not work properly.");
  console.error("Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your environment variables.");
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Create a simple test function to verify Cloudinary is working
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection test:", result.status === "ok" ? "Success" : "Failed");
    return result;
  } catch (error) {
    console.error("Cloudinary connection test failed:", error.message);
    // Log more detailed information for troubleshooting
    console.error("Check that your Cloudinary credentials are correct in environment variables");
    console.error("Current environment:", process.env.NODE_ENV || "development");
    return { status: "error", error: error.message };
  }
};

// Create a wrapper around cloudinary.uploader.upload with better error handling
const enhancedUpload = async (file, options = {}) => {
  try {
    // Merge default options with provided options
    const uploadOptions = {
      timeout: 60000, // 60 second timeout
      resource_type: 'auto', // auto-detect resource type
      ...options
    };
    
    // Attempt the upload
    console.log("Starting Cloudinary upload with timeout:", uploadOptions.timeout);
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    console.log("Cloudinary upload success:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    
    // Enhanced error handling with specific error types
    if (error.http_code === 400) {
      console.error("Bad request: Check file format and content");
    } else if (error.http_code === 401) {
      console.error("Authentication error: Check Cloudinary credentials");
    } else if (error.http_code === 403) {
      console.error("Rate limit or quota exceeded");
    } else if (error.http_code === 413) {
      console.error("File too large for Cloudinary");
    } else if (error.http_code >= 500) {
      console.error("Cloudinary server error");
    }
    
    throw error; // Re-throw for caller to handle
  }
};

// Add the enhanced upload to the cloudinary object
cloudinary.enhancedUpload = enhancedUpload;

// Test the connection on module load only in development
if (process.env.NODE_ENV !== 'production') {
  testCloudinaryConnection();
}

export default cloudinary;