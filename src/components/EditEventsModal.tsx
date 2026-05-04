import { useState, type KeyboardEvent } from 'react';
import { X, Tag, AlertCircle, Plus } from 'lucide-react';
import { updateEvents } from '../api';
import { useToast } from '../context/ToastContext';

interface Props {
  campaignId: string;
  campaignName: string;
  currentEvents: string[];
  onClose: () => void;
  onUpdated: () => void;
}

export const EditEventsModal = ({ campaignId, campaignName, currentEvents, onClose, onUpdated }: Props) => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<string[]>([...currentEvents]);
  const [eventInput, setEventInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addEvent = () => {
    const val = eventInput.trim().toLowerCase();
    if (!val) return;
    if (events.includes(val)) { setEventInput(''); return; }
    setEvents(prev => [...prev, val]);
    setEventInput('');
  };

  const removeEvent = (ev: string) => setEvents(prev => prev.filter(e => e !== ev));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addEvent(); }
    if (e.key === 'Backspace' && !eventInput && events.length > 0) {
      setEvents(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateEvents(campaignId, events);
      showToast('Events updated successfully!', 'success');
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update events');
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = ['deposit', 're-deposit', 'registration', 'lead', 'purchase'];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon"><Tag size={22} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Edit Events</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{campaignName}</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} type="button"><X size={22} /></button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Conversion Events</label>
            <div className="events-tag-input">
              {events.map(ev => (
                <span key={ev} className="event-tag">
                  {ev}
                  <button type="button" className="event-tag-remove" onClick={() => removeEvent(ev)} title="Remove">
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="events-tag-inner-input"
                value={eventInput}
                onChange={e => setEventInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={events.length === 0 ? 'e.g. deposit  (Enter to add)' : ''}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {PRESETS.filter(p => !events.includes(p)).map(preset => (
                <button
                  key={preset}
                  type="button"
                  className="event-preset-btn"
                  onClick={() => setEvents(prev => [...prev, preset])}
                >
                  <Plus size={11} /> {preset}
                </button>
              ))}
            </div>
            <p className="field-hint">Press Enter or comma to add an event. Backspace removes the last one.</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
              {loading ? <div className="loader" style={{ width: '18px', height: '18px' }} /> : 'Save Events'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
