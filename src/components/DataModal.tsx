import React, { useState } from 'react';
import './DataModal.css';

interface IDataModalProps {
  isOpen: boolean;
  tableName: string;
  mode: 'create' | 'edit' | 'view';
  initialData?: Record<string, any>;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const DataModal: React.FC<IDataModalProps> = ({
  isOpen,
  tableName,
  mode,
  initialData = {},
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(initialData, null, 2));

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setJsonText(JSON.stringify(initialData, null, 2));
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      let dataToSave = formData;
      
      if (jsonMode) {
        try {
          dataToSave = JSON.parse(jsonText);
        } catch (parseError) {
          setError('Invalid JSON format');
          setLoading(false);
          return;
        }
      }

      await onSave(dataToSave);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !initialData.id) return;
    
    if (!confirm('Are you sure you want to delete this record?')) return;

    setLoading(true);
    setError(null);

    try {
      await onDelete(initialData.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    if (jsonMode) {
      setJsonText(JSON.stringify(newData, null, 2));
    }
  };

  const getCommonFields = (table: string): string[] => {
    switch (table) {
      case 'systemusers':
        return [
          'fullname',
          'internalemailaddress',
          'domainname',
          'firstname',
          'lastname',
          'businessunitid',
          'isdisabled'
        ];
      case 'commondataserviceforapps':
        return [
          'name',
          'description',
          'value',
          'category',
          'status'
        ];
      case 'sharepointonline':
        return [
          'title',
          'description',
          'url',
          'category',
          'modified'
        ];
      default:
        return [
          'name',
          'description',
          'value',
          'category',
          'status',
          'created',
          'modified'
        ];
    }
  };

  const renderFormFields = () => {
    const fields = getCommonFields(tableName);
    
    return fields.map(field => (
      <div key={field} className="form-field">
        <label htmlFor={field}>
          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
        </label>
        <input
          id={field}
          type={field.includes('email') ? 'email' : 
                field.includes('url') ? 'url' : 
                field.includes('date') || field.includes('created') || field.includes('modified') ? 'datetime-local' :
                field.includes('disabled') ? 'checkbox' : 'text'}
          value={field.includes('disabled') ? undefined : (formData[field] || '')}
          checked={field.includes('disabled') ? !!formData[field] : undefined}
          onChange={(e) => updateFormField(field, 
            field.includes('disabled') ? e.target.checked : e.target.value
          )}
          disabled={mode === 'view'}
          placeholder={`Enter ${field}...`}
        />
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="data-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="data-modal">
        <div className="data-modal-header">
          <h3>
            {mode === 'create' ? '➕ Create' :
             mode === 'edit' ? '✏️ Edit' : '👁️ View'} 
            {' '}{tableName} Record
          </h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="data-modal-content">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="mode-toggle">
            <button 
              className={!jsonMode ? 'active' : ''}
              onClick={() => setJsonMode(false)}
            >
              📝 Form View
            </button>
            <button 
              className={jsonMode ? 'active' : ''}
              onClick={() => setJsonMode(true)}
            >
              🔧 JSON View
            </button>
          </div>

          {jsonMode ? (
            <div className="json-editor">
              <label htmlFor="json-input">JSON Data:</label>
              <textarea
                id="json-input"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                disabled={mode === 'view'}
                rows={15}
                placeholder="Enter JSON data..."
              />
            </div>
          ) : (
            <div className="form-fields">
              {renderFormFields()}
              
              <div className="form-field">
                <label htmlFor="custom-fields">Additional Fields (JSON):</label>
                <textarea
                  id="custom-fields"
                  value={JSON.stringify(
                    Object.fromEntries(
                      Object.entries(formData).filter(([key]) => 
                        !getCommonFields(tableName).includes(key)
                      )
                    ), null, 2
                  )}
                  onChange={(e) => {
                    try {
                      const additional = JSON.parse(e.target.value || '{}');
                      const base = Object.fromEntries(
                        Object.entries(formData).filter(([key]) => 
                          getCommonFields(tableName).includes(key)
                        )
                      );
                      setFormData({ ...base, ...additional });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  disabled={mode === 'view'}
                  rows={4}
                  placeholder='{ "customField": "value" }'
                />
              </div>
            </div>
          )}
        </div>

        <div className="data-modal-footer">
          <div className="button-group">
            <button onClick={onClose} disabled={loading}>
              Cancel
            </button>
            
            {mode !== 'view' && (
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="primary"
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create Record' : 'Save Changes'}
              </button>
            )}
            
            {mode === 'edit' && onDelete && (
              <button 
                onClick={handleDelete} 
                disabled={loading}
                className="danger"
              >
                {loading ? 'Deleting...' : 'Delete Record'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;