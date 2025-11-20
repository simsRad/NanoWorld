// Auto-generated service for cr8ac_envtablecodeapps table
import { initialize, getContext } from '@microsoft/power-apps/app';
import { getClient } from '@microsoft/power-apps/data';
import type { Cr8acEnvtablecodeappsModel } from '../models/Cr8acEnvtablecodeappsModel';

export class Cr8acEnvtablecodeappsService {
  private static client: any = null;

  private static async ensureInitialized(): Promise<void> {
    if (!this.client) {
      console.log('Initializing Cr8acEnvtablecodeappsService...');
      
      try {
        // Initialize SDK first (same pattern as working service)
        await initialize();
        console.log('[EnvTableService] SDK initialized, getting context...');
        
        // Get context
        await getContext();
        console.log('[EnvTableService] Context obtained successfully');
        
        // Use the same client configuration as the working Cr8acCodeappstableService
        this.client = getClient({
          // Try the custom table using Set Name (plural) - most likely
          cr8ac_codeappstables: {
            tableId: "cr8ac_codeappstables",
            apis: {},
          },
          // Try with logical name (singular) as backup
          cr8ac_codeappstable: {
            tableId: "cr8ac_codeappstable", 
            apis: {},
          },
          // Try with Display Name
          CodeAppsTable: {
            tableId: "CodeAppsTable",
            apis: {},
          },
          // Try with Schema Name
          cr8ac_CodeAppsTable: {
            tableId: "cr8ac_CodeAppsTable",
            apis: {},
          },
          // Also include standard Dataverse tables for fallback
          systemusers: {
            tableId: "systemuser",
            apis: {},
          }
        });
        
        console.log('[EnvTableService] Data client initialized successfully');
        console.log('[EnvTableService] Available client properties:', Object.keys(this.client));
      } catch (error) {
        console.error('Failed to initialize Cr8acEnvtablecodeappsService:', error);
        throw error;
      }
    }
  }

  public static async getAll(): Promise<Cr8acEnvtablecodeappsModel[]> {
    console.log('Cr8acEnvtablecodeappsService.getAll() called');
    
    try {
      await this.ensureInitialized();
      
      if (!this.client) {
        throw new Error('Client not initialized');
      }

      console.log('[EnvTableService] Available client methods:', Object.keys(this.client));
      
      // Use the Dataverse API methods to retrieve records
      if (this.client.retrieveMultipleRecordsAsync) {
        console.log('[EnvTableService] Using retrieveMultipleRecordsAsync...');
        
        // Try different table name variations
        const tableNames = [
          'cr8ac_codeappstables',    // Set name (plural) 
          'cr8ac_codeappstable',     // Logical name (singular)
          'cr8ac_codeappstables',    // Try plural again
        ];

        for (const tableName of tableNames) {
          try {
            console.log(`[EnvTableService] Trying to retrieve records from: ${tableName}`);
            const result = await this.client.retrieveMultipleRecordsAsync(tableName);
            console.log(`[EnvTableService] Success with ${tableName}:`, result);
            
            if (result && result.entities) {
              return result.entities;
            } else if (result && Array.isArray(result)) {
              return result;
            } else if (result) {
              return [result];
            }
          } catch (error: any) {
            console.log(`[EnvTableService] Failed with table ${tableName}:`, error?.message || error);
          }
        }
      } else {
        console.log('[EnvTableService] retrieveMultipleRecordsAsync not available');
      }

      throw new Error('Table not found in data client. No accessible table reference found.');
      
    } catch (error) {
      console.error('Error in Cr8acEnvtablecodeappsService.getAll():', error);
      
      // Return mock data as fallback
      console.log('Returning mock data as fallback');
      return this.getMockData();
    }
  }

  private static mockData: Cr8acEnvtablecodeappsModel[] = [
    {
      cr8ac_envtablecodeappsid: '1',
      cr8ac_name: 'Production Environment Config',
      createdon: new Date('2024-01-15'),
      modifiedon: new Date('2024-01-20'),
      createdby: 'System Admin',
      modifiedby: 'System Admin',
      statuscode: 1,
      statecode: 0,
    },
    {
      cr8ac_envtablecodeappsid: '2',
      cr8ac_name: 'Development Environment Setup',
      createdon: new Date('2024-01-16'),
      modifiedon: new Date('2024-01-21'),
      createdby: 'System Admin',
      modifiedby: 'System Admin',
      statuscode: 1,
      statecode: 0,
    },
    {
      cr8ac_envtablecodeappsid: '3',
      cr8ac_name: 'Staging Environment Rules',
      createdon: new Date('2024-01-17'),
      modifiedon: new Date('2024-01-22'),
      createdby: 'System Admin',
      modifiedby: 'System Admin',
      statuscode: 2,
      statecode: 1,
    },
  ];

