export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  body?: string;
}

export interface CompanyInfo {
  totalEmployees: number;
  announcements: Announcement[];
  links: { title: string; url: string }[];
}

/* Order line and order additions */
export interface OrderLine {
  id: string;         // local id for editing
  sku?: string;
  name?: string;
  qty: number;
  notes?: string;
  storeroom?: string;
}

export interface StockOrder {
  id: string;
  requestRef: string;
  created: string;
  isp: string;
  status: string;
  storeroom?: string;
  needBy?: string;
  notes?: string;
  lines?: OrderLine[];
}

/* New: tool type for stock view */
export interface ToolItem {
  name: string;
  details?: string;
  purchasePrice?: number;
  purchaseBasePrice?: number;
  quantity?: number;
  serialNumber?: boolean;
  sku?: string;
  totalCost?: number;
  totalCostBase?: number;
  toolType?: string;
}