/**
 * Dataverse Service using Microsoft Power Apps SDK
 * Provides CRUD operations for Dataverse entities with proper authentication
 */

import { getClient } from "@microsoft/power-apps/data";
import { getContext } from "@microsoft/power-apps/app";
import type { IContext } from "@microsoft/power-apps/app";

export interface DataverseUser {
  systemuserid?: string;
  fullname?: string;
  domainname?: string;
  internalemailaddress?: string;
  jobtitle?: string;
  businessunitid?: {
    name?: string;
  };
  isdisabled?: boolean;
  createdon?: string;
  modifiedon?: string;
}

export interface IDataverseQueryOptions {
  $select?: string;
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $expand?: string;
}

export interface IDataverseResult<T> {
  data?: T[];
  error?: string;
  totalRecords?: number;
}

/**
 * Mock Dataverse data for fallback
 */
const mockDataverseUsers: DataverseUser[] = [
  {
    systemuserid: '1',
    fullname: 'Simunye Radingwana',
    domainname: 'simunye.r@nanofiber.co.uk',
    internalemailaddress: 'simunye.r@nanofiber.co.uk',
    jobtitle: 'Developer',
    businessunitid: { name: 'NanoFiber Technologies' },
    isdisabled: false,
    createdon: '2024-01-15T10:00:00Z',
    modifiedon: '2025-10-29T12:00:00Z'
  },
  {
    systemuserid: '2',
    fullname: 'Stephan Theron',
    domainname: 'stephan.t@nanofiber.co.uk',
    internalemailaddress: 'stephan.t@nanofiber.co.uk',
    jobtitle: 'Manager',
    businessunitid: { name: 'NanoFiber Technologies' },
    isdisabled: false,
    createdon: '2024-01-10T09:00:00Z',
    modifiedon: '2025-10-29T11:30:00Z'
  },
  {
    systemuserid: '3',
    fullname: 'John Smith',
    domainname: 'john.smith@nanofiber.co.uk',
    internalemailaddress: 'john.smith@nanofiber.co.uk',
    jobtitle: 'Senior Developer',
    businessunitid: { name: 'NanoFiber Technologies' },
    isdisabled: false,
    createdon: '2024-02-01T08:00:00Z',
    modifiedon: '2025-10-28T16:45:00Z'
  },
  {
    systemuserid: '4',
    fullname: 'Sarah Johnson',
    domainname: 'sarah.j@nanofiber.co.uk',
    internalemailaddress: 'sarah.j@nanofiber.co.uk',
    jobtitle: 'Project Coordinator',
    businessunitid: { name: 'NanoFiber Technologies' },
    isdisabled: false,
    createdon: '2024-03-15T12:00:00Z',
    modifiedon: '2025-10-27T14:20:00Z'
  }
];

/**
 * Dataverse Service Class using Microsoft Power Apps SDK
 */
export class DataverseService {
  private static dataClient: any = null;
  private static context: IContext | null = null;

