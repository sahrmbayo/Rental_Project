import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../lib/prisma';
import { escapeHtml } from '../../lib/escapeHtml';
import { clientIp, rateLimit } from '../../lib/rateLimit';
import { ADMIN_EMAIL, EMAIL_FROM, SITE_NAME } from '../../lib/config';

const resend = new Resend(process.env.RESEND_API_KEY);

const REASONS = ['issue', 'question', 'feedback'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`contact:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { customerName, customerEmail, customerPhone, reasonType, message, website } = body ?? {};

    // Honeypot: real users never see or fill this field.
    if (website) return NextResponse.json({ success: true }, { status: 201 });

    if (
      typeof customerName !== 'string' || !customerName.trim() || customerName.length > 100 ||
      typeof customerEmail !== 'string' || !EMAIL_RE.test(customerEmail) || customerEmail.length > 200 ||
      !REASONS.includes(reasonType) ||
      typeof message !== 'string' || !message.trim() || message.length > 5000 ||
      (customerPhone && (typeof customerPhone !== 'string' || customerPhone.length > 30))
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone || null,
        reasonType,
        message: message.trim(),
      },
    });

    const safe = {
      name: escapeHtml(submission.customerName),
      email: escapeHtml(submission.customerEmail),
      phone: escapeHtml(submission.customerPhone || 'Not provided'),
      reason: escapeHtml(reasonType),
      message: escapeHtml(submission.message).replace(/\n/g, '<br/>'),
    };

    const results = await Promise.allSettled([
      resend.emails.send({
        from: EMAIL_FROM,
        to: ADMIN_EMAIL,
        replyTo: submission.customerEmail,
        subject: `New Contact Form Submission - ${reasonType}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${safe.name}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>
          <p><strong>Reason:</strong> ${safe.reason}</p>
          <p><strong>Message:</strong></p>
          <p>${safe.message}</p>
          <p><strong>Reference ID:</strong> ${submission.id}</p>
        `,
      }),
      resend.emails.send({
        from: EMAIL_FROM,
        to: submission.customerEmail,
        subject: 'We received your message - Thank you!',
        html: `
          <h3>Hi ${safe.name},</h3>
          <p>Thanks for reaching out! We've received your message and will get back to you soon.</p>
          <p><strong>Your message:</strong> ${safe.message}</p>
          <p><strong>Reference ID:</strong> ${submission.id}</p>
          <br/>
          <p>Best regards,<br/>${SITE_NAME}</p>
        `,
      }),
    ]);
    results.forEach((r) => r.status === 'rejected' && console.error('Contact email failed:', r.reason));

    return NextResponse.json({ success: true, submissionId: submission.id }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 });
  }
}
