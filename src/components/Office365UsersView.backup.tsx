import React, { useState, useEffect } from 'react';
import { EnhancedOffice365UsersService } from '../services/EnhancedOffice365UsersService';
import type { Office365UserRecord } from '../generated/models/Office365UsersModel';

const Office365UsersView: React.FC = () => {
  const [users, setUsers] = useState<Office365UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Office365UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [mainStoreroomFilter, setMainStoreroomFilter] = useState('');
  const [ispFilter, setIspFilter] = useState('');

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, areaFilter, departmentFilter, mainStoreroomFilter, ispFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await EnhancedOffice365UsersService.getAll({ 
        top: 100,
        select: ['id', 'displayName', 'givenName', 'surname', 'mail', 'userPrincipalName', 'jobTitle', 'department', 'officeLocation', 'accountEnabled', 'businessPhones', 'mobilePhone']
      });
      
      if (result.error) {
        setError(`Error loading users: ${result.error}`);
      } else {
        const userData = result.data?.value || [];
        setUsers(userData);
      }
    } catch (err) {
      console.error('Office 365 Users loading error:', err);
      setError('Error loading Office 365 users: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(search) ||
        user.givenName?.toLowerCase().includes(search) ||
        user.surname?.toLowerCase().includes(search) ||
        user.mail?.toLowerCase().includes(search) ||
        user.userPrincipalName?.toLowerCase().includes(search)
      );
    }

    // Area filter (using office location)
    if (areaFilter) {
      filtered = filtered.filter(user => 
        user.officeLocation?.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(user => 
        user.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getUniqueValues = (field: keyof Office365UserRecord): string[] => {
    const values = users
      .map(user => {
        const value = user[field];
        return typeof value === 'string' ? value : '';
      })
      .filter(value => value && value !== 'TBC' && value !== 'Not specified')
      .filter((value, index, self) => self.indexOf(value) === index);
    return values.sort();
  };

  const getUserStatus = (user: Office365UserRecord): string => {
    if (user.accountEnabled === false) return 'Ex-Employee';
    if (!user.mail || user.mail === 'TBC') return 'Pending';
    return 'Active';
  };

  const getUserDisplayType = (user: Office365UserRecord): string => {
    // Simulate the MS/FN/RP pattern from your data
    if (user.displayName?.includes('Manager') || user.jobTitle?.includes('Manager')) return 'MS';
    if (user.mail && user.mail !== 'TBC') return 'FN';
    return 'RP';
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '10px' }}>
            Loading Office 365 users...
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            Please wait while we fetch the user directory
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={loadUsers}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with filters */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Use first name, last name, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            minWidth: '250px',
            fontSize: '14px'
          }}
        />

        {/* Area filter */}
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Area</option>
          {getUniqueValues('officeLocation').map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        {/* Department filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Department</option>
          {getUniqueValues('department').map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Main Storeroom filter (placeholder) */}
        <select
          value={mainStoreroomFilter}
          onChange={(e) => setMainStoreroomFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Main Storeroom</option>
          <option value="London">London</option>
          <option value="Manchester">Manchester</option>
          <option value="Birmingham">Birmingham</option>
        </select>

        {/* ISP filter (placeholder) */}
        <select
          value={ispFilter}
          onChange={(e) => setIspFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">ISP</option>
          <option value="BT">BT</option>
          <option value="Virgin">Virgin</option>
          <option value="Sky">Sky</option>
        </select>

        {/* New button */}
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span> New
        </button>
      </div>

      {/* Users table */}
      <div style={{ 
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> Names
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✉️</span> Email
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👥</span> Manager
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💼</span> Title
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌟</span> Status
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏢</span> Department
                </div>
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏪</span> Main Storeroom
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const userType = getUserDisplayType(user);
              const status = getUserStatus(user);
              
              return (
                <tr key={user.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '2px' }}>
                        <strong>{userType}:</strong> {user.displayName || 'No name'}
                      </div>
                      {user.givenName && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          <strong>FN:</strong> {user.givenName} {user.surname || ''}
                        </div>
                      )}
                      {user.userPrincipalName && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          <strong>RP:</strong> {user.userPrincipalName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>
                    {user.mail || 'TBC'}
                  </td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>
                    TBC
                  </td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>
                    {user.jobTitle || 'TBC'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: status === 'Ex-Employee' ? '#fee2e2' : 
                                     status === 'Pending' ? '#fef3c7' : '#dcfce7',
                      color: status === 'Ex-Employee' ? '#dc2626' : 
                             status === 'Pending' ? '#d97706' : '#16a34a'
                    }}>
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>
                    {user.department || 'TBC'}
                  </td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>
                    {user.officeLocation || 'TBC'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              No users found
            </div>
            <div style={{ fontSize: '14px' }}>
              Try adjusting your search criteria or filters
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{ 
        marginTop: '12px', 
        fontSize: '14px', 
        color: '#6b7280',
        textAlign: 'right'
      }}>
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default Office365UsersView;