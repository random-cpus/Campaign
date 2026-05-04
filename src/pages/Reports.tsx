import { useState, useEffect } from 'react';
import type { Campaign } from '../types';
import {
  getCampaigns, getReport,
  type ReportData, type ReportFilters,
} from '../api';
import { useToast } from '../context/ToastContext';
import {
  BarChart3, MousePointerClick, TrendingUp, Filter,
  RefreshCw, AlertCircle, ChevronDown, Calendar,
} from 'lucide-react';

type Period = 'all_time' | 'current_month' | 'last_month' | 'last_week' | 'custom';

const PERIOD_LABELS: Record<Period, string> = {
  all_time: 'All Time',
  current_month: 'Current Month',
  last_month: 'Last Month',
  last_week: 'Last 7 Days',
  custom: 'Custom Range',
};

export const Reports = () => {
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState('');
  const [affiliateId, setAffiliateId] = useState('');
  const [period, setPeriod] = useState<Period>('all_time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [campsLoading, setCampsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  // Load campaigns list for the selector
  useEffect(() => {
    getCampaigns()
      .then(data => {
        setCampaigns(data);
        if (data.length > 0) setCampaignId(data[0].$id);
      })
      .catch(() => showToast('Failed to load campaigns', 'error'))
      .finally(() => setCampsLoading(false));
  }, []);

  const fetchReport = async () => {
    if (!campaignId) { showToast('Please select a campaign', 'error'); return; }
    if (period === 'custom' && (!startDate || !endDate)) {
      showToast('Please enter both start and end date for custom range', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    const filters: ReportFilters = {};
    if (affiliateId.trim()) filters.affiliate_id = affiliateId.trim();
    if (period !== 'all_time') {
      if (period === 'custom') {
        filters.period = 'custom';
        filters.start_date = startDate;
        filters.end_date = endDate;
      } else {
        filters.period = period;
      }
    }

    try {
      const data = await getReport(campaignId, filters);
      setReport(data);
      setFetched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const convRate = (clicks: number, conversions: number) => {
    if (!clicks) return '0%';
    return `${((conversions / clicks) * 100).toFixed(1)}%`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Analyze campaign performance & event breakdowns</p>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="glass-panel report-filter-card">
        <div className="report-filter-header">
          <Filter size={16} />
          <span>Report Filters</span>
        </div>
        <div className="report-filter-body">

          {/* Campaign selector */}
          <div className="report-field">
            <label className="report-label">Campaign</label>
            <div className="select-wrap">
              <select
                value={campaignId}
                onChange={e => setCampaignId(e.target.value)}
                disabled={campsLoading}
              >
                {campsLoading
                  ? <option>Loading…</option>
                  : campaigns.length === 0
                    ? <option value="">No campaigns found</option>
                    : campaigns.map(c => (
                        <option key={c.$id} value={c.$id}>{c.name}</option>
                      ))
                }
              </select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>

          {/* Period selector */}
          <div className="report-field">
            <label className="report-label">Period</label>
            <div className="select-wrap">
              <select value={period} onChange={e => setPeriod(e.target.value as Period)}>
                {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>

          {/* Affiliate ID */}
          <div className="report-field">
            <label className="report-label">Affiliate ID <span className="report-optional">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. aff123"
              value={affiliateId}
              onChange={e => setAffiliateId(e.target.value)}
            />
          </div>

          {/* Custom date range */}
          {period === 'custom' && (
            <>
              <div className="report-field">
                <label className="report-label"><Calendar size={13} /> Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="report-field">
                <label className="report-label"><Calendar size={13} /> End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            className="btn btn-primary report-run-btn"
            onClick={fetchReport}
            disabled={loading || campsLoading || !campaignId}
          >
            {loading ? <span className="loader" style={{ width: 18, height: 18 }} /> : <RefreshCw size={16} />}
            {loading ? 'Loading…' : 'Run Report'}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="error-message" style={{ marginTop: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Results ── */}
      {report && (
        <>
          {/* Meta info */}
          <div className="report-meta">
            <span className="report-meta-campaign">{report.campaign_name}</span>
            {report.filters.period && (
              <span className="report-meta-tag">
                {PERIOD_LABELS[report.filters.period as Period] ?? report.filters.period}
              </span>
            )}
            {!report.filters.period && (
              <span className="report-meta-tag">All Time</span>
            )}
            {report.filters.affiliate_id && (
              <span className="report-meta-tag report-meta-aff">Aff: {report.filters.affiliate_id}</span>
            )}
          </div>

          {/* Totals */}
          <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue"><MousePointerClick size={22} /></div>
              <div className="stat-body">
                <div className="stat-value">{report.totals.clicks.toLocaleString()}</div>
                <div className="stat-label">Total Clicks</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-green"><TrendingUp size={22} /></div>
              <div className="stat-body">
                <div className="stat-value stat-green">{report.totals.conversions.toLocaleString()}</div>
                <div className="stat-label">Total Conversions</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-yellow"><BarChart3 size={22} /></div>
              <div className="stat-body">
                <div className="stat-value stat-yellow">
                  {convRate(report.totals.clicks, report.totals.conversions)}
                </div>
                <div className="stat-label">Conversion Rate</div>
              </div>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div className="section-header">
              <h2 className="section-title"><BarChart3 size={18} /> Event Breakdown</h2>
            </div>
            {report.breakdown.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><BarChart3 size={28} /></div>
                <h3>No event data</h3>
                <p>No conversions recorded for this period.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th style={{ textAlign: 'right' }}>Clicks</th>
                      <th style={{ textAlign: 'right' }}>Conversions</th>
                      <th style={{ textAlign: 'right' }}>Conv. Rate</th>
                      <th style={{ textAlign: 'right' }}>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.breakdown.map(row => (
                      <tr key={row.event}>
                        <td>
                          <span className="event-badge">{row.event}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>{row.clicks.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                            {row.conversions.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="rate-pill">
                            {convRate(row.clicks, row.conversions)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                          {report.totals.conversions
                            ? `${((row.conversions / report.totals.conversions) * 100).toFixed(1)}%`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Empty prompt (before first fetch) ── */}
      {!fetched && !loading && !error && (
        <div className="report-empty-prompt glass-panel">
          <div className="empty-icon" style={{ margin: '0 auto 1.25rem' }}>
            <BarChart3 size={30} />
          </div>
          <h3>Select a campaign and run a report</h3>
          <p>Use the filters above to choose a campaign, period, and optionally an affiliate, then click <strong>Run Report</strong>.</p>
        </div>
      )}
    </div>
  );
};
