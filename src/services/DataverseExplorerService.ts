/**
 * Generic Dataverse Explorer Service
 * Uses the available Dataverse operations to explore and work with data
 */

import { initialize, getContext } from '@microsoft/power-apps/app';
import { getClient } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';

export interface IDataverseRecord {
  [key: string]: any;
}

export interface IDataverseResult<T> {
  data?: T;
  error?: string;
  success: boolean;
}

let dataClient: any = null;

/**
 * Initialize Power Apps and get data client
 */
async function ensureInitialized() {
  if (dataClient) {
    return dataClient;
  }

  try {
    console.log('[DataverseExplorer] Initializing Power Apps SDK...');
    await initialize();
    
    console.log('[DataverseExplorer] Getting Power Apps context...');
    getContext(); // Initialize context
    
    console.log('[DataverseExplorer] Getting data client...');
    dataClient = getClient(dataSourcesInfo);
    
    console.log('[DataverseExplorer] Dataverse client initialized successfully');
    return dataClient;
  } catch (error) {
    console.error('[DataverseExplorer] Failed to initialize:', error);
    throw error;
  }
}

export class DataverseExplorerService {
  
  /**
   * Get all available data sources from the schema
   */
  public static getAvailableDataSources(): string[] {
    const sources = Object.keys(dataSourcesInfo);
    console.log('[DataverseExplorer] Available data sources:', sources);
    return sources;
  }

  /**
   * Get Dataverse tables specifically
   */
  public static getDataverseTables(): string[] {
    const dataverseTables = Object.keys(dataSourcesInfo).filter(key => {
      const source = dataSourcesInfo[key as keyof typeof dataSourcesInfo];
      return source && typeof source === 'object' && 'dataSourceType' in source && 
             source.dataSourceType === 'Dataverse';
    });
    console.log('[DataverseExplorer] Available Dataverse tables:', dataverseTables);
    return dataverseTables;
  }

  /**
   * Retrieve records from any table using direct Dataverse operations
   */
  public static async getRecords<T = IDataverseRecord>(
    tableName: string, 
    options?: {
      select?: string[];
      filter?: string;
      orderBy?: string[];
      top?: number;
    }
  ): Promise<IDataverseResult<T[]>> {
    try {
      const client = await ensureInitialized();
      
      console.log(`[DataverseExplorer] Retrieving records from table: ${tableName}`, options);
      
      const result = await client.retrieveMultipleRecordsAsync(tableName, options);
      
      console.log(`[DataverseExplorer] Successfully retrieved ${result.data?.length || 0} records from ${tableName}`);
      
      return {
        data: result.data || [],
        success: true
      };
    } catch (error) {
      console.error(`[DataverseExplorer] Failed to retrieve records from ${tableName}:`, error);
      return {
        error: error instanceof Error ? error.message : String(error),
        success: false
      };
    }
  }

  /**
   * Create a new record in any table
   */
  public static async createRecord<T = IDataverseRecord>(
    tableName: string,
    record: Partial<T>
  ): Promise<IDataverseResult<T>> {
    try {
      const client = await ensureInitialized();
      
      console.log(`[DataverseExplorer] Creating record in table: ${tableName}`, record);
      
      const result = await client.createRecordAsync(tableName, record);
      
      console.log(`[DataverseExplorer] Successfully created record in ${tableName}:`, result.data);
      
      return {
        data: result.data,
        success: true
      };
    } catch (error) {
      console.error(`[DataverseExplorer] Failed to create record in ${tableName}:`, error);
      return {
        error: error instanceof Error ? error.message : String(error),
        success: false
      };
    }
  }

  /**
   * Update a record in any table
   */
  public static async updateRecord<T = IDataverseRecord>(
    tableName: string,
    recordId: string,
    updates: Partial<T>
  ): Promise<IDataverseResult<T>> {
    try {
      const client = await ensureInitialized();
      
      console.log(`[DataverseExplorer] Updating record in table: ${tableName}`, { recordId, updates });
      
      const result = await client.updateRecordAsync(tableName, recordId, updates);
      
      console.log(`[DataverseExplorer] Successfully updated record in ${tableName}:`, result.data);
      
      return {
        data: result.data,
        success: true
      };
    } catch (error) {
      console.error(`[DataverseExplorer] Failed to update record in ${tableName}:`, error);
      return {
        error: error instanceof Error ? error.message : String(error),
        success: false
      };
    }
  }

  /**
   * Delete a record from any table
   */
  public static async deleteRecord(
    tableName: string,
    recordId: string
  ): Promise<IDataverseResult<boolean>> {
    try {
      const client = await ensureInitialized();
      
      console.log(`[DataverseExplorer] Deleting record from table: ${tableName}`, { recordId });
      
      await client.deleteRecordAsync(tableName, recordId);
      
      console.log(`[DataverseExplorer] Successfully deleted record from ${tableName}`);
      
      return {
        data: true,
        success: true
      };
    } catch (error) {
      console.error(`[DataverseExplorer] Failed to delete record from ${tableName}:`, error);
      return {
        error: error instanceof Error ? error.message : String(error),
        success: false
      };
    }
  }

  /**
   * Execute a custom operation
   */
  public static async executeOperation(
    operationName: string,
    parameters?: Record<string, any>
  ): Promise<IDataverseResult<any>> {
    try {
      const client = await ensureInitialized();
      
      console.log(`[DataverseExplorer] Executing operation: ${operationName}`, parameters);
      
      const result = await client.executeAsync(operationName, parameters);
      
      console.log(`[DataverseExplorer] Successfully executed operation ${operationName}:`, result);
      
      return {
        data: result,
        success: true
      };
    } catch (error) {
      console.error(`[DataverseExplorer] Failed to execute operation ${operationName}:`, error);
      return {
        error: error instanceof Error ? error.message : String(error),
        success: false
      };
    }
  }
}