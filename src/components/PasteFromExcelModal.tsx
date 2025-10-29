import React, { useMemo, useState } from 'react';
import type { OrderLine, ToolItem } from '../types';
import { tools } from '../data/toolsData';

type Props = {
  defaultStoreroom?: string;
  onClose: () => void;
  onAdd: (lines: OrderLine[]) => void;
};

const detectDelimiter = (text: string) => {
  const sample = text.split('\n').slice(0, 5).join('\n');
  if (sample.indexOf('\t') >= 0) return '\t';
  if (sample.indexOf(';') >= 0) return ';';
  return ','; // fallback
};

const parseCSV = (text: string) => {
  const delim = detectDelimiter(text);
  const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  if (rows.length === 0) return { headers: [], rows: [] as string[][] };
  const headers = rows[0].split(delim).map(h => h.trim().toLowerCase());
  const data = rows.slice(1).map(r => r.split(delim).map(c => c.trim()));
  return { headers, rows: data };
};

const mkLineFromRow = (row: string[], headers: string[], defaultStoreroom?: string) => {
  // map common column names to fields
  const get = (keys: string[]) => {
    for (const k of keys) {
      const idx = headers.indexOf(k);
      if (idx >= 0) return row[idx] ?? '';
    }
    return '';
  };

  const sku = get(['sku', 'part', 'part number', 'part_no']);
  const name = get(['name', 'item', 'item name', 'description']);
  const qtyRaw = get(['qty', 'quantity', 'amount', 'qty.']);
  const storeroom = get(['storeroom', 'store', 'location']) || defaultStoreroom;
  const notes = get(['notes', 'note', 'comment']);

  const qty = Number(qtyRaw || 1) || 1;

  // try to find tool name if missing
  const tool: ToolItem | undefined = tools.find(t => t.sku === sku) ?? undefined;

  return {
    id: `line-${Math.random().toString(36).slice(2,8)}`,
    sku: sku || tool?.sku,
    name: name || tool?.name || sku || 'Unknown item',
    qty,
    notes,
    storeroom,
  } as OrderLine;
};

const PasteFromExcelModal: React.FC<Props> = ({ defaultStoreroom, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const parsed = useMemo(() => parseCSV(text), [text]);
  const preview = useMemo(() => {
    if (!parsed.rows.length) return [];
    return parsed.rows.map(r => mkLineFromRow(r, parsed.headers, defaultStoreroom));
  }, [parsed, defaultStoreroom]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{maxWidth:900, width:'95%'}}>
        <div className="modal-header">
          <h3 style={{margin:0}}>Paste CSV / Excel data</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{padding:12}}>
          <div style={{marginBottom:8,color:'#6b7280'}}>Paste rows copied from Excel or a CSV file. First row is treated as headers.</div>
          <textarea
            placeholder="Paste CSV / TSV text here (first row = headers). Columns: sku, name, qty, storeroom, notes"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{width:'100%',minHeight:140,padding:12,borderRadius:8,border:'1px solid #e6e9ee',fontSize:13}}
          />

          <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{color:'#6b7280'}}>{preview.length ? `${preview.length} rows parsed` : 'No rows parsed yet'}</div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn-muted" onClick={() => { setText(''); }}>Clear</button>
              <button
                className="btn-primary"
                disabled={preview.length === 0}
                onClick={() => {
                  onAdd(preview);
                  onClose();
                }}
              >
                Add to order ({preview.length})
              </button>
            </div>
          </div>

          {preview.length > 0 && (
            <div style={{marginTop:12,maxHeight:240,overflow:'auto',border:'1px solid #f1f1f3',borderRadius:8,padding:8,background:'#fff'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{textAlign:'left',color:'#6b7280',fontWeight:700}}>
                    <th style={{padding:'6px 8px'}}>Storeroom</th>
                    <th style={{padding:'6px 8px'}}>Item Name</th>
                    <th style={{padding:'6px 8px'}}>SKU</th>
                    <th style={{padding:'6px 8px'}}>Qty</th>
                    <th style={{padding:'6px 8px'}}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(p => (
                    <tr key={p.id} style={{borderTop:'1px solid #f3f4f6'}}>
                      <td style={{padding:'8px'}}>{p.storeroom}</td>
                      <td style={{padding:'8px'}}>{p.name}</td>
                      <td style={{padding:'8px'}}>{p.sku}</td>
                      <td style={{padding:'8px'}}>{p.qty}</td>
                      <td style={{padding:'8px'}}>{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasteFromExcelModal;