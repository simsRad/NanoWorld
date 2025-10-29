import React from 'react';
import { usePowerAppsInit } from '../hooks/usePowerAppsInit';

interface PowerAppsGuardProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

/**
 * Component to guard data operations until Power Apps SDK is initialized
 * Prevents errors from uninitialized services
 * 
 * @param children Component(s) to render once initialized
 * @param loadingComponent Custom loading component
 * @param errorComponent Custom error component
 * @returns Protected component or loading/error state
 */
export const PowerAppsGuard: React.FC<PowerAppsGuardProps> = ({
  children,
  loadingComponent,
  errorComponent
}) => {
  const { isInitialized, isInitializing, error } = usePowerAppsInit();

  // Show loading state
  if (isInitializing) {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
        <p>Loading Power Apps SDK...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return errorComponent ? (
      <>{errorComponent}</>
    ) : (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#d13438' }}>
        <p>Failed to initialize: {error}</p>
      </div>
    );
  }

  // Show protected content once initialized
  if (!isInitialized) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
        <p>Power Apps not initialized</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PowerAppsGuard;
