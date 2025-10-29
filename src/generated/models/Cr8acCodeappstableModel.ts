/**
 * Generated Model for cr8ac_codeappstable
 * This model represents the schema of the Dataverse table
 */

export interface ICr8acCodeappsTableCreateRequest {
  cr8ac_name?: string;
  cr8ac_description?: string;
  cr8ac_value?: number;
  // Add other fields as needed
}

export interface Cr8acCodeappstable extends ICr8acCodeappsTableCreateRequest {
  cr8ac_codeappstableid: string; // Primary key
  createdon?: Date;
  modifiedon?: Date;
  createdby?: string;
  modifiedby?: string;
  statecode?: number;
  statuscode?: number;
}

export type Cr8acCodeappstableRecord = Omit<Cr8acCodeappstable, 'cr8ac_codeappstableid'>;
