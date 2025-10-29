export interface Installation {
  id: string;
  address: string;
  area: string;
  assistant: string;
  assistantEmail: string;
  bookingStatus: string;
  coordinator: string;
  coordinatorEmail: string;
  dateInstall: string;
  engineer: string;
  engineerEmail: string;
  installStatus: string;
  installType: string;
  isp: string;
  lastNote: string;
  team: string;
  teamLead: string;
  teamLeadEmail: string;
  timeSlot: string;
  workOrder: string;
}

export interface CoordinationFilters {
  engineer: string;
  area: string;
  installStatus: string;
  timeSlot: string;
  installType: string;
  isp: string;
  searchTerm: string;
}

export type ViewMode = 'list' | 'card';

export type SortField = 'dateInstall' | 'engineer' | 'installStatus' | 'address';
export type SortDirection = 'asc' | 'desc';