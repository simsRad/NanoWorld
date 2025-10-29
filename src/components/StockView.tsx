import React, { useMemo, useState, useEffect } from 'react';
import { tools as initialTools } from '../data/toolsData';
import type { ToolItem } from '../types';
import ManageStockModal from './ManageStockModal';
import { exportObjectsToCsv } from '../utils/exportCsv';

type SortField = 'name' | 'purchasePrice' | 'quantity' | 'sku' | 'toolType';
type SortDirection = 'asc' | 'desc';

const StockView: React.FC = () => {
  const [items, setItems] = useState<ToolItem[]>(() => initialTools.map(t => ({ ...t })));
  const [filterType, setFilterType] = useState<string>('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ToolItem | null>(null);
  const [showManage, setShowManage] = useState(false);
  
  // Sorting and pagination state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toolTypes = useMemo(() => {
    const set = new Set<string>();
    items.forEach(t => set.add(t.toolType ?? 'Unknown'));
    return Array.from(set);
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(t => {
      if (filterType && (t.toolType ?? '') !== filterType) return false;
      if (search) {
        const s = search.toLowerCase();
        return (t.name?.toLowerCase().includes(s) || (t.sku ?? '').toLowerCase().includes(s));
      }
      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'purchasePrice':
          aValue = a.purchasePrice || 0;
          bValue = b.purchasePrice || 0;
          break;
        case 'quantity':
          aValue = a.quantity || 0;
          bValue = b.quantity || 0;
          break;
        case 'sku':
          aValue = a.sku || '';
          bValue = b.sku || '';
          break;
        case 'toolType':
          aValue = a.toolType || '';
          bValue = b.toolType || '';
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, filterType, search, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredAndSortedItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, search, sortField, sortDirection, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const onAdd = (it: ToolItem) => setItems(prev => [{ ...it }, ...prev]);
  const onUpdate = (it: ToolItem) => setItems(prev => prev.map(p => (p.sku === it.sku && p.name === it.name ? { ...it } : p)));

  return (
    <div className="card">
      <div className="stock-header">
        <div className="stock-filters">
          <input 
            className="stock-search" 
            placeholder="Search name or sku" 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
          />
          <select 
            className="stock-type-filter" 
            value={filterType} 
            onChange={e=>setFilterType(e.target.value)}
          >
            <option value="">All tool types</option>
            {toolTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="stock-actions">
          <button className="btn-primary" onClick={() => { setEditing(null); setShowManage(true); }}>Add Stock Item</button>

          <button
            className="btn-muted stock-export-btn"
            onClick={() => exportObjectsToCsv('stock-items.csv', items, ['name','sku','quantity','purchasePrice','toolType'])}
            title="Download stock items as CSV"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Export Stock CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="installations-table">
          <thead>
            <tr>
              <th 
                className="sortable-header"
                onClick={() => handleSort('name')}
              >
                <div className="header-content">
                  <span>Name</span>
                  {sortField === 'name' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="table-header">Details</th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('purchasePrice')}
              >
                <div className="header-content">
                  <span>Purchase</span>
                  {sortField === 'purchasePrice' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('quantity')}
              >
                <div className="header-content">
                  <span>Qty</span>
                  {sortField === 'quantity' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="table-header">Serial</th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('sku')}
              >
                <div className="header-content">
                  <span>SKU</span>
                  {sortField === 'sku' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('toolType')}
              >
                <div className="header-content">
                  <span>Tool Type</span>
                  {sortField === 'toolType' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((t: ToolItem, idx: number) => (
              <tr key={idx} className="table-row">
                <td className="name-cell">
                  <div className="tool-info">
                    <div className="tool-name">{t.name}</div>
                    <div className="tool-details">{t.details || 'No details provided'}</div>
                  </div>
                </td>
                <td className="details-cell">{t.details ?? ''}</td>
                <td className="price-cell">
                  {t.purchasePrice != null ? `£${t.purchasePrice}` : 'N/A'}
                </td>
                <td className="quantity-cell">
                  {t.quantity ?? 'N/A'}
                </td>
                <td className="serial-cell">
                  <span className={`serial-badge ${t.serialNumber ? 'has-serial' : 'no-serial'}`}>
                    {t.serialNumber ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="sku-cell">{t.sku ?? 'N/A'}</td>
                <td className="type-cell">
                  {t.toolType ?? 'Unknown'}
                </td>
                <td className="actions-cell">
                  <button className="edit-btn" onClick={() => { setEditing(t); setShowManage(true); }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V12.5a.5.5 0 0 0 .5.5h.793L11.207 9zm.354-3.354-3-3L9.5 1.793l3 3-.939.853z"/>
                      <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedItems.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span className="pagination-text">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedItems.length)} of {filteredAndSortedItems.length} items
            </span>
            
            <div className="items-per-page">
              <label htmlFor="items-per-page">Items per page:</label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="per-page-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
              First
            </button>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
              Previous
            </button>

            {/* Page numbers */}
            <div className="page-numbers">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                <path d="M6.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L12.293 8 6.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {showManage && (
        <ManageStockModal
          item={editing}
          onClose={() => setShowManage(false)}
          onSave={(it) => {
            // if editing replace by matching sku+name (simple heuristic), else add
            if (editing) onUpdate(it); else onAdd(it);
            setShowManage(false);
          }}
        />
      )}
    </div>
  );
};

export default StockView;