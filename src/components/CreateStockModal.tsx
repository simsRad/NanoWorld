import React, { useMemo, useState } from 'react';
import type { ToolItem } from '../types';

type Props = {
  existing: ToolItem[];
  onClose: () => void;
  onSave: (item: ToolItem) => void;
};

const normalizeSkuBase = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 24);

const CreateStockModal: React.FC<Props> = ({ existing, onClose, onSave }) => {
  const toolTypes = useMemo(() => {
    const set = new Set<string>();
    existing.forEach(i => set.add(i.toolType ?? ''));
    return Array.from(set).filter(Boolean);
  }, [existing]);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [details, setDetails] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [serialNumber, setSerialNumber] = useState(false);
  const [toolType, setToolType] = useState(toolTypes[0] ?? '');

  const generateUniqueSku = () => {
    const base = normalizeSkuBase(name || 'item') || 'item';
    let candidate = base;
    let i = 1;
    const exists = (s: string) => existing.some(it => (it.sku ?? '').toLowerCase() === s.toLowerCase());
    while (exists(candidate) && i < 9999) {
      candidate = `${base}-${i}`;
      i += 1;
    }
    setSku(candidate);
  };

  const handleSave = () => {
    if (!name) {
      alert('Name is required');
      return;
    }
    if (!sku) generateUniqueSku();
    const item: ToolItem = {
      name,
      sku,
      details: details || undefined,
      purchasePrice: purchasePrice === '' ? undefined : Number(purchasePrice),
      quantity: quantity === '' ? undefined : Number(quantity),
      serialNumber: serialNumber ? true : undefined,
      toolType: toolType || undefined,
    } as ToolItem;
    onSave(item);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 680, width: '96%' }}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Create Stock Item</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{ padding: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>
              <div className="label">Name</div>
              <input value={name} onChange={e => setName(e.target.value)} />
            </label>

            <label>
              <div className="label">SKU</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={sku} onChange={e => setSku(e.target.value)} />
                <button type="button" className="btn-muted" onClick={generateUniqueSku}>Generate</button>
              </div>
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <div className="label">Details</div>
              <input value={details} onChange={e => setDetails(e.target.value)} />
            </label>

            <label>
              <div className="label">Purchase Price</div>
              <input type="number" value={purchasePrice as any} onChange={e => setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>

            <label>
              <div className="label">Quantity</div>
              <input type="number" value={quantity as any} onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>

            <label>
              <div className="label">Tool Type</div>
              <select value={toolType} onChange={e => setToolType(e.target.value)}>
                <option value="">(none)</option>
                {toolTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={serialNumber} onChange={e => setSerialNumber(e.target.checked)} />
              <div style={{ marginLeft: 6 }}>
                <div className="label">Requires serial number</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>Tick if items need serial tracking</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button className="btn-muted" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Create Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStockModal;