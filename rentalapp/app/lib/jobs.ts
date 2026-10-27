// Background jobs run once a day by /api/cron/daily.
import { prisma } from './prisma';
import { confirmOrderPayment } from './orders';
import { sendEmail, emailButton } from './email';
import { sendText } from './sms';
import { escapeHtml } from './escapeHtml';
import {
  DAY_MS,
  LISTING_REMINDER_DAYS_BEFORE,
  LISTING_TTL_DAYS,
  RESERVATION_PRIORITY_DAYS,
  SITE_NAME,
  getAppUrl,
} from './config';
import { buildPropertyWhere, describeSearch, pickSearchParams } from './listings';

const daysAgo = (days: number, now: Date) => new Date(now.getTime() - days * DAY_MS);

/** Pending orders whose tenant never came back to /checkout: ask Monime directly. */
export async function reconcilePendingOrders(now = new Date()) {
  const orders = await prisma.order.findMany({
    where: {
      status: 'pending',
      checkoutSessionId: { not: null },
      createdAt: { gte: daysAgo(2, now), lte: new Date(now.getTime() - 10 * 60 * 1000) },
    },
    select: { id: true },
    take: 100,
  });
  let confirmed = 0;
  for (const o of orders) {
    try {
      const r = await confirmOrderPayment(o.id);
      if (r.state === 'paid') confirmed++;
      else if (r.state === 'not-paid') {
        await prisma.order.updateMany({ where: { id: o.id, status: 'pending' }, data: { status: 'cancelled' } });
      }
    } catch (e) {
      console.error('Reconcile failed for order', o.id, e);
    }
  }
  return { checked: orders.length, confirmed };
}

/** One day before the priority period ends, nudge the agent to mark the property rented. */
export async function sendRelistReminders(now = new Date()) {
  const orders = await prisma.order.findMany({
    where: {
      status: 'completed',
      outcome: null,
      property: { is: { isAvailable: false, rentedAt: null } },
      relistReminderSentAt: null,
      paidAt: { lte: daysAgo(RESERVATION_PRIORITY_DAYS - 1, now), gt: daysAgo(RESERVATION_PRIORITY_DAYS, now) },
    },
    include: { property: { select: { title: true, agent: { select: { name: true, email: true, phone: true } } } } },
    take: 200,
  });

  for (const o of orders) {
    const agent = o.property!.agent;
    const title = o.property!.title;
    await Promise.all([
      sendEmail({
        to: agent.email,
        subject: `Reservation ends tomorrow – ${title}`,
        html: `
          <p>Hi ${escapeHtml(agent.name)},</p>
          <p>${escapeHtml(o.name)}'s priority on “${escapeHtml(title)}” ends tomorrow.</p>
          <p>If you have agreed terms, mark the property as rented. Otherwise it will be re-listed automatically.</p>
          ${emailButton(`${getAppUrl()}/Dashboard/reserved-properties`, 'Mark as rented')}
        `,
      }),
      sendText(agent.phone, `${SITE_NAME}: Reservation on "${title}" ends tomorrow. Mark it rented in your dashboard or it will be re-listed.`),
    ]);
    await prisma.order.update({ where: { id: o.id }, data: { relistReminderSentAt: now } });
  }
  return { reminded: orders.length };
}

/** After the priority period, put the property back on the market. */
export async function relistExpiredReservations(now = new Date()) {
  const orders = await prisma.order.findMany({
    where: {
      status: 'completed',
      outcome: null,
      propertyId: { not: null },
      paidAt: { lte: daysAgo(RESERVATION_PRIORITY_DAYS, now) },
    },
    include: {
      property: {
        select: { id: true, title: true, isAvailable: true, rentedAt: true, agent: { select: { name: true, email: true, phone: true } } },
      },
    },
    take: 200,
  });

  let relisted = 0;
  for (const o of orders) {
    const p = o.property!;
    if (p.rentedAt) {
      await prisma.order.update({ where: { id: o.id }, data: { outcome: 'rented' } });
      continue;
    }
    await prisma.order.update({ where: { id: o.id }, data: { outcome: 'relisted', relistedAt: now } });
    if (p.isAvailable) continue; // agent already re-listed it by hand

    await prisma.property.update({ where: { id: p.id }, data: { isAvailable: true, confirmedAt: now, expiryReminderSentAt: null } });
    relisted++;

    await Promise.all([
      sendEmail({
        to: p.agent.email,
        subject: `Re-listed – ${p.title}`,
        html: `<p>Hi ${escapeHtml(p.agent.name)},</p><p>The ${RESERVATION_PRIORITY_DAYS}-day reservation on “${escapeHtml(p.title)}” ended without being marked rented, so it is visible to tenants again.</p>`,
      }),
      sendEmail({
        to: o.email,
        subject: `Your priority period ended – ${p.title}`,
        html: `<p>Hi ${escapeHtml(o.name)},</p><p>Your ${RESERVATION_PRIORITY_DAYS}-day priority on “${escapeHtml(p.title)}” has ended and the property is available to others again. The agent's contact details remain in your reservations.</p>${emailButton(`${getAppUrl()}/reservations`, 'My reservations')}`,
      }),
    ]);
  }
  return { relisted };
}