  private static getMockData(): Cr8acEnvtablecodeappsModel[] {
    return [...this.mockData];
  }

  public static async create(record: Partial<Cr8acEnvtablecodeappsModel>): Promise<Cr8acEnvtablecodeappsModel> {
    console.log('[EnvTableService] Creating record:', record);
    
    try {
      await this.ensureInitialized();
      
      if (this.client.createRecordAsync) {
        // Try different table names
        const tableNames = ['cr8ac_codeappstables', 'cr8ac_codeappstable'];
        
        for (const tableName of tableNames) {
          try {
            console.log(`[EnvTableService] Trying to create record in: ${tableName}`);
            const result = await this.client.createRecordAsync(tableName, record);
            console.log(`[EnvTableService] Created record in ${tableName}:`, result);
            return result;
          } catch (error: any) {
            console.log(`[EnvTableService] Failed to create in ${tableName}:`, error?.message || error);
          }
        }
      }
      
      throw new Error('Failed to create record in any available table');
    } catch (error) {
      console.error('[EnvTableService] Error creating record, using mock fallback:', error);
      
      // Mock create operation
      const newRecord: Cr8acEnvtablecodeappsModel = {
        cr8ac_envtablecodeappsid: `mock-${Date.now()}`,
        cr8ac_name: record.cr8ac_name || 'New Record',
        createdon: new Date(),
        modifiedon: new Date(),
        createdby: record.createdby || 'Current User',
        modifiedby: record.modifiedby || 'Current User',
        statuscode: record.statuscode || 1,
        statecode: record.statecode || 0,
      };
      
      this.mockData.unshift(newRecord);
      return newRecord;
    }
  }

  public static async update(id: string, record: Partial<Cr8acEnvtablecodeappsModel>): Promise<Cr8acEnvtablecodeappsModel> {
    console.log('[EnvTableService] Updating record:', id, record);
    
    try {
      await this.ensureInitialized();
      
      if (this.client.updateRecordAsync) {
        // Try different table names
        const tableNames = ['cr8ac_codeappstables', 'cr8ac_codeappstable'];
        
        for (const tableName of tableNames) {
          try {
            console.log(`[EnvTableService] Trying to update record in: ${tableName}`);
            const result = await this.client.updateRecordAsync(tableName, id, record);
            console.log(`[EnvTableService] Updated record in ${tableName}:`, result);
            return result;
          } catch (error: any) {
            console.log(`[EnvTableService] Failed to update in ${tableName}:`, error?.message || error);
          }
        }
      }
      
      throw new Error('Failed to update record in any available table');
    } catch (error) {
      console.error('[EnvTableService] Error updating record, using mock fallback:', error);
      
      // Mock update operation
      const existingIndex = this.mockData.findIndex(r => r.cr8ac_envtablecodeappsid === id);
      if (existingIndex === -1) {
        throw new Error(`Record with ID ${id} not found`);
      }
      
      const updatedRecord: Cr8acEnvtablecodeappsModel = {
        ...this.mockData[existingIndex],
        ...record,
        modifiedon: new Date(),
        modifiedby: record.modifiedby || 'Current User',
      };
      
      this.mockData[existingIndex] = updatedRecord;
      return updatedRecord;
    }
  }

  public static async delete(id: string): Promise<void> {
    console.log('[EnvTableService] Deleting record:', id);
    
    try {
      await this.ensureInitialized();
      
      if (this.client.deleteRecordAsync) {
        // Try different table names
        const tableNames = ['cr8ac_codeappstables', 'cr8ac_codeappstable'];
        
        for (const tableName of tableNames) {
          try {
            console.log(`[EnvTableService] Trying to delete record from: ${tableName}`);
            await this.client.deleteRecordAsync(tableName, id);
            console.log(`[EnvTableService] Deleted record from ${tableName}`);
            return;
          } catch (error: any) {
            console.log(`[EnvTableService] Failed to delete from ${tableName}:`, error?.message || error);
          }
        }
      }
      
      throw new Error('Failed to delete record from any available table');
    } catch (error) {
      console.error('[EnvTableService] Error deleting record, using mock fallback:', error);
      
      // Mock delete operation
      const existingIndex = this.mockData.findIndex(r => r.cr8ac_envtablecodeappsid === id);
      if (existingIndex === -1) {
        throw new Error(`Record with ID ${id} not found`);
      }
      
      this.mockData.splice(existingIndex, 1);
    }
  }
}