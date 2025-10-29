import React from 'react';

type Tile = { id: string; label: string };

type Props = {
  onOpen?: (id: string) => void;
};

// balanced colour palette (greens, blue, orange, purple, red)
const PALETTE = ['#7cb342', '#42a5f5', '#fb923c', '#8b5cf6', '#ef4444'];

const tiles: Tile[] = [
  { id: 'users', label: 'Users' },
  { id: 'warehouses', label: 'Warehouses' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'stock-items', label: 'Stock Items' },
  { id: 'tools', label: 'Tools' },
  { id: 'coordination', label: 'Coordination' },
  { id: 'inspections', label: 'Inspections' },
  { id: 'lookup-manager', label: 'Lookup Manager' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'helpdesk', label: 'HelpDesk' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'fleet', label: 'Fleet' },
];

const IconBox: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.4" />
    <path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const TileButton: React.FC<{ t: Tile; color: string; onClick: (id: string) => void }> = ({ t, color, onClick }) => (
  <button
    type="button"
    className="landing-tile"
    onClick={() => onClick(t.id)}
    aria-label={t.label}
    title={t.label}
    style={{
      display: 'flex',
      height: 48,
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid #e6e9ee',
      background: '#fff',
      alignItems: 'stretch',
      padding: 0,
    }}
  >
    {/* thin coloured stripe (keeps the colour but removes full-text background) */}
    <div style={{ width: 12, background: color }} />

    {/* label area - white background, text tinted with the colour for emphasis */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 12px', color: color, fontWeight: 700 }}>
      {t.label}
    </div>

    {/* dark icon box on the right */}
    <div style={{ width: 52, background: '#082341', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconBox />
    </div>
  </button>
);

const LOGO_SRC = 'https://nanofibre.co.uk/wp-content/uploads/2023/08/cropped-Nano-1-e1740481081777.png';

const Landing: React.FC<Props> = ({ onOpen }) => {
  const handleClick = (id: string) => onOpen?.(id);

  return (
    <div className="landing" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 1 520px' }}>
        <div className="landing-panel">
          {/* 2-column grid so each row has two buttons */}
          <div
            className="landing-tiles-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {tiles.map((t, i) => (
              <TileButton key={t.id} t={t} color={PALETTE[i % PALETTE.length]} onClick={handleClick} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={LOGO_SRC} alt="Nano Fibre" style={{ maxWidth: 520, width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>
    </div>
  );
};

export default Landing;