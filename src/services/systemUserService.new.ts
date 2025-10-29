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

    try {
      this.powerApps = await initialize();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Power Apps:', error);
      throw error;
    }
  }

  public async getUsers(): Promise<SystemUser[]> {
    await this.init();
    try {
      const table = this.powerApps.data.createTable('systemuser');
      const result = await table.retrieveMultipleRecords({
        select: ['systemuserid', 'fullname', 'domainname', 'internalemailaddress', 'title', 'mobilephone']
      });
      return result.entities;
    } catch (error) {
      console.error('Failed to get users:', error);
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
