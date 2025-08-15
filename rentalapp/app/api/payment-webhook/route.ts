import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';


// 1. Install the Resend library: npm install resend
import { Resend } from 'resend';

const prisma = new PrismaClient();

// 2. Configure Resend with your API key from your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: Request) {
  // --- IMPORTANT: Verify the webhook signature for security in production ---
  // const signature = headers().get('monime-signature');
  // ... verification logic ...

  try {
    const body = await request.json();

    // Check if the event is a successful checkout session
    if (body.event === 'checkout_session.completed') {
      const session = body.data.object;
      
      // Extract the inquiry data we passed earlier in the callbackState
      const {
        userName,
        userEmail,
        userPhone,
        message,
        propertyId,
        agentId,
      } = JSON.parse(session.callbackState);

      // Get the agent's details to send notifications
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });

      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found.`);
      }

      // Save the official inquiry to your database
      await prisma.inquiry.create({
        data: {
          name: userName,
          email: userEmail,
          message: `Phone: ${userPhone}. Message: ${message}`,
          propertyId: propertyId,
          agentId: agentId,
        },
      });

      // --- 3. Send Email Notification using Resend ---
      try {
        await resend.emails.send({
          from: 'inquiry@sierrarentals.com', // Must be a verified domain on Resend
          to: agent.email,
          subject: 'New Property Inquiry on SierraRentals!',
          html: `
            <div>
              <h2>New Inquiry!</h2>
              <p>You have a new inquiry for one of your properties.</p>
              <ul>
                <li><strong>From:</strong> ${userName}</li>
                <li><strong>Email:</strong> ${userEmail}</li>
                <li><strong>Phone:</strong> ${userPhone}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
        // Note: Even if the email fails, we don't stop the process.
        // The inquiry is already saved in the database.
      }
    }

    // Return a 200 OK response to Monime to acknowledge receipt
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('[PAYMENT_WEBHOOK_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
