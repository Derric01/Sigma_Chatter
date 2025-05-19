// Simple script to test Cloudinary connectivity
// Run with: node src/test-cloudinary.js

import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

console.log('==== Cloudinary Connection Test ====');

// Check if environment variables are set
console.log('\nEnvironment Variable Check:');
console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ NOT SET');
console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ NOT SET');
console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ NOT SET');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('\n❌ ERROR: Missing Cloudinary credentials in environment variables');
  console.log('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Test ping
async function testConnection() {
  try {
    console.log('\nTrying to connect to Cloudinary...');
    const result = await cloudinary.api.ping();
    console.log(`✅ Connection successful! Status: ${result.status}`);
    return true;
  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

// Create a test upload
async function testUpload() {
  try {
    // Create a simple test image
    const testImagePath = path.join(process.cwd(), 'uploads', 'test-image.jpg');
    
    // Check if we have any test images in the uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    
    let imagePath;
    
    if (files.length > 0 && files.some(f => f.endsWith('.jpg') || f.endsWith('.png'))) {
      // Use an existing image
      const imageFile = files.find(f => f.endsWith('.jpg') || f.endsWith('.png'));
      imagePath = path.join(uploadsDir, imageFile);
      console.log(`\nUsing existing image for upload test: ${imageFile}`);
    } else {
      console.log('\nNo existing images found. Test image upload will be skipped.');
      return false;
    }
    
    console.log('Attempting to upload test image...');
    const uploadResponse = await cloudinary.uploader.upload(imagePath, {
      folder: 'test',
      resource_type: 'auto',
      timeout: 30000
    });
    
    console.log(`✅ Upload successful! Image URL: ${uploadResponse.secure_url}`);
    return true;
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
    if (error.http_code) {
      console.error(`HTTP Error Code: ${error.http_code}`);
    }
    return false;
  }
}

// Main function
async function runTests() {
  const connectionResult = await testConnection();
  
  if (connectionResult) {
    await testUpload();
  }
  
  console.log('\n==== Test Complete ====');
}

runTests();
