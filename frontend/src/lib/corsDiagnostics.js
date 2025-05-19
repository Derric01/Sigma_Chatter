/**
 * CORS Diagnostic Tool for Sigma Chatter
 * 
 * This script provides functions to diagnose CORS issues between 
 * the frontend and backend components of the application.
 */

// Build a simple CORS test function
function testCORS(endpoint, includeCustomHeaders = false) {
    console.log(`Testing CORS for ${endpoint}...`);
    
    // Create basic headers
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Add custom headers if specified
    if (includeCustomHeaders) {
        headers['Cache-Control'] = 'no-cache';
        headers['Pragma'] = 'no-cache';
    }
    
    // Perform the test
    return fetch(endpoint, {
        method: 'OPTIONS',
        headers,
        credentials: 'include'
    })
    .then(response => {
        console.log(`CORS preflight response status: ${response.status}`);
        
        // Check allowed headers
        const allowHeaders = response.headers.get('Access-Control-Allow-Headers');
        console.log(`Allowed headers: ${allowHeaders || 'None'}`);
        
        // Check allowed methods
        const allowMethods = response.headers.get('Access-Control-Allow-Methods');
        console.log(`Allowed methods: ${allowMethods || 'None'}`);
        
        // Check allowed origin
        const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
        console.log(`Allowed origin: ${allowOrigin || 'None'}`);
        
        // Check allow credentials
        const allowCredentials = response.headers.get('Access-Control-Allow-Credentials');
        console.log(`Allow credentials: ${allowCredentials || 'None'}`);
        
        return {
            status: response.status,
            allowedHeaders: allowHeaders?.split(',').map(h => h.trim()) || [],
            allowedMethods: allowMethods?.split(',').map(m => m.trim()) || [],
            allowedOrigin: allowOrigin,
            allowCredentials: allowCredentials === 'true'
        };
    })
    .catch(error => {
        console.error('CORS test failed:', error);
        return {
            status: 'error',
            error: error.message
        };
    });
}

// Run tests for specific endpoints
async function runDiagnostics() {
    console.log('Running CORS diagnostics...');
    console.log('=========================');
    
    // Test the health endpoint
    await testCORS('http://localhost:5001/');
    console.log('-------------------------');
    
    // Test the auth check endpoint
    await testCORS('http://localhost:5001/api/auth/check');
    console.log('-------------------------');
    
    // Test with custom headers
    await testCORS('http://localhost:5001/api/auth/check', true);
    console.log('=========================');
    console.log('Diagnostics complete. Check the console output for results.');
}

// Export the functions
export { testCORS, runDiagnostics };
