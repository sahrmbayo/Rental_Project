// Server-only settings. Client components should import from ./constants instead.
import { SITE_NAME } from './constants';

export { SITE_NAME, PLACEHOLDER_IMAGE } from './constants';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mbayo262@gmail.com';
export const EMAIL_FROM = process.env.EMAIL_FROM || `${SITE_NAME} <noreply@salonerent.com>`;

/** Reservation fee in whole Leones (NLe). Monime expects minor units, so multiply by 100 when charging. */
export const RESERVATION_FEE_NLE = Number(process.env.RESERVATION_FEE_NLE ?? 50);

/** Days a paying tenant has to agree terms before the property is re-listed. */
export const RESERVATION_PRIORITY_DAYS = 3;
/** Days a listing stays public before the agent must confirm it is still available. */
export const LISTING_TTL_DAYS = 30;
/** Days before expiry that the agent gets a reminder. */
export const LISTING_REMINDER_DAYS_BEFORE = 5;

export const DAY_MS = 24 * 60 * 60 * 1000;

export function getAppUrl(fallbackOrigin?: string) {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return (process.env.NEXT_PUBLIC_APP_URL || fallbackOrigin || vercelUrl || 'http://localhost:3000').replace(/\/$/, '');
}
