/**
 * Generated Service for Office365Users
 * Provides CRUD operations for Office 365 Users with fallback mock data
 */

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

/**
 * Mock Office 365 users data for fallback
 */
const mockOffice365Users: Office365UserRecord[] = [
  {
    id: '1',
    displayName: 'Simunye Radingwana',
    givenName: 'Simunye',
    surname: 'Radingwana',
    mail: 'simunye.r@nanofiber.co.uk',
    userPrincipalName: 'simunye.r@nanofiber.co.uk',
    jobTitle: 'Developer',
    department: 'IT',
    officeLocation: 'London',
    businessPhones: ['+44 20 1234 5678'],
    mobilePhone: '+44 7700 900123',
    accountEnabled: true
  },
  {
    id: '2',
    displayName: 'Stephan Theron',
    givenName: 'Stephan',
    surname: 'Theron',
    mail: 'stephan.t@nanofiber.co.uk',
    userPrincipalName: 'stephan.t@nanofiber.co.uk',
    jobTitle: 'Manager',
    department: 'IT',
    officeLocation: 'London',
    businessPhones: ['+44 20 1234 5679'],
    mobilePhone: '+44 7700 900124',
    accountEnabled: true
  },
  {
    id: '3',
    displayName: 'John Smith',
    givenName: 'John',
    surname: 'Smith',
    mail: 'john.smith@nanofiber.co.uk',
    userPrincipalName: 'john.smith@nanofiber.co.uk',
    jobTitle: 'Senior Developer',
    department: 'Engineering',
    officeLocation: 'Manchester',
    businessPhones: ['+44 161 1234 5678'],
    mobilePhone: '+44 7700 900125',
    accountEnabled: true
  },
  {
    id: '4',
    displayName: 'Sarah Johnson',
    givenName: 'Sarah',
    surname: 'Johnson',
    mail: 'sarah.johnson@nanofiber.co.uk',
    userPrincipalName: 'sarah.johnson@nanofiber.co.uk',
    jobTitle: 'Project Manager',
    department: 'Operations',
    officeLocation: 'Birmingham',
    businessPhones: ['+44 121 1234 5678'],
    mobilePhone: '+44 7700 900126',
    accountEnabled: true
  },
  {
    id: '5',
    displayName: 'Mike Wilson',
    givenName: 'Mike',
    surname: 'Wilson',
    mail: 'mike.wilson@nanofiber.co.uk',
    userPrincipalName: 'mike.wilson@nanofiber.co.uk',
    jobTitle: 'Field Engineer',
    department: 'Field Operations',
    officeLocation: 'Liverpool',
    businessPhones: ['+44 151 1234 5678'],
    mobilePhone: '+44 7700 900127',
    accountEnabled: true
  }
];

/**
 * Office 365 Users Service Class
 */
export class Office365UsersService {
  /**
   * Get all Office 365 users (returns mock data for now)
   */
  static async getAll(options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[Office365UsersService.getAll] Using mock data');
      
      // Apply filtering if specified
      let filteredUsers = [...mockOffice365Users];
      
      // Apply top limit if specified
      if (options.top) {
        filteredUsers = filteredUsers.slice(0, options.top);
      }
      
      // Apply skip if specified
      if (options.skip) {
        filteredUsers = filteredUsers.slice(options.skip);
      }

      const result: Office365UserCollection = {
        value: filteredUsers,
        '@odata.count': mockOffice365Users.length
      };

      return { data: result };

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
      
      const user = mockOffice365Users.find(u => u.id === userId);
      
      if (!user) {
        return {
          error: `User with ID ${userId} not found`
        };
      }

      return { data: user };

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
      
      const searchLower = searchTerm.toLowerCase();
      const filteredUsers = mockOffice365Users.filter(user => 
        (user.displayName?.toLowerCase().includes(searchLower)) ||
        (user.givenName?.toLowerCase().includes(searchLower)) ||
        (user.surname?.toLowerCase().includes(searchLower)) ||
        (user.mail?.toLowerCase().includes(searchLower)) ||
        (user.jobTitle?.toLowerCase().includes(searchLower)) ||
        (user.department?.toLowerCase().includes(searchLower))
      );

      // Apply top limit if specified
      let resultUsers = filteredUsers;
      if (options.top) {
        resultUsers = resultUsers.slice(0, options.top);
      }

      const result: Office365UserCollection = {
        value: resultUsers,
        '@odata.count': filteredUsers.length
      };

      return { data: result };

    } catch (error) {
      console.error('[Office365UsersService.searchUsers] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get current user profile (returns Simunye's profile as default)
   */
  static async getCurrentUser(): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[Office365UsersService.getCurrentUser] Starting request');
      
      // Return Simunye's profile as the current user
      const currentUser = mockOffice365Users[0];
      
      return { data: currentUser };

    } catch (error) {
      console.error('[Office365UsersService.getCurrentUser] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default Office365UsersService;