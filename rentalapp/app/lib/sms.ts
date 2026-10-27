// SMS / WhatsApp via Twilio's REST API. Does nothing unless TWILIO_* env vars are set.
const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const SMS_FROM = process.env.TWILIO_SMS_FROM;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

/** Normalises Sierra Leone numbers to E.164 (+232XXXXXXXX). Returns null if it can't. */
export function toE164(phone: string | null | undefined) {
  const digits = (phone ?? '').replace(/[^\d+]/g, '');
  if (!digits) return null;
  if (digits.startsWith('+')) return /^\+\d{8,15}$/.test(digits) ? digits : null;
  if (digits.startsWith('00')) return toE164(`+${digits.slice(2)}`);
  if (digits.startsWith('232')) return toE164(`+${digits}`);
  if (digits.startsWith('0') && digits.length === 9) return `+232${digits.slice(1)}`;
  if (digits.length === 8) return `+232${digits}`;
  return null;
}

async function send(to: string, from: string, body: string) {
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
}

export const smsEnabled = () => !!(SID && TOKEN && (SMS_FROM || WHATSAPP_FROM));

/** Sends via WhatsApp when configured, falling back to SMS. Never throws. */
export async function sendText(phone: string | null | undefined, body: string) {
  if (!smsEnabled()) return false;
  const to = toE164(phone);
  if (!to) return false;
  try {
    if (WHATSAPP_FROM) {
      try {
        await send(`whatsapp:${to}`, `whatsapp:${WHATSAPP_FROM}`, body);
        return true;
      } catch (e) {
        if (!SMS_FROM) throw e;
        console.warn('WhatsApp send failed, falling back to SMS:', e);
      }
    }
    await send(to, SMS_FROM!, body);
    return true;
  } catch (e) {
    console.error('Text message failed:', e);
    return false;
  }
}
