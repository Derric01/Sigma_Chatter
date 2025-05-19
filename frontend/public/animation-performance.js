/**
 * Animation Performance Optimization Script for Sigma Chatter
 * This script runs before React loads to improve rendering performance
 */
(function() {
  try {
    // Configure browser for optimal rendering performance
    
    // Add hardware acceleration hints to improve rendering performance
    document.documentElement.classList.add('hardware-accelerated');
    document.documentElement.style.transform = 'translateZ(0)';
    document.documentElement.style.backfaceVisibility = 'hidden';
    document.documentElement.style.perspective = '1000px';
    
    // Disable debug and development modes that might cause excessive re-renders
    // This helps in development environments where React might be in StrictMode
    window.SIGMA_DEBUG = false;
    window.DISABLE_DIAGNOSTICS = true;
    
    // Configure throttling for high-frequency events
    window.SCROLL_THROTTLE = 100; // ms
    window.RESIZE_THROTTLE = 200; // ms
    window.CONNECTION_CHECK_INTERVAL = 60000; // Check connection status every minute, not continuously
    window.SOCKET_RECONNECT_ATTEMPTS = 5;
    
    // Performance flags for components
    window.PERFORMANCE_FLAGS = {
      disableConnectionStatus: true,
      minimizeDiagnostics: true,
      skipExcessiveRevalidation: true,
      optimizeScrolling: true,
      batchStateUpdates: true
    };
    
    console.log('Animation performance optimizations applied');
  } catch (e) {
    console.error('Animation performance optimization error:', e);
  }
})();
