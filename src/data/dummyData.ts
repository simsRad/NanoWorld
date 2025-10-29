import type { User, CompanyInfo, StockOrder } from '../types';
import { tools } from './toolsData';

export const users: User[] = [
  { id: 'u1', name: 'Ava Carter', email: 'ava.carter@nanoworld.com', role: 'Engineer', department: 'R&D' },
  { id: 'u2', name: 'Liam Patel', email: 'liam.patel@nanoworld.com', role: 'Product Manager', department: 'Product' },
  { id: 'u3', name: 'Maya Chen', email: 'maya.chen@nanoworld.com', role: 'Designer', department: 'UX' },
  { id: 'u4', name: 'Noah Smith', email: 'noah.smith@nanoworld.com', role: 'Support', department: 'Customer Success' },
  { id: 'u5', name: 'Olivia Nguyen', email: 'olivia.nguyen@nanoworld.com', role: 'QA', department: 'Engineering' },
];

export const companyInfo: CompanyInfo = {
  totalEmployees: 128,
  announcements: [
    { id: 'a1', title: 'Quarterly All-Hands Tomorrow', date: '2025-10-27' },
    { id: 'a2', title: 'New Office in Austin Opened', date: '2025-09-02' },
    { id: 'a3', title: 'Security Training — mandatory', date: '2025-08-15' },
  ],
  links: [
    { title: 'HR Portal', url: 'https://example.com/hr' },
    { title: 'Internal Wiki', url: 'https://example.com/wiki' },
    { title: 'Benefits', url: 'https://example.com/benefits' },
  ],
};

// utility to create lines from tools (simple sample)
const mkLine = (tIdx: number, qty = 1, storeroom = 'Storeroom Birmingham') => {
  const t = tools[tIdx % tools.length];
  return {
    id: `${t.sku ?? t.name}-${Math.random().toString(36).slice(2,8)}`,
    sku: t.sku,
    name: t.name,
    qty,
    notes: '',
    storeroom,
  };
};

// renamed to initialStockOrders so App can manage live state
export const initialStockOrders: StockOrder[] = [
  {
    id: 'ORD-2401',
    requestRef: 'WON-12345',
    created: '2025-10-26 10:00',
    isp: 'Region B',
    status: 'Awaiting ISP',
    storeroom: 'Storeroom DEMO',
    needBy: '2025-10-30',
    notes: 'Please expedite',
    lines: [ mkLine(0, 2), mkLine(4, 1, 'Storeroom Boston') ],
  },
  {
    id: 'ORD-2400',
    requestRef: 'WON-12344',
    created: '2025-10-25 14:30',
    isp: 'Virgin',
    status: 'POD Recording',
    storeroom: 'Storeroom Birmingham',
    needBy: '2025-11-05',
    lines: [ mkLine(8, 1) ],
  },
  {
    id: 'ORD-2399',
    requestRef: 'WON-12342',
    created: '2025-10-25 09:15',
    isp: 'Region N',
    status: 'Closed',
    storeroom: 'Storeroom Bristol',
    needBy: '2025-10-27',
    lines: [ mkLine(2, 3) ],
  },
];