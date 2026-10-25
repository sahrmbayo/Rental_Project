// Server-only settings. Client components should import from ./constants instead.
import { SITE_NAME } from './constants';

export { SITE_NAME, PLACEHOLDER_IMAGE } from './constants';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mbayo262@gmail.com';
export const EMAIL_FROM = process.env.EMAIL_FROM || `${SITE_NAME} <noreply@salonerent.com>`;

/** Reservation fee in whole Leones (NLe). Monime expects minor units, so multiply by 100 when charging. */
export const RESERVATION_FEE_NLE = Number(process.env.RESERVATION_FEE_NLE ?? 50);

export function getAppUrl(fallbackOrigin?: string) {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return (process.env.NEXT_PUBLIC_APP_URL || fallbackOrigin || vercelUrl || 'http://localhost:3000').replace(/\/$/, '');
}
