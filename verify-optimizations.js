  /**
 * Verify Performance Optimizations
 * This script checks if all performance optimizations have been correctly applied
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(message, status) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  const color = status === 'pass' ? GREEN : status === 'fail' ? RED : YELLOW;
  console.log(`${color}${icon} ${message}${RESET}`);
}

function verifyOptimizations() {
  console.log('\n=== Verifying Performance Optimizations ===\n');
  
  const checks = {
    backend: {
      'index.js': {
        corsConfig: {
          check: (content) => content.includes('allowedOrigins'),
          message: 'CORS configuration includes allowed origins'
        },
        cacheControl: {
          check: (content) => content.includes('Cache-Control'),
          message: 'Cache control headers are configured'
        },
        healthEndpoint: {
          check: (content) => content.includes('app.get("/", (req, res)'),
          message: 'Health endpoint is configured'
        },
        port: {
          check: (content) => content.includes('PORT = process.env.PORT || 5001'),
          message: 'Backend port is set to 5001'
        }
      }
    },
    frontend: {
      '.env': {
        apiUrl: {
          check: (content) => content.includes('VITE_API_URL=http://localhost:5001/api'),
          message: 'API URL is set to localhost:5001'
        },
        optimizations: {
          check: (content) => content.includes('VITE_DISABLE_CONNECTION_STATUS=true'),
          message: 'Performance optimizations are enabled'
        }
      },
      'src/App.jsx': {
        connectionStatus: {
          check: (content) => content.includes('OptimizedConnectionStatus'),
          message: 'Optimized connection status is configured'
        },
        strictMode: {
          check: (content) => !content.includes('<StrictMode>'),
          message: 'StrictMode is disabled'
        }
      },
      'src/main.jsx': {
        rendering: {
          check: (content) => !content.includes('<StrictMode>'),
          message: 'Main rendering does not use StrictMode'
        }
      },
      'vite.config.js': {
        fastRefresh: {
          check: (content) => content.includes('fastRefresh: false'),
          message: 'Fast Refresh is disabled for stability'
        }
      }
    }
  };
  
  let totalChecks = 0;
  let passedChecks = 0;

  // Run the checks
  for (const [section, files] of Object.entries(checks)) {
    console.log(`\n${section.toUpperCase()} CHECKS:`);
    
    for (const [fileName, checkItems] of Object.entries(files)) {
      const filePath = path.join(process.cwd(), section, fileName);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const [checkName, check] of Object.entries(checkItems)) {
          totalChecks++;
          const passed = check.check(content);
          if (passed) passedChecks++;
          log(check.message, passed ? 'pass' : 'fail');
        }
      } catch (err) {
        log(`Could not check ${fileName}: ${err.message}`, 'warn');
      }
    }
  }
  
  console.log(`\n${passedChecks} of ${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log(GREEN + '\nAll performance optimizations are correctly applied! 🎉\n' + RESET);
  } else {
    console.log(YELLOW + '\nSome optimizations may be missing. Check the results above.\n' + RESET);
  }
}

// Run verification
verifyOptimizations();
