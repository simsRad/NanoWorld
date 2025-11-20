import type { Office365UserRecord, Office365UserCollection } from '../generated/models/Office365UsersModel';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';
import { getClient } from '@microsoft/power-apps/data';

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

// Helper function to convert API errors to strings
const getErrorMessage = (error: any): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
};

/**
 * Real Office 365 Users Service that connects to Microsoft Graph API via Power Platform
 */
export class RealOffice365UsersService {
  private static readonly dataSourceName = 'office365users';
  private static readonly client = getClient(dataSourcesInfo);

  /**
   * Get all Office 365 users from Microsoft Graph API
   */
  static async getAll(options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[RealOffice365UsersService.getAll] Fetching users from Office 365...');
      
      // Build query parameters
      const params: any = {};
      
      if (options.top) {
        params.$top = options.top;
      }
      
      if (options.skip) {
        params.$skip = options.skip;
      }
      
      if (options.filter) {
        params.$filter = options.filter;
      }
      
      if (options.orderBy && options.orderBy.length > 0) {
        params.$orderby = options.orderBy.join(',');
      }
      
      if (options.select && options.select.length > 0) {
        params.$select = options.select.join(',');
      }

      const result = await RealOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: RealOffice365UsersService.dataSourceName,
            operationName: 'GetUsers',
            parameters: params
          },
        }
      );

      console.log('[RealOffice365UsersService.getAll] API result:', result);

      if (result.error) {
        return {
          error: getErrorMessage(result.error)
        };
      }

      // Transform the result to match our expected format
      const users: Office365UserRecord[] = Array.isArray(result.data?.value) 
        ? result.data.value.map((user: any) => ({
            id: user.id,
            displayName: user.displayName,
            givenName: user.givenName,
            surname: user.surname,
            mail: user.mail,
            userPrincipalName: user.userPrincipalName,
            jobTitle: user.jobTitle,
            department: user.department,
            officeLocation: user.officeLocation,
            businessPhones: user.businessPhones,
            mobilePhone: user.mobilePhone,
            accountEnabled: user.accountEnabled,
            createdDateTime: user.createdDateTime,
            lastSignInDateTime: user.lastSignInDateTime
          }))
        : [];

      const collection: Office365UserCollection = {
        value: users,
        '@odata.count': result.data?.['@odata.count'] || users.length,
        '@odata.nextLink': result.data?.['@odata.nextLink']
      };

      return { data: collection };

    } catch (error) {
      console.error('[RealOffice365UsersService.getAll] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch Office 365 users'
      };
    }
  }

  /**
   * Get a specific Office 365 user by ID
   */
  static async getById(userId: string): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[RealOffice365UsersService.getById] Fetching user:', userId);
      
      const result = await RealOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: RealOffice365UsersService.dataSourceName,
            operationName: 'GetUser',
            parameters: { id: userId }
          },
        }
      );

      if (result.error) {
        return {
          error: getErrorMessage(result.error)
        };
      }

      const user: Office365UserRecord = {
        id: result.data.id,
        displayName: result.data.displayName,
        givenName: result.data.givenName,
        surname: result.data.surname,
        mail: result.data.mail,
        userPrincipalName: result.data.userPrincipalName,
        jobTitle: result.data.jobTitle,
        department: result.data.department,
        officeLocation: result.data.officeLocation,
        businessPhones: result.data.businessPhones,
        mobilePhone: result.data.mobilePhone,
        accountEnabled: result.data.accountEnabled,
        createdDateTime: result.data.createdDateTime,
        lastSignInDateTime: result.data.lastSignInDateTime
      };

      return { data: user };

    } catch (error) {
      console.error('[RealOffice365UsersService.getById] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[RealOffice365UsersService.getCurrentUser] Fetching current user...');
      
      const result = await RealOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: RealOffice365UsersService.dataSourceName,
            operationName: 'MyProfile',
            parameters: {}
          },
        }
      );

      if (result.error) {
        return {
          error: getErrorMessage(result.error)
        };
      }

      const user: Office365UserRecord = {
        id: result.data.id,
        displayName: result.data.displayName,
        givenName: result.data.givenName,
        surname: result.data.surname,
        mail: result.data.mail,
        userPrincipalName: result.data.userPrincipalName,
        jobTitle: result.data.jobTitle,
        department: result.data.department,
        officeLocation: result.data.officeLocation,
        businessPhones: result.data.businessPhones,
        mobilePhone: result.data.mobilePhone,
        accountEnabled: result.data.accountEnabled,
        createdDateTime: result.data.createdDateTime,
        lastSignInDateTime: result.data.lastSignInDateTime
      };

      return { data: user };

    } catch (error) {
      console.error('[RealOffice365UsersService.getCurrentUser] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch current user'
      };
    }
  }

  /**
   * Search Office 365 users
   */
  static async searchUsers(searchTerm: string, options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[RealOffice365UsersService.searchUsers] Searching for:', searchTerm);
      
      // Build search filter
      let filter = '';
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim();
        filter = `startswith(displayName,'${term}') or startswith(givenName,'${term}') or startswith(surname,'${term}') or startswith(mail,'${term}') or startswith(userPrincipalName,'${term}')`;
      }
      
      // Combine with any existing filter
      if (options.filter) {
        filter = filter ? `(${filter}) and (${options.filter})` : options.filter;
      }
      
      const searchOptions = {
        ...options,
        filter: filter
      };

      return await RealOffice365UsersService.getAll(searchOptions);

    } catch (error) {
      console.error('[RealOffice365UsersService.searchUsers] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to search users'
      };
    }
  }
}

export default RealOffice365UsersService;
