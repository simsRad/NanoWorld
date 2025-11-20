import React, { useState, useEffect } from 'react';
import { Cr8acCodeappstableService } from '../generated/services/Cr8acCodeappstableService';
import type { Cr8acCodeappstable } from '../generated/models/Cr8acCodeappstableModel';
import type { Cr8acEnvtablecodeappsModel } from '../generated/models/Cr8acEnvtablecodeappsModel';
import EnvRecordFormModal from './EnvRecordFormModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const EnvTableDataverseView: React.FC = () => {
  const [records, setRecords] = useState<Cr8acEnvtablecodeappsModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Cr8acEnvtablecodeappsModel | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Cr8acEnvtablecodeappsModel | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading real Dataverse table records...');
      
      // Use the working Cr8acCodeappstableService to get real data
      const result = await Cr8acCodeappstableService.getAll({ 
        top: 100,
        select: ['cr8ac_codeappstableid', 'cr8ac_name', 'cr8ac_description', 'cr8ac_value', 'createdon', 'modifiedon', 'statecode', 'statuscode'],
        orderBy: ['modifiedon desc']
      });
      
      console.log('Real Dataverse service result:', result);
      
      if (result.data && Array.isArray(result.data)) {
        // Convert Cr8acCodeappstable records to EnvTable format for display
        const convertedRecords: Cr8acEnvtablecodeappsModel[] = result.data.map((record: Cr8acCodeappstable) => ({
          cr8ac_envtablecodeappsid: record.cr8ac_codeappstableid,
          cr8ac_name: record.cr8ac_name || 'Unnamed Record',
          createdon: record.createdon,
          modifiedon: record.modifiedon,
          createdby: 'Dataverse User',
          modifiedby: 'Dataverse User', 
          statuscode: record.statuscode || 1,
          statecode: record.statecode || 0,
          // Add description as additional info if available
          cr8ac_description: (record as any).cr8ac_description,
          cr8ac_value: (record as any).cr8ac_value,
        }));
        
        setRecords(convertedRecords);
        console.log(`Loaded ${convertedRecords.length} real records from Dataverse`);
        
      } else if (result.error) {
        console.error('Dataverse connection error:', result.error);
        setError(`Connection error: ${result.error}`);
        // Fall back to mock data
        setRecords(getMockData());
      } else {
        console.log('No data returned, using mock data');
        setError('No records found in Dataverse');
        setRecords(getMockData());
      }
      
    } catch (err: any) {
      console.error('Error loading records:', err);
      setError(err?.message || 'Failed to load records');
      // Fall back to mock data
      setRecords(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback method
  const getMockData = (): Cr8acEnvtablecodeappsModel[] => {
    return [
      {
        cr8ac_envtablecodeappsid: '1',
        cr8ac_name: 'Production Environment Config',
        createdon: new Date('2024-01-15'),
        modifiedon: new Date('2024-01-20'),
        createdby: 'System Admin',
        modifiedby: 'System Admin',
        statuscode: 1,
        statecode: 0,
      },
      {
        cr8ac_envtablecodeappsid: '2',
        cr8ac_name: 'Development Environment Setup',
        createdon: new Date('2024-01-16'),
        modifiedon: new Date('2024-01-21'),
        createdby: 'System Admin',
        modifiedby: 'System Admin',
        statuscode: 1,
        statecode: 0,
      },
      {
        cr8ac_envtablecodeappsid: '3',
        cr8ac_name: 'Staging Environment Rules',
        createdon: new Date('2024-01-17'),
        modifiedon: new Date('2024-01-22'),
        createdby: 'System Admin',
        modifiedby: 'System Admin',
        statuscode: 2,
        statecode: 1,
      },
    ];
  };

  const handleAddNew = () => {
    setFormMode('create');
    setEditingRecord(null);
    setShowFormModal(true);
  };

  const handleEdit = (record: Cr8acEnvtablecodeappsModel) => {
    setFormMode('edit');
    setEditingRecord(record);
    setShowFormModal(true);
  };

  const handleDelete = (record: Cr8acEnvtablecodeappsModel) => {
    setDeletingRecord(record);
    setShowDeleteDialog(true);
  };

  const handleSaveRecord = async (recordData: Partial<Cr8acEnvtablecodeappsModel>) => {
    setActionLoading(true);
    
    try {
      if (formMode === 'create') {
        console.log('Creating new record in real Dataverse:', recordData);
        
        // Convert to Dataverse format
        const dataverseRecord = {
          cr8ac_name: recordData.cr8ac_name,
          cr8ac_description: 'Created via Environment Table',
          cr8ac_value: 1000, // Default value
        };
        
        const result = await Cr8acCodeappstableService.create(dataverseRecord);
        if (result.data) {
          // Convert back to display format
          const newRecord: Cr8acEnvtablecodeappsModel = {
            cr8ac_envtablecodeappsid: result.data.cr8ac_codeappstableid,
            cr8ac_name: result.data.cr8ac_name || 'New Record',
            createdon: result.data.createdon || new Date(),
            modifiedon: result.data.modifiedon || new Date(),
            createdby: 'Current User',
            modifiedby: 'Current User',
            statuscode: result.data.statuscode || 1,
            statecode: result.data.statecode || 0,
          };
          setRecords(prev => [newRecord, ...prev]);
        }
      } else if (editingRecord) {
        console.log('Updating record in real Dataverse:', editingRecord.cr8ac_envtablecodeappsid, recordData);
        
        // Convert to Dataverse format
        const dataverseRecord = {
          cr8ac_name: recordData.cr8ac_name,
          cr8ac_description: 'Updated via Environment Table',
        };
        
        const result = await Cr8acCodeappstableService.update(editingRecord.cr8ac_envtablecodeappsid!, dataverseRecord);
        if (result && result.data) {
          // Convert back to display format
          const updatedRecord: Cr8acEnvtablecodeappsModel = {
            ...editingRecord,
            cr8ac_name: recordData.cr8ac_name, // Use the form data since we just updated it
            modifiedon: new Date(),
            modifiedby: 'Current User',
          };
          
          setRecords(prev => prev.map(r => 
            r.cr8ac_envtablecodeappsid === editingRecord.cr8ac_envtablecodeappsid 
              ? updatedRecord 
              : r
          ));
        }
      }
      
      setShowFormModal(false);
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error saving record:', err);
      throw err; // Re-throw to let the form handle the error
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord?.cr8ac_envtablecodeappsid) return;
    
    setActionLoading(true);
    
    try {
      console.log('Deleting record from real Dataverse:', deletingRecord.cr8ac_envtablecodeappsid);
      await Cr8acCodeappstableService.delete(deletingRecord.cr8ac_envtablecodeappsid);
      setRecords(prev => prev.filter(r => 
        r.cr8ac_envtablecodeappsid !== deletingRecord.cr8ac_envtablecodeappsid
      ));
      setShowDeleteDialog(false);
      setDeletingRecord(null);
    } catch (err: any) {
      console.error('Error deleting record:', err);
      throw err; // Re-throw to let the dialog handle the error
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || 
      record.cr8ac_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.cr8ac_envtablecodeappsid?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && record.statecode === 0) ||
      (statusFilter === 'inactive' && record.statecode === 1);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="env-loading-container">
        <div className="env-loading-spinner"></div>
        <p>Loading environment table records...</p>
        <small>Connecting to Dataverse...</small>
      </div>
    );
  }

  return (
    <div className="env-table-view">
      <div className="env-table-header">
        <div>
          <h2 className="env-table-title">CodeApps Table Records</h2>
          <p className="env-table-subtitle">Manage cr8ac_codeappstable data from Dataverse (Real Data)</p>
        </div>
        <div className="env-table-actions">
          <button 
            onClick={loadRecords}
            className="env-refresh-btn"
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <button className="env-add-btn" onClick={handleAddNew}>
            + Add New Record
          </button>
        </div>
      </div>

      {error && (
        <div className="env-error-message">
          <p>⚠️ {error}</p>
          <p>Showing sample data instead.</p>
        </div>
      )}

      <div className="env-table-filters">
        <div className="env-filter-group">
          <label htmlFor="search">Search Records</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or ID..."
            className="env-search-input"
          />
        </div>
        
        <div className="env-filter-group">
          <label htmlFor="status">Filter by Status</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="env-status-filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="env-records-summary">
        <span>Total records: <strong>{records.length}</strong></span>
        <span>Filtered results: <strong>{filteredRecords.length}</strong></span>
      </div>

      <div className="env-table-container">
        <table className="env-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Name</th>
              <th>Created Date</th>
              <th>Modified Date</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.cr8ac_envtablecodeappsid}>
                  <td>{record.cr8ac_envtablecodeappsid}</td>
                  <td><strong>{record.cr8ac_name || 'Untitled Record'}</strong></td>
                  <td>{formatDate(record.createdon)}</td>
                  <td>{formatDate(record.modifiedon)}</td>
                  <td>{record.createdby || 'Unknown'}</td>
                  <td>
                    <span className={`env-status-badge ${record.statecode === 0 ? 'active' : 'inactive'}`}>
                      {record.statecode === 0 ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="env-record-actions">
                      <button 
                        className="env-action-btn" 
                        title="Edit record"
                        onClick={() => handleEdit(record)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="env-action-btn delete" 
                        title="Delete record"
                        onClick={() => handleDelete(record)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="env-no-records">
                  No records found matching the current filters.
                  <br />
                  <small>Try adjusting your search terms or status filter.</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="env-debug-info">
        <details>
          <summary>🔧 Debug Information</summary>
          <div className="env-debug-content">
            <p><strong>Records loaded:</strong> {records.length}</p>
            <p><strong>Search term:</strong> {searchTerm || '(none)'}</p>
            <p><strong>Status filter:</strong> {statusFilter}</p>
            <p><strong>Last error:</strong> {error || '(none)'}</p>
            <p><strong>Loading state:</strong> {loading ? 'Loading...' : 'Complete'}</p>
            <p><strong>Component version:</strong> Enhanced with CRUD operations</p>
            <p><strong>Data source:</strong> Real Dataverse cr8ac_codeappstable</p>
          </div>
        </details>
      </div>

      {/* Add/Edit Record Modal */}
      <EnvRecordFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        record={editingRecord}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingRecord(null);
        }}
        onConfirm={handleConfirmDelete}
        record={deletingRecord}
        deleting={actionLoading}
      />
    </div>
  );
};

export default EnvTableDataverseView;