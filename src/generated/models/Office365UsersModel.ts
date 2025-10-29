/**
 * Generated Model for Office365Users
 * Provides TypeScript types for Office 365 Users
 */

export interface Office365User {
  id?: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName?: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  businessPhones?: string[];
  mobilePhone?: string;
  preferredLanguage?: string;
  accountEnabled?: boolean;
}

export interface IOffice365UserCreateRequest {
  displayName: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  businessPhones?: string[];
  mobilePhone?: string;
  preferredLanguage?: string;
  accountEnabled?: boolean;
}

export interface Office365UserRecord extends Office365User {
  // Additional properties that might be returned from the API
  createdDateTime?: string;
  lastSignInDateTime?: string;
  assignedLicenses?: any[];
  assignedPlans?: any[];
}

export type Office365UserCollection = {
  value: Office365UserRecord[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
};