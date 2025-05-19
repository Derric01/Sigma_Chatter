#!/usr/bin/env node

/**
 * Sigma Chatter Configuration Verification Script
 * 
 * This script tests the local development setup to ensure all configurations
 * are correct for local development.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('Sigma Chatter Local Development Verification');
console.log('============================================');

// Check files exist
const requiredFiles = [
    { path: path.join('backend', '.env'), name: 'Backend .env file' },
    { path: path.join('backend', 'src', 'index.js'), name: 'Backend entry point' },
    { path: path.join('frontend', 'src', 'lib', 'axios.js'), name: 'Frontend API client' },
    { path: path.join('frontend', 'src', 'lib', 'socket.js'), name: 'Frontend Socket client' },
    { path: path.join('frontend', 'cors-diagnostic.html'), name: 'CORS diagnostic tool' },
    { path: 'LOCAL_DEVELOPMENT.md', name: 'Local development guide' },
];

console.log('\nChecking required files...');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(file.path);
    console.log(`  ${exists ? '✅' : '❌'} ${file.name} (${file.path})`);
});

// Check environment variables
console.log('\nChecking backend .env configuration...');
try {
    const envContent = fs.readFileSync(path.join('backend', '.env'), 'utf8');
    const envLines = envContent.split('\n');
    
    const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
    requiredVars.forEach(varName => {
        const exists = envLines.some(line => line.startsWith(`${varName} =`) || line.startsWith(`${varName}=`));
        console.log(`  ${exists ? '✅' : '❌'} ${varName}`);
        
        if (exists && varName === 'PORT') {
            const portLine = envLines.find(line => line.startsWith(`${varName} =`) || line.startsWith(`${varName}=`));
            const port = portLine.split('=')[1].trim();
            console.log(`    - Port value: ${port} (expecting 5003)`);
        }
    });
} catch (err) {
    console.log('  ❌ Error reading .env file:', err.message);
}

// Check for production URLs
console.log('\nChecking for production URLs in key files...');

// Helper function to check a file for production URLs
function checkFileForProductionURLs(filePath, fileDescription) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const productionURLs = [
            'vercel.app',
            'onrender.com',
            'netlify.app',
            'herokuapp.com',
            'sigmachatter-server'
        ];
        
        const matches = productionURLs.filter(url => content.includes(url));
        if (matches.length > 0) {
            console.log(`  ❌ ${fileDescription} contains production URLs: ${matches.join(', ')}`);
        } else {
            console.log(`  ✅ ${fileDescription} - No production URLs found`);
        }
    } catch (err) {
        console.log(`  ❌ Error reading ${fileDescription}:`, err.message);
    }
}

checkFileForProductionURLs(path.join('backend', 'src', 'index.js'), 'Backend index.js');
checkFileForProductionURLs(path.join('frontend', 'src', 'lib', 'axios.js'), 'Frontend axios.js');
checkFileForProductionURLs(path.join('frontend', 'src', 'lib', 'socket.js'), 'Frontend socket.js');

console.log('\nVerification complete!');
console.log('\nNow run the application with:');
console.log('  npm run dev');
