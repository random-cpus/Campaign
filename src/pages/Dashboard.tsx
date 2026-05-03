import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Campaign } from '../types';
import { getCampaigns } from '../api';
import { useToast } from '../context/ToastContext';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { BarChart3, CheckCircle2, PauseCircle, Plus, Megaphone, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      showToast('Failed to load campaigns', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const total = campaigns.length;
  const active = campaigns.filter(c => c.status === 'active').length;
  const paused = campaigns.filter(c => c.status === 'paused').length;
  const recent = [...campaigns].slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's your campaign overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue"><BarChart3 size={22} /></div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '—' : total}</div>
            <div className="stat-label">Total Campaigns</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green"><CheckCircle2 size={22} /></div>
          <div className="stat-body">
            <div className="stat-value stat-green">{loading ? '—' : active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-yellow"><PauseCircle size={22} /></div>
          <div className="stat-body">
            <div className="stat-value stat-yellow">{loading ? '—' : paused}</div>
            <div className="stat-label">Paused</div>
          </div>
        </div>
      </div>

      <div className="glass-panel section-panel">
        <div className="section-header">
          <h2 className="section-title"><Megaphone size={18} /> Recent Campaigns</h2>
          <Link to="/campaigns" className="btn btn-ghost btn-sm">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        {loading ? (
          <div className="skeleton-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-row">
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-badge"></div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Megaphone size={28} /></div>
            <h3>No campaigns yet</h3>
            <p>Click "New Campaign" to create your first tracking campaign.</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create First Campaign
            </button>
          </div>
        ) : (
          <div className="recent-list">
            {recent.map(camp => (
              <div key={camp.$id} className="recent-item">
                <div className="recent-info">
                  <span className="recent-name">{camp.name}</span>
                  <span className="recent-id">ID: {camp.$id}</span>
                </div>
                <span className={`badge badge-${camp.status}`}>{camp.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateCampaignModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchCampaigns}
        />
      )}
    </div>
  );
};
