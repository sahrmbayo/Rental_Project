import { Resend } from 'resend';
import { EMAIL_FROM, SITE_NAME, getAppUrl } from './config';

const resend = new Resend(process.env.RESEND_API_KEY);

/** Sends an email and never throws; failures are logged so callers' main work still succeeds. */
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, html: layout(html) });
    if (error) console.error('Email failed:', subject, error);
    return !error;
  } catch (e) {
    console.error('Email failed:', subject, e);
    return false;
  }
}

function layout(body: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111827">
      <div style="padding:16px 0;font-size:20px;font-weight:800;color:#148656">Salone<span style="color:#f5780b">Rent</span></div>
      ${body}
      <p style="margin-top:32px;font-size:12px;color:#6b7280">${SITE_NAME} · <a href="${getAppUrl()}" style="color:#148656">${getAppUrl().replace(/^https?:\/\//, '')}</a></p>
    </div>`;
}

export function emailButton(href: string, label: string) {
  return `<p><a href="${href}" style="display:inline-block;background:#148656;color:#fff;padding:10px 20px;border-radius:9999px;text-decoration:none;font-weight:600">${label}</a></p>`;
}
