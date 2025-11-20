import React, { useState, useEffect } from 'react';
import { SharePointService } from '../generated/services/SharePointService';
import type { Item } from '../generated/models/SharePointModel';

interface SharePointSite {
  Name?: string;
  DisplayName?: string;
}

interface DocumentLibrary {
  Name?: string;
  DisplayName?: string;
  dataset?: string;
  DynamicProperties?: Record<string, unknown>;
}

interface SharePointDocument extends Item {
  id?: number;
  Title?: string;
  Name?: string;
  FileRef?: string;
  Modified?: string;
  Author?: { Title: string };
  Editor?: { Title: string };
  File_x0020_Size?: number;
  FileSystemObjectType?: number;
  ServerRedirectedEmbedUri?: string;
  ContentTypeId?: string;
  library?: string;
  libraryDisplayName?: string;
}

const SharePointDocumentsView: React.FC = () => {
  const [sites, setSites] = useState<SharePointSite[]>([]);
  const [libraries, setLibraries] = useState<DocumentLibrary[]>([]);
  const [documents, setDocuments] = useState<SharePointDocument[]>([]);
  const [selectedSite, setSelectedSite] = useState<SharePointSite | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'sites' | 'libraries' | 'documents'>('sites');
  const [viewMode, setViewMode] = useState<'sites' | 'documents'>('sites');

  // Load SharePoint sites on component mount
  useEffect(() => {
    loadSharePointSites();
  }, []);

  const loadSharePointSites = async () => {
    try {
      setLoading(true);
      setError(null);
      setStep('sites');
      
      console.log('Loading SharePoint sites...');
      const result = await SharePointService.GetDataSets();
      console.log('SharePoint sites result:', result);
      
      if (result.error) {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || JSON.stringify(result.error);
        setError(`Error loading SharePoint sites: ${errorMessage}`);
        console.error('SharePoint sites error details:', result.error);
        return;
      }

      const siteData = result.data?.value || [];
      setSites(siteData);
      console.log(`Loaded ${siteData.length} SharePoint sites:`, siteData.map(s => s.DisplayName));
    } catch (err) {
      console.error('SharePoint sites loading error:', err);
      setError('Error connecting to SharePoint: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentLibraries = async (site: SharePointSite) => {
    try {
      setLoading(true);
      setError(null);
      setStep('libraries');
      
      console.log('Loading document libraries for site:', site.Name);
      
      if (!site.Name) {
        setError('Site name is required');
        return;
      }
      
      // Get document libraries specifically
      const result = await SharePointService.GetTablesForLibraries(site.Name);
      console.log('Document libraries result:', result);
      
      if (result.error) {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || JSON.stringify(result.error);
        setError(`Error loading document libraries: ${errorMessage}`);
        console.error('SharePoint libraries error details:', result.error);
        console.error('Full result object:', result);
        return;
      }

      const libraryData = (result.data?.value || []).map(lib => ({
        ...lib,
        dataset: site.Name
      }));
      setLibraries(libraryData);

      // Load documents from all libraries
      if (libraryData.length > 0 && site.Name) {
        await loadAllDocuments(site.Name, libraryData);
      }
    } catch (err) {
      console.error('Document libraries loading error:', err);
      setError('Error loading document libraries: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = async (site: SharePointSite) => {
    setSelectedSite(site);
    setViewMode('documents');
    await loadDocumentLibraries(site);
  };

  const handleBackToSites = () => {
    setSelectedSite(null);
    setViewMode('sites');
    setLibraries([]);
    setDocuments([]);
    setError(null);
  };

  const getSharePointUrl = (siteName?: string): string => {
    if (!siteName) return '#';
    // Convert the site name to a proper SharePoint URL
    if (siteName.startsWith('https://')) {
      return siteName; // Already a full URL
    }
    if (siteName.includes('sharepoint.com')) {
      return `https://${siteName}`;
    }
    return `https://nanofibreuk.sharepoint.com/sites/${siteName}`;
  };

  const loadAllDocuments = async (dataset: string, libs: DocumentLibrary[]) => {
    try {
      setLoading(true);
      setError(null);
      setStep('documents');
      
      console.log('Loading documents from libraries:', libs.map(l => l.DisplayName));
      
      const allDocuments: SharePointDocument[] = [];
      
      // Load documents from each library
      for (const library of libs) {
        try {
          console.log(`Loading documents from library: ${library.DisplayName} (${library.Name})`);
          
          if (!library.Name) {
            console.warn(`Skipping library with no name: ${library.DisplayName}`);
            continue;
          }
          
          // Use ODataStyleGetFileItems to get file items specifically
          const result = await SharePointService.ODataStyleGetFileItems(
            dataset, 
            library.Name,
            undefined, // $filter
            'Modified desc', // $orderby - most recent first
            100, // $top - limit to 100 documents per library
            undefined, // folderPath
            undefined, // viewScopeOption
            undefined  // view
          );
          
          console.log(`Documents from ${library.DisplayName}:`, result);
          
          if (result.error) {
            console.warn(`Error loading documents from ${library.DisplayName}: ${result.error}`);
            continue;
          }

          const libraryDocs = (result.data?.value || []).map(doc => ({
            ...doc,
            library: library.Name,
            libraryDisplayName: library.DisplayName
          }));
          
          allDocuments.push(...libraryDocs);
          console.log(`Added ${libraryDocs.length} documents from ${library.DisplayName}`);
        } catch (err) {
          console.warn(`Error loading documents from library ${library.DisplayName}:`, err);
        }
      }
      
      console.log(`Total documents loaded: ${allDocuments.length}`);
      setDocuments(allDocuments);
      
    } catch (err) {
      console.error('Documents loading error:', err);
      setError('Error loading documents: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    if (bytes < 1073741824) return Math.round(bytes / 1048576) + ' MB';
    return Math.round(bytes / 1073741824) + ' GB';
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getFileIcon = (fileName?: string): string => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': return '📘';
      case 'xls':
      case 'xlsx': return '📗';
      case 'ppt':
      case 'pptx': return '📙';
      case 'txt': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov': return '🎬';
      case 'zip':
      case 'rar': return '📦';
      default: return '📄';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>🌐 SharePoint Sites Directory</h2>
        {selectedSite && (
          <button
            onClick={handleBackToSites}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Sites
          </button>
        )}
      </div>
      
      {/* Progress indicator - only show when viewing documents */}
      {selectedSite && viewMode === 'documents' && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step === 'sites' ? '#0078d4' : '#28a745',
              color: 'white',
              fontSize: '12px'
            }}>
              1. Sites {step === 'sites' && loading ? '⏳' : '✓'}
            </span>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step === 'libraries' ? '#0078d4' : step === 'documents' ? '#28a745' : '#6c757d',
              color: 'white',
              fontSize: '12px'
            }}>
              2. Libraries {step === 'libraries' && loading ? '⏳' : step === 'documents' ? '✓' : ''}
            </span>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step === 'documents' ? '#0078d4' : '#6c757d',
              color: 'white',
              fontSize: '12px'
            }}>
              3. Documents {step === 'documents' && loading ? '⏳' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Selected site info */}
      {selectedSite && viewMode === 'documents' && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#0078d4' }}>📁 {selectedSite.DisplayName}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Site: {selectedSite.Name}</p>
              {libraries.length > 0 && (
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  📁 {libraries.length} document libraries found
                </p>
              )}
            </div>
            <button
              onClick={() => window.open(getSharePointUrl(selectedSite.Name), '_blank')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🚀 Visit Site
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>❌ Error:</strong> {error}
          <button 
            onClick={loadSharePointSites}
            style={{ 
              marginLeft: '10px', 
              padding: '5px 10px', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
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
          <div>⏳ Loading {step}...</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            {step === 'sites' && 'Fetching SharePoint sites...'}
            {step === 'libraries' && 'Loading document libraries...'}
            {step === 'documents' && 'Retrieving documents...'}
          </div>
        </div>
      )}

      {/* Documents table */}
      {!loading && documents.length > 0 && viewMode === 'documents' && (
        <div>
          <h3>📋 Documents ({documents.length} found)</h3>
          <div style={{ 
            overflowX: 'auto',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>📄 Document</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>📁 Library</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>📊 Size</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>📅 Modified</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>👤 Author</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={`${doc.library}-${doc.id}-${index}`} style={{ 
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getFileIcon(doc.Name)}</span>
                        <div>
                          <div style={{ fontWeight: '500', color: '#212529' }}>
                            {doc.Title || doc.Name || 'Untitled'}
                          </div>
                          {doc.FileRef && (
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                              {doc.FileRef}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#e7f3ff', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#0078d4'
                      }}>
                        {doc.libraryDisplayName || doc.library}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#6c757d' }}>
                      {formatFileSize(doc.File_x0020_Size)}
                    </td>
                    <td style={{ padding: '12px', color: '#6c757d' }}>
                      {formatDate(doc.Modified)}
                    </td>
                    <td style={{ padding: '12px', color: '#6c757d' }}>
                      {doc.Editor?.Title || doc.Author?.Title || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No documents message */}
      {!loading && documents.length === 0 && !error && selectedSite && viewMode === 'documents' && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <h3>📂 No Documents Found</h3>
          <p>No documents were found in the document libraries for "{selectedSite.DisplayName}".</p>
          {libraries.length === 0 && (
            <p>No document libraries were found in this site.</p>
          )}
        </div>
      )}

      {/* Sites Directory */}
      {!loading && (!selectedSite || viewMode === 'sites') && sites.length > 0 && !error && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3>🏢 Available SharePoint Sites ({sites.length})</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
              Click "View Documents" to browse files, or "Visit Site" to open in SharePoint
            </p>
          </div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {sites.map((site, index) => (
              <div key={index} style={{ 
                padding: '20px', 
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#0078d4';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#212529', marginBottom: '8px' }}>
                      🌐 {site.DisplayName || 'Unnamed Site'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '15px', fontFamily: 'monospace' }}>
                      📂 {site.Name}
                    </div>
                    {site.Name && (
                      <div style={{ fontSize: '12px', color: '#0078d4', marginBottom: '15px' }}>
                        🔗 {getSharePointUrl(site.Name)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleSiteSelect(site)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0078d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#106ebe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0078d4'}
                  >
                    📄 View Documents
                  </button>
                  
                  {site.Name && (
                    <button
                      onClick={() => window.open(getSharePointUrl(site.Name), '_blank')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    >
                      🚀 Visit Site
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(getSharePointUrl(site.Name))}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                    title="Copy link to clipboard"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePointDocumentsView;