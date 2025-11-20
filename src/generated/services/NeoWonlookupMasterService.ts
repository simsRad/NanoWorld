/**
 * Generated Service for neo_wonlookup_master
 * Provides CRUD operations for the Dataverse table
 */

import { initialize, getContext } from '@microsoft/power-apps/app';
import { getClient } from '@microsoft/power-apps/data';
import type { 
  NeoWonlookupMaster, 
  INeoWonlookupMasterCreateRequest,
  INeoWonlookupMasterUpdateRequest
} from '../models/NeoWonlookupMasterModel';

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
    console.log('[NeoWonlookupMasterService] Using cached data client');
    return dataClient;
  }

  // Prevent multiple concurrent initialization attempts
  if (initPromise) {
    console.log('[NeoWonlookupMasterService] Waiting for initialization in progress...');
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      console.log('[NeoWonlookupMasterService] Initializing Power Apps SDK...');
      
      // Initialize the SDK
      await initialize();
      console.log('[NeoWonlookupMasterService] SDK initialized, getting context...');
      
      // Get context (required before getting data client)
      await getContext();
      console.log('[NeoWonlookupMasterService] Context retrieved, getting data client...');
      
      // Get data client - pass empty config to get generic client with CRUD methods
      const client = getClient({});
      
      if (!client) {
        throw new Error('Failed to initialize Power Apps data client');
      }
      
      dataClient = client;
      console.log('[NeoWonlookupMasterService] Successfully initialized');
      console.log('[NeoWonlookupMasterService] Available client methods:', Object.keys(client));
      
      return dataClient;
    } catch (error) {
      console.error('[NeoWonlookupMasterService] Initialization failed:', error);
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

/**
 * Get all records from neo_wonlookup_master table
 */
export async function getAllNeoWonlookupMaster(options?: IGetAllOptions): Promise<IServiceResult<NeoWonlookupMaster[]>> {
  try {
    console.log('[NeoWonlookupMasterService] Getting all records with options:', options);
    
    const client = await ensureInitialized();
    
    if (!client.retrieveMultipleRecordsAsync) {
      throw new Error('retrieveMultipleRecordsAsync method not available');
    }
    
    // Build the query
    const query = buildODataQuery(options);
    console.log('[NeoWonlookupMasterService] OData Query:', query);
    
      // Build the full WebAPI URL for Dataverse
      const queryString = query ? `?${query}` : '';
      
      console.log('[NeoWonlookupMasterService] Using retrieveMultipleRecordsAsync with table: neo_wonlookup_master');
      
      const response = await client.retrieveMultipleRecordsAsync(
        'neo_wonlookup_master',
        queryString
      );
      
      console.log('[NeoWonlookupMasterService] Full API response:', response);
      console.log('[NeoWonlookupMasterService] Retrieved records:', response?.entities?.length || 0);
      
      return {
        data: response?.entities || []
      };  } catch (error) {
    console.error('[NeoWonlookupMasterService] Error getting all records:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get a single record by ID from neo_wonlookup_master table
 */
export async function getNeoWonlookupMasterById(id: string, select?: string[]): Promise<IServiceResult<NeoWonlookupMaster>> {
  try {
    console.log('[NeoWonlookupMasterService] Getting record by ID:', id);
    
    const client = await ensureInitialized();
    
    if (!client.retrieveRecordAsync) {
      throw new Error('retrieveRecordAsync method not available');
    }
    
    const query = select && select.length > 0 ? `?$select=${select.join(',')}` : '';
    
    // Call retrieveRecordAsync with table name, record ID, and optional query
    const response = await client.retrieveRecordAsync(
      'neo_wonlookup_master',
      id,
      query
    );
    
    console.log('[NeoWonlookupMasterService] Retrieved record:', response);
    
    return {
      data: response
    };
    
  } catch (error) {
    console.error('[NeoWonlookupMasterService] Error getting record by ID:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Create a new record in neo_wonlookup_master table
 */
export async function createNeoWonlookupMaster(record: INeoWonlookupMasterCreateRequest): Promise<IServiceResult<NeoWonlookupMaster>> {
  try {
    console.log('[NeoWonlookupMasterService] Creating record:', record);
    
    const client = await ensureInitialized();
    
    if (!client.createRecordAsync) {
      throw new Error('createRecordAsync method not available');
    }
    
    // Call createRecordAsync with table name and record data
    const response = await client.createRecordAsync(
      'neo_wonlookup_master',
      record
    );
    
    console.log('[NeoWonlookupMasterService] Created record:', response);
    
    return {
      data: response
    };
    
  } catch (error) {
    console.error('[NeoWonlookupMasterService] Error creating record:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Update a record in neo_wonlookup_master table
 */
export async function updateNeoWonlookupMaster(id: string, record: INeoWonlookupMasterUpdateRequest): Promise<IServiceResult<NeoWonlookupMaster>> {
  try {
    console.log('[NeoWonlookupMasterService] Updating record:', id, record);
    
    const client = await ensureInitialized();
    
    if (!client.updateRecordAsync) {
      throw new Error('updateRecordAsync method not available');
    }
    
    // Call updateRecordAsync with table name, record ID, and updates
    const response = await client.updateRecordAsync(
      'neo_wonlookup_master',
      id,
      record
    );
    
    console.log('[NeoWonlookupMasterService] Updated record:', response);
    
    return {
      data: response
    };
    
  } catch (error) {
    console.error('[NeoWonlookupMasterService] Error updating record:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Delete a record from neo_wonlookup_master table
 */
export async function deleteNeoWonlookupMaster(id: string): Promise<IServiceResult<boolean>> {
  try {
    console.log('[NeoWonlookupMasterService] Deleting record:', id);
    
    const client = await ensureInitialized();
    
    if (!client.deleteRecordAsync) {
      throw new Error('deleteRecordAsync method not available');
    }
    
    // Call deleteRecordAsync with table name and record ID
    await client.deleteRecordAsync(
      'neo_wonlookup_master',
      id
    );
    
    console.log('[NeoWonlookupMasterService] Deleted record successfully');
    
    return {
      data: true
    };
    
  } catch (error) {
    console.error('[NeoWonlookupMasterService] Error deleting record:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Filter records from neo_wonlookup_master table by category
 */
export async function getNeoWonlookupMasterByCategory(category: string): Promise<IServiceResult<NeoWonlookupMaster[]>> {
  return getAllNeoWonlookupMaster({
    filter: `neo_category eq '${category}'`,
    orderBy: ['neo_sortorder', 'neo_name']
  });
}

/**
 * Get active records from neo_wonlookup_master table
 */
export async function getActiveNeoWonlookupMaster(): Promise<IServiceResult<NeoWonlookupMaster[]>> {
  return getAllNeoWonlookupMaster({
    filter: 'neo_isactive eq true',
    orderBy: ['neo_sortorder', 'neo_name']
  });
}

/**
 * Search records from neo_wonlookup_master table by name or description
 */
export async function searchNeoWonlookupMaster(searchTerm: string): Promise<IServiceResult<NeoWonlookupMaster[]>> {
  const filter = `contains(neo_name,'${searchTerm}') or contains(neo_description,'${searchTerm}')`;
  return getAllNeoWonlookupMaster({
    filter,
    orderBy: ['neo_name']
  });
}