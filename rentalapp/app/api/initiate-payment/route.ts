import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto'; // Used for creating a unique key for each request

const prisma = new PrismaClient();

// --- IMPORTANT: Store these securely in your .env.local file ---
const MONIME_API_KEY = process.env.MONIME_API_KEY;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID;
const MONIME_API_URL = 'https://api.monime.io/v1/checkout-sessions';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Define the expected shape of the incoming request body for better type safety
interface RequestBody {
  propertyId: string;
  amount: number;
  currency: string;
}

export async function POST(request: Request) {
  // --- Environment Variable Validation ---
  // Ensure all required environment variables are configured on the server
  if (!MONIME_API_KEY || !MONIME_SPACE_ID || !APP_URL) {
    console.error('Missing required environment variables for Monime payment.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId, amount, currency }: RequestBody = await request.json();
    if (!propertyId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields: propertyId, amount, or currency' }, { status: 400 });
    }

    // 1. Get the property details from your database
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    // 2. Prepare the headers for the Monime API request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MONIME_API_KEY}`,
      'Monime-Space-Id': MONIME_SPACE_ID,
      'Idempotency-Key': randomUUID(), // Prevents accidental duplicate payments on retries
    };

    // 3. Prepare the body (payload) for the Monime API request
    const paymentPayload = {
      name: `Listing Fee: ${property.title}`,
      // URLs Monime will use to redirect the user after the transaction
      successUrl: `${APP_URL}/payment-success?propertyId=${propertyId}`,
      cancelUrl: `${APP_URL}/dashboard/properties`,
      reference: `PROP-${propertyId}`, // Your internal reference for this transaction
      lineItems: [
        {
          name: `One-time listing fee for "${property.title}"`,
          quantity: 1,
          price: {
            currency: currency, // e.g., "SLL"
            value: amount * 100, // Monime expects the value in the minor unit (cents)
          },
        },
      ],
      // Specify which payment methods to show on the checkout page
      paymentOptions: {
        momo: {
          disable: false, // Ensure mobile money is enabled
          enabledProviders: ['m17'], // 'm17' is the code for Orange Money SL
        },
        card: {
          disable: true, // Disable card payments as requested
        }
      }
    };

    // 4. Make the API call to Monime to create the checkout session
    const monimeResponse = await fetch(MONIME_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentPayload),
    });

    const responseData = await monimeResponse.json();

    if (!monimeResponse.ok || !responseData.success) {
      console.error('Monime API Error:', responseData.messages || 'No error message provided.');
      throw new Error(responseData.messages?.[0]?.text || 'Failed to create checkout session with Monime.');
    }

    // 5. Extract the redirectUrl from Monime's successful response
    const redirectUrl = responseData.result?.redirectUrl;
    if (!redirectUrl) {
      console.error('Monime Success Response missing redirectUrl:', responseData);
      throw new Error('No redirect URL received from payment provider.');
    }

    // 6. Update your property with the payment reference from Monime
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        paymentProvider: 'Monime',
        paymentReference: responseData.result?.id, // Save the Monime session ID
      },
    });

    // 7. Return the redirectUrl to the client, which will send the user to the checkout page
    return NextResponse.json({ redirectUrl });

  } catch (error) {
    console.error('[INITIATE_PAYMENT_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
