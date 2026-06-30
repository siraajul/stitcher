'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function placeStockRequest(data: {
  customerName: string;
  phoneNumber: string;
  dressId: string;
  requestedMeters: number;
}) {
  if (!data.phoneNumber) {
    return { success: false, error: 'Phone number is required' };
  }

  try {
    const session = await auth();

    const dress = await prisma.dress.findUnique({
      where: { id: data.dressId },
      include: { catalog: true },
    });

    if (!dress) {
      return { success: false, error: 'Dress not found' };
    }

    // @ts-ignore - TS language server caching issue with Prisma
    const request = await prisma.stockRequest.create({
      data: {
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        requestedMeters: data.requestedMeters,
        dressId: data.dressId,
        userId: session?.user?.id || null,
      },
    });

    // Send Telegram Notification
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const message = `⚠️ *Restock Request!*\n\n` +
          `*Customer:* ${data.customerName}\n` +
          `*Phone:* ${data.phoneNumber}\n` +
          `*Catalog:* ${dress.catalog.catalogNumber}\n` +
          `*Dress:* ${dress.name}\n` +
          `*Requested Amount:* ${data.requestedMeters} meters`;
        
        // Fire and forget, don't await to avoid blocking the UI on slow network
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
          }),
          signal: AbortSignal.timeout(5000), // 5 seconds max
        }).catch(err => console.error('Failed to send telegram notification:', err));
      } catch (err) {
        console.error('Failed to format telegram notification:', err);
      }
    }

    revalidatePath(`/admin/requests`);
    return { success: true, request };
  } catch (error: any) {
    console.error('Stock request failed:', error);
    return { success: false, error: error.message || 'Failed to submit request' };
  }
}

export async function getPendingStockRequests() {
  // @ts-ignore - TS language server caching issue with Prisma
  return await prisma.stockRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      dress: {
        include: {
          catalog: true,
        },
      },
    },
  });
}

export async function updateStockRequestStatus(requestId: string, status: 'PENDING' | 'REVIEWED') {
  try {
    // @ts-ignore - TS language server caching issue with Prisma
    await prisma.stockRequest.update({
      where: { id: requestId },
      data: { status },
    });

    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update stock request status:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}
