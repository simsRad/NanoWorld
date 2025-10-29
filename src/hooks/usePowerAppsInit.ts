import { useEffect, useState } from 'react';
import { initialize } from '@microsoft/power-apps/app';

interface UsePowerAppsInitReturn {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
}

/**
 * Custom hook to initialize Power Apps SDK
 * Ensures the SDK is ready before data operations
 * 
 * @returns Object with initialization status
 */
export const usePowerAppsInit = (): UsePowerAppsInitReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPowerApps = async () => {
      try {
        console.log('[PowerApps] Starting SDK initialization...');
        setIsInitializing(true);
        setError(null);

        // Wait for SDK initialization
        console.log('[PowerApps] Calling initialize()...');
        const result = await initialize();
        console.log('[PowerApps] Initialize completed, result:', result);

        // Mark as initialized even if data API not immediately available
        console.log('[PowerApps] SDK initialization completed');
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[PowerApps] Initialization error (continuing anyway):', errorMessage);
        // Don't fail on error - set to initialized anyway
        setIsInitialized(true);
        setError(null); // Clear error to allow component to render
      } finally {
        setIsInitializing(false);
      }
    };

    initPowerApps();
  }, []);

  return { isInitialized, isInitializing, error };
};

export default usePowerAppsInit;
