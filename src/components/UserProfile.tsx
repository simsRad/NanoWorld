import React, { useEffect, useState } from 'react';
import type { User } from '../types';

type Props = { user: User | null };

const UserProfile: React.FC<Props> = ({ user }) => {
  const [form, setForm] = useState<User | null>(null);

  useEffect(() => {
    setForm(user ? { ...user } : null);
  }, [user]);

  if (!form) {
    return (
      <div className="profile-form card" style={{minHeight:150,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{color:'#6b7280'}}>Select a user to view or edit their profile</div>
      </div>
    );
  }

  const onChange = (k: keyof User, v: string) => setForm(prev => prev ? { ...prev, [k]: v } : prev);

  const onSave = () => {
    // local-only - no backend
    alert(`Saved changes for ${form.name} (local state only)`);
  };

  return (
    <div className="profile-form">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>User Profile</h3>
      </div>
      <div className="form-row">
        <input value={form.name} onChange={(e)=>onChange('name', e.target.value)} placeholder="Name" />
      </div>
      <div className="form-row">
        <input value={form.email} onChange={(e)=>onChange('email', e.target.value)} placeholder="Email" />
      </div>
      <div className="form-row">
        <input value={form.role} onChange={(e)=>onChange('role', e.target.value)} placeholder="Role" />
        <input value={form.department} onChange={(e)=>onChange('department', e.target.value)} placeholder="Department" />
      </div>
      <button className="save-btn" onClick={onSave}>Save Changes</button>
    </div>
  );
};

export default UserProfile;