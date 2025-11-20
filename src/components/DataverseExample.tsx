import React, { useState, useEffect } from 'react';
import { SystemusersService } from '../generated/services/SystemusersService';
import { usePowerApps } from '../PowerProvider';
import type { Systemusers } from '../generated/models/SystemusersModel';

/**
 * Example component demonstrating Dataverse integration with Microsoft Power Apps SDK
 */
const DataverseExample: React.FC = () => {
  const { isInitialized, error: initError } = usePowerApps();
  const [users, setUsers] = useState<Systemusers[]>([]);
  const [currentUser, setCurrentUser] = useState<Systemusers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isInitialized) {
      loadDataverseData();
    }
  }, [isInitialized]);

  const loadDataverseData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading users from Dataverse...');

      // Load all users using the generated service
      const usersResult = await SystemusersService.getAll({
        select: ['systemuserid', 'fullname', 'internalemailaddress', 'jobtitle', 'isdisabled', 'modifiedon', 'createdon', 'businessunitidname'],
        orderBy: ['fullname asc'],
        top: 50
      });

      console.log('Users result:', usersResult);

      if (usersResult.error) {
        setError(`Error loading users: ${usersResult.error}`);
      } else {
        setUsers(usersResult.data || []);
        
        // Set first user as current user for demo
        if (usersResult.data && usersResult.data.length > 0) {
          setCurrentUser(usersResult.data[0]);
        }
      }

    } catch (err) {
      console.error('Error loading Dataverse data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load Dataverse data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDataverseData();
      return;
    }

    try {
      setLoading(true);
      
      // Use filter for search
      const searchResult = await SystemusersService.getAll({
        select: ['systemuserid', 'fullname', 'internalemailaddress', 'jobtitle', 'isdisabled', 'modifiedon', 'createdon', 'businessunitidname'],
        filter: `contains(fullname,'${searchTerm}') or contains(internalemailaddress,'${searchTerm}')`,
        orderBy: ['fullname asc'],
        top: 50
      });

      if (searchResult.error) {
        setError(searchResult.error.toString());
      } else {
        setUsers(searchResult.data || []);
      }

    } catch (err) {
      console.error('Error searching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Initializing Power Apps SDK...</div>
        {initError && <div style={{ color: 'red', marginTop: '10px' }}>Error: {initError}</div>}
      </div>
    );
  }

  const { context } = usePowerApps();
  const envInfo = {
    environmentId: context?.app?.environmentId,
    appId: context?.app?.appId,
    userId: context?.user?.objectId,
    userPrincipalName: context?.user?.userPrincipalName,
    tenantId: context?.user?.tenantId
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Dataverse Integration</h2>
        <p>Connected to Microsoft Dataverse with comprehensive user management.</p>
        
        {/* Environment Information */}
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Environment Information</h3>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            <div>Environment ID: {envInfo.environmentId || 'Not available'}</div>
            <div>App ID: {envInfo.appId || 'Not available'}</div>
            <div>User ID: {envInfo.userId || 'Not available'}</div>
            <div>User Principal Name: {envInfo.userPrincipalName || 'Not available'}</div>
            <div>Tenant ID: {envInfo.tenantId || 'Not available'}</div>
          </div>
        </div>

        {/* Current User */}
        {currentUser && (
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Current User</h3>
            <div>
              <strong>{currentUser.fullname}</strong> ({currentUser.jobtitle})
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              {currentUser.internalemailaddress} | {currentUser.businessunitidname || 'Unknown Business Unit'}
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              flex: 1
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 16px',
              background: '#c596e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
          <button
            onClick={loadDataverseData}
            style={{
              padding: '8px 16px',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#ffe6e6', 
            color: '#d00', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading Dataverse users...</div>
        </div>
      ) : (
        <div>
          <h3>System Users ({users.length} found)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Full Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Job Title</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Business Unit</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.systemuserid || index}>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      <strong>{user.fullname || 'N/A'}</strong>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      {user.internalemailaddress || user.domainname || 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      {user.jobtitle || 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      {user.businessunitidname || 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        background: user.isdisabled ? '#ffebee' : '#e8f5e8',
                        color: user.isdisabled ? '#c62828' : '#2e7d32'
                      }}>
                        {user.isdisabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '0.9em', color: '#666' }}>
                      {user.modifiedon ? new Date(user.modifiedon).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No users found. {searchTerm ? 'Try a different search term.' : 'Check your Dataverse connection.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataverseExample;