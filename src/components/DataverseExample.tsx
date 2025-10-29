import React, { useState, useEffect } from 'react';
import { Cr8acCodeappstableService, type IGetAllOptions } from '../generated/services/Cr8acCodeappstableService';
import type { Cr8acCodeappstable, ICr8acCodeappsTableCreateRequest } from '../generated/models/Cr8acCodeappstableModel';
import { PowerAppsGuard } from './PowerAppsGuard';

/**
 * Example component demonstrating Dataverse CRUD operations
 */
const DataverseExample: React.FC = () => {
  const [records, setRecords] = useState<Cr8acCodeappstable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const options: IGetAllOptions = {
        select: ['cr8ac_codeappstableid', 'cr8ac_name', 'cr8ac_description', 'cr8ac_value'],
        orderBy: ['cr8ac_name asc'],
        top: 50
      };

      const result = await Cr8acCodeappstableService.getAll(options);

      if (result.error) {
        setError(result.error);
      } else {
        setRecords(result.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create a new record
  const createRecord = async (record: ICr8acCodeappsTableCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      const result = await Cr8acCodeappstableService.create(record);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setRecords(prev => [result.data as Cr8acCodeappstable, ...prev]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a record (kept for future use - see DATAVERSE_GUIDE.md for usage)
  // const updateRecord = async (id: string, updates: Partial<Cr8acCodeappstable>) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const result = await Cr8acCodeappstableService.update(id, updates);

  //     if (result.error) {
  //       setError(result.error);
  //     } else {
  //       // Refresh records
  //       await fetchRecords();
  //     }
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  //     setError(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await Cr8acCodeappstableService.delete(id);

      if (result.error) {
        setError(result.error);
      } else {
        setRecords(prev => prev.filter(r => r.cr8ac_codeappstableid !== id));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <PowerAppsGuard>
      <div className="card" style={{ padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Code Apps Table Records</h3>

        {error && (
          <div style={{ padding: '0.5rem', backgroundColor: '#fee', color: '#c33', marginBottom: '1rem', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}

        <button
          onClick={fetchRecords}
          disabled={loading}
          style={{ marginBottom: '1rem', marginRight: '0.5rem' }}
          className="primary-cta"
        >
          {loading ? 'Loading...' : 'Refresh Records'}
        </button>

        <button
          onClick={() => {
            const newRecord: ICr8acCodeappsTableCreateRequest = {
              cr8ac_name: `Record ${new Date().getTime()}`,
              cr8ac_description: 'Sample record',
              cr8ac_value: Math.floor(Math.random() * 100)
            };
            createRecord(newRecord);
          }}
          disabled={loading}
          className="primary-cta"
        >
          Create Record
        </button>

        {loading && <p style={{ color: 'var(--muted)' }}>Loading...</p>}

        {records.length === 0 && !loading && (
          <p style={{ color: 'var(--muted)' }}>No records found</p>
        )}

        {records.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Value</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.cr8ac_codeappstableid} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{record.cr8ac_name}</td>
                    <td style={{ padding: '0.5rem' }}>{record.cr8ac_description}</td>
                    <td style={{ padding: '0.5rem' }}>{record.cr8ac_value}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button
                        onClick={() => deleteRecord(record.cr8ac_codeappstableid)}
                        disabled={loading}
                        style={{ color: '#c33', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PowerAppsGuard>
  );
};

export default DataverseExample;
