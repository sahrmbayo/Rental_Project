import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '../../lib/prisma';
import { errorResponse, requireUserId } from '../../lib/auth';
import { createCheckoutSession } from '../../lib/monime';
import { getAppUrl, RESERVATION_FEE_NLE } from '../../lib/config';
import { listingExpiryCutoff } from '../../lib/listings';

export async function POST(req: NextRequest) {
  let orderId: string | null = null;
  try {
    const userId = await requireUserId();
    const { propertyId } = await req.json();
    if (typeof propertyId !== 'string' || !propertyId) {
      return NextResponse.json({ message: 'propertyId required' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, isAvailable: true, rentedAt: true, confirmedAt: true },
    });
    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    if (property.rentedAt || property.confirmedAt < listingExpiryCutoff()) {
      return NextResponse.json({ message: 'This listing is no longer active' }, { status: 409 });
    }
    if (!property.isAvailable) {
      return NextResponse.json({ message: 'This property is already reserved' }, { status: 409 });
    }

    const user = await (await clerkClient()).users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
    if (!email) return NextResponse.json({ message: 'Your account needs an email address' }, { status: 400 });

    const order = await prisma.order.create({
      data: {
        userId,
        email,
        name: user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || email,
        phone: user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers[0]?.phoneNumber || '',
        status: 'pending',
        propertyId: property.id,
      },
    });
    orderId = order.id;

    const appUrl = getAppUrl(req.nextUrl.origin);
    const title = property.title.slice(0, 100);

    const session = await createCheckoutSession(
      {
        name: title,
        reference: order.id,
        successUrl: `${appUrl}/api/payment/return?status=success&co=${order.id}`,
        cancelUrl: `${appUrl}/api/payment/return?status=cancel&co=${order.id}`,
        lineItems: [
          {
            type: 'custom',
            name: title,
            price: { currency: 'SLE', value: RESERVATION_FEE_NLE * 100 },
            quantity: 1,
          },
        ],
        metadata: { propertyId: property.id, orderDbId: order.id },
      },
      order.id
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { checkoutSessionId: session.id },
    });

    return NextResponse.json({ redirectUrl: session.redirectUrl });
  } catch (e) {
    if (orderId) await prisma.order.deleteMany({ where: { id: orderId, status: 'pending' } }).catch(() => {});
    return errorResponse(e, 'Could not start checkout');
  }
}
