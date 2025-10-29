/**
 * Generated Service for Office365Users
 * Provides CRUD operations for Office 365 Users
 */

import { initialize } from '@microsoft/power-apps/app';
import type { Office365UserRecord, Office365UserCollection } from '../models/Office365UsersModel';

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
    console.log('[Office365UsersService] Using cached Power Apps instance');
    return powerAppsInstance;
  }

  // Prevent multiple concurrent initialization attempts
  if (initPromise) {
    console.log('[Office365UsersService] Waiting for initialization in progress...');
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      console.log('[Office365UsersService] Initializing Power Apps...');
      powerAppsInstance = await initialize();
      console.log('[Office365UsersService] Power Apps initialized successfully');
      return powerAppsInstance;
    } catch (error) {
      console.error('[Office365UsersService] Power Apps initialization failed:', error);
      initPromise = null; // Reset to allow retry
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Office 365 Users Service Class
 */
export class Office365UsersService {
  private static connectionId = '4361a4de3ed842908c159e1023fe34b9';
  
  /**
   * Get all Office 365 users
   */
  static async getAll(options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[Office365UsersService.getAll] Starting request with options:', options);
      
      const powerApps = await ensureInitialized();
      
      if (!powerApps?.connector) {
        throw new Error('Power Apps connector not available');
      }

      // Build OData query parameters
      const queryParams: Record<string, string> = {};
      
      if (options.select && options.select.length > 0) {
        queryParams['$select'] = options.select.join(',');
      }
      
      if (options.filter) {
        queryParams['$filter'] = options.filter;
      }
      
      if (options.orderBy && options.orderBy.length > 0) {
        queryParams['$orderby'] = options.orderBy.join(',');
      }
      
      if (options.top) {
        queryParams['$top'] = options.top.toString();
      }
      
      if (options.skip) {
        queryParams['$skip'] = options.skip.toString();
      }

      console.log('[Office365UsersService.getAll] Query parameters:', queryParams);

      // Make the API call to Office 365 Users
      const result = await powerApps.connector.invokeMethod({
        connectorId: 'shared_office365users',
        connectionId: this.connectionId,
        operationId: 'GetUsers',
        parameters: queryParams
      });

      console.log('[Office365UsersService.getAll] Raw result:', result);

      if (!result || result.error) {
        throw new Error(`API call failed: ${result?.error || 'Unknown error'}`);
      }

      return {
        data: result.data as Office365UserCollection
      };

    } catch (error) {
      console.error('[Office365UsersService.getAll] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get a specific Office 365 user by ID
   */
  static async getById(userId: string): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[Office365UsersService.getById] Starting request for user ID:', userId);
      
      const powerApps = await ensureInitialized();
      
      if (!powerApps?.connector) {
        throw new Error('Power Apps connector not available');
      }

      const result = await powerApps.connector.invokeMethod({
        connectorId: 'shared_office365users',
        connectionId: this.connectionId,
        operationId: 'GetUser',
        parameters: {
          userId: userId
        }
      });

      console.log('[Office365UsersService.getById] Raw result:', result);

      if (!result || result.error) {
        throw new Error(`API call failed: ${result?.error || 'Unknown error'}`);
      }

      return {
        data: result.data as Office365UserRecord
      };

    } catch (error) {
      console.error('[Office365UsersService.getById] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Search Office 365 users
   */
  static async searchUsers(searchTerm: string, options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[Office365UsersService.searchUsers] Starting search with term:', searchTerm);
      
      // Build search filter
      const searchFilter = `startswith(displayName,'${searchTerm}') or startswith(givenName,'${searchTerm}') or startswith(surname,'${searchTerm}') or startswith(mail,'${searchTerm}')`;
      
      return await this.getAll({
        ...options,
        filter: options.filter ? `(${options.filter}) and (${searchFilter})` : searchFilter
      });

    } catch (error) {
      console.error('[Office365UsersService.searchUsers] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[Office365UsersService.getCurrentUser] Starting request');
      
      const powerApps = await ensureInitialized();
      
      if (!powerApps?.connector) {
        throw new Error('Power Apps connector not available');
      }

      const result = await powerApps.connector.invokeMethod({
        connectorId: 'shared_office365users',
        connectionId: this.connectionId,
        operationId: 'GetCurrentUser',
        parameters: {}
      });

      console.log('[Office365UsersService.getCurrentUser] Raw result:', result);

      if (!result || result.error) {
        throw new Error(`API call failed: ${result?.error || 'Unknown error'}`);
      }

      return {
        data: result.data as Office365UserRecord
      };

    } catch (error) {
      console.error('[Office365UsersService.getCurrentUser] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default Office365UsersService;