  /**
   * Initialize the Dataverse service
   */
  static async initialize(): Promise<void> {
    try {
      console.log('[DataverseService.initialize] Setting up Dataverse client...');
      
      // Get the Power Apps context
      this.context = await getContext();
      console.log('[DataverseService.initialize] Context retrieved:', this.context);

      // Initialize the data client with Dataverse entities
      this.dataClient = getClient({
        systemusers: {
          tableId: "systemuser",
          apis: {},
        },
        accounts: {
          tableId: "account", 
          apis: {},
        },
        contacts: {
          tableId: "contact",
          apis: {},
        }
      });

      console.log('[DataverseService.initialize] Data client initialized successfully');
    } catch (error) {
      console.error('[DataverseService.initialize] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Get all system users from Dataverse
   */
  static async getUsers(options: IDataverseQueryOptions = {}): Promise<IDataverseResult<DataverseUser>> {
    try {
      console.log('[DataverseService.getUsers] Fetching users with options:', options);

      if (!this.dataClient) {
        console.log('[DataverseService.getUsers] Data client not available, using mock data');
        return {
          data: mockDataverseUsers,
          totalRecords: mockDataverseUsers.length
        };
      }

      // Build query options
      const queryOptions = {
        $select: options.$select || 'systemuserid,fullname,domainname,internalemailaddress,jobtitle,isdisabled,createdon,modifiedon',
        $filter: options.$filter,
        $orderby: options.$orderby || 'fullname asc',
        $top: options.$top || 100,
        $skip: options.$skip || 0,
        $expand: options.$expand
      };

      console.log('[DataverseService.getUsers] Query options:', queryOptions);

      // Execute the query
      const result = await this.dataClient.retrieveMultipleRecordsAsync(
        "systemusers",
        queryOptions
      );

      console.log('[DataverseService.getUsers] Query result:', result);

      return {
        data: result.entities || [],
        totalRecords: result.totalRecordCount || 0
      };

    } catch (error) {
      console.error('[DataverseService.getUsers] Error fetching users:', error);
      
      // Fallback to mock data on error
      console.log('[DataverseService.getUsers] Falling back to mock data');
      return {
        data: mockDataverseUsers,
        totalRecords: mockDataverseUsers.length,
        error: `Dataverse unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get a single user by ID
   */
  static async getUser(userId: string, options: IDataverseQueryOptions = {}): Promise<IDataverseResult<DataverseUser>> {
    try {
      console.log('[DataverseService.getUser] Fetching user:', userId);

      if (!this.dataClient) {
        const mockUser = mockDataverseUsers.find(u => u.systemuserid === userId);
        return {
          data: mockUser ? [mockUser] : [],
          totalRecords: mockUser ? 1 : 0
        };
      }

      const queryOptions = {
        $select: options.$select || 'systemuserid,fullname,domainname,internalemailaddress,jobtitle,isdisabled,createdon,modifiedon',
        $expand: options.$expand
      };

      const result = await this.dataClient.retrieveRecordAsync(
        "systemusers",
        userId,
        queryOptions
      );

      return {
        data: result ? [result] : [],
        totalRecords: result ? 1 : 0
      };

    } catch (error) {
      console.error('[DataverseService.getUser] Error fetching user:', error);
      
      const mockUser = mockDataverseUsers.find(u => u.systemuserid === userId);
      return {
        data: mockUser ? [mockUser] : [],
        totalRecords: mockUser ? 1 : 0,
        error: `Dataverse unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(searchTerm: string, options: IDataverseQueryOptions = {}): Promise<IDataverseResult<DataverseUser>> {
    try {
      console.log('[DataverseService.searchUsers] Searching for:', searchTerm);

      const searchFilter = `contains(fullname,'${searchTerm}') or contains(internalemailaddress,'${searchTerm}') or contains(domainname,'${searchTerm}')`;
      
      return this.getUsers({
        ...options,
        $filter: options.$filter ? `(${options.$filter}) and (${searchFilter})` : searchFilter
      });

    } catch (error) {
      console.error('[DataverseService.searchUsers] Error searching users:', error);
      
      // Fallback search in mock data
      const searchLower = searchTerm.toLowerCase();
      const filteredUsers = mockDataverseUsers.filter(user => 
        user.fullname?.toLowerCase().includes(searchLower) ||
        user.internalemailaddress?.toLowerCase().includes(searchLower) ||
        user.domainname?.toLowerCase().includes(searchLower)
      );

      return {
        data: filteredUsers,
        totalRecords: filteredUsers.length,
        error: `Dataverse unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<IDataverseResult<DataverseUser>> {
    try {
      if (this.context?.user?.objectId) {
        return this.getUser(this.context.user.objectId);
      }
      
      // Fallback to first mock user
      return {
        data: [mockDataverseUsers[0]],
        totalRecords: 1
      };

    } catch (error) {
      console.error('[DataverseService.getCurrentUser] Error getting current user:', error);
      return {
        data: [mockDataverseUsers[0]],
        totalRecords: 1,
        error: `Dataverse unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get environment information
   */
  static getEnvironmentInfo() {
    return {
      environmentId: this.context?.app?.environmentId,
      appId: this.context?.app?.appId,
      userId: this.context?.user?.objectId,
      userPrincipalName: this.context?.user?.userPrincipalName,
      tenantId: this.context?.user?.tenantId
    };
  }
}

export default DataverseService;