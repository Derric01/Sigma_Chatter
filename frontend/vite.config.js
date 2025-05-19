import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Disable React Fast Refresh in development to prevent reload loops
      fastRefresh: false
    })
  ],
  // Add base path configuration for proper asset paths in production
  base: '/',
  // Ensure the build generates the files in a way that works with SPA routing
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    }
  },
  // Development server configuration
  server: {
    port: 5173,
    hmr: { 
      // Optimize Hot Module Replacement for better performance
      overlay: false
    },
    // Prevent "cross-origin" errors when communicating with the backend
    cors: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
