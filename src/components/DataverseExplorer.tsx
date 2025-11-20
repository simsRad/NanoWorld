import React, { useState, useEffect } from 'react';
import { DataverseExplorerService } from '../services/DataverseExplorerService';
import type { IDataverseRecord } from '../services/DataverseExplorerService';
import { SystemusersService } from '../generated/services/SystemusersService';
import DataModal from './DataModal';
import './DataverseExplorer.css';

interface IExplorerState {
  availableSources: string[];
  dataverseTables: string[];
  systemUsers: IDataverseRecord[];
  selectedTable: string;
  records: IDataverseRecord[];
  loading: boolean;
  error: string | null;
  createForm: {
    show: boolean;
    data: Record<string, any>;
  };
  modal: {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    tableName: string;
    recordData: Record<string, any>;
  };
}

const DataverseExplorer: React.FC = () => {
  const [state, setState] = useState<IExplorerState>({
    availableSources: [],
    dataverseTables: [],
    systemUsers: [],
    selectedTable: 'systemusers',
    records: [],
    loading: false,
    error: null,
    createForm: {
      show: false,
      data: {}
    },
    modal: {
      isOpen: false,
      mode: 'create',
      tableName: 'systemusers',
      recordData: {}
    }
  });

  useEffect(() => {
    initializeExplorer();
  }, []);

  const initializeExplorer = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get available data sources
      const sources = DataverseExplorerService.getAvailableDataSources();
      const dataverseTables = DataverseExplorerService.getDataverseTables();
      
      console.log('Available sources:', sources);
      console.log('Dataverse tables:', dataverseTables);
      
      setState(prev => ({ 
        ...prev, 
        availableSources: sources,
        dataverseTables: dataverseTables,
        loading: false 
      }));

      // Load system users as they're the main Dataverse table we have
      await loadSystemUsers();
      
    } catch (error) {
      console.error('Failed to initialize explorer:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : String(error),
        loading: false 
      }));
    }
  };

  const loadSystemUsers = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Loading system users with both services...');
      
      // Try the generated service first
      try {
        const result = await SystemusersService.getAll({
          top: 50
        });
        
        console.log('SystemusersService result:', result);
        
        if (result.data && result.data.length > 0) {
          setState(prev => ({ 
            ...prev, 
            systemUsers: result.data || [],
            records: result.data || [],
            loading: false,
            error: null
          }));
          return;
        }
      } catch (sysError) {
        console.warn('SystemusersService failed:', sysError);
      }

      // Try the generic service as fallback
      const genericResult = await DataverseExplorerService.getRecords('systemusers', {
        top: 50
      });
      
      console.log('DataverseExplorerService result:', genericResult);
      
      if (genericResult.success && genericResult.data) {
        setState(prev => ({ 
          ...prev, 
          systemUsers: genericResult.data || [],
          records: genericResult.data || [],
          loading: false,
          error: null
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: genericResult.error || 'No records found',
          loading: false 
        }));
      }
    } catch (error) {
      console.error('Failed to load system users:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : String(error),
        loading: false 
      }));
    }
  };

  const loadRecordsFromTable = async (tableName: string) => {
    setState(prev => ({ ...prev, loading: true, selectedTable: tableName }));
    
    try {
      const result = await DataverseExplorerService.getRecords(tableName, {
        top: 20
      });
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          records: result.data || [],
          loading: false,
          error: null
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'Failed to load records',
          loading: false 
        }));
      }
    } catch (error) {
      console.error('Failed to load records:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : String(error),
        loading: false 
      }));
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', tableName: string, recordData: Record<string, any> = {}) => {
    setState(prev => ({
      ...prev,
      modal: {
        isOpen: true,
        mode,
        tableName,
        recordData
      }
    }));
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      modal: {
        ...prev.modal,
        isOpen: false
      }
    }));
  };

  const handleModalSave = async (data: Record<string, any>) => {
    try {
      if (state.modal.mode === 'create') {
        const result = await DataverseExplorerService.createRecord(state.modal.tableName, data);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create record');
        }
      } else if (state.modal.mode === 'edit') {
        const result = await DataverseExplorerService.updateRecord(
          state.modal.tableName,
          state.modal.recordData.id || state.modal.recordData.systemuserid,
          data
        );
        if (!result.success) {
          throw new Error(result.error || 'Failed to update record');
        }
      }
      
      // Reload records after successful operation
      await loadRecordsFromTable(state.selectedTable);
    } catch (error) {
      console.error('Modal save failed:', error);
      throw error; // Re-throw to let modal handle the error display
    }
  };

  const handleModalDelete = async (id: string) => {
    try {
      const result = await DataverseExplorerService.deleteRecord(state.modal.tableName, id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete record');
      }
      
      // Reload records after successful deletion
      await loadRecordsFromTable(state.selectedTable);
    } catch (error) {
      console.error('Modal delete failed:', error);
      throw error; // Re-throw to let modal handle the error display
    }
  };

  const tryCreateRecord = async () => {
    if (!state.createForm.data || Object.keys(state.createForm.data).length === 0) {
      alert('Please add some data to create a record');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await DataverseExplorerService.createRecord(
        state.selectedTable, 
        state.createForm.data
      );
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false,
          createForm: { show: false, data: {} },
          error: null
        }));
        
        // Reload records
        await loadRecordsFromTable(state.selectedTable);
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'Failed to create record',
          loading: false 
        }));
      }
    } catch (error) {
      console.error('Failed to create record:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : String(error),
        loading: false 
      }));
    }
  };

  const renderRecordValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div className="dataverse-explorer">
      <div className="explorer-header">
        <h2>🔍 Dataverse Explorer</h2>
        <p>Explore available Dataverse data and operations</p>
      </div>

      {state.error && (
        <div className="error-message">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      <div className="explorer-section">
        <h3>📊 Available Data Sources ({state.availableSources.length})</h3>
        <div className="sources-grid">
          {state.availableSources.map(source => (
            <div 
              key={source} 
              className={`source-card ${state.dataverseTables.includes(source) ? 'dataverse' : 'connector'}`}
              onClick={() => loadRecordsFromTable(source)}
            >
              <div className="source-name">{source}</div>
              <div className="source-type">
                {state.dataverseTables.includes(source) ? 'Dataverse Table' : 'Connector'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="explorer-section">
        <h3>🗃️ Dataverse Tables ({state.dataverseTables.length})</h3>
        <div className="tables-info">
          {state.dataverseTables.length > 0 ? (
            <div>
              <p><strong>Available Dataverse Tables:</strong></p>
              <ul>
                {state.dataverseTables.map(table => (
                  <li key={table}>
                    <button 
                      className="table-button"
                      onClick={() => loadRecordsFromTable(table)}
                    >
                      {table}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No custom Dataverse tables found. You can work with system tables like 'systemusers'.</p>
          )}
        </div>
      </div>

      <div className="explorer-section">
        <h3>📋 Records from: {state.selectedTable}</h3>
        <div className="records-controls">
          <button 
            onClick={() => loadRecordsFromTable(state.selectedTable)}
            disabled={state.loading}
          >
            🔄 Refresh Records
          </button>
          <button 
            onClick={() => openModal('create', state.selectedTable)}
          >
            ➕ Create New Record
          </button>
          <button 
            onClick={() => setState(prev => ({ 
              ...prev, 
              createForm: { show: !prev.createForm.show, data: {} }
            }))}
          >
            🔧 Advanced Create
          </button>
        </div>

        {state.createForm.show && (
          <div className="create-form">
            <h4>Create New Record</h4>
            <textarea
              placeholder="Enter JSON data (e.g., {'name': 'Test', 'description': 'Test record'})"
              value={JSON.stringify(state.createForm.data, null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value || '{}');
                  setState(prev => ({ 
                    ...prev, 
                    createForm: { ...prev.createForm, data }
                  }));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={6}
            />
            <div className="form-buttons">
              <button onClick={tryCreateRecord} disabled={state.loading}>
                Create Record
              </button>
              <button 
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  createForm: { show: false, data: {} }
                }))}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="loading">Loading records...</div>
        )}

        {state.records.length > 0 && (
          <div className="records-table">
            <p><strong>Found {state.records.length} records:</strong></p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {Object.keys(state.records[0] || {}).slice(0, 10).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.records.slice(0, 20).map((record, index) => (
                    <tr 
                      key={index}
                      onClick={() => openModal('view', state.selectedTable, record)}
                      style={{ cursor: 'pointer' }}
                      title="Click to view record details"
                    >
                      {Object.keys(record).slice(0, 10).map(key => (
                        <td key={key} title={renderRecordValue(record[key])}>
                          {renderRecordValue(record[key]).substring(0, 50)}
                          {renderRecordValue(record[key]).length > 50 ? '...' : ''}
                        </td>
                      ))}
                      <td>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', state.selectedTable, record);
                          }}
                          className="table-action-button edit"
                          title="Edit record"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {state.records.length === 0 && !state.loading && (
          <div className="no-records">
            No records found in {state.selectedTable}
          </div>
        )}
      </div>

      <DataModal
        isOpen={state.modal.isOpen}
        tableName={state.modal.tableName}
        mode={state.modal.mode}
        initialData={state.modal.recordData}
        onClose={closeModal}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />
    </div>
  );
};

export default DataverseExplorer;