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

/**
 * Real Office 365 Users Service using Microsoft Graph API
 */
export class GraphOffice365UsersService {
  private static readonly dataSourceName = 'office365users';
  private static readonly client = getClient(dataSourcesInfo);

  /**
   * Get all Office 365 users from Microsoft Graph API
   */
  static async getAll(options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[GraphOffice365UsersService.getAll] Fetching users from Microsoft Graph...');
      
      // Use the Office 365 Users connector operations
      const result = await GraphOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: GraphOffice365UsersService.dataSourceName,
            operationName: 'GetUsers_V2',
            parameters: {
              '$top': options.top || 50,
              '$select': options.select?.join(',') || 'id,displayName,givenName,surname,mail,userPrincipalName,jobTitle,department,officeLocation,accountEnabled,businessPhones,mobilePhone'
            }
          },
        }
      );

      console.log('[GraphOffice365UsersService.getAll] Graph API result:', result);

      if (result.error) {
        return {
          error: result.error instanceof Error ? result.error.message : String(result.error)
        };
      }

      // Transform Microsoft Graph response to our format
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
            accountEnabled: user.accountEnabled
          }))
        : [];

      const collection: Office365UserCollection = {
        value: users,
        '@odata.count': result.data?.['@odata.count'] || users.length,
        '@odata.nextLink': result.data?.['@odata.nextLink']
      };

      return { data: collection };

    } catch (error) {
      console.error('[GraphOffice365UsersService.getAll] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch Office 365 users from Microsoft Graph'
      };
    }
  }

  /**
   * Get current user profile from Microsoft Graph
   */
  static async getCurrentUser(): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[GraphOffice365UsersService.getCurrentUser] Fetching current user from Microsoft Graph...');
      
      const result = await GraphOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: GraphOffice365UsersService.dataSourceName,
            operationName: 'MyProfile_V2',
            parameters: {}
          },
        }
      );

      if (result.error) {
        return {
          error: result.error instanceof Error ? result.error.message : String(result.error)
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
        accountEnabled: result.data.accountEnabled
      };

      return { data: user };

    } catch (error) {
      console.error('[GraphOffice365UsersService.getCurrentUser] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch current user from Microsoft Graph'
      };
    }
  }

  /**
   * Search Office 365 users in Microsoft Graph
   */
  static async searchUsers(searchTerm: string, options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[GraphOffice365UsersService.searchUsers] Searching Microsoft Graph for:', searchTerm);
      
      // Build Microsoft Graph search filter
      let searchFilter = '';
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim().replace(/'/g, "''"); // Escape single quotes for OData
        searchFilter = `startswith(displayName,'${term}') or startswith(givenName,'${term}') or startswith(surname,'${term}') or startswith(mail,'${term}')`;
      }

      const result = await GraphOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: GraphOffice365UsersService.dataSourceName,
            operationName: 'SearchUser_V2',
            parameters: {
              'searchTerm': searchTerm,
              '$top': options.top || 20,
              '$filter': searchFilter
            }
          },
        }
      );

      if (result.error) {
        return {
          error: result.error instanceof Error ? result.error.message : String(result.error)
        };
      }

      // Transform search results
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
            accountEnabled: user.accountEnabled
          }))
        : [];

      const collection: Office365UserCollection = {
        value: users,
        '@odata.count': result.data?.['@odata.count'] || users.length
      };

      return { data: collection };

    } catch (error) {
      console.error('[GraphOffice365UsersService.searchUsers] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to search Office 365 users in Microsoft Graph'
      };
    }
  }

  /**
   * Get a specific user by ID from Microsoft Graph
   */
  static async getById(userId: string): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[GraphOffice365UsersService.getById] Fetching user from Microsoft Graph:', userId);
      
      const result = await GraphOffice365UsersService.client.executeAsync<any, any>(
        {
          connectorOperation: {
            tableName: GraphOffice365UsersService.dataSourceName,
            operationName: 'UserProfile_V2',
            parameters: {
              'id': userId
            }
          },
        }
      );

      if (result.error) {
        return {
          error: result.error instanceof Error ? result.error.message : String(result.error)
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
        accountEnabled: result.data.accountEnabled
      };

      return { data: user };

    } catch (error) {
      console.error('[GraphOffice365UsersService.getById] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch user from Microsoft Graph'
      };
    }
  }
}

export default GraphOffice365UsersService;