import { initialize } from '@microsoft/power-apps/app';

export type SystemUser = {
  systemuserid: string;
  fullname?: string;
  domainname?: string;
  internalemailaddress?: string;
  title?: string;
  mobilephone?: string;
};

export class SystemUserService {
  private static instance: SystemUserService | null = null;
  private powerApps: any = null;
  private initialized = false;
  
  private constructor() {}

  public static getInstance(): SystemUserService {
    if (!SystemUserService.instance) {
      SystemUserService.instance = new SystemUserService();
    }
    return SystemUserService.instance;
  }

  private async init(): Promise<void> {
    if (this.initialized) return;

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Initializing Power Apps (attempt ${attempt}/${maxRetries})...`);

        // Ensure document is fully loaded
        if (document.readyState !== 'complete') {
          console.log('Waiting for document to load...');
          await new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }));
        }

        // Add a small delay between retries
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }

        // Initialize Power Apps with Office 365 Users API
        this.powerApps = await initialize();
        
        // Verify Power Apps API is available
        if (!this.powerApps?.data) {
          throw new Error('Power Apps data API not available after initialization');
        }

        // Try to access the Office 365 Users API
        await this.powerApps.data.getConnection({
          logicalName: 'shared_office365users'
        });
        
        this.initialized = true;
        console.log('Power Apps and Office 365 Users API initialized successfully');
        return;

      } catch (error) {
        lastError = error as Error;
        console.error(`Power Apps initialization attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          console.error('All initialization attempts failed');
          throw new Error(`Failed to initialize Power Apps after ${maxRetries} attempts: ${lastError.message}`);
        }
      }
    }
  }

  public async getUsers(): Promise<SystemUser[]> {
    try {
      await this.init();

      if (!this.powerApps?.data) {
        throw new Error('Power Apps not properly initialized');
      }

      console.log('Fetching users from Office 365...');
      const office365 = this.powerApps.data.getConnection('shared_office365users');
      
      // Using Office 365 Users API to get user list
      const users = await office365.api('/users').get();

      if (!users?.value) {
        throw new Error('No users returned from Office 365');
      }

      // Map Office 365 user properties to SystemUser type
      const mappedUsers: SystemUser[] = users.value.map((user: any) => ({
        systemuserid: user.id,
        fullname: user.displayName,
        domainname: user.userPrincipalName,
        internalemailaddress: user.mail,
        title: user.jobTitle,
        mobilephone: user.mobilePhone
      }));

      console.log(`Successfully retrieved ${mappedUsers.length} users from Office 365`);
      return mappedUsers;
    } catch (error) {
      console.error('Failed to get users:', error);
      // Reset initialization state on critical errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('not properly initialized') || errorMessage.includes('not available')) {
        console.log('Resetting Power Apps initialization state...');
        this.initialized = false;
        this.powerApps = null;
      }
      throw error;
    }
  }

  public async getCurrentUser(): Promise<SystemUser | null> {
    try {
      const users = await this.getUsers();
      return users[0] || null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }
}

export default SystemUserService;
