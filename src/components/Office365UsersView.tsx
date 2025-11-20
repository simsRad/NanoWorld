import React, { useState, useEffect } from 'react';
import { GraphOffice365UsersService } from '../services/GraphOffice365UsersService';
import { EnhancedOffice365UsersService } from '../services/EnhancedOffice365UsersService';
import type { Office365UserRecord } from '../generated/models/Office365UsersModel';

const Office365UsersView: React.FC = () => {
  const [users, setUsers] = useState<Office365UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Office365UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, departmentFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      console.log('Attempting to load real Office 365 users...');
      
      // Try to load real data first
      const result = await GraphOffice365UsersService.getAll({ 
        top: 100,
        select: ['id', 'displayName', 'givenName', 'surname', 'mail', 'userPrincipalName', 'jobTitle', 'department', 'officeLocation', 'accountEnabled', 'businessPhones', 'mobilePhone']
      });
      
      if (result.error) {
        console.warn('Real Office 365 API failed, falling back to mock data:', result.error);
        
        // Fallback to mock data
        const mockResult = await EnhancedOffice365UsersService.getAll({ 
          top: 100,
          select: ['id', 'displayName', 'givenName', 'surname', 'mail', 'userPrincipalName', 'jobTitle', 'department', 'officeLocation', 'accountEnabled', 'businessPhones', 'mobilePhone']
        });
        
        if (mockResult.error) {
          setError(`Error loading user data: ${mockResult.error}`);
        } else {
          const userData = mockResult.data?.value || [];
          setUsers(userData);
          setUsingMockData(true);
        }
      } else {
        const userData = result.data?.value || [];
        setUsers(userData);
        console.log(`Loaded ${userData.length} real Office 365 users`);
      }
    } catch (err) {
      console.error('Office 365 Users loading error:', err);
      
      // Final fallback to mock data
      try {
        console.log('Attempting fallback to mock data...');
        const mockResult = await EnhancedOffice365UsersService.getAll({ 
          top: 100,
          select: ['id', 'displayName', 'givenName', 'surname', 'mail', 'userPrincipalName', 'jobTitle', 'department', 'officeLocation', 'accountEnabled', 'businessPhones', 'mobilePhone']
        });
        
        if (mockResult.data?.value) {
          setUsers(mockResult.data.value);
          setUsingMockData(true);
        } else {
          setError('Unable to load user data');
        }
      } catch (mockErr) {
        setError('Error loading user data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(search) ||
        user.givenName?.toLowerCase().includes(search) ||
        user.surname?.toLowerCase().includes(search) ||
        user.mail?.toLowerCase().includes(search) ||
        user.userPrincipalName?.toLowerCase().includes(search)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.accountEnabled === isActive);
    }

    setFilteredUsers(filtered);
  };

  const formatPhoneNumbers = (phones?: string[] | string): string => {
    if (!phones) return 'No phone';
    if (typeof phones === 'string') return phones;
    if (Array.isArray(phones) && phones.length > 0) return phones[0];
    return 'No phone';
  };

  const getStatusBadge = (accountEnabled?: boolean) => {
    if (accountEnabled === undefined) return 'Unknown';
    return accountEnabled ? 'Active' : 'Inactive';
  };

  const getStatusColor = (accountEnabled?: boolean) => {
    if (accountEnabled === undefined) return '#6c757d';
    return accountEnabled ? '#28a745' : '#dc3545';
  };

  const formatUserCode = (displayName?: string): string => {
    if (!displayName) return 'UK/UN/XX';
    
    const names = displayName.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    
    const firstInitials = firstName.substring(0, 2).toUpperCase();
    const lastInitials = lastName.substring(0, 2).toUpperCase();
    
    return `MS/${firstInitials}/${lastInitials}`;
  };

  const departments = Array.from(new Set(users.map(user => user.department).filter(Boolean)));

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>👥 Office 365 Users Directory</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Office 365 Users integration
          {usingMockData && (
            <span style={{ 
              marginLeft: '10px', 
              padding: '2px 8px', 
              backgroundColor: '#ffc107', 
              color: '#212529', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              DEMO DATA
            </span>
          )}
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <button 
          onClick={loadUsers}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0078d4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '8px',
          color: '#721c24'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          fontSize: '16px',
          color: '#666'
        }}>
          ⏳ Loading Office 365 users...
        </div>
      )}

      {/* Users table */}
      {!loading && filteredUsers.length > 0 && (
        <div>
          <div style={{ 
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#495057' }}>
              📋 Users ({filteredUsers.length} of {users.length})
            </h3>
            {usingMockData && (
              <div style={{
                padding: '4px 8px',
                backgroundColor: '#ffc107',
                color: '#212529',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Using demo data - Real API unavailable
              </div>
            )}
          </div>
          
          <div style={{ 
            overflowX: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>👤 User</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>✉️ Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>🏢 Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>🏷️ Department</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📍 Location</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📱 Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>🔄 Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || index} style={{ 
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#6c757d' }}>
                      {formatUserCode(user.displayName)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500', color: '#212529' }}>
                        {user.displayName || 'No name'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {user.userPrincipalName || 'No UPN'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {user.mail || 'No email'}
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {user.jobTitle || 'No title'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {user.department && (
                        <span style={{ 
                          padding: '2px 6px', 
                          backgroundColor: '#e7f3ff', 
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#0078d4'
                        }}>
                          {user.department}
                        </span>
                      )}
                      {!user.department && <span style={{ color: '#6c757d' }}>No department</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {user.officeLocation || 'Not specified'}
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {formatPhoneNumbers(user.businessPhones || user.mobilePhone)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: user.accountEnabled ? '#d4edda' : '#f8d7da',
                        color: getStatusColor(user.accountEnabled)
                      }}>
                        {getStatusBadge(user.accountEnabled)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No users message */}
      {!loading && filteredUsers.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <h3>👥 No Users Found</h3>
          <p>No users match your current filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Office365UsersView;