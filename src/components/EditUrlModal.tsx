import { useState } from 'react';
import { X, Link2, AlertCircle } from 'lucide-react';
import { updateOfferUrl } from '../api';
import { useToast } from '../context/ToastContext';

interface Props {
  campaignId: string;
  campaignName: string;
  currentUrl: string;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditUrlModal = ({ campaignId, campaignName, currentUrl, onClose, onUpdated }: Props) => {
  const { showToast } = useToast();
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setLoading(true);
    try {
      await updateOfferUrl(campaignId, url.trim());
      showToast('Offer URL updated successfully!', 'success');
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon"><Link2 size={22} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Edit Offer URL</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{campaignName}</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} type="button"><X size={22} /></button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="edit-url">Advertiser Offer URL</label>
            <textarea id="edit-url" value={url} onChange={e => setUrl(e.target.value)}
              required rows={3} autoFocus />
            <p className="field-hint">
              Ensure sub-parameter placeholders like <code>&#123;sub1&#125;</code> are included in the URL.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
              {loading ? <div className="loader" style={{ width: '18px', height: '18px' }} /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
