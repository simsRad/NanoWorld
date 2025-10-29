import React, { useState, useEffect } from 'react';
import Office365UsersService from '../generated/services/Office365UsersService';
import type { Office365UserRecord } from '../generated/models/Office365UsersModel';
import type { User } from '../types';

type Props = {
  onSelectUser: (u: User) => void;
};

const UserList: React.FC<Props> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<Office365UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
        try {
          const result = await Office365UsersService.getAll({
            select: ['id', 'displayName', 'givenName', 'surname', 'mail', 'jobTitle', 'department'],
            top: 50
          });
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          setUsers(result.data?.value || []);
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

  const handleUserClick = (user: Office365UserRecord) => {
    onSelectUser({
      id: user.id || '',
      name: user.displayName || '',
      department: user.department || 'No Department',
      role: user.jobTitle || 'No Role',
      email: user.mail || ''
    });
  };

  return (
    <div className="user-list card">
      <h3 style={{marginTop:0}}>People</h3>
      {users.map(user => (
        <div key={user.id} className="user-row" onClick={() => handleUserClick(user)}>
          <div className="user-avatar">
            {(user.displayName || '').split(' ').map((n: string) => n[0]).slice(0,2).join('')}
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <strong style={{fontSize:14}}>{user.displayName}</strong>
            <small style={{color:'#6b7280'}}>{user.jobTitle || 'No Title'}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;