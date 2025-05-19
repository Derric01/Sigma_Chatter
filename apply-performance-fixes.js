#!/usr/bin/env node
/**
 * Performance optimization script for Sigma Chatter
 * This script applies various fixes to improve performance and fix flickering issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

/**
 * Log a message with color
 */
function log(message, color = GREEN) {
  console.log(`${color}${message}${RESET}`);
}

/**
 * Apply performance fixes
 */
function applyPerformanceFixes() {
  try {
    // Get the root directory
    const rootDir = process.cwd();
    log(`Applying performance fixes to project in ${rootDir}`);
    
    // 1. Check if frontend .env exists, create if not
    const frontendEnvPath = path.join(rootDir, 'frontend', '.env');
    if (!fs.existsSync(frontendEnvPath)) {
      log('Creating frontend .env file...', YELLOW);
      fs.writeFileSync(frontendEnvPath, `# Environment Variables for local development
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_DISABLE_STRICT_MODE=true
VITE_DISABLE_CONNECTION_STATUS=true
VITE_OPTIMIZE_RENDERING=true
VITE_THROTTLE_EVENTS=true
VITE_DISABLE_DIAGNOSTICS=true`);
      log('Created frontend .env file.');
    } else {
      log('Frontend .env file already exists.', YELLOW);
    }
    
    // 2. Update packages
    log('Installing required frontend packages...', YELLOW);
    execSync('cd frontend && npm install zustand react-router-dom socket.io-client react-hot-toast --save', { stdio: 'inherit' });
    log('Frontend packages updated.');
    
    log('Installing required backend packages...', YELLOW);
    execSync('cd backend && npm install cors socket.io express helmet compression --save', { stdio: 'inherit' });
    log('Backend packages updated.');
    
    // 3. Set permissions for script files
    try {
      execSync('chmod +x verify-local-setup.js', { stdio: 'inherit' });
      log('Set permissions for verify-local-setup.js');
    } catch (error) {
      log('Could not set permissions for verify-local-setup.js (non-critical)', YELLOW);
    }
    
    // 4. Verify the installations and optimizations
    log('Running verification script...', YELLOW);
    try {
      execSync('node verify-local-setup.js', { stdio: 'inherit' });
      log('Verification completed successfully.');
    } catch (error) {
      log('Verification script encountered issues. See errors above.', RED);
    }
    
    log('\n✅ Performance optimizations have been applied successfully!');
    log('Please start both the backend and frontend servers to verify the changes.');
    log('Backend: cd backend && npm start');
    log('Frontend: cd frontend && npm run dev');
    
  } catch (error) {
    log(`Error applying performance fixes: ${error.message}`, RED);
    process.exit(1);
  }
}

// Execute the function
applyPerformanceFixes();
