import { useState } from 'react';
import { X, PlusCircle, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { createCampaign } from '../api';
import { useToast } from '../context/ToastContext';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateCampaignModal = ({ onClose, onCreated }: Props) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tracking_url: string; postback_url: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    setError('');
    setLoading(true);
    try {
      const data = await createCampaign(name.trim(), url.trim());
      setResult({ tracking_url: data.tracking_url, postback_url: data.postback_url });
      onCreated();
      showToast(`Campaign "${name}" created successfully!`, 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !result && onClose()}>
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon"><PlusCircle size={22} /></div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{result ? 'Campaign Created!' : 'New Campaign'}</h2>
          </div>
          <button className="btn-icon" onClick={onClose} type="button" title="Close"><X size={22} /></button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="camp-name">Campaign Name</label>
              <input id="camp-name" type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Q3 Summer Promo" required autoFocus />
            </div>
            <div className="input-group">
              <label htmlFor="camp-url">Advertiser Offer URL</label>
              <textarea id="camp-url" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://advertiser.com/landing?click={clickId}&sub1={sub1}&sub2={sub2}"
                required rows={3} />
              <p className="field-hint">
                <strong>Important:</strong> Sub-parameters must appear inside the URL as <code>&#123;sub1&#125;</code>, <code>&#123;sub2&#125;</code>, etc. — they are NOT separate fields.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '160px' }}>
                {loading ? <div className="loader" style={{ width: '18px', height: '18px' }} /> : 'Create Campaign'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Copy the URLs below and distribute them to your traffic sources and advertisers.
            </p>
            <div className="result-url-box">
              <div className="result-url-label">Tracking URL <span style={{ color: '#64748b' }}>(give to traffic source)</span></div>
              <div className="result-url-row">
                <code className="result-url-value">{result.tracking_url}</code>
                <button className="btn btn-ghost btn-sm" onClick={() => copy(result.tracking_url, 'track')}>
                  {copied === 'track' ? <CheckCircle2 size={15} color="var(--success-color)" /> : <Copy size={15} />}
                  {copied === 'track' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="result-url-box">
              <div className="result-url-label">Postback URL <span style={{ color: '#64748b' }}>(give to advertiser)</span></div>
              <div className="result-url-row">
                <code className="result-url-value">{result.postback_url}</code>
                <button className="btn btn-ghost btn-sm" onClick={() => copy(result.postback_url, 'post')}>
                  {copied === 'post' ? <CheckCircle2 size={15} color="var(--success-color)" /> : <Copy size={15} />}
                  {copied === 'post' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
