import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Cr8acEnvtablecodeappsModel } from '../generated/models/Cr8acEnvtablecodeappsModel';

interface EnvRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<Cr8acEnvtablecodeappsModel>) => Promise<void>;
  record?: Cr8acEnvtablecodeappsModel | null;
  mode: 'create' | 'edit';
}

const EnvRecordFormModal: React.FC<EnvRecordFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  record,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Cr8acEnvtablecodeappsModel>>({
    cr8ac_name: '',
    statecode: 0,
    statuscode: 1,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record && mode === 'edit') {
      setFormData({
        cr8ac_name: record.cr8ac_name || '',
        statecode: record.statecode || 0,
        statuscode: record.statuscode || 1,
      });
    } else {
      setFormData({
        cr8ac_name: '',
        statecode: 0,
        statuscode: 1,
      });
    }
    setErrors({});
  }, [record, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cr8ac_name?.trim()) {
      newErrors.cr8ac_name = 'Name is required';
    } else if (formData.cr8ac_name.trim().length < 2) {
      newErrors.cr8ac_name = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const recordToSave = {
        ...formData,
        cr8ac_name: formData.cr8ac_name?.trim(),
        modifiedon: new Date(),
      };

      if (mode === 'create') {
        recordToSave.createdon = new Date();
        recordToSave.createdby = 'Current User';
        recordToSave.modifiedby = 'Current User';
      } else {
        recordToSave.modifiedby = 'Current User';
      }

      await onSave(recordToSave);
      onClose();
    } catch (error) {
      console.error('Error saving record:', error);
      setErrors({ general: 'Failed to save record. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Cr8acEnvtablecodeappsModel, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Environment Record' : 'Edit Environment Record'}
      className="env-record-modal"
    >
      <form onSubmit={handleSubmit} className="env-form">
        {errors.general && (
          <div className="env-error-message">
            <p>{errors.general}</p>
          </div>
        )}

        <div className="env-form-group">
          <label htmlFor="record-name" className="env-form-label">
            Record Name *
          </label>
          <input
            id="record-name"
            type="text"
            value={formData.cr8ac_name || ''}
            onChange={(e) => handleChange('cr8ac_name', e.target.value)}
            placeholder="Enter a descriptive name for this record"
            className={`env-form-input ${errors.cr8ac_name ? 'error' : ''}`}
            disabled={saving}
          />
          {errors.cr8ac_name && (
            <small style={{ color: '#dc2626' }}>{errors.cr8ac_name}</small>
          )}
        </div>

        <div className="env-form-group">
          <label htmlFor="record-status" className="env-form-label">
            Status
          </label>
          <select
            id="record-status"
            value={formData.statecode || 0}
            onChange={(e) => {
              const statecode = parseInt(e.target.value);
              handleChange('statecode', statecode);
              handleChange('statuscode', statecode === 0 ? 1 : 2);
            }}
            className="env-form-select"
            disabled={saving}
          >
            <option value={0}>Active</option>
            <option value={1}>Inactive</option>
          </select>
        </div>

        {mode === 'edit' && record && (
          <>
            <div className="env-form-group">
              <label className="env-form-label">Record ID</label>
              <input
                type="text"
                value={record.cr8ac_envtablecodeappsid || 'N/A'}
                className="env-form-input"
                disabled
                style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
              />
            </div>

            <div className="env-form-group">
              <label className="env-form-label">Created</label>
              <input
                type="text"
                value={`${record.createdon ? new Date(record.createdon).toLocaleString() : 'N/A'} by ${record.createdby || 'Unknown'}`}
                className="env-form-input"
                disabled
                style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
              />
            </div>
          </>
        )}

        <div className="env-form-actions">
          <button
            type="button"
            onClick={onClose}
            className="env-form-btn"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="env-form-btn primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : (mode === 'create' ? 'Create Record' : 'Save Changes')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EnvRecordFormModal;