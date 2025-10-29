import React, { useState } from 'react';
import type { StockOrder } from '../types';

type Props = {
  onClose: () => void;
  onAdd: (order: StockOrder) => void;
};

const CreateOrderModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    id: '',
    requestRef: '',
    // store created as datetime-local string (YYYY-MM-DDTHH:mm)
    created: '',
    isp: '',
    status: '',
    storeroom: '',
  });

  const update = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim()) {
      alert('Order ID is required');
      return;
    }

    // convert datetime-local to display format "YYYY-MM-DD HH:mm"
    const createdValue = form.created
      ? form.created.replace('T', ' ')
      : new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newOrder: StockOrder = {
      id: form.id.trim(),
      requestRef: form.requestRef.trim() || '-',
      created: createdValue,
      isp: form.isp.trim() || '-',
      status: form.status.trim() || 'Draft',
      storeroom: form.storeroom.trim() || '-',
    };
    onAdd(newOrder);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Create New Stock Order</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form-container" onSubmit={submit}>
          <div className="modal-form">
            <label>Order ID</label>
            <input value={form.id} onChange={e => update('id', e.target.value)} placeholder="ORD-2402" />

            <label>Request Ref</label>
            <input value={form.requestRef} onChange={e => update('requestRef', e.target.value)} placeholder="WON-12346" />

            <label>Created</label>
            {/* datetime-local provides a date+time picker */}
            <input
              type="datetime-local"
              value={form.created}
              onChange={e => update('created', e.target.value)}
              placeholder="YYYY-MM-DD HH:mm or leave blank"
            />

            <label>Region</label>
            <select value={form.isp} onChange={e => update('isp', e.target.value)}>
              <option value="">Select region</option>
              <option value="Region B">Region B</option>
              <option value="Region N">Region N</option>
              <option value="Virgin">Virgin</option>
            </select>

            <label>Storeroom</label>
            <select value={form.storeroom} onChange={e => update('storeroom', e.target.value)}>
              <option value="">Select storeroom</option>
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

            <label>Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value)}>
              <option value="">Select status</option>
              <option>Draft</option>
              <option>Awaiting ISP</option>
              <option>POD Recording</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-muted" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;