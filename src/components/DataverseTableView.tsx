import React, { useState, useEffect } from 'react';
import { Cr8acCodeappstableService } from '../generated/services/Cr8acCodeappstableService';
import type { Cr8acCodeappstable } from '../generated/models/Cr8acCodeappstableModel';

const DataverseTableView: React.FC = () => {
  const [records, setRecords] = useState<Cr8acCodeappstable[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Cr8acCodeappstable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, statusFilter]);

  // Mock data for fallback
  const getMockData = (): Cr8acCodeappstable[] => [
    {
      cr8ac_codeappstableid: '12345678-1234-1234-1234-123456789abc',
      cr8ac_name: 'Sample Equipment Record',
      cr8ac_description: 'Demo equipment entry for testing purposes',
      cr8ac_value: 15000,
      createdon: new Date('2024-01-15T10:30:00Z'),
      modifiedon: new Date('2024-10-30T14:22:00Z'),
      statecode: 0,
      statuscode: 1
    },
    {
      cr8ac_codeappstableid: '87654321-4321-4321-4321-cba987654321',
      cr8ac_name: 'Test Asset Item',
      cr8ac_description: 'Another test record for demonstration',
      cr8ac_value: 8500,
      createdon: new Date('2024-02-20T09:15:00Z'),
      modifiedon: new Date('2024-10-29T16:45:00Z'),
      statecode: 0,
      statuscode: 1
    },
    {
      cr8ac_codeappstableid: 'abcdef12-3456-7890-abcd-ef1234567890',
      cr8ac_name: 'Inactive Equipment',
      cr8ac_description: 'Equipment marked as inactive for testing',
      cr8ac_value: 5200,
      createdon: new Date('2024-03-10T11:20:00Z'),
      modifiedon: new Date('2024-10-28T13:10:00Z'),
      statecode: 1,
      statuscode: 2
    }
  ];

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading Dataverse table records...');
      
      const result = await Cr8acCodeappstableService.getAll({ 
        top: 100,
        select: ['cr8ac_codeappstableid', 'cr8ac_name', 'cr8ac_description', 'cr8ac_value', 'createdon', 'modifiedon', 'statecode', 'statuscode'],
        orderBy: ['modifiedon desc']
      });
      
      console.log('Service result:', result);
      
      if (result.error) {
        console.error('Dataverse table loading error:', result.error);
        
        // Use mock data as fallback
        console.log('Using mock data as fallback due to connection error');
        const mockData = getMockData();
        setRecords(mockData);
        setError(`Connection issue (using demo data): ${result.error}`);
        
      } else if (result.data) {
        const tableData = Array.isArray(result.data) ? result.data : [];
        setRecords(tableData);
        console.log(`Loaded ${tableData.length} records from Dataverse table`);
        
        // If no real data, show mock data with a note
        if (tableData.length === 0) {
          console.log('No real records found, showing mock data');
          const mockData = getMockData();
          setRecords(mockData);
          setError('No records found in Dataverse table (showing demo data)');
        }
      } else {
        // Handle case where there's no error but also no data
        console.warn('No data returned from service, using mock data');
        const mockData = getMockData();
        setRecords(mockData);
        setError('No data returned from Dataverse (showing demo data)');
      }
    } catch (err) {
      console.error('Dataverse table loading error:', err);
      
      // Use mock data as fallback for any unexpected errors
      console.log('Using mock data as fallback due to unexpected error');
      const mockData = getMockData();
      setRecords(mockData);
      setError('Connection error (using demo data): ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.cr8ac_name?.toLowerCase().includes(search) ||
        record.cr8ac_description?.toLowerCase().includes(search) ||
        record.cr8ac_codeappstableid?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(record => {
        // Active if statecode is 0, inactive if statecode is 1
        return isActive ? record.statecode === 0 : record.statecode === 1;
      });
    }

    setFilteredRecords(filtered);
  };

  const getStatusBadge = (statecode?: number) => {
    if (statecode === undefined) return 'Unknown';
    return statecode === 0 ? 'Active' : 'Inactive';
  };

  const getStatusColor = (statecode?: number) => {
    if (statecode === undefined) return '#6c757d';
    return statecode === 0 ? '#28a745' : '#dc3545';
  };

  const formatRecordCode = (name?: string, id?: string): string => {
    if (name) {
      const words = name.split(' ').filter(w => w.length > 0);
      if (words.length >= 2) {
        return `DV/${words[0].substring(0, 2).toUpperCase()}/${words[1].substring(0, 2).toUpperCase()}`;
      } else if (words.length === 1) {
        return `DV/${words[0].substring(0, 2).toUpperCase()}/XX`;
      }
    }
    
    if (id) {
      return `DV/${id.substring(0, 4).toUpperCase()}`;
    }
    
    return 'DV/UN/KN';
  };

  const formatDate = (dateString?: Date | string): string => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const formatValue = (value?: number): string => {
    if (value === undefined || value === null) return 'No value';
    return value.toLocaleString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>🗂️ Dataverse Table Records</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Code Apps Table integration - Real data from Dataverse
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
            placeholder="🔍 Search records..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Records</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <button 
          onClick={loadRecords}
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
          ⏳ Loading Dataverse records...
        </div>
      )}

      {/* Records table */}
      {!loading && filteredRecords.length > 0 && (
        <div>
          <div style={{ 
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#495057' }}>
              📋 Records ({filteredRecords.length} of {records.length})
            </h3>
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
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📝 Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📄 Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>💰 Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📅 Created</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>📝 Modified</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>🔄 Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={record.cr8ac_codeappstableid || index} style={{ 
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#6c757d' }}>
                      {formatRecordCode(record.cr8ac_name, record.cr8ac_codeappstableid)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500', color: '#212529' }}>
                        {record.cr8ac_name || 'No name'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        ID: {record.cr8ac_codeappstableid?.substring(0, 8) || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {record.cr8ac_description || 'No description'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '2px 6px', 
                        backgroundColor: record.cr8ac_value ? '#e7f3ff' : '#f8f9fa', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: record.cr8ac_value ? '#0078d4' : '#6c757d'
                      }}>
                        {formatValue(record.cr8ac_value)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {formatDate(record.createdon)}
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>
                      {formatDate(record.modifiedon)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: record.statecode === 0 ? '#d4edda' : '#f8d7da',
                        color: getStatusColor(record.statecode)
                      }}>
                        {getStatusBadge(record.statecode)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No records message */}
      {!loading && filteredRecords.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <h3>🗂️ No Records Found</h3>
          <p>No records match your current filters. Try adjusting your search criteria.</p>
          <button 
            onClick={loadRecords}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0078d4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reload Data
          </button>
        </div>
      )}
    </div>
  );
};

export default DataverseTableView;