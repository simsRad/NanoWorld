import { initialize, getContext } from "@microsoft/power-apps/app";
import { getClient } from "@microsoft/power-apps/data";
import { useEffect, type ReactNode, createContext, useContext, useState } from "react";
import type { IContext } from "@microsoft/power-apps/app";

interface PowerProviderProps {
  children: ReactNode;
}

interface PowerContextType {
  context: IContext | null;
  client: any | null;
  isInitialized: boolean;
  error: string | null;
}

const PowerContext = createContext<PowerContextType>({
  context: null,
  client: null,
  isInitialized: false,
  error: null
});

export const usePowerApps = () => {
  const context = useContext(PowerContext);
  if (!context) {
    throw new Error('usePowerApps must be used within a PowerProvider');
  }
  return context;
};

export default function PowerProvider({ children }: PowerProviderProps) {
  const [context, setContext] = useState<IContext | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("Initializing Microsoft Power Apps SDK...");
        
        // Initialize the Power Apps SDK
        await initialize();
        console.log("Power Apps SDK initialized successfully");

        // Get the app context
        const appContext = await getContext();
        setContext(appContext);
        console.log("Power Apps context retrieved:", appContext);

        // Get the data client
        const dataClient = getClient({
          // Configure your data sources here
          users: {
            tableId: "systemuser", // Dataverse table for users
            apis: {},
          },
          // Custom Code Apps table using all name variations
          cr8ac_codeappstables: {
            tableId: "cr8ac_codeappstables", // Set Name (plural)
            apis: {},
          },
          cr8ac_codeappstable: {
            tableId: "cr8ac_codeappstable", // Logical Name (singular)
            apis: {},
          },
          CodeAppsTable: {
            tableId: "CodeAppsTable", // Display Name
            apis: {},
          },
          cr8ac_CodeAppsTable: {
            tableId: "cr8ac_CodeAppsTable", // Schema Name
            apis: {},
          },
          // Environment table using all name variations
          cr8ac_envtablecodeapps: {
            tableId: "cr8ac_envtablecodeapps", // Logical name
            apis: {},
          },
          cr8ac_envtablecodeappss: {
            tableId: "cr8ac_envtablecodeappss", // Set name (plural)
            apis: {},
          },
          EnvTableCodeApps: {
            tableId: "EnvTableCodeApps", // Display name
            apis: {},
          },
          cr8ac_EnvTableCodeApps: {
            tableId: "cr8ac_EnvTableCodeApps", // Schema name
            apis: {},
          },
        });
        setClient(dataClient);
        console.log("Power Apps data client initialized");

        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize Power Platform SDK:", err);
        setError(err instanceof Error ? err.message : 'Unknown initialization error');
        setIsInitialized(false);
      }
    };

    initApp();
  }, []);

  const contextValue: PowerContextType = {
    context,
    client,
    isInitialized,
    error
  };

  return (
    <PowerContext.Provider value={contextValue}>
      {children}
    </PowerContext.Provider>
  );
}
