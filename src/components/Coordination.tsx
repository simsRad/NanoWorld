import React, { useState, useMemo, useEffect } from 'react';
import type { CoordinationFilters, ViewMode, SortField, SortDirection } from '../types/coordination';
import './Coordination.css';
import { 
  mockInstallations, 
  getUniqueEngineers, 
  getUniqueAreas, 
  getUniqueStatuses,
  getUniqueInstallTypes,
  getUniqueISPs 
} from '../data/coordinationData';
import Autocomplete from './Autocomplete';

const Coordination: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState<SortField>('dateInstall');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState<CoordinationFilters>({
    engineer: '',
    area: '',
    installStatus: '',
    installType: '',
    timeSlot: '',
    isp: '',
    searchTerm: ''
  });

  // Keep installations in local state so edits/adds reflect immediately
  const [installations, setInstallations] = useState(() => mockInstallations.slice());

  // Modal state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>(null);

  // CSV preview state
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique values for filters
  const engineers = getUniqueEngineers(installations);
  const areas = getUniqueAreas(installations);
  const statuses = getUniqueStatuses(installations);
  const installTypes = getUniqueInstallTypes(installations);
  const isps = getUniqueISPs(installations);
  const timeSlots = Array.from(new Set(installations.map(i => i.timeSlot).filter(Boolean))).sort();

  // Filter and sort installations
  const filteredAndSortedInstallations = useMemo(() => {
  let filtered = installations;

    // Apply filters
    if (filters.engineer) {
      filtered = filtered.filter(installation => 
        installation.engineer.toLowerCase().includes(filters.engineer.toLowerCase())
      );
    }
    if (filters.area) {
      filtered = filtered.filter(installation => 
        installation.area.toLowerCase().includes(filters.area.toLowerCase())
      );
    }
    if (filters.installStatus) {
      filtered = filtered.filter(installation => 
        installation.installStatus.toLowerCase().includes(filters.installStatus.toLowerCase())
      );
    }
    if (filters.installType) {
      filtered = filtered.filter(installation => 
        installation.installType.toLowerCase().includes(filters.installType.toLowerCase())
      );
    }
    if ((filters as any).timeSlot) {
      filtered = filtered.filter(installation => 
        (installation.timeSlot || '').toLowerCase().includes(((filters as any).timeSlot || '').toLowerCase())
      );
    }
    if (filters.isp) {
      filtered = filtered.filter(installation => 
        installation.isp.toLowerCase().includes(filters.isp.toLowerCase())
      );
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(installation => 
        installation.address.toLowerCase().includes(searchLower) ||
        installation.engineer.toLowerCase().includes(searchLower) ||
        installation.coordinator.toLowerCase().includes(searchLower) ||
        installation.lastNote.toLowerCase().includes(searchLower)
      );
    }

    // Sort installations
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'dateInstall':
          aValue = new Date(a.dateInstall);
          bValue = new Date(b.dateInstall);
          break;
        case 'engineer':
          aValue = a.engineer;
          bValue = b.engineer;
          break;
        case 'installStatus':
          aValue = a.installStatus;
          bValue = b.installStatus;
          break;
        case 'address':
          aValue = a.address;
          bValue = b.address;
          break;
        default:
          aValue = a.dateInstall;
          bValue = b.dateInstall;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [filters, sortField, sortDirection, installations]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedInstallations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInstallations = filteredAndSortedInstallations.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortField, sortDirection, itemsPerPage]);

  // Open modal for editing
  const openEditModal = (installation: any) => {
    setEditing(true);
    setFormState({ ...installation });
    setIsModalOpen(true);
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditing(false);
    setFormState({
      id: '', address: '', area: '', assistant: '', assistantEmail: '', bookingStatus: '', coordinator: '', coordinatorEmail: '', dateInstall: '', engineer: '', engineerEmail: '', installStatus: '', installType: '', isp: '', lastNote: '', team: '', teamLead: '', teamLeadEmail: '', timeSlot: '', workOrder: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(null);
  };

  const handleFormChange = (key: string, value: string) => {
    setFormState((prev: any) => ({ ...prev, [key]: value }));
  };

  const saveForm = () => {
    if (!formState) return;
    if (editing && formState.id) {
      setInstallations(prev => prev.map(p => p.id === formState.id ? { ...p, ...formState } : p));
    } else {
      // create new id
      const newId = String(Date.now());
      setInstallations(prev => [{ ...formState, id: newId }, ...prev]);
    }
    closeModal();
  };

  const resetFilters = () => {
    setFilters({ engineer: '', area: '', installStatus: '', installType: '', timeSlot: '', isp: '', searchTerm: '' });
  };

  const handleFilterChange = (key: keyof CoordinationFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // CSV Export Functions
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value.toString();
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadTemplate = () => {
    const template = [{
      id: '',
      address: '',
      area: '',
      assistant: '',
      assistantEmail: '',
      bookingStatus: '',
      coordinator: '',
      coordinatorEmail: '',
      dateInstall: '',
      engineer: '',
      engineerEmail: '',
      installStatus: '',
      installType: '',
      isp: '',
      lastNote: '',
      team: '',
      teamLead: '',
      teamLeadEmail: '',
      timeSlot: '',
      workOrder: ''
    }];
    downloadCSV(template, 'installation-template.csv');
  };

  const handleDownloadInstallations = () => {
    downloadCSV(filteredAndSortedInstallations, `installations-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const newInstallations = lines.slice(1)
        .filter(line => line.trim().length > 0)
        .map((line, index) => {
          const values: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i-1] === ',')) {
              inQuotes = true;
            } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
              inQuotes = false;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

          const installation: any = {};
          headers.forEach((header, i) => {
            installation[header] = values[i] || '';
          });
          
          // Ensure ID is unique
          if (!installation.id || installation.id.trim() === '') {
            installation.id = `imported-${Date.now()}-${index}`;
          }
          
          return installation;
        });

      setCsvPreviewData(newInstallations);
      setShowCsvPreview(true);
    };
    
    reader.readAsText(file);
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const handleCsvPreviewEdit = (index: number, field: string, value: string) => {
    setCsvPreviewData(prev => prev.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    ));
  };

  const handleConfirmImport = () => {
    setInstallations(prev => [...prev, ...csvPreviewData]);
    setShowCsvPreview(false);
    setCsvPreviewData([]);
  };

  const handleCancelImport = () => {
    setShowCsvPreview(false);
    setCsvPreviewData([]);
  };

  const handleDeletePreviewRow = (index: number) => {
    setCsvPreviewData(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="coordination-page">
      <div className="coordination-container">
        {/* Header */}
        <div className="coordination-header">
          <div className="coordination-title-section">
            <p className="coordination-subtitle">
              Manage installation schedules and engineer coordination
            </p>
          </div>
          <div className="coordination-actions">
            <button className="btn btn-secondary" onClick={handleDownloadTemplate}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              Download Template
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('csv-import')?.click()}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              Import CSV
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadInstallations}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Export CSV
            </button>
            <button className="btn btn-primary" onClick={openAddModal}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Add Installation
            </button>
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              style={{ display: 'none' }}
            />
          </div>
        </div>

       

        {/* Filters and Controls */}
        <div className="filters-container">
          <div className="filters-row">
            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="use ref, name, or sku"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="search-input"
              />
            </div>

            {/* Engineer Filter - native select to match Area behavior */}
            <select
              value={filters.engineer}
              onChange={(e) => handleFilterChange('engineer', e.target.value)}
              className="filter-select"
            >
              <option value="">Engineer</option>
              {engineers.map(engineer => (
                <option key={engineer} value={engineer}>{engineer}</option>
              ))}
            </select>

            {/* Area Filter */}
            <select
              value={filters.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
              className="filter-select"
            >
              <option value="">Area</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.installStatus}
              onChange={(e) => handleFilterChange('installStatus', e.target.value)}
              className="filter-select"
            >
              <option value="">Install Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="view-controls">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('list')}
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                  </svg>
                </button>
              </div>
              <button className="btn btn-primary" onClick={openAddModal}>Add Installation</button>
              <button className="btn btn-secondary" onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="filters-row secondary">
            <select
              value={filters.installType}
              onChange={(e) => handleFilterChange('installType', e.target.value)}
              className="filter-select"
            >
              <option value="">Install Type</option>
              {installTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={filters.isp}
              onChange={(e) => handleFilterChange('isp', e.target.value)}
              className="filter-select"
            >
              <option value="">ISP</option>
              {isps.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>

            <select
              value={(filters as any).timeSlot}
              onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
              className="filter-select"
            >
              <option value="">Time Slot</option>
              {timeSlots.map(ts => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>

            <div className="spacer"></div>
            
            <div className="results-count">
              {filteredAndSortedInstallations.length} installations
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="table-container">
            <table className="installations-table">
              <thead>
                <tr>
                  <th 
                    className="sortable-header"
                    onClick={() => handleSort('address')}
                  >
                    <div className="header-content">
                      <span>Address</span>
                      {sortField === 'address' && (
                        <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="sortable-header"
                    onClick={() => handleSort('engineer')}
                  >
                    <div className="header-content">
                      <span>Engineer</span>
                      {sortField === 'engineer' && (
                        <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="sortable-header"
                    onClick={() => handleSort('installStatus')}
                  >
                    <div className="header-content">
                      <span>Install Status</span>
                      {sortField === 'installStatus' && (
                        <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="table-header">Coordinator</th>
                  <th 
                    className="sortable-header"
                    onClick={() => handleSort('dateInstall')}
                  >
                    <div className="header-content">
                      <span>Date & Time</span>
                      {sortField === 'dateInstall' && (
                        <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="table-header">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInstallations.map((installation) => (
                  <tr key={installation.id} className="table-row">
                    <td className="address-cell">
                      {installation.address}
                    </td>
                    <td className="engineer-cell">
                      <div className="engineer-info">
                        <div className="engineer-name">{installation.engineer}</div>
                        <div className="engineer-email">{installation.engineerEmail}</div>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${installation.installStatus.toLowerCase()}`}>
                        {installation.installStatus}
                      </span>
                      <div className="install-type">{installation.installType}</div>
                    </td>
                    <td className="coordinator-cell">
                      <div className="coordinator-info">
                        <div className="coordinator-name">{installation.coordinator}</div>
                        <div className="coordinator-team">
                          {installation.team || 'Sample ISP Team'} - {installation.isp} - {installation.area}
                        </div>
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="date-info">
                        <div className="date-value">{formatDate(installation.dateInstall)}</div>
                        <div className="time-slot">{installation.timeSlot}</div>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => openEditModal(installation)}>
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
        ) : (
          /* Card View */
          <div className="card-grid">
            {paginatedInstallations.map((installation) => (
              <div key={installation.id} className="installation-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="engineer-avatar">
                    <div className="avatar-circle">
                      {getInitials(installation.engineer)}
                    </div>
                    <div className="engineer-details">
                      <div className="engineer-name">
                        {installation.engineer}
                      </div>
                      <div className="engineer-email">{installation.engineerEmail}</div>
                    </div>
                  </div>
                  <button className="edit-btn" onClick={() => openEditModal(installation)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V12.5a.5.5 0 0 0 .5.5h.793L11.207 9zm.354-3.354-3-3L9.5 1.793l3 3-.939.853z"/>
                      <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                </div>

                {/* Work Order Number */}
                <div className="card-section">
                  <div className="section-label">Work Order Numbers</div>
                  <div className="section-content">{installation.workOrder || installation.id}</div>
                </div>

                {/* Address */}
                <div className="card-section">
                  <div className="section-content">
                    {installation.address}
                  </div>
                </div>

                {/* Region */}
                <div className="card-section">
                  <div className="section-label icon-text-small">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    Region
                  </div>
                  <div className="section-content">
                    <span className="region-badge">
                      {installation.area}
                    </span>
                  </div>
                </div>

                {/* Time Slot */}
                <div className="card-section">
                  <div className="section-label icon-text-small">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    Time Slot
                  </div>
                  <div className="section-content">
                    <span className="timeslot-badge">
                      {formatDate(installation.dateInstall)} {installation.timeSlot}
                    </span>
                  </div>
                </div>

                {/* Install Status */}
                <div className="card-section">
                  <div className="section-label icon-text-small">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                    </svg>
                    Install Status
                  </div>
                  <div className="section-content">
                    <span className={`status-badge ${installation.installStatus.toLowerCase()}`}>
                      {installation.installStatus}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="card-section">
                  <div className="section-label icon-text-small">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                      <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    </svg>
                    Notes
                  </div>
                  <div className="card-notes">
                    {installation.lastNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedInstallations.length === 0 && filteredAndSortedInstallations.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">📭</div>
            <h3 className="no-results-title">No installations found</h3>
            <p className="no-results-text">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredAndSortedInstallations.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span className="pagination-text">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedInstallations.length)} of {filteredAndSortedInstallations.length} installations
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
      
      {/* Edit / Add Modal */}
      {isModalOpen && formState && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3 className="modal-title">{editing ? 'Edit Installation' : 'Add Installation'}</h3>

            <div className="modal-form-container">
              <div className="modal-form">
              <label>Address</label>
              <input value={formState.address || ''} onChange={(e) => handleFormChange('address', e.target.value)} />

              <label>Engineer</label>
              <Autocomplete
                suggestions={engineers}
                value={formState.engineer || ''}
                onChange={(v) => handleFormChange('engineer', v)}
              />

              <label>Engineer Email</label>
              <input value={formState.engineerEmail || ''} onChange={(e) => handleFormChange('engineerEmail', e.target.value)} />

              <label>Coordinator</label>
              <input value={formState.coordinator || ''} onChange={(e) => handleFormChange('coordinator', e.target.value)} />

              <label>Coordinator Email</label>
              <input value={formState.coordinatorEmail || ''} onChange={(e) => handleFormChange('coordinatorEmail', e.target.value)} />

              <label>Date Install</label>
              <input type="date" value={formState.dateInstall ? formState.dateInstall.split('T')[0] : ''} onChange={(e) => handleFormChange('dateInstall', e.target.value)} />

              <label>Time Slot</label>
              <select value={formState.timeSlot || ''} onChange={(e) => handleFormChange('timeSlot', e.target.value)}>
                <option value="">Select time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>

              <label>Install Status</label>
              <select value={formState.installStatus || ''} onChange={(e) => handleFormChange('installStatus', e.target.value)}>
                <option value="">Select status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <label>Install Type</label>
              <select value={formState.installType || ''} onChange={(e) => handleFormChange('installType', e.target.value)}>
                <option value="">Select type</option>
                {installTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <label>ISP</label>
              <select value={formState.isp || ''} onChange={(e) => handleFormChange('isp', e.target.value)}>
                <option value="">Select ISP</option>
                {isps.map(isp => (
                  <option key={isp} value={isp}>{isp}</option>
                ))}
              </select>

              <label>Last Note</label>
              <textarea value={formState.lastNote || ''} onChange={(e) => handleFormChange('lastNote', e.target.value)} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={saveForm}>{editing ? 'Save' : 'Add'}</button>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Preview Modal */}
      {showCsvPreview && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content" style={{ width: '90%', maxWidth: '1200px' }}>
            <h3 className="modal-title">Preview CSV Import ({csvPreviewData.length} records)</h3>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #d2d0ce', borderRadius: '4px' }}>
              <table className="installations-table" style={{ fontSize: '12px' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f3f2f1' }}>
                  <tr>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '100px' }}>Address</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '80px' }}>Engineer</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '80px' }}>Area</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '80px' }}>Status</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '80px' }}>Type</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '60px' }}>ISP</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '80px' }}>Date</th>
                    <th style={{ padding: '8px', fontSize: '11px', minWidth: '60px' }}>Time Slot</th>
                    <th style={{ padding: '8px', fontSize: '11px', width: '40px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {csvPreviewData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ padding: '4px' }}>
                        <input 
                          value={row.address || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'address', e.target.value)}
                          style={{ width: '100%', padding: '2px', fontSize: '12px', border: '1px solid #ddd' }}
                        />
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.engineer || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'engineer', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select Engineer</option>
                          {engineers.map(engineer => (
                            <option key={engineer} value={engineer}>{engineer}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.area || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'area', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select Area</option>
                          {areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.installStatus || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'installStatus', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select Status</option>
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.installType || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'installType', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select Type</option>
                          {installTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.isp || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'isp', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select ISP</option>
                          {isps.map(isp => (
                            <option key={isp} value={isp}>{isp}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px' }}>
                        <input 
                          type="date"
                          value={row.dateInstall || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'dateInstall', e.target.value)}
                          style={{ width: '100%', padding: '2px', fontSize: '12px', border: '1px solid #ddd' }}
                        />
                      </td>
                      <td style={{ padding: '4px' }}>
                        <select 
                          value={row.timeSlot || ''} 
                          onChange={(e) => handleCsvPreviewEdit(index, 'timeSlot', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '2px 20px 2px 4px', 
                            fontSize: '12px', 
                            border: '1px solid #ddd',
                            appearance: 'none',
                            background: 'white url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'><path d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat right 4px center'
                          }}
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '4px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeletePreviewRow(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#dc3545',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete row"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={handleConfirmImport}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Import {csvPreviewData.length} Records
              </button>
              <button className="btn btn-secondary" onClick={handleCancelImport}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      </div>


    </div>
  );
};

export default Coordination;