const DOMAIN = 'redrocksdd.com';
const WEBHOOK_ENDPOINT = 'https://www.redrocksdd.com/api/email/inbound';

async function resend(path, init = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || body?.error || `Resend request failed (${response.status})`);
  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    const listed = await resend('/domains');
    let domain = Array.isArray(listed?.data) ? listed.data.find((x) => String(x?.name || '').toLowerCase() === DOMAIN) : null;

    if (!domain) {
      domain = await resend('/domains', {
        method: 'POST',
        body: JSON.stringify({ name: DOMAIN, capabilities: { sending: 'enabled', receiving: 'enabled' } }),
      });
    } else {
      await resend(`/domains/${domain.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ capabilities: { sending: 'enabled', receiving: 'enabled' } }),
      });
    }

    const fullDomain = await resend(`/domains/${domain.id}`);
    const hooks = await resend('/webhooks').catch(() => ({ data: [] }));
    let webhook = Array.isArray(hooks?.data) ? hooks.data.find((x) => x?.endpoint === WEBHOOK_ENDPOINT) : null;
    if (!webhook) {
      webhook = await resend('/webhooks', {
        method: 'POST',
        body: JSON.stringify({ endpoint: WEBHOOK_ENDPOINT, events: ['email.received'] }),
      });
    }

    return res.status(200).json({ ok: true, domain: fullDomain, webhook, endpoint: WEBHOOK_ENDPOINT });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : 'setup_failed' });
  }
}
