/**
 * Theme Preload Script for Sigma Chatter
 * This script runs before React loads to prevent theme flickering
 * It applies the theme from localStorage immediately
 */
(function() {
  try {
    // Get stored theme from localStorage
    const storedTheme = localStorage.getItem('theme-storage');
    if (storedTheme) {
      const themeData = JSON.parse(storedTheme);
      if (themeData.state && themeData.state.theme) {
        // Apply theme to HTML element immediately
        document.documentElement.setAttribute('data-theme', themeData.state.theme);
      }
    } else {
      // Default theme if no preference saved
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    // Add a hardware acceleration class to the HTML element to improve animations
    document.documentElement.classList.add('hardware-accelerated');

    // Prevent FOUC (Flash of Unstyled Content)
    document.documentElement.classList.add('theme-applied');
  } catch (e) {
    console.error('Theme preload error:', e);
    // Fallback to light theme on error
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();