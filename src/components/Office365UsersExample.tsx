import React, { useState, useEffect } from 'react';
import { Office365UsersService } from '../generated/services/Office365UsersService';

const Office365UsersExample: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users automatically when component mounts
  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading all Office 365 users...');
      const result = await Office365UsersService.getAll({ top: 50 });
      console.log('All users result:', result);
      
      if (result.error) {
        setError(`Error loading users: ${result.error}`);
      } else {
        setUsers(result.data?.value || []);
        // Set the first user as current user
        if (result.data?.value && result.data.value.length > 0) {
          setCurrentUser(result.data.value[0]);
        }
      }
    } catch (err) {
      console.error('Office 365 Users loading error:', err);
      setError('Error loading Office 365 users: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching current user from Office 365...');
      const result = await Office365UsersService.getCurrentUser();
      console.log('Current user result:', result);
      
      if (result.error) {
        setError(`Error loading current user: ${result.error}`);
      } else {
        setCurrentUser(result.data || null);
      }
    } catch (err) {
      console.error('Office 365 Users connection error:', err);
      setError('Error connecting to Office 365: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Searching users in Office 365...');
      const result = await Office365UsersService.searchUsers('', { top: 10 });
      console.log('Users search result:', result);
      
      if (result.error) {
        setError(`Error searching users: ${result.error}`);
      } else {
        setUsers(result.data?.value || []);
      }
    } catch (err) {
      console.error('Office 365 Users search error:', err);
      setError('Error searching Office 365 users: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Office 365 Users Integration</h2>
      <p>Connected to Office 365 Users via Microsoft Power Platform</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={fetchCurrentUser}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0078d4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Get My Profile'}
        </button>

        <button 
          onClick={searchUsers}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#107c10', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Search Users'}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '4px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {currentUser && (
        <div style={{ marginTop: '20px' }}>
          <h3>My Profile:</h3>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #0ea5e9',
            borderRadius: '4px'
          }}>
            <p><strong>Display Name:</strong> {currentUser.displayName || 'No display name'}</p>
            <p><strong>Email:</strong> {currentUser.mail || 'No email'}</p>
            <p><strong>Job Title:</strong> {currentUser.jobTitle || 'No job title'}</p>
            <p><strong>Department:</strong> {currentUser.department || 'No department'}</p>
            <p><strong>Office Location:</strong> {currentUser.officeLocation || 'No office location'}</p>
          </div>
        </div>
      )}

      {users && users.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Office 365 Users ({users.length} total):</h3>
          <div style={{ 
            maxHeight: '500px', 
            overflowY: 'auto', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead style={{ 
                backgroundColor: '#f8f9fa',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                <tr>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600'
                  }}>Name</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600'
                  }}>Email</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600'
                  }}>Job Title</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600'
                  }}>Department</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600'
                  }}>Office</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index} style={{ 
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                          {user.displayName || 'No name'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {user.userPrincipalName || ''}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      {user.mail || user.userPrincipalName || 'No email'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      {user.jobTitle || 'Not specified'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      {user.department || 'Not specified'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      {user.officeLocation || 'Not specified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          padding: '40px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '16px' }}>Loading Office 365 users...</div>
        </div>
      )}

      {users.length === 0 && !loading && !error && (
        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>No Office 365 users found</div>
          <div>Click "Get My Profile" or "Search Users" to load user data.</div>
        </div>
      )}
    </div>
  );
};

export default Office365UsersExample;