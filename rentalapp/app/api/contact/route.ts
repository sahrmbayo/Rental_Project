import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, reasonType, message } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !reasonType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        reasonType,
        message,
      },
    });

    // Send email notification to admin
    await resend.emails.send({
      from: 'Salone Rent <salonerent.com>',
      to: 'mbayo262@gmail.com', // Replace with your admin email
      subject: `New Contact Form Submission - ${reasonType}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
        <p><strong>Reason:</strong> ${reasonType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Reference ID:</strong> ${submission.id}</p>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'Salone Rent <salonerent.com>',
      to: customerEmail,
      subject: 'We received your message - Thank you!',
      html: `
        <h3>Hi ${customerName},</h3>
        <p>Thanks for reaching out! We've received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong> ${message}</p>
        <p><strong>Reference ID:</strong> ${submission.id}</p>
        <br/>
        <p>Best regards,<br/>Salone Rent</p>
      `,
    });

    return NextResponse.json(
      { success: true, submissionId: submission.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}