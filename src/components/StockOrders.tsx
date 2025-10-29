import React from 'react';
import type { StockOrder } from '../types';
import { exportObjectsToCsv } from '../utils/exportCsv'; // added

type Props = {
  orders: StockOrder[];
  onSelect?: (order: StockOrder) => void; // new optional prop
};

const StockOrders: React.FC<Props> = ({ orders, onSelect }) => {
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div className="chips" style={{display:'flex',gap:8}}>
          <div className="chip">All</div>
          <div className="chip">Draft</div>
          <div className="chip">Awaiting ISP</div>
          <div className="chip">Awaiting POD</div>
          <div className="chip">Closed</div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button
            className="btn-muted"
            onClick={() => exportObjectsToCsv('stock-orders.csv', orders, ['id','requestRef','created','isp','status','storeroom','needBy','notes'])}
          >
            Export Orders CSV
          </button>
        </div>
      </div>

      <table className="orders-table" aria-label="Stock orders table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Request Ref</th>
            <th>Created</th>
            <th>ISP</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{cursor: onSelect ? 'pointer' : 'default'}} onClick={() => onSelect ? onSelect(o) : undefined}>
              <td style={{fontWeight:700}}>{o.id}</td>
              <td>{o.requestRef}</td>
              <td>{o.created}</td>
              <td>{o.isp}</td>
              <td>
                <span style={{
                  padding:'6px 10px',
                  borderRadius:16,
                  background: o.status === 'Closed' ? '#ecfdf5' : (o.status.includes('Awaiting') ? '#fff7ed' : '#eef2ff'),
                  color: o.status === 'Closed' ? '#16a34a' : '#92400e',
                  fontWeight:700,
                  fontSize:12
                }}>{o.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockOrders;