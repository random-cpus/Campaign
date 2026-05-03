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
