import React, { useState } from 'react';

type Option = { id: string; label: string; color: string; icon?: React.ReactNode };

type Props = {
  onSelect?: (id: string) => void; // new optional prop to notify parent which tile selected
};

const stockOptions: Option[] = [
  { id: 'catalogue', label: 'Stock Catalogue', color: '#7cb342' },
  { id: 'orders', label: 'Stock Orders', color: '#7cb342' },
  { id: 'counts', label: 'Stock Counts', color: '#42a5f5' },
  { id: 'movements', label: 'Stocks Movements', color: '#ef4444' },
  { id: 'faulty', label: 'Faulty Items', color: '#fb8c00' },
  { id: 'samsara', label: 'Samsara 8Am Check', color: '#facc15' },
];

const toolOptions: Option[] = [
  { id: 'tools-catalogue', label: 'Tools Catalogue', color: '#ef4444' },
  { id: 'toolkits', label: 'Toolkits', color: '#60a5fa' },
  { id: 'warehouse', label: 'Tool Warehouse', color: '#d97706' },
  { id: 'allocations', label: 'Tool Allocations', color: '#f59e0b' },
  { id: 'allocation-logs', label: 'Tool Allocation Logs', color: '#84cc16' },
  { id: 'confirmations', label: 'Tool Confirmations', color: '#ef6b6b' },
  { id: 'stock-levels', label: 'Tool Stock Levels', color: '#fb923c' },
];

const assetOptions: Option[] = [
  { id: 'asset-catalogue', label: 'Asset Catalogue', color: '#c0564a' },
  { id: 'asset-warehouse', label: 'Asset Warehouse', color: '#7c3aed' },
  { id: 'asset-allocation', label: 'Asset Allocation', color: '#86efac' },
  { id: 'allocation-logs', label: 'Asset Allocation Logs', color: '#94a3b8' },
  { id: 'asset-confirmations', label: 'Asset Confirmations', color: '#f59e0b' },
  { id: 'asset-stock-levels', label: 'Asset Stock Levels', color: '#60a5fa' },
];

const IconBox: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#fff" strokeWidth="1.5" />
    <path d="M7 12h10M7 8h10M7 16h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TileButton: React.FC<{ opt: Option; active?: boolean; onClick: (id: string) => void }> = ({ opt, active, onClick }) => {
  return (
    <button
      className={`log-tile ${active ? 'log-tile-active' : ''}`}
      onClick={() => onClick(opt.id)}
      aria-label={opt.label}
      type="button"
    >
      <div className="log-tile-left" style={{ background: opt.color }}>{opt.label}</div>
      <div className="log-tile-right" style={{ background: '#082341' }}><IconBox /></div>
    </button>
  );
};

const Logistics: React.FC<Props> = ({ onSelect }) => {
  const [tab, setTab] = useState<'stock' | 'tools' | 'assets'>('stock');
  const [activeTile, setActiveTile] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActiveTile(id);
    onSelect?.(id); // notify parent so the main area can render corresponding content
  };

  const renderTiles = () => {
    const list = tab === 'stock' ? stockOptions : tab === 'tools' ? toolOptions : assetOptions;
    return (
      <div className="log-tiles-grid">
        {list.map(o => <TileButton key={o.id} opt={o} active={activeTile === o.id} onClick={handleClick} />)}
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Logistics</h2>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Manage stock, tools and assets</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`chip ${tab === 'stock' ? 'chip-active' : ''}`} onClick={() => setTab('stock')} type="button">Stock</button>
          <button className={`chip ${tab === 'tools' ? 'chip-active' : ''}`} onClick={() => setTab('tools')} type="button">Tools</button>
          <button className={`chip ${tab === 'assets' ? 'chip-active' : ''}`} onClick={() => setTab('assets')} type="button">Assets</button>
        </div>
      </div>

      <div style={{ marginTop: 6 }}>
        {renderTiles()}
      </div>
    </div>
  );
};

export default Logistics;