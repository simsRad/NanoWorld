/**
 * Generated Service for cr8ac_codeappstable
 * Provides CRUD operations for the Dataverse table
 */

import { initialize, getContext } from '@microsoft/power-apps/app';
import { getClient } from '@microsoft/power-apps/data';
import type { Cr8acCodeappstable, ICr8acCodeappsTableCreateRequest } from '../models/Cr8acCodeappstableModel';

export interface IGetAllOptions {
  maxPageSize?: number;
  select?: string[];
  filter?: string;
  orderBy?: string[];
  top?: number;
  skip?: number;
  skipToken?: string;
}

export interface IServiceResult<T> {
  data?: T;
  error?: string;
}

let dataClient: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Initialize Power Apps and get data client
 */
async function ensureInitialized() {
  // Return cached client if already initialized
  if (dataClient) {
    console.log('[Cr8acCodeappstableService] Using cached data client');
    return dataClient;
  }

  // Prevent multiple concurrent initialization attempts
  if (initPromise) {
    console.log('[Cr8acCodeappstableService] Waiting for initialization in progress...');
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      console.log('[Cr8acCodeappstableService] Initializing Power Apps SDK...');
      
      // Initialize the SDK
      await initialize();
      console.log('[Cr8acCodeappstableService] SDK initialized, getting context...');
      
      // Get context (required before getting data client)
      await getContext();
      console.log('[Cr8acCodeappstableService] Context retrieved, getting data client...');
      
      // Get data client - pass empty config to get generic client with CRUD methods
      const client = getClient({});
      
      if (!client) {
        throw new Error('Failed to initialize Power Apps data client');
      }
      
      dataClient = client;
      console.log('[Cr8acCodeappstableService] Successfully initialized');
      console.log('[Cr8acCodeappstableService] Available client methods:', Object.keys(client));
      
      return dataClient;
    } catch (error) {
      console.error('[Cr8acCodeappstableService] Initialization failed:', error);
      dataClient = null;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Build OData query string
 */
function buildODataQuery(options?: IGetAllOptions): string {
  const parts: string[] = [];

  if (options?.select && options.select.length > 0) {
    parts.push(`$select=${options.select.join(',')}`);
  }

  if (options?.filter) {
    parts.push(`$filter=${encodeURIComponent(options.filter)}`);
  }

  if (options?.orderBy && options.orderBy.length > 0) {
    parts.push(`$orderby=${options.orderBy.join(',')}`);
  }

  if (options?.top) {
    parts.push(`$top=${options.top}`);
  }

  if (options?.skip) {
    parts.push(`$skip=${options.skip}`);
  }

  if (options?.skipToken) {
    parts.push(`$skiptoken=${options.skipToken}`);
  }

  return parts.join('&');
}

export class Cr8acCodeappstableService {
  /**
   * Create a new record
   */
  static async create(record: ICr8acCodeappsTableCreateRequest): Promise<IServiceResult<Cr8acCodeappstable>> {
    try {
      console.log('[Cr8acCodeappstableService] Creating record:', record);
      
      const client = await ensureInitialized();
      
      if (!client.createRecordAsync) {
        throw new Error('createRecordAsync method not available');
      }
      
      const response = await client.createRecordAsync('cr8ac_codeappstable', record);
      
      console.log('[Cr8acCodeappstableService] Created record:', response);
      
      return {
        data: response
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Create failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Retrieve a single record by ID
   */
  static async get(id: string, select?: string[]): Promise<IServiceResult<Cr8acCodeappstable>> {
    try {
      console.log('[Cr8acCodeappstableService] Getting record by ID:', id);
      
      const client = await ensureInitialized();
      
      if (!client.retrieveRecordAsync) {
        throw new Error('retrieveRecordAsync method not available');
      }
      
      const query = select && select.length > 0 ? `?$select=${select.join(',')}` : '';
      
      const response = await client.retrieveRecordAsync('cr8ac_codeappstable', id, query);
      
      console.log('[Cr8acCodeappstableService] Retrieved record:', response);
      
      return {
        data: response
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Get failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Retrieve all records with optional filters
   */
  static async getAll(options?: IGetAllOptions): Promise<IServiceResult<Cr8acCodeappstable[]>> {
    try {
      console.log('[Cr8acCodeappstableService] Getting all records with options:', options);
      
      const client = await ensureInitialized();
      
      if (!client.retrieveMultipleRecordsAsync) {
        throw new Error('retrieveMultipleRecordsAsync method not available');
      }
      
      const query = buildODataQuery(options);
      console.log('[Cr8acCodeappstableService] OData Query:', query);
      
      const response = await client.retrieveMultipleRecordsAsync(
        'cr8ac_codeappstable',
        query ? `?${query}` : ''
      );
      
      console.log('[Cr8acCodeappstableService] Full API response:', response);
      console.log('[Cr8acCodeappstableService] Retrieved records:', response?.entities?.length || 0);
      
      return {
        data: response?.entities || []
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] GetAll failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Update an existing record
   */
  static async update(id: string, record: Partial<ICr8acCodeappsTableCreateRequest>): Promise<IServiceResult<Cr8acCodeappstable>> {
    try {
      console.log('[Cr8acCodeappstableService] Updating record:', id, record);
      
      const client = await ensureInitialized();
      
      if (!client.updateRecordAsync) {
        throw new Error('updateRecordAsync method not available');
      }
      
      const response = await client.updateRecordAsync('cr8ac_codeappstable', id, record);
      
      console.log('[Cr8acCodeappstableService] Updated record:', response);
      
      return {
        data: response
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Update failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Delete a record
   */
  static async delete(id: string): Promise<IServiceResult<boolean>> {
    try {
      console.log('[Cr8acCodeappstableService] Deleting record:', id);
      
      const client = await ensureInitialized();
      
      if (!client.deleteRecordAsync) {
        throw new Error('deleteRecordAsync method not available');
      }
      
      await client.deleteRecordAsync('cr8ac_codeappstable', id);
      
      console.log('[Cr8acCodeappstableService] Deleted record successfully');
      
      return {
        data: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Delete failed:', errorMessage);
      return { error: errorMessage };
    }
  }
}

export default Cr8acCodeappstableService;
