import React, { useEffect, useState } from 'react';
import type { ToolItem } from '../types';

type Props = {
  item?: ToolItem | null; // if provided -> edit mode
  onClose: () => void;
  onSave: (item: ToolItem) => void;
};

const empty = (): ToolItem => ({
  name: '',
  details: '',
  purchasePrice: undefined,
  purchaseBasePrice: undefined,
  quantity: 1,
  serialNumber: false,
  sku: '',
  totalCost: 0,
  totalCostBase: 0,
  toolType: 'ISP',
});

const ManageStockModal: React.FC<Props> = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState<ToolItem>(empty());

  useEffect(() => {
    setForm(item ? { ...item } : empty());
  }, [item]);

  const update = <K extends keyof ToolItem>(k: K, v: ToolItem[K]) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { alert('Name required'); return; }
    onSave({ ...form, name: form.name.trim() });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{maxWidth:640}}>
        <div className="modal-header">
          <h3 style={{margin:0}}>{item ? 'Edit Tool' : 'Add Tool'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form-container" onSubmit={submit}>
          <div className="modal-form">
            <label>Name</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} />

            <label>Details</label>
            <input value={form.details ?? ''} onChange={e => update('details', e.target.value)} />

            <label>Purchase Price</label>
            <input type="number" step="0.01" value={form.purchasePrice ?? ''} onChange={e => update('purchasePrice', e.target.value ? Number(e.target.value) : undefined)} />

            <label>Quantity</label>
            <input type="number" value={form.quantity ?? 1} onChange={e => update('quantity', Number(e.target.value || 0))} />

            <label>Serial Number?</label>
            <input type="checkbox" checked={!!form.serialNumber} onChange={e => update('serialNumber', e.target.checked)} />

            <label>SKU</label>
            <input value={form.sku ?? ''} onChange={e => update('sku', e.target.value)} />

            <label>Type</label>
            <select className="dropdown-select" value={form.toolType ?? 'ISP'} onChange={e => update('toolType', e.target.value)}>
              <option value="ISP">ISP</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-muted" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{item ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStockModal;