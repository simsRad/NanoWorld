import React, { useEffect, useState } from 'react';
import './NeoWonlookupMasterView.css';
import { 
  getAllNeoWonlookupMaster, 
  getNeoWonlookupMasterByCategory,
  getActiveNeoWonlookupMaster,
  searchNeoWonlookupMaster 
} from '../generated/services/NeoWonlookupMasterService';
import type { NeoWonlookupMaster } from '../generated/models/NeoWonlookupMasterModel';

export const NeoWonlookupMasterView: React.FC = () => {
  const [lookupData, setLookupData] = useState<NeoWonlookupMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load initial data
  useEffect(() => {
    loadLookupData();
  }, []);

  const loadLookupData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllNeoWonlookupMaster({
        orderBy: ['neo_sortorder', 'neo_name']
      });
      
      if (result.error) {
        setError(result.error);
      } else {
        setLookupData(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lookup data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadLookupData();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await searchNeoWonlookupMaster(searchTerm);
      
      if (result.error) {
        setError(result.error);
      } else {
        setLookupData(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    if (!category) {
      loadLookupData();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await getNeoWonlookupMasterByCategory(category);
      
      if (result.error) {
        setError(result.error);
      } else {
        setLookupData(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category filter failed');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveOnly = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getActiveNeoWonlookupMaster();
      
      if (result.error) {
        setError(result.error);
      } else {
        setLookupData(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load active data');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(lookupData
    .map(item => item.neo_category)
    .filter(Boolean)
  ));

  return (
    <div className="neo-lookup-view">
      <div className="header">
        <h2>NEO Won Lookup Master</h2>
        <p>Manage lookup data for the NEO application</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            Search
          </button>
        </div>

        <div className="filter-section">
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleCategoryFilter(e.target.value);
            }}
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button onClick={loadActiveOnly} disabled={loading}>
            Active Only
          </button>

          <button onClick={loadLookupData} disabled={loading}>
            Show All
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading">
          Loading lookup data...
        </div>
      )}

      {/* Data Table */}
      <div className="data-table">
        {lookupData.length === 0 && !loading ? (
          <div className="no-data">
            No lookup data found
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Code</th>
                <th>Value</th>
                <th>Active</th>
                <th>Sort Order</th>
                <th>Modified</th>
              </tr>
            </thead>
            <tbody>
              {lookupData.map((item) => (
                <tr key={item.neo_wonlookup_masterid}>
                  <td>{item.neo_name || '-'}</td>
                  <td>{item.neo_description || '-'}</td>
                  <td>{item.neo_category || '-'}</td>
                  <td>{item.neo_code || '-'}</td>
                  <td>{item.neo_value || '-'}</td>
                  <td>
                    <span className={`status ${item.neo_isactive ? 'active' : 'inactive'}`}>
                      {item.neo_isactive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{item.neo_sortorder || '-'}</td>
                  <td>
                    {item.modifiedon 
                      ? new Date(item.modifiedon).toLocaleDateString()
                      : '-'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="summary">
        Showing {lookupData.length} record{lookupData.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default NeoWonlookupMasterView;