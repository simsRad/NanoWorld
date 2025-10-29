import React, { useState } from 'react';

type Props = {
  initial?: {
    name?: string;
    email?: string;
    profileId?: string;
    role?: string;
    manager?: string;
    theme?: 'light' | 'dark';
  };
  onBack?: () => void;
  onSave?: (payload: Record<string, any>) => void;
};

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="4" fill="#FBBF24" />
    <g stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.2 4.2l1.4 1.4" />
      <path d="M18.4 18.4l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.2 19.8l1.4-1.4" />
      <path d="M18.4 5.6l1.4-1.4" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#374151" />
  </svg>
);

const Profile: React.FC<Props> = ({ initial = {}, onBack, onSave }) => {
  const [name] = useState(initial.name ?? 'Simunye Radingwana');
  const [email] = useState(initial.email ?? 'simunye.r@nanofiber.co.uk');
  const [profileId] = useState(initial.profileId ?? 'UID-0001');
  const [role] = useState(initial.role ?? 'Developer');
  const [manager] = useState(initial.manager ?? 'Stephan Theron');
  const [theme, setTheme] = useState<'light' | 'dark'>(initial.theme ?? 'light');

  const handleSave = () => {
    const payload = { name, email, profileId, role, manager, theme };
    onSave?.(payload);
    alert('Profile saved (demo)');
    onBack?.();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Manage Account</h2>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Profile details (view only) and site preferences</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-muted" onClick={onBack}>Close</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>
            <div className="label">Name</div>
            <input value={name} readOnly />
          </label>

          <label>
            <div className="label">Email</div>
            <input value={email} readOnly />
          </label>

          <label>
            <div className="label">Profile ID</div>
            <input value={profileId} readOnly />
          </label>

          <label>
            <div className="label">Role</div>
            <input value={role} readOnly />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            <div className="label">Manager</div>
            <input value={manager} readOnly />
          </label>

          <div style={{ gridColumn: '1 / -1' }}>
            <div className="label">Theme</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
                aria-pressed={theme === 'dark'}
                title="Toggle theme"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #e6e9ee',
                  background: theme === 'dark' ? '#111827' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#111827',
                  cursor: 'pointer'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                </span>
                <span style={{ fontWeight: 600 }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>

              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                Toggle app theme. Other fields are read-only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;