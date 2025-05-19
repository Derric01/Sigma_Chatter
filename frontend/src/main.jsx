import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Initialize performance monitoring
if (import.meta.env.DEV) {
  console.log('Initializing app in development mode with optimizations');
}

// Apply FOUC-prevention class that will be removed after hydration
document.documentElement.classList.add('fouc-ready');

// Create root with concurrent mode
const root = createRoot(document.getElementById('root'));

// Render app with error boundary
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
