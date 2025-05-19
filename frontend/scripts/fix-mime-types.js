/**
 * Post-build script to ensure correct MIME types for JavaScript files
 * This script is run after the build process to generate the necessary
 * headers files for Netlify and Vercel deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const buildDir = fs.existsSync(distDir) ? distDir : rootDir; // Account for different build output dirs

// Create _headers file for Netlify
const createNetlifyHeaders = () => {
  const headersContent = `# MIME type headers for Netlify
/assets/*.js
  Content-Type: application/javascript; charset=utf-8

/*.js
  Content-Type: application/javascript; charset=utf-8

/theme-preload.js
  Content-Type: application/javascript; charset=utf-8

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;

  // Write to both public and dist/build directories
  try {
    fs.writeFileSync(path.join(publicDir, '_headers'), headersContent);
    console.log('✅ Created Netlify _headers in public directory');
    
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
      console.log('✅ Created Netlify _headers in dist directory');
    }
  } catch (error) {
    console.error('❌ Error creating Netlify headers:', error);
  }
};

// Create vercel.json with correct MIME types
const createVercelConfig = () => {
  const vercelConfigPath = path.join(rootDir, 'vercel.json');
  let vercelConfig = {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "/assets/*.js",
        "headers": [
          {
            "key": "Content-Type", 
            "value": "application/javascript; charset=utf-8"
          }
        ]
      },
      {
        "source": "/*.js",
        "headers": [
          {
            "key": "Content-Type", 
            "value": "application/javascript; charset=utf-8"
          }
        ]
      },
      {
        "source": "/theme-preload.js",
        "headers": [
          {
            "key": "Content-Type", 
            "value": "application/javascript; charset=utf-8"
          }
        ]
      }
    ]
  };

  // Read existing config if it exists
  try {
    if (fs.existsSync(vercelConfigPath)) {
      const existingConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      // Preserve any existing settings that aren't headers or rewrites
      Object.keys(existingConfig).forEach(key => {
        if (key !== 'headers' && key !== 'rewrites') {
          vercelConfig[key] = existingConfig[key];
        }
      });
    }

    // Write updated config
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    console.log('✅ Updated vercel.json with MIME type headers');

    // If dist exists, also copy vercel.json there
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
      console.log('✅ Copied vercel.json to dist directory');
    }
  } catch (error) {
    console.error('❌ Error creating Vercel config:', error);
  }
};

// Copy theme-preload.js to the dist directory
const copyThemePreload = () => {
  try {
    if (fs.existsSync(distDir)) {
      const source = path.join(publicDir, 'theme-preload.js');
      const dest = path.join(distDir, 'theme-preload.js');
      
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
        console.log('✅ Copied theme-preload.js to dist directory');
      } else {
        console.warn('⚠️ theme-preload.js not found in public directory');
      }
    }
  } catch (error) {
    console.error('❌ Error copying theme-preload.js:', error);
  }
};

// Execute
console.log('📦 Running post-build MIME type fixes...');
createNetlifyHeaders();
createVercelConfig();
copyThemePreload();
console.log('✅ MIME type fixes completed');