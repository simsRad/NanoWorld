import React, { useMemo, useState } from 'react';
import type { StockOrder, OrderLine, ToolItem } from '../types';
import { tools } from '../data/toolsData';
import PasteFromExcelModal from './PasteFromExcelModal';
import { exportOrderLinesCsv } from '../utils/exportCsv';

type Props = {
  order: StockOrder;
  onBack: () => void;
  onSave: (o: StockOrder) => void;
};

const findToolBySku = (sku?: string): ToolItem | undefined => tools.find(t => t.sku === sku);

const OrderDetails: React.FC<Props> = ({ order, onBack, onSave }) => {
  const [draft, setDraft] = useState<StockOrder>({ ...order, lines: (order.lines || []).map(l => ({ ...l })) });
  const [showPaste, setShowPaste] = useState(false); // new state

  const addLine = () => {
    const newLine: OrderLine = {
      id: `line-${Math.random().toString(36).slice(2,8)}`,
      sku: tools[0]?.sku,
      name: tools[0]?.name,
      qty: 1,
      notes: '',
      storeroom: draft.storeroom ?? 'Storeroom Birmingham',
    };
    setDraft(d => ({ ...d, lines: [newLine, ...(d.lines ?? [])] }));
  };

  const updateLine = (id: string, patch: Partial<OrderLine>) => {
    setDraft(d => ({ ...d, lines: d.lines?.map(l => l.id === id ? { ...l, ...patch } : l) }));
  };

  const removeLine = (id: string) => {
    setDraft(d => ({ ...d, lines: d.lines?.filter(l => l.id !== id) }));
  };

  const toolOptions = useMemo(() => tools, []);

  const addParsedLines = (lines: OrderLine[]) => {
    setDraft(d => ({ ...d, lines: [...lines, ...(d.lines ?? [])] }));
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <h2 style={{margin:0}}>Order {draft.id}</h2>
          <div style={{color:'#6b7280',fontSize:13}}>{draft.requestRef} • {draft.status}</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn-muted" onClick={onBack}>Back</button>

          {/* Export order lines for current order */}
          <button className="btn-muted" onClick={() => exportOrderLinesCsv(draft)}>Export Order CSV</button>

          <button className="btn-primary" onClick={() => onSave(draft)}>Save Order</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <label>
            <div className="label">ISP</div>
            <select value={draft.isp} onChange={e => setDraft(d => ({ ...d, isp: e.target.value }))}>
              <option>Region B</option>
              <option>Region N</option>
              <option>Virgin</option>
            </select>
          </label>

          <label>
            <div className="label">Request Reference</div>
            <input value={draft.requestRef} onChange={e => setDraft(d => ({ ...d, requestRef: e.target.value }))} />
          </label>

          <label>
            <div className="label">Need By</div>
            <input type="date" value={draft.needBy ?? ''} onChange={e => setDraft(d => ({ ...d, needBy: e.target.value }))} />
          </label>

          <label>
            <div className="label">Default Storeroom</div>
            <select value={draft.storeroom ?? ''} onChange={e => setDraft(d => ({ ...d, storeroom: e.target.value }))}>
              <option>Storeroom Birmingham</option>
              <option>Storeroom Boston</option>
              <option>Storeroom Bradford</option>
              <option>Storeroom Burnley</option>
              <option>Storeroom Godmanchester</option>
              <option>Storeroom Liverpool</option>
              <option>Storeroom Manchester</option>
              <option>Storeroom Mansfield</option>
              <option>Storeroom Newark</option>
              <option>Storeroom Bristol</option>
              <option>Storeroom Oxford</option>
              <option>Storeroom Paddock Wood</option>
              <option>Storeroom Preston</option>
              <option>Storeroom DEMO</option>
              <option>Storeroom Swindon</option>
            </select>
          </label>

          <label style={{gridColumn:'1 / -1'}}>
            <div className="label">Notes</div>
            <textarea value={draft.notes ?? ''} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
          </label>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <h3 style={{margin:0}}>Order Lines</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn-muted" onClick={() => setShowPaste(true)}>Paste from Excel</button>
            <button className="btn-primary" onClick={addLine}>Add Line</button>
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="orders-table" style={{minWidth:900}}>
            <thead>
              <tr>
                <th>Storeroom</th>
                <th>Item Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(draft.lines || []).map(line => (
                <tr key={line.id}>
                  <td>
                    <select value={line.storeroom} onChange={e => updateLine(line.id, { storeroom: e.target.value })}>
                      <option>Storeroom Birmingham</option>
                      <option>Storeroom Boston</option>
                      <option>Storeroom Bradford</option>
                      <option>Storeroom Burnley</option>
                      <option>Storeroom Godmanchester</option>
                      <option>Storeroom Liverpool</option>
                      <option>Storeroom Manchester</option>
                      <option>Storeroom Mansfield</option>
                      <option>Storeroom Newark</option>
                      <option>Storeroom Bristol</option>
                      <option>Storeroom Oxford</option>
                      <option>Storeroom Paddock Wood</option>
                      <option>Storeroom Preston</option>
                      <option>Storeroom DEMO</option>
                      <option>Storeroom Swindon</option>
                    </select>
                  </td>

                  <td>
                    <select value={line.sku} onChange={e => {
                      const sku = e.target.value;
                      const t = findToolBySku(sku);
                      updateLine(line.id, { sku, name: t?.name });
                    }}>
                      {toolOptions.map(t => <option key={t.sku} value={t.sku}>{t.name}</option>)}
                    </select>
                  </td>

                  <td>{line.sku}</td>

                  <td>
                    <input type="number" value={line.qty} min={0} onChange={e => updateLine(line.id, { qty: Number(e.target.value || 0) })} style={{width:80}} />
                  </td>

                  <td>
                    <input value={line.notes ?? ''} onChange={e => updateLine(line.id, { notes: e.target.value })} />
                  </td>

                  <td>
                    <button className="btn-muted" onClick={() => removeLine(line.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaste && (
        <PasteFromExcelModal
          defaultStoreroom={draft.storeroom}
          onClose={() => setShowPaste(false)}
          onAdd={addParsedLines}
        />
      )}
    </div>
  );
};

export default OrderDetails;