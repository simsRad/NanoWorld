import React, { useState } from 'react';

type Props = {
  onNavigate?: (view: 'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination') => void;
};

const WaffleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 6.5h15M4.5 12h15m-15 5.5h15"/>
</svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" aria-hidden>
    <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
      <path d="m1.5 10.5 9-9 9 9" />
      <path d="M3.5 8.5v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </g>
  </svg>
);

const StockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16">
    <path fill="currentColor" d="M12 6V0H4v6H0v7h16V6h-4zm-5 6H1V7h2v1h2V7h2v5zM5 6V1h2v1h2V1h2v5H5zm10 6H9V7h2v1h2V7h2v5zM0 16h3v-1h10v1h3v-2H0v2z"/>
</svg>
);

const LogisticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden>
    <path fill="#000" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3c-1.852 0-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3c1.852 0 3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3c1.852 0 3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3c-1.852 0-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2zm16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="m17.275 20.25l3.475-3.45l-1.05-1.05l-2.425 2.375l-.975-.975l-1.05 1.075l2.025 2.025ZM6 9h12V7H6v2Zm12 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23ZM3 22V3h18v8.675q-.475-.225-.975-.375T19 11.075V5H5v14.05h6.075q.125.775.388 1.475t.687 1.325L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22l-1.5-1.5L3 22Zm3-5h5.075q.075-.525.225-1.025t.375-.975H6v2Zm0-4h7.1q.95-.925 2.213-1.463T18 11H6v2Zm-1 6.05V5v14.05Z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const CoordinationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);


const Sidebar: React.FC<Props> = ({ onNavigate }) => {
  // default to 'home' as the initial selected view
  // include 'logistics' and 'coordination' in the state union so setSelected accepts it
  const [selected, setSelected] = useState<'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination'>('home');
  const [expanded, setExpanded] = useState<boolean>(true);
  
  const click = (view: 'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination', e?: React.MouseEvent) => {
    e?.preventDefault();
    setSelected(view);
    onNavigate?.(view);
  };
  
  return (
    <aside
      className={`sidebar ${expanded ? 'sidebar--expanded' : 'sidebar--collapsed'}`}
      aria-label="Sidebar"
    >
      <div className="sidebar-top">
        <button
          className="sidebar-toggle"
          onClick={() => setExpanded(prev => !prev)}
          aria-pressed={expanded}
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        >
          <WaffleIcon />
        </button>
      </div>

      <nav className="sidebar-nav" role="navigation" aria-label="Main">
        <a
          className={`nav-item ${selected === 'home' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('home', e)}
          aria-current={selected === 'home' ? 'page' : undefined}
          aria-label="Home"
        >
          <div className="nav-icon"><HomeIcon /></div>
          <span className="nav-label">Home</span>
        </a>

        <a
          className={`nav-item ${selected === 'orders' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('orders', e)}
          aria-current={selected === 'orders' ? 'page' : undefined}
          aria-label="Orders"
        >
          <div className="nav-icon">< OrdersIcon/></div>
          <span className="nav-label">Orders</span>
        </a>

        <a
          className={`nav-item ${selected === 'stock' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('stock', e)}
          aria-current={selected === 'stock' ? 'page' : undefined}
          aria-label="Stock"
        >
          <div className="nav-icon"><StockIcon /></div>
          <span className="nav-label">Stock</span>
        </a>

        <a
          className={`nav-item ${selected === 'logistics' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('logistics', e)}
          aria-current={selected === 'logistics' ? 'page' : undefined}
          aria-label="Logistics"
        >
          <div className="nav-icon"><LogisticsIcon /></div>
          <span className="nav-label">Logistics</span>
        </a>

        <a
          className={`nav-item ${selected === 'coordination' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('coordination', e)}
          aria-current={selected === 'coordination' ? 'page' : undefined}
          aria-label="Coordination"
        >
          <div className="nav-icon"><CoordinationIcon /></div>
          <span className="nav-label">Coordination</span>
        </a>

        <a
          className={`nav-item ${selected === 'users' ? 'active' : ''}`}
          href="#"
          onClick={(e) => click('users', e)}
          aria-current={selected === 'users' ? 'page' : undefined}
          aria-label="Users"
        >
          <div className="nav-icon"><UsersIcon /></div>
          <span className="nav-label">Users</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;