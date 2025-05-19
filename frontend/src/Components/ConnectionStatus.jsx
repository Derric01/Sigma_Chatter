import { useEffect, useState, useRef } from 'react';
import socket from '../lib/socket';
import { getDiagnosticData } from '../lib/diagnostics';
import { quickTest } from '../lib/connectionTest';

const ConnectionStatus = () => {
  // State variables
  const [apiStatus, setApiStatus] = useState('unchecked');
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [cloudinaryStatus, setCloudinaryStatus] = useState('unknown');
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [connectionTestResults, setConnectionTestResults] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [isTestingConnections, setIsTestingConnections] = useState(false);
  
  // Disabled automatic diagnostics to prevent refresh loops
  
  // Refs for preventing excessive re-renders
  const timeoutsRef = useRef([]);
  const diagnosticsRunningRef = useRef(false);
  
  // Clear all timeouts on unmount
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };
  
  // Add timeout and track it
  const safeSetTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  };
  // Function to run diagnostics without causing re-renders
  const runDiagnostics = async () => {
    if (diagnosticsRunningRef.current) return;
    
    diagnosticsRunningRef.current = true;
    setIsRunningDiagnostics(true);
    
    try {
      const data = await getDiagnosticData();
      
      // Check if component is still mounted before updating state
      if (timeoutsRef.current) {
        // Batch state updates
        safeSetTimeout(() => {
          setDiagnosticData(data);
          
          // Update individual status indicators in one render cycle
          if (data.connections) {
            setApiStatus(data.connections.serverConnection.status);
            // Don't override the socket status from the socket events
            if (socketStatus === 'unchecked' || socketStatus === 'unknown') {
              setSocketStatus(data.connections.socketConnection.status);
            }
            setCloudinaryStatus(data.connections.cloudinaryConnection.status);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Diagnostics error:', error);
      setApiStatus('error');
    } finally {
      // Check if component is still mounted before updating state
      if (timeoutsRef.current) {
        safeSetTimeout(() => {
          setIsRunningDiagnostics(false);
          diagnosticsRunningRef.current = false;
        }, 500);
      }
    }
  };
  
  // Function to run connection tests
  const handleRunConnectionTest = async () => {
    if (isTestingConnections) return;
    
    setIsTestingConnections(true);
    try {
      const results = await quickTest();
      safeSetTimeout(() => {
        setConnectionTestResults(results);
      }, 100);
    } catch (error) {
      console.error('Connection test error:', error);
    } finally {
      safeSetTimeout(() => {
        setIsTestingConnections(false);
      }, 500);
    }
  };  // Memoize the runDiagnostics function to prevent it from changing
  // on each render, allowing us to use it in the dependency array
  const memoizedRunDiagnostics = useRef(runDiagnostics);

  // Setup socket event listeners once on component mount
  useEffect(() => {
    let mounted = true;
    let hasRunInitialDiagnostics = false;
    
    // Socket event handlers with throttling
    const onConnect = () => {
      if (!mounted) return;
      
      // Don't update state if component is unmounting
      const timeoutId = safeSetTimeout(() => {
        setSocketStatus('connected');
        
        // Only run diagnostics once on initial connect
        if (!hasRunInitialDiagnostics) {
          hasRunInitialDiagnostics = true;
          safeSetTimeout(memoizedRunDiagnostics.current, 1000);
        }
      }, 300);
      timeoutsRef.current.push(timeoutId);
    };
    
    const onDisconnect = () => {
      if (!mounted) return;
      
      const timeoutId = safeSetTimeout(() => {
        setSocketStatus('disconnected');
      }, 300);
      timeoutsRef.current.push(timeoutId);
    };
    
    const onConnectError = () => {
      if (!mounted) return;
      
      const timeoutId = safeSetTimeout(() => {
        setSocketStatus('error');
      }, 300);
      timeoutsRef.current.push(timeoutId);
    };

    // Set up socket listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
      // Check current status once
    if (socket.connected) {
      setSocketStatus('connected');
      
      // If socket is already connected, run diagnostics once with a delay
      if (!hasRunInitialDiagnostics) {
        hasRunInitialDiagnostics = true;
        const initialDiagnosticsTimeout = safeSetTimeout(memoizedRunDiagnostics.current, 1500);
        timeoutsRef.current.push(initialDiagnosticsTimeout);
      }
    }
    
    // Cleanup function
    return () => {
      mounted = false;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      clearAllTimeouts();
    };
  }, [memoizedRunDiagnostics]); // Use memoized function to avoid infinite loops
  
  // Toggle visibility
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  // Generate status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return 'badge-success';
      case 'disconnected':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      case 'unchecked':
      case 'unknown':
      default:
        return 'badge-ghost';
    }
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 hardware-accelerated connection-status">
      <div 
        className="bg-base-200 rounded-full shadow-md cursor-pointer p-2 flex items-center justify-center hardware-accelerated"
        onClick={toggleVisibility}
      >
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(socketStatus)}`}></div>
        <span className="text-xs font-semibold">Connection</span>
      </div>

      {isVisible && (
        <div className="bg-base-100 rounded-lg shadow-xl p-4 mt-2 border border-base-300 w-80 hardware-accelerated">          <h3 className="font-medium mb-3 flex items-center justify-between">
            <span>Connection Status</span>
            <button 
              className="btn btn-ghost btn-xs"
              onClick={memoizedRunDiagnostics.current}
              disabled={isRunningDiagnostics}
            >
              {isRunningDiagnostics ? 'Checking...' : 'Refresh'}
            </button>
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">API Server:</span>
              <span className={`badge ${getStatusColor(apiStatus)}`}>
                {apiStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">WebSocket:</span>
              <span className={`badge ${getStatusColor(socketStatus)}`}>
                {socketStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Image Upload:</span>
              <span className={`badge ${getStatusColor(cloudinaryStatus)}`}>
                {cloudinaryStatus}
              </span>
            </div>
          </div>
          
          <hr className="my-3 opacity-20" />
          
          <button 
            className="btn btn-sm btn-block btn-neutral"
            onClick={handleRunConnectionTest}
            disabled={isTestingConnections}
          >
            {isTestingConnections ? 'Testing...' : 'Run Connection Test'}
          </button>
          
          {connectionTestResults && (
            <div className="mt-3 text-xs overflow-auto max-h-36 p-2 bg-base-300 rounded">
              <pre>{JSON.stringify(connectionTestResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
