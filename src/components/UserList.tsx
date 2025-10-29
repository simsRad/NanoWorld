import React, { useState, useEffect } from 'react';
import { SystemUserService, type SystemUser } from '../services/systemUserService';
import type { User } from '../types';

type Props = {
  onSelectUser: (u: User) => void;
};

const UserList: React.FC<Props> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
        try {
          const systemUsers = await SystemUserService.getInstance().getUsers();
          setUsers(systemUsers);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
          setLoading(false);
        }
      }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="user-list card">
        <h3 style={{marginTop:0}}>People</h3>
        <div className="p-4 text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list card">
        <h3 style={{marginTop:0}}>People</h3>
        <div className="p-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  const handleUserClick = (user: SystemUser) => {
    onSelectUser({
      id: user.systemuserid,
      name: user.fullname || '',
      department: user.title || 'No Department',
      role: user.title || 'No Role',
      email: user.internalemailaddress || ''
    });
  };

  return (
    <div className="user-list card">
      <h3 style={{marginTop:0}}>People</h3>
      {users.map(user => (
        <div key={user.systemuserid} className="user-row" onClick={() => handleUserClick(user)}>
          <div className="user-avatar">
            {(user.fullname || '').split(' ').map((n: string) => n[0]).slice(0,2).join('')}
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <strong style={{fontSize:14}}>{user.fullname}</strong>
            <small style={{color:'#6b7280'}}>{user.title || 'No Title'}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;