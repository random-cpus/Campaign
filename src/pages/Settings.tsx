import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import { useToast } from '../context/ToastContext';
import { getCampaigns } from '../api';
import { KeyRound, Eye, EyeOff, CheckCircle2, Trash2, Shield, AlertCircle } from 'lucide-react';

export const Settings = () => {
  const { apiKey, setApiKey, clearApiKey, hasApiKey } = useApiKey();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [input, setInput] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const maskedKey = (key: string) => key.length > 8
    ? key.slice(0, 8) + '•'.repeat(Math.max(0, key.length - 8))
    : '•'.repeat(key.length);

  const handleSave = () => {
    if (!input.trim()) return;
    setApiKey(input.trim());
    showToast('API key saved successfully!', 'success');
    setTestResult(null);
  };

  const handleClear = () => {
    if (!window.confirm('Clear the saved API key? You will be logged out.')) return;
    clearApiKey();
    setInput('');
    setTestResult(null);
    showToast('API key cleared.', 'info');
  };

  const handleTest = async () => {
    const keyToTest = input.trim() || apiKey;
    if (!keyToTest) return;
    setTesting(true);
    setTestResult(null);
    try {
      await getCampaigns(keyToTest);
      setTestResult('success');
      showToast('Connection successful! API key is valid.', 'success');
    } catch (err: any) {
      setTestResult('error');
      showToast('Connection failed — API key may be invalid.', 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your API key and connection settings</p>
        </div>
      </div>

      <div className="glass-panel settings-panel">
        <div className="settings-section-header">
          <div className="settings-icon"><KeyRound size={20} /></div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>API Key Configuration</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your key is stored only in this browser and never sent to any third party.
            </p>
          </div>
        </div>

        {/* Current Key Status */}
        {hasApiKey && (
          <div className="key-status-box">
            <Shield size={16} color="var(--success-color)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saved Key</div>
              <div className="saved-key-display">{showKey ? apiKey : maskedKey(apiKey)}</div>
            </div>
            <button className="btn-icon" onClick={() => setShowKey(!showKey)} title={showKey ? 'Hide key' : 'Reveal key'}>
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}

        {/* Input */}
        <div className="input-group" style={{ marginTop: '1.5rem' }}>
          <label htmlFor="api-key-input">Enter or Update API Key</label>
          <div style={{ position: 'relative' }}>
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={input}
              onChange={e => { setInput(e.target.value); setTestResult(null); }}
              placeholder="Paste your API key here"
              style={{ paddingRight: '3rem', fontFamily: 'monospace' }}
              autoFocus={!hasApiKey}
            />
            <button
              className="btn-icon"
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showKey ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`test-result ${testResult === 'success' ? 'test-success' : 'test-error'}`}>
            {testResult === 'success'
              ? <><CheckCircle2 size={17} /> <span>Connection successful! API key is valid.</span></>
              : <><AlertCircle size={17} /> <span>Connection failed. Check your API key.</span></>
            }
          </div>
        )}

        {/* Buttons */}
        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={!input.trim()}>
            Save Key
          </button>
          <button className="btn btn-ghost" onClick={handleTest} disabled={testing || (!input.trim() && !apiKey)}>
            {testing ? <><div className="loader" style={{ width: '16px', height: '16px' }} /> Testing...</> : 'Test Connection'}
          </button>
          {hasApiKey && (
            <button className="btn btn-danger" onClick={handleClear}>
              <Trash2 size={16} /> Clear Key
            </button>
          )}
          {hasApiKey && (
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              ← Back to Dashboard
            </button>
          )}
        </div>

        <div className="settings-note">
          <strong>API key:</strong> The key is sent as <code>x-api-key</code> header with every request to the backend. If your key is compromised, contact your backend team to issue a new one.
        </div>
      </div>
    </div>
  );
};
