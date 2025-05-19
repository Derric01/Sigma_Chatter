import { useEffect, useState, useRef, useCallback, memo } from 'react';
import socket from '../lib/socket';

// Use memo to prevent unnecessary re-renders
const ConnectionStatus = memo(() => {
  // State variables
  const [apiStatus, setApiStatus] = useState('connected'); // Assume connected by default
  const [socketStatus, setSocketStatus] = useState(socket.connected ? 'connected' : 'disconnected');
  const [isVisible, setIsVisible] = useState(false);
  
  // Use refs to prevent re-renders on value changes
  const statusCheckRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  
  // Memoize the update function to prevent recreation on each render
  const updateSocketStatus = useCallback(() => {
    setSocketStatus(socket.connected ? 'connected' : 'disconnected');
  }, []);
  
  // Clean up all timeouts on unmount
  useEffect(() => {
    // Setup socket event handlers
    socket.on('connect', updateSocketStatus);
    socket.on('disconnect', updateSocketStatus);
    
    // Initial socket status
    updateSocketStatus();
    
    // Clean up function
    return () => {
      socket.off('connect', updateSocketStatus);
      socket.off('disconnect', updateSocketStatus);
      
      // Clear any pending timeouts
      if (statusCheckRef.current) clearTimeout(statusCheckRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [updateSocketStatus]);
  
  // Only show when there's a problem - reduces UI noise
  useEffect(() => {
    // Only show status indicator if there's a problem
    const hasConnectionIssue = apiStatus !== 'connected' || socketStatus !== 'connected';
    
    if (hasConnectionIssue && !isVisible) {
      // Delay showing the indicator to prevent flickering during normal reconnects
      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Show after 2 seconds of connection issues
    } else if (!hasConnectionIssue && isVisible) {
      // Hide immediately when connection is restored
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // Slight delay before hiding
    }
  }, [apiStatus, socketStatus, isVisible]);
  
  // Don't render anything if not visible
  if (!isVisible) return null;
  
  // Determine indicator color
  const getColorClass = () => {
    if (apiStatus !== 'connected' && socketStatus !== 'connected') {
      return 'bg-red-500'; // Both failed - red
    } else if (apiStatus !== 'connected' || socketStatus !== 'connected') {
      return 'bg-yellow-500'; // One failed - yellow
    }
    return 'bg-green-500'; // All good - green
  };
  
  // Render a simple indicator
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-base-200 p-2 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity">
      <div className={`w-3 h-3 rounded-full ${getColorClass()}`}></div>
      <span className="text-xs">
        {apiStatus !== 'connected' || socketStatus !== 'connected' 
          ? 'Connection issues' 
          : 'Connected'}
      </span>
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

export default ConnectionStatus;
