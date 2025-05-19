import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to apply theme with performance optimizations
const applyThemeToDOM = (theme) => {
  // We'll add a class to temporarily disable transitions
  document.documentElement.classList.add('theme-applied');
  
  // Apply the theme
  document.documentElement.setAttribute('data-theme', theme);
  
  // Re-enable transitions after a short delay
  setTimeout(() => {
    document.documentElement.classList.remove('theme-applied');
  }, 100);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light", // Default theme
      lastThemeUpdate: 0, // Track last update time to prevent flickering
      isInitialized: false, // Track if theme has been initialized
      
      // Initialize theme on app start
      initializeTheme: () => {
        const { theme, isInitialized } = get();
        
        if (!isInitialized) {
          // Apply stored theme or system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const themeToApply = theme || (prefersDark ? 'dark' : 'light');
          
          applyThemeToDOM(themeToApply);
          set({ isInitialized: true, theme: themeToApply });
        }
      },
      
      // Set theme with debouncing
      setTheme: (theme) => {
        // Check if same theme is being set again
        const { theme: currentTheme, lastThemeUpdate } = get();
        if (currentTheme === theme) {
          return; // Don't update if theme is the same
        }
        
        // Throttle theme updates to prevent flickering
        const now = Date.now();
        if (now - lastThemeUpdate < 300) {
          return; // Don't update if less than 300ms since last update
        }

        // Apply theme with optimizations
        applyThemeToDOM(theme);
        
        // Update state
        set({ 
          theme, 
          lastThemeUpdate: now,
          isInitialized: true
        });
      },
    }),
    {
      name: "theme-storage", // Local storage key
    }
  )
);
