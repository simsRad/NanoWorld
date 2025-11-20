import React, { useState, useEffect, useRef } from 'react';

type Props = {
  onNavigate?: (view: 'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination' | 'sharepoint' | 'office365' | 'dataverse' | 'envtable' | 'explorer' | 'lookup' | 'codeapps') => void;
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

const SharePointIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M13.5 1.515c3.066 0 5.55 2.485 5.55 5.55c0 .888-.208 1.727-.578 2.471l4.503 4.503a1.5 1.5 0 0 1 0 2.122L20.853 18.282a1.5 1.5 0 0 1-2.122 0l-4.503-4.503c-.744.37-1.583.578-2.471.578c-3.066 0-5.55-2.485-5.55-5.55s2.484-5.55 5.55-5.55zm0 2.25c-1.82 0-3.3 1.48-3.3 3.3s1.48 3.3 3.3 3.3s3.3-1.48 3.3-3.3s-1.48-3.3-3.3-3.3zM1.5 12A1.5 1.5 0 0 1 3 10.5h6A1.5 1.5 0 0 1 10.5 12v9A1.5 1.5 0 0 1 9 22.5H3A1.5 1.5 0 0 1 1.5 21v-9zm2.25 1.5v6h3.75v-6H3.75z"/>
  </svg>
);

const Office365Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17H4v-2h4v2zm0-4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z"/>
  </svg>
);

const DataverseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2zM2 2v20h20V2H2zm18 18H4V4h16v16z"/>
  </svg>
);

const EnvironmentTableIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
  </svg>
);

const LookupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#000" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);


const Sidebar: React.FC<Props> = ({ onNavigate }) => {
  // default to 'home' as the initial selected view
  // include 'logistics' and 'coordination' in the state union so setSelected accepts it
  const [selected, setSelected] = useState<'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination' | 'sharepoint' | 'office365' | 'dataverse' | 'envtable' | 'explorer' | 'lookup' | 'codeapps'>('home');
  const [expanded, setExpanded] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const click = (view: 'home' | 'orders' | 'stock' | 'logistics' | 'users' | 'coordination' | 'sharepoint' | 'office365' | 'dataverse' | 'envtable' | 'explorer' | 'lookup' | 'codeapps', e?: React.MouseEvent) => {
    e?.preventDefault();
    setSelected(view);
    setMobileMenuOpen(false); // Close mobile menu when item is selected
    onNavigate?.(view);
  };

  // Define all navigation items
  const allNavItems = [
    { key: 'home', label: 'Home', icon: <HomeIcon />, ariaLabel: 'Home' },
    { key: 'orders', label: 'Orders', icon: <OrdersIcon />, ariaLabel: 'Orders' },
    { key: 'stock', label: 'Stock', icon: <StockIcon />, ariaLabel: 'Stock' },
    { key: 'logistics', label: 'Logistics', icon: <LogisticsIcon />, ariaLabel: 'Logistics' },
    { key: 'coordination', label: 'Coordination', icon: <CoordinationIcon />, ariaLabel: 'Coordination' },
    { key: 'users', label: 'Users', icon: <UsersIcon />, ariaLabel: 'Users' },
    { key: 'lookup', label: 'Lookup Manager', icon: <LookupIcon />, ariaLabel: 'Lookup Manager' },
    { key: 'codeapps', label: 'Code Apps Table', icon: <DataverseIcon />, ariaLabel: 'Code Apps Table' },
    { key: 'sharepoint', label: 'SharePoint', icon: <SharePointIcon />, ariaLabel: 'SharePoint' },
    { key: 'office365', label: 'Office 365', icon: <Office365Icon />, ariaLabel: 'Office 365 Users' },
    { key: 'dataverse', label: 'Dataverse', icon: <DataverseIcon />, ariaLabel: 'Dataverse' },
    { key: 'envtable', label: 'Env Table', icon: <EnvironmentTableIcon />, ariaLabel: 'Environment Table' },
    { key: 'explorer', label: 'DV Explorer', icon: '🔍', ariaLabel: 'Dataverse Explorer' }
  ] as const;

  // For mobile: show first 4 items + more button
  const mobileVisibleItems = allNavItems.slice(0, 4);
  const mobileHiddenItems = allNavItems.slice(4);
  
  // Ref for clicking outside to close mobile menu
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);
  
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

      {/* Desktop Navigation - Show all items */}
      <nav className="sidebar-nav desktop-nav" role="navigation" aria-label="Main">
        {allNavItems.map((item) => (
          <a
            key={item.key}
            className={`nav-item ${selected === item.key ? 'active' : ''}`}
            href="#"
            onClick={(e) => click(item.key as any, e)}
            aria-current={selected === item.key ? 'page' : undefined}
            aria-label={item.ariaLabel}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Mobile Navigation - Show first 4 + overflow menu */}
      <nav className="sidebar-nav mobile-nav" role="navigation" aria-label="Main">
        {mobileVisibleItems.map((item) => (
          <a
            key={item.key}
            className={`nav-item ${selected === item.key ? 'active' : ''}`}
            href="#"
            onClick={(e) => click(item.key as any, e)}
            aria-current={selected === item.key ? 'page' : undefined}
            aria-label={item.ariaLabel}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
        
        {/* More button for mobile overflow */}
        <div className="nav-item more-menu" ref={mobileMenuRef}>
          <button
            className={`more-button ${mobileMenuOpen ? 'menu-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="More options"
          >
            <div className="nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </div>
            <span className="nav-label">More</span>
          </button>
          
          {/* Overflow menu */}
          {mobileMenuOpen && (
            <div className="mobile-overflow-menu">
              {mobileHiddenItems.map((item, index) => (
                <a
                  key={`${item.key}-${index}`}
                  className={`overflow-nav-item ${selected === item.key ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => click(item.key as any, e)}
                  aria-label={item.ariaLabel}
                >
                  <span className="nav-label">{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;