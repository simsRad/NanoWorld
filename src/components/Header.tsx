import React, { useEffect, useRef, useState } from 'react';

type Props = { onNavigate?: (view: 'home' | 'orders' | 'stock' | 'logistics' | 'profile' | 'logout') => void };

const LOGO_SRC = 'https://nanofibre.co.uk/wp-content/uploads/2023/08/cropped-Nano-1-e1740481081777.png';

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 40 40" fill="currentColor" aria-hidden>
    <path d="M20 21.456c-5.127 0-9.298-4.171-9.298-9.298S14.873 2.861 20 2.861s9.298 4.171 9.298 9.298s-4.171 9.297-9.298 9.297zm0-17.712c-4.639 0-8.414 3.775-8.414 8.414s3.775 8.414 8.414 8.414s8.414-3.775 8.414-8.414S24.639 3.744 20 3.744zm16.828 33.395H3.172a.442.442 0 0 1-.442-.442V30.99c.403-7.249 6.934-7.686 7-7.69l20.513-.001c.09.004 6.623.442 7.025 7.666l.001 5.732a.44.44 0 0 1-.441.442zm-33.214-.883h32.772V30.99c-.358-6.418-5.929-6.795-6.166-6.808l-20.465.001c-.212.013-5.783.41-6.141 6.831v5.242z"/>
  </svg>
);

const Header: React.FC<Props> = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="header">
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="site-logo-wrap">
            <img src={LOGO_SRC} alt="Nano Fibre" className="site-logo-img" />
          </div>
        </div>

        <div ref={wrapRef} style={{ position: 'relative' }}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="user-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff', /* reduced gradient: plain white */
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
              cursor: 'pointer'
            }}
            title="Account"
          >
            <UserIcon />
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Account menu"
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                minWidth: 180,
                background: '#fff',
                boxShadow: '0 6px 20px rgba(20,20,40,0.08)',
                borderRadius: 8,
                padding: 8,
                zIndex: 80,
                border: '1px solid #e6e9ee'
              }}
            >
              <button
                type="button"
                onClick={() => { setOpen(false); onNavigate?.('profile'); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', border: 0, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
              >
                Manage account
              </button>
              <div style={{ height: 1, background: '#eef2f6', margin: '6px 0' }} />
              <button
                type="button"
                onClick={() => { setOpen(false); onNavigate?.('logout'); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', border: 0, background: 'transparent', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;