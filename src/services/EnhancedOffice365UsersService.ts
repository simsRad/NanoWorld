import type { Office365UserRecord, Office365UserCollection } from '../generated/models/Office365UsersModel';

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
 * Enhanced mock Office 365 users data that matches your real organization structure
 */
const enhancedMockOffice365Users: Office365UserRecord[] = [
  {
    id: '1',
    displayName: 'Aiden Buck',
    givenName: 'Aiden',
    surname: 'Buck',
    mail: 'aiden.b@nanofibre.co.uk',
    userPrincipalName: 'aiden.b@nanofibre.co.uk',
    jobTitle: 'Senior Engineer',
    department: 'Engineering',
    officeLocation: 'London',
    businessPhones: ['+44 20 1234 5678'],
    mobilePhone: '+44 7700 900123',
    accountEnabled: true
  },
  {
    id: '2',
    displayName: 'Furtenji Sherpa',
    givenName: 'Furtenji',
    surname: 'Sherpa',
    mail: 'furtenji.s@nanofibre.co.uk',
    userPrincipalName: 'furtenji.s@nanofibre.co.uk',
    jobTitle: 'Project Manager',
    department: 'Operations',
    officeLocation: 'Manchester',
    businessPhones: ['+44 161 1234 5678'],
    mobilePhone: '+44 7700 900124',
    accountEnabled: false // Ex-Employee
  },
  {
    id: '3',
    displayName: 'Charlie Lewis Green',
    givenName: 'Charlie Lewis',
    surname: 'Green',
    mail: 'charlie.g@nanofibre.co.uk',
    userPrincipalName: 'charlie.g@nanofibre.co.uk',
    jobTitle: 'Field Engineer',
    department: 'Field Operations',
    officeLocation: 'Birmingham',
    businessPhones: ['+44 121 1234 5678'],
    mobilePhone: '+44 7700 900125',
    accountEnabled: true
  },
  {
    id: '4',
    displayName: 'Robert Bradley',
    givenName: 'Robert',
    surname: 'Bradley',
    mail: 'robert.b@nanofibre.co.uk',
    userPrincipalName: 'robert.b@nanofibre.co.uk',
    jobTitle: 'Senior Technician',
    department: 'Technical Services',
    officeLocation: 'Liverpool',
    businessPhones: ['+44 151 1234 5678'],
    mobilePhone: '+44 7700 900126',
    accountEnabled: true
  },
  {
    id: '5',
    displayName: 'Tyron Mudau',
    givenName: 'Tyron',
    surname: 'Mudau',
    mail: 'tyron.m@nanofibre.co.uk',
    userPrincipalName: 'tyron.m@nanofibre.co.uk',
    jobTitle: 'Network Specialist',
    department: 'IT Infrastructure',
    officeLocation: 'Leeds',
    businessPhones: ['+44 113 1234 5678'],
    mobilePhone: '+44 7700 900127',
    accountEnabled: true
  },
  {
    id: '6',
    displayName: 'Simunye Radingwana',
    givenName: 'Simunye',
    surname: 'Radingwana',
    mail: 'simunye.r@nanofibre.co.uk',
    userPrincipalName: 'simunye.r@nanofibre.co.uk',
    jobTitle: 'Senior Developer',
    department: 'IT Development',
    officeLocation: 'London',
    businessPhones: ['+44 20 1234 5679'],
    mobilePhone: '+44 7700 900128',
    accountEnabled: true
  },
  {
    id: '7',
    displayName: 'Sarah Johnson',
    givenName: 'Sarah',
    surname: 'Johnson',
    mail: 'sarah.j@nanofibre.co.uk',
    userPrincipalName: 'sarah.j@nanofibre.co.uk',
    jobTitle: 'Operations Manager',
    department: 'Operations',
    officeLocation: 'Manchester',
    businessPhones: ['+44 161 1234 5679'],
    mobilePhone: '+44 7700 900129',
    accountEnabled: true
  },
  {
    id: '8',
    displayName: 'Mike Wilson',
    givenName: 'Mike',
    surname: 'Wilson',
    mail: 'mike.w@nanofibre.co.uk',
    userPrincipalName: 'mike.w@nanofibre.co.uk',
    jobTitle: 'Field Engineer',
    department: 'Field Operations',
    officeLocation: 'Birmingham',
    businessPhones: ['+44 121 1234 5679'],
    mobilePhone: '+44 7700 900130',
    accountEnabled: true
  }
];

/**
 * Enhanced Office 365 Users Service with realistic mock data
 */
export class EnhancedOffice365UsersService {
  /**
   * Get all Office 365 users with realistic data
   */
  static async getAll(options: IGetAllOptions = {}): Promise<IServiceResult<Office365UserCollection>> {
    try {
      console.log('[EnhancedOffice365UsersService.getAll] Loading enhanced user data');
      
      // Apply filtering if specified
      let filteredUsers = [...enhancedMockOffice365Users];
      
      // Apply search filter if provided
      if (options.filter) {
        const searchTerm = options.filter.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          (user.displayName?.toLowerCase().includes(searchTerm)) ||
          (user.givenName?.toLowerCase().includes(searchTerm)) ||
          (user.surname?.toLowerCase().includes(searchTerm)) ||
          (user.mail?.toLowerCase().includes(searchTerm)) ||
          (user.jobTitle?.toLowerCase().includes(searchTerm)) ||
          (user.department?.toLowerCase().includes(searchTerm)) ||
          (user.officeLocation?.toLowerCase().includes(searchTerm))
        );
      }
      
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
        '@odata.count': enhancedMockOffice365Users.length
      };

      return { data: result };

    } catch (error) {
      console.error('[EnhancedOffice365UsersService.getAll] Error:', error);
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
      console.log('[EnhancedOffice365UsersService.getById] Fetching user:', userId);
      
      const user = enhancedMockOffice365Users.find(u => u.id === userId);
      
      if (!user) {
        return {
          error: `User with ID ${userId} not found`
        };
      }

      return { data: user };

    } catch (error) {
      console.error('[EnhancedOffice365UsersService.getById] Error:', error);
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
      console.log('[EnhancedOffice365UsersService.searchUsers] Searching for:', searchTerm);
      
      const searchOptions = {
        ...options,
        filter: searchTerm
      };

      return await EnhancedOffice365UsersService.getAll(searchOptions);

    } catch (error) {
      console.error('[EnhancedOffice365UsersService.searchUsers] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get current user profile (returns Simunye's profile)
   */
  static async getCurrentUser(): Promise<IServiceResult<Office365UserRecord>> {
    try {
      console.log('[EnhancedOffice365UsersService.getCurrentUser] Getting current user');
      
      // Return Simunye's profile as the current user
      const currentUser = enhancedMockOffice365Users.find(u => u.givenName === 'Simunye');
      
      if (!currentUser) {
        return {
          error: 'Current user profile not found'
        };
      }

      return { data: currentUser };

    } catch (error) {
      console.error('[EnhancedOffice365UsersService.getCurrentUser] Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default EnhancedOffice365UsersService;