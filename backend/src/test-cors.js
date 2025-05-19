/**
 * CORS Test Script for Sigma Chatter
 * 
 * This script tests the CORS configuration of the backend server.
 */

const fetch = require('node-fetch');
const API_URL = 'http://localhost:5001';

async function testCors() {
  try {
    console.log('Testing CORS config...');
    
    const response = await fetch(`${API_URL}/`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`CORS headers: ${response.headers.get('access-control-allow-origin')}`);
    
    const data = await response.json();
    console.log('Response:', data);
    
    console.log('CORS test complete!');
  } catch (err) {
    console.error('CORS test failed:', err.message);
  }
}

testCors();