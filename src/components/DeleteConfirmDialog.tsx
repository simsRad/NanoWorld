import React from 'react';
import Modal from './Modal';
import type { Cr8acEnvtablecodeappsModel } from '../generated/models/Cr8acEnvtablecodeappsModel';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  record: Cr8acEnvtablecodeappsModel | null;
  deleting: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  record,
  deleting
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      // Keep dialog open on error
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      className="env-confirm-dialog"
    >
      <div className="env-confirm-icon danger">⚠️</div>
      <h4 className="env-confirm-title">Delete Environment Record?</h4>
      <p className="env-confirm-message">
        Are you sure you want to delete the record "{record?.cr8ac_name || 'Unknown'}"?
        <br />
        <strong>This action cannot be undone.</strong>
      </p>
      
      {record && (
        <div style={{ 
          background: 'var(--bg)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <p><strong>Record ID:</strong> {record.cr8ac_envtablecodeappsid}</p>
          <p><strong>Name:</strong> {record.cr8ac_name || 'N/A'}</p>
          <p><strong>Status:</strong> {record.statecode === 0 ? 'Active' : 'Inactive'}</p>
        </div>
      )}

      <div className="env-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="env-form-btn"
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="env-form-btn danger"
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Record'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmDialog;