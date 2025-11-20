import React, { useEffect, useState } from 'react';
import { Cr8acCodeappstableService } from '../generated/services/Cr8acCodeappstableService';
import type { Cr8acCodeappstable } from '../generated/models/Cr8acCodeappstableModel';
import './Cr8acCodeappstableView.css';

export const Cr8acCodeappstableView: React.FC = () => {
  const [records, setRecords] = useState<Cr8acCodeappstable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ cr8ac_name: '', cr8ac_description: '', cr8ac_value: 0 });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await Cr8acCodeappstableService.getAll({
        orderBy: ['cr8ac_name asc']
      });

      if (result.error) {
        setError(result.error);
        setRecords([]);
      } else {
        setRecords(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    try {
      setError(null);
      const result = await Cr8acCodeappstableService.create(newRecord);
      
      if (result.error) {
        setError(result.error);
      } else {
        setShowCreateModal(false);
        setNewRecord({ cr8ac_name: '', cr8ac_description: '', cr8ac_value: 0 });
        await loadRecords(); // Reload the list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
    }
  };

  const filteredRecords = records.filter((record) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      record.cr8ac_name?.toLowerCase().includes(search) ||
      record.cr8ac_description?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="cr8ac-codeappstable-view">
        <div className="loading">Loading Code Apps Table records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cr8ac-codeappstable-view">
        <div className="error">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={loadRecords}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cr8ac-codeappstable-view">
      <div className="header">
        <h2>Code Apps Table</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowCreateModal(true)} className="create-btn">
            Create New
          </button>
          <button onClick={loadRecords} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="stats">
        <span>Total Records: {records.length}</span>
        {searchTerm && <span>Filtered: {filteredRecords.length}</span>}
      </div>

      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Value</th>
              <th>Status</th>
              <th>Created</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  {searchTerm ? 'No records match your search' : 'No records found'}
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.cr8ac_codeappstableid}>
                  <td>{record.cr8ac_name || 'N/A'}</td>
                  <td>{record.cr8ac_description || 'N/A'}</td>
                  <td>{record.cr8ac_value !== undefined ? record.cr8ac_value : 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${record.statecode === 0 ? 'active' : 'inactive'}`}>
                      {record.statecode === 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{record.createdon ? new Date(record.createdon).toLocaleDateString() : 'N/A'}</td>
                  <td>{record.modifiedon ? new Date(record.modifiedon).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Record</h3>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={newRecord.cr8ac_name}
                onChange={(e) => setNewRecord({ ...newRecord, cr8ac_name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newRecord.cr8ac_description}
                onChange={(e) => setNewRecord({ ...newRecord, cr8ac_description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                value={newRecord.cr8ac_value}
                onChange={(e) => setNewRecord({ ...newRecord, cr8ac_value: Number(e.target.value) })}
                placeholder="Enter value"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleCreateRecord} className="submit-btn" disabled={!newRecord.cr8ac_name}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cr8acCodeappstableView;
