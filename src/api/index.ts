import type { Campaign } from '../types';

export type { Campaign };

const BASE = '/api';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getCampaigns(status?: string): Promise<Campaign[]> {
  const url = status ? `${BASE}/campaign?status=${status}` : `${BASE}/campaign`;
  const res = await fetch(url, { headers: defaultHeaders });
  const data = await handleResponse(res);
  if (data?.campaigns && Array.isArray(data.campaigns)) return data.campaigns;
  if (Array.isArray(data)) return data;
  return [];
}

export async function createCampaign(name: string, advertiser_offer_url: string): Promise<any> {
  const res = await fetch(`${BASE}/campaign`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ name, advertiser_offer_url }),
  });
  return handleResponse(res);
}

export async function updateStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`${BASE}/campaign/${id}/status`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({ status }),
  });
  await handleResponse(res);
}

export async function updateOfferUrl(id: string, advertiser_offer_url: string): Promise<void> {
  const res = await fetch(`${BASE}/campaign/${id}/offer-url`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({ advertiser_offer_url }),
  });
  await handleResponse(res);
}

export async function deleteCampaign(id: string): Promise<void> {
  const res = await fetch(`${BASE}/campaign/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  await handleResponse(res);
}

export interface ReportFilters {
  affiliate_id?: string;
  period?: 'last_week' | 'last_month' | 'current_month' | 'custom';
  start_date?: string;
  end_date?: string;
}

export interface ReportBreakdownItem {
  event: string;
  clicks: number;
  conversions: number;
}

export interface ReportData {
  success: boolean;
  campaign_id: string;
  campaign_name: string;
  filters: {
    affiliate_id: string | null;
    period: string | null;
  };
  totals: {
    clicks: number;
    conversions: number;
  };
  breakdown: ReportBreakdownItem[];
}

export async function getReport(campaignId: string, filters: ReportFilters = {}): Promise<ReportData> {
  const params = new URLSearchParams();
  if (filters.affiliate_id) params.set('affiliate_id', filters.affiliate_id);
  if (filters.period) params.set('period', filters.period);
  if (filters.start_date) params.set('start_date', filters.start_date);
  if (filters.end_date) params.set('end_date', filters.end_date);
  const query = params.toString();
  const url = `${BASE}/reports/${campaignId}${query ? `?${query}` : ''}`;
  const res = await fetch(url, { headers: defaultHeaders });
  return handleResponse(res);
}
