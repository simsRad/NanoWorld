/**
 * Small CSV export helpers used by StockOrders / StockView / OrderDetails.
 * - exportObjectsToCsv: export array-of-objects to CSV (select fields or infer from first item)
 * - exportOrderLinesCsv: export a given order's lines combined with order metadata
 */

function escapeCsvCell(v: any) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportObjectsToCsv<T = any>(filename: string, items: T[], fields?: string[]) {
  if (!items || items.length === 0) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const keys = fields && fields.length ? fields : Object.keys(items[0] as any);
  const header = keys.join(',');
  const rows = items.map(it => keys.map(k => escapeCsvCell((it as any)[k])).join(','));
  const csv = [header, ...rows].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportOrderLinesCsv(order: any) {
  const lines = (order.lines || []).map((ln: any) => ({
    orderId: order.id,
    requestRef: order.requestRef,
    created: order.created,
    isp: order.isp,
    status: order.status,
    needBy: order.needBy,
    storeroom: ln.storeroom,
    sku: ln.sku,
    name: ln.name,
    qty: ln.qty,
    notes: ln.notes,
  }));
  exportObjectsToCsv(`${order.id}-lines.csv`, lines, ['orderId','requestRef','created','isp','status','needBy','storeroom','sku','name','qty','notes']);
}