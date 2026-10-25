const MONIME_API = 'https://api.monime.io/v1';

function monimeHeaders() {
  return {
    Authorization: `Bearer ${process.env.MONIME_ACCESS_TOKEN}`,
    'Monime-Space-Id': process.env.MONIME_SPACE_ID!,
  };
}

export type CheckoutSession = {
  id: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  redirectUrl?: string;
  metadata?: Record<string, string> | null;
};

export async function createCheckoutSession(body: unknown, idempotencyKey: string) {
  const res = await fetch(`${MONIME_API}/checkout-sessions`, {
    method: 'POST',
    headers: {
      ...monimeHeaders(),
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Monime create failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return result as CheckoutSession;
}

export async function getCheckoutSession(id: string) {
  const res = await fetch(`${MONIME_API}/checkout-sessions/${encodeURIComponent(id)}`, {
    headers: monimeHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Monime lookup failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return result as CheckoutSession;
}
