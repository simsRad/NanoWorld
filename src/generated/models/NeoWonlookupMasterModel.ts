/**
 * Generated Model for neo_wonlookup_master
 * This model represents the schema of the Dataverse table
 */

export interface INeoWonlookupMasterCreateRequest {
  neo_name?: string;
  neo_description?: string;
  neo_value?: string;
  neo_code?: string;
  neo_category?: string;
  neo_isactive?: boolean;
  neo_sortorder?: number;
  // Add other fields as needed based on actual table schema
}

export interface NeoWonlookupMaster extends INeoWonlookupMasterCreateRequest {
  neo_wonlookup_masterid: string; // Primary key
  createdon?: Date;
  modifiedon?: Date;
  createdby?: string;
  modifiedby?: string;
  statecode?: number;
  statuscode?: number;
  versionnumber?: number;
  ownerid?: string;
  owningbusinessunit?: string;
  owninguser?: string;
  owningteam?: string;
}

export type NeoWonlookupMasterRecord = Omit<NeoWonlookupMaster, 'neo_wonlookup_masterid'>;

export interface INeoWonlookupMasterUpdateRequest extends Partial<INeoWonlookupMasterCreateRequest> {
  // Allows partial updates
}

export interface INeoWonlookupMasterResponse {
  value?: NeoWonlookupMaster[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
}