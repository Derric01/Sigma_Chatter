#!/usr/bin/env node
/**
 * Server diagnostic script for Sigma Chatter
 * 
 * Run this script to verify the server configuration and environment variables.
 * Usage: node server-diagnostics.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('\n=== Sigma Chatter Server Diagnostics ===\n');

// Check environment variables
function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  
  const requiredVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    const isSet = !!process.env[varName];
    console.log(`- ${varName}: ${isSet ? '✅ Set' : '❌ NOT SET'}`);
    if (!isSet) allPresent = false;
  }
  
  // Optional variables
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- CLIENT_URL: ${process.env.CLIENT_URL || 'not set (will use default CORS)'}`);
  
  return allPresent;
}

// Check MongoDB connection
async function checkMongoDBConnection() {
  console.log('\nTesting MongoDB connection...');
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ Cannot test MongoDB connection - MONGODB_URI is not set');
    return false;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Get collection stats
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Check uploads directory
function checkUploadsDirectory() {
  console.log('\nChecking uploads directory...');
  
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Uploads directory does not exist, creating it...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created at:', uploadsDir);
    } else {
      console.log('✅ Uploads directory exists at:', uploadsDir);
      
      // Check write permissions
      try {
        const testFile = path.join(uploadsDir, '.test-write-permission');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('✅ Uploads directory is writable');
      } catch (error) {
        console.error('❌ Uploads directory is not writable:', error.message);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('❌ Error checking uploads directory:', error.message);
    return false;
  }
}

// Check Cloudinary configuration
async function checkCloudinaryConfig() {
  console.log('\nTesting Cloudinary configuration...');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.log('❌ Cannot test Cloudinary - credentials not set');
    return false;
  }
  
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      console.log('✅ Cloudinary connection successful!');
      return true;
    } else {
      console.error('❌ Cloudinary ping returned unexpected status:', result.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Cloudinary configuration test failed:', error.message);
    return false;
  }
}

// Main diagnostic function
async function runDiagnostics() {
  try {
    // System info
    console.log('System information:');
    console.log(`- Node.js version: ${process.version}`);
    console.log(`- Platform: ${process.platform}`);
    console.log(`- Architecture: ${process.arch}`);
    console.log(`- Current directory: ${process.cwd()}`);
    
    // Check components
    const envVarsOk = checkEnvironmentVariables();
    const uploadsOk = checkUploadsDirectory();
    const mongodbOk = await checkMongoDBConnection();
    const cloudinaryOk = await checkCloudinaryConfig();
    
    // Summary
    console.log('\n=== Diagnostic Summary ===');
    console.log(`- Environment Variables: ${envVarsOk ? '✅ OK' : '❌ Issues detected'}`);
    console.log(`- Uploads Directory: ${uploadsOk ? '✅ OK' : '❌ Issues detected'}`);
    console.log(`- MongoDB Connection: ${mongodbOk ? '✅ OK' : '❌ Issues detected'}`);
    console.log(`- Cloudinary Configuration: ${cloudinaryOk ? '✅ OK' : '❌ Issues detected'}`);
    
    if (envVarsOk && uploadsOk && mongodbOk && cloudinaryOk) {
      console.log('\n✅ All systems operational! Server should work correctly.');
    } else {
      console.log('\n❌ Some issues detected. Please fix them before running the server.');
    }
    
  } catch (error) {
    console.error('Error during diagnostics:', error);
  }
}

// Run the diagnostics
runDiagnostics();
