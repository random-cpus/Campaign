import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'https://trk.resiliencemedia.tech';
const BACKEND_API_KEY  = process.env.BACKEND_API_KEY  || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const method = req.method || 'GET';
  let path = req.url?.split('?')[0] || '/';
  if (path.startsWith('/api')) path = path.replace(/^\/api/, '');
  if (!path) path = '/';

  if (!BACKEND_API_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: BACKEND_API_KEY missing' });
  }

  const backendHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': BACKEND_API_KEY,   // ← server-side env se, user se nahi
  };


  try {
    // GET /campaign
    if (path === '/campaign' && method === 'GET') {
      const status = req.query.status as string | undefined;
      const url = status
        ? `${BACKEND_BASE_URL}/campaign?status=${status}`
        : `${BACKEND_BASE_URL}/campaign`;
      const response = await fetch(url, { headers: backendHeaders });
      const data = await response.text();
      return res.status(response.status).send(data);
    }

    // POST /campaign
    if (path === '/campaign' && method === 'POST') {
      const response = await fetch(`${BACKEND_BASE_URL}/campaign`, {
        method: 'POST',
        headers: backendHeaders,
        body: JSON.stringify(req.body),
      });
      const data = await response.text();
      return res.status(response.status).send(data);
    }

    // /campaign/:id and sub-routes
    const match = path.match(/^\/campaign\/([^\/]+)(?:\/(.*))?$/);
    if (match) {
      const [, id, sub] = match;

      if (sub === 'status' && method === 'PUT') {
        const response = await fetch(`${BACKEND_BASE_URL}/campaign/${id}/status`, {
          method: 'PUT',
          headers: backendHeaders,
          body: JSON.stringify(req.body),
        });
        return res.status(response.status).send(await response.text());
      }

      if (sub === 'offer-url' && method === 'PUT') {
        const response = await fetch(`${BACKEND_BASE_URL}/campaign/${id}/offer-url`, {
          method: 'PUT',
          headers: backendHeaders,
          body: JSON.stringify(req.body),
        });
        return res.status(response.status).send(await response.text());
      }

      if (!sub && method === 'DELETE') {
        const response = await fetch(`${BACKEND_BASE_URL}/campaign/${id}`, {
          method: 'DELETE',
          headers: backendHeaders,
        });
        return res.status(response.status).send(await response.text());
      }
    }

    return res.status(404).json({ error: 'Not Found' });
  } catch (error: any) {
    console.error('[Proxy Error]', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
