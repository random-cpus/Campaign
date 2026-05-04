import { useState, useEffect } from 'react';
import type { Campaign } from '../types';
import { getCampaigns, updateStatus, deleteCampaign } from '../api';
import { useToast } from '../context/ToastContext';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { EditUrlModal } from '../components/EditUrlModal';
import { EditEventsModal } from '../components/EditEventsModal';
import {
  Plus, Copy, Trash2, Edit2, CheckCircle2, Play, Pause, Megaphone, AlertCircle, Tag
} from 'lucide-react';

type Filter = 'all' | 'active' | 'paused';

export const Campaigns = () => {
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editModal, setEditModal] = useState<Campaign | null>(null);
  const [editEventsModal, setEditEventsModal] = useState<Campaign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCampaigns = async (f: Filter = filter) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCampaigns(f === 'all' ? undefined : f);
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(filter); }, [filter]);

  const handleToggleStatus = async (camp: Campaign) => {
    const newStatus = camp.status === 'active' ? 'paused' : 'active';
    try {
      await updateStatus(camp.$id, newStatus);
      showToast(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully.`, 'success');
      fetchCampaigns();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (camp: Campaign) => {
    if (!window.confirm(`Delete "${camp.name}"? This cannot be undone.`)) return;
    try {
      await deleteCampaign(camp.$id);
      showToast(`Campaign "${camp.name}" deleted.`, 'success');
      fetchCampaigns();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const copy = (text: string | null, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Manage your tracking campaigns</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="filter-bar">
          {(['all', 'active', 'paused'] as Filter[]).map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'filter-btn-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'active' ? '● Active' : '● Paused'}
            </button>
          ))}
          <span className="filter-count">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="skeleton-list" style={{ padding: '1rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-row skeleton-table-row">
                <div className="skeleton skeleton-text" style={{ width: '25%' }}></div>
                <div className="skeleton skeleton-badge"></div>
                <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '15%' }}></div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem' }}>
            <div className="empty-icon"><Megaphone size={28} /></div>
            <h3>No campaigns {filter !== 'all' ? `with status "${filter}"` : 'found'}</h3>
            <p>
              {filter !== 'all'
                ? `Try switching to "All" to see all campaigns.`
                : 'Click "New Campaign" to create your first tracking campaign.'}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                <Plus size={16} /> Create First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th>Events</th>
                  <th>Tracking URL</th>
                  <th>Postback URL</th>
                  <th>Offer URL</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(camp => (
                  <tr key={camp.$id}>
                    <td>
                      <div className="camp-name">{camp.name}</div>
                      <div className="camp-id">ID: {camp.$id}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge badge-${camp.status}`}>{camp.status}</span>
                    </td>
                    <td>
                      {camp.events && camp.events.length > 0 ? (
                        <div className="events-cell">
                          {camp.events.map(ev => (
                            <span key={ev} className="event-badge">{ev}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#475569', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`copy-btn ${copiedId === `t-${camp.$id}` ? 'copy-btn-success' : ''}`}
                        onClick={() => copy(camp.tracking_url, `t-${camp.$id}`)}
                        disabled={!camp.tracking_url}
                        title={camp.tracking_url || ''}
                      >
                        {copiedId === `t-${camp.$id}` ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copiedId === `t-${camp.$id}` ? 'Copied!' : 'Copy Link'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`copy-btn ${copiedId === `p-${camp.$id}` ? 'copy-btn-success' : ''}`}
                        onClick={() => copy(camp.postback_url, `p-${camp.$id}`)}
                        disabled={!camp.postback_url}
                        title={camp.postback_url || ''}
                      >
                        {copiedId === `p-${camp.$id}` ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copiedId === `p-${camp.$id}` ? 'Copied!' : 'Copy Link'}
                      </button>
                    </td>
                    <td>
                      <span className="offer-url-text" title={camp.advertiser_offer_url}>
                        {camp.advertiser_offer_url}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className={`btn-icon action-btn ${camp.status === 'active' ? 'action-pause' : 'action-play'}`}
                          onClick={() => handleToggleStatus(camp)}
                          title={camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                        >
                          {camp.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          className="btn-icon action-btn action-tag"
                          onClick={() => setEditEventsModal(camp)}
                          title="Edit Events"
                        >
                          <Tag size={16} />
                        </button>
                        <button
                          className="btn-icon action-btn action-edit"
                          onClick={() => setEditModal(camp)}
                          title="Edit Offer URL"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon action-btn action-delete"
                          onClick={() => handleDelete(camp)}
                          title="Delete Campaign"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={() => fetchCampaigns()} />
      )}
      {editModal && (
        <EditUrlModal
          campaignId={editModal.$id}
          campaignName={editModal.name}
          currentUrl={editModal.advertiser_offer_url}
          onClose={() => setEditModal(null)}
          onUpdated={() => fetchCampaigns()}
        />
      )}
      {editEventsModal && (
        <EditEventsModal
          campaignId={editEventsModal.$id}
          campaignName={editEventsModal.name}
          currentEvents={editEventsModal.events ?? []}
          onClose={() => setEditEventsModal(null)}
          onUpdated={() => fetchCampaigns()}
        />
      )}
    </div>
  );
};