/** Remind agents a few days before a listing stops showing publicly. */
export async function sendListingExpiryReminders(now = new Date()) {
  const properties = await prisma.property.findMany({
    where: {
      rentedAt: null,
      expiryReminderSentAt: null,
      confirmedAt: {
        lte: daysAgo(LISTING_TTL_DAYS - LISTING_REMINDER_DAYS_BEFORE, now),
        gt: daysAgo(LISTING_TTL_DAYS, now),
      },
    },
    select: { id: true, title: true, agent: { select: { name: true, email: true, phone: true } } },
    take: 500,
  });

  for (const p of properties) {
    await Promise.all([
      sendEmail({
        to: p.agent.email,
        subject: `Is “${p.title}” still available?`,
        html: `
          <p>Hi ${escapeHtml(p.agent.name)},</p>
          <p>“${escapeHtml(p.title)}” will be hidden from tenants in ${LISTING_REMINDER_DAYS_BEFORE} days unless you confirm it is still available.</p>
          ${emailButton(`${getAppUrl()}/Dashboard/properties`, 'Confirm listing')}
        `,
      }),
      sendText(p.agent.phone, `${SITE_NAME}: Please confirm "${p.title}" is still available within ${LISTING_REMINDER_DAYS_BEFORE} days or it will be hidden.`),
    ]);
    await prisma.property.update({ where: { id: p.id }, data: { expiryReminderSentAt: now } });
  }
  return { reminded: properties.length };
}

/** Email tenants new listings that match their saved searches. */
export async function sendSavedSearchAlerts(now = new Date()) {
  const searches = await prisma.savedSearch.findMany({ take: 1000, orderBy: { lastNotifiedAt: 'asc' } });
  let sent = 0;

  for (const s of searches) {
    const params = pickSearchParams((s.params ?? {}) as Record<string, unknown>);
    const matches = await prisma.property.findMany({
      where: { AND: [buildPropertyWhere(params, now), { isAvailable: true }, { postedAt: { gt: s.lastNotifiedAt } }] },
      orderBy: { postedAt: 'desc' },
      take: 10,
      select: { id: true, title: true, price: true, city: true, area: true },
    });

    if (matches.length) {
      const appUrl = getAppUrl();
      const list = matches
        .map(
          (m) =>
            `<li style="margin-bottom:8px"><a href="${appUrl}/properties/${m.id}" style="color:#148656;font-weight:600">${escapeHtml(m.title)}</a><br/>NLe ${m.price.toLocaleString()}/yr · ${escapeHtml(m.area)}, ${escapeHtml(m.city)}</li>`
        )
        .join('');
      const ok = await sendEmail({
        to: s.email,
        subject: `${matches.length} new listing${matches.length > 1 ? 's' : ''} for “${s.label}”`,
        html: `<p>New properties matching your saved search <strong>${escapeHtml(describeSearch(params))}</strong>:</p><ul>${list}</ul><p style="font-size:12px;color:#6b7280">Manage alerts on your <a href="${appUrl}/saved" style="color:#148656">Saved page</a>.</p>`,
      });
      if (ok) sent++;
    }
    await prisma.savedSearch.update({ where: { id: s.id }, data: { lastNotifiedAt: now } });
  }
  return { searches: searches.length, sent };
}

export async function runDailyJobs(now = new Date()) {
  const results: Record<string, unknown> = {};
  const steps = {
    reconcilePendingOrders,
    sendRelistReminders,
    relistExpiredReservations,
    sendListingExpiryReminders,
    sendSavedSearchAlerts,
  };
  for (const [name, fn] of Object.entries(steps)) {
    try {
      results[name] = await fn(now);
    } catch (e) {
      console.error(`Daily job ${name} failed:`, e);
      results[name] = { error: e instanceof Error ? e.message : String(e) };
    }
  }
  return results;
}
