import React, { useState } from 'react';
import { SharePointService } from '../generated/services/SharePointService';
import type { DataSetsList } from '../generated/models/SharePointModel';

const SharePointExample: React.FC = () => {
  const [dataSets, setDataSets] = useState<DataSetsList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching SharePoint data sets...');
      const result = await SharePointService.GetDataSets();
      console.log('SharePoint result:', result);
      
      if (result.error) {
        setError(`Error loading SharePoint data: ${result.error}`);
      } else {
        setDataSets(result.data || null);
      }
    } catch (err) {
      console.error('SharePoint connection error:', err);
      setError('Error connecting to SharePoint: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>SharePoint Online Integration</h2>
      <p>Connected to SharePoint Online via Microsoft Power Platform</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={fetchDataSets}
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
          {loading ? 'Loading...' : 'Fetch SharePoint Sites'}
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

      {dataSets && (
        <div style={{ marginTop: '20px' }}>
          <h3>Available SharePoint Sites:</h3>
          {dataSets.value && dataSets.value.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {dataSets.value.map((dataSet, index) => (
                <li key={index} style={{ 
                  marginBottom: '10px', 
                  padding: '10px', 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px'
                }}>
                  <strong>Name:</strong> {dataSet.Name || 'No name'}<br/>
                  <strong>Display Name:</strong> {dataSet.DisplayName || 'No display name'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No SharePoint sites found or access denied.</p>
          )}
        </div>
      )}

      {dataSets === null && !loading && (
        <p style={{ marginTop: '20px', color: '#6b7280' }}>
          Click "Fetch SharePoint Sites" to load available sites and document libraries.
        </p>
      )}
    </div>
  );
};

export default SharePointExample;