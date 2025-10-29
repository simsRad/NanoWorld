/**
 * Generated Service for cr8ac_codeappstable
 * Provides CRUD operations for the Dataverse table
 */

import { initialize } from '@microsoft/power-apps/app';
import type { Cr8acCodeappstable, ICr8acCodeappsTableCreateRequest, Cr8acCodeappstableRecord } from '../models/Cr8acCodeappstableModel';

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

let powerAppsInstance: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Initialize Power Apps if not already initialized
 */
async function ensureInitialized() {
  // Return cached instance if already initialized
  if (powerAppsInstance) {
    console.log('[Cr8acCodeappstableService] Using cached Power Apps instance');
    return powerAppsInstance;
  }

  // Prevent multiple concurrent initialization attempts
  if (initPromise) {
    console.log('[Cr8acCodeappstableService] Waiting for initialization in progress...');
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      console.log('[Cr8acCodeappstableService] Initializing Power Apps...');
      powerAppsInstance = await initialize();
      console.log('[Cr8acCodeappstableService] Power Apps initialized successfully');
      return powerAppsInstance;
    } catch (error) {
      console.error('[Cr8acCodeappstableService] Failed to initialize Power Apps:', error);
      powerAppsInstance = null;
      initPromise = null;
      throw new Error(`Failed to initialize Power Apps SDK: ${error instanceof Error ? error.message : String(error)}`);
    }
  })();

  return initPromise;
}

/**
 * Build OData query string
 */
function buildODataQuery(options?: IGetAllOptions): string {
  let query = '';

  if (options?.select && options.select.length > 0) {
    query += `$select=${options.select.join(',')}`;
  }

  if (options?.filter) {
    query += `${query ? '&' : ''}$filter=${encodeURIComponent(options.filter)}`;
  }

  if (options?.orderBy && options.orderBy.length > 0) {
    query += `${query ? '&' : ''}$orderby=${options.orderBy.join(',')}`;
  }

  if (options?.top) {
    query += `${query ? '&' : ''}$top=${options.top}`;
  }

  if (options?.skip) {
    query += `${query ? '&' : ''}$skip=${options.skip}`;
  }

  if (options?.skipToken) {
    query += `${query ? '&' : ''}$skiptoken=${options.skipToken}`;
  }

  return query;
}

export class Cr8acCodeappstableService {
  /**
   * Create a new record
   */
  static async create(record: ICr8acCodeappsTableCreateRequest): Promise<IServiceResult<Cr8acCodeappstable>> {
    try {
      const powerApps = await ensureInitialized();
      
      console.log('[Cr8acCodeappstableService] Creating record...');
      const table = powerApps.data.createTable('cr8ac_codeappstable');
      
      const result = await table.createRecord(record);
      
      if (result?.data) {
        console.log('[Cr8acCodeappstableService] Record created successfully:', result.data);
        return { data: result.data };
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Create failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Retrieve a single record by ID
   */
  static async get(id: string, options?: IGetAllOptions): Promise<IServiceResult<Cr8acCodeappstable>> {
    try {
      const powerApps = await ensureInitialized();
      
      const table = powerApps.data.createTable('cr8ac_codeappstable');
      console.log('[Cr8acCodeappstableService] Retrieving record:', id);
      
      const queryParams = buildODataQuery(options);
      const result = await table.retrieveRecord(id, queryParams ? { query: queryParams } : undefined);
      
      if (result?.data) {
        console.log('[Cr8acCodeappstableService] Record retrieved successfully');
        return { data: result.data };
      }
      
      throw new Error('Record not found');
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
      const powerApps = await ensureInitialized();
      
      const table = powerApps.data.createTable('cr8ac_codeappstable');
      const queryParams = buildODataQuery(options);
      
      console.log('[Cr8acCodeappstableService] Retrieving all records...');
      const result = await table.retrieveMultipleRecords(
        queryParams ? { query: queryParams } : undefined
      );
      
      if (result?.data) {
        console.log(`[Cr8acCodeappstableService] Retrieved ${result.data.length} records`);
        return { data: result.data };
      }
      
      throw new Error('No data returned');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] GetAll failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Update a record
   */
  static async update(id: string, record: Partial<Cr8acCodeappstableRecord>): Promise<IServiceResult<void>> {
    try {
      const powerApps = await ensureInitialized();
      
      const table = powerApps.data.createTable('cr8ac_codeappstable');
      console.log('[Cr8acCodeappstableService] Updating record:', id);
      
      await table.updateRecord(id, record);
      
      console.log('[Cr8acCodeappstableService] Record updated successfully');
      return { data: undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Update failed:', errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Delete a record
   */
  static async delete(id: string): Promise<IServiceResult<void>> {
    try {
      const powerApps = await ensureInitialized();
      
      const table = powerApps.data.createTable('cr8ac_codeappstable');
      console.log('[Cr8acCodeappstableService] Deleting record:', id);
      
      await table.deleteRecord(id);
      
      console.log('[Cr8acCodeappstableService] Record deleted successfully');
      return { data: undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Cr8acCodeappstableService] Delete failed:', errorMessage);
      return { error: errorMessage };
    }
  }
}

export default Cr8acCodeappstableService;
