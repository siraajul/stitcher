'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function placeOrder(data: {
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMode: string;
  mfsSenderNumber?: string;
  dressId: string;
  orderedMeters: number;
}) {
  if (!data.phoneNumber) {
    return { success: false, error: 'Phone number is required' };
  }
  if (!data.address) {
    return { success: false, error: 'Delivery address is required' };
  }

  try {
    // We should use a transaction to ensure stock is checked and updated correctly
    const result = await prisma.$transaction(async (tx) => {
      const dress = await tx.dress.findUnique({
        where: { id: data.dressId },
        include: { catalog: true },
      });

      if (!dress) {
        throw new Error('Dress not found');
      }

      if (dress.stockMeters < data.orderedMeters) {
        throw new Error(`Insufficient stock. Only ${dress.stockMeters} meters available.`);
      }

      // @ts-ignore
      const totalPrice = dress.pricePerMeter * data.orderedMeters;

      const session = await auth();

      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          paymentMode: data.paymentMode,
          mfsSenderNumber: data.mfsSenderNumber || null,
          dressId: data.dressId,
          orderedMeters: data.orderedMeters,
          totalPrice,
          userId: session?.user?.id || null,
        } as any,
      });

      await tx.dress.update({
        where: { id: data.dressId },
        data: {
          stockMeters: {
            decrement: data.orderedMeters,
          },
          // @ts-ignore
          totalMetersSold: {
            increment: data.orderedMeters,
          },
        },
      });

      return { order: order, catalogNumber: dress.catalog.catalogNumber };
    });

    // Send Telegram Notification
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const paymentInfo = data.mfsSenderNumber ? `${data.paymentMode} (${data.mfsSenderNumber})` : data.paymentMode;
        const message = `🔔 *New Order Received!*\n\n` +
          `*Customer:* ${data.customerName}\n` +
          `*Phone:* ${data.phoneNumber}\n` +
          `*Address:* ${data.address}\n` +
          `*Payment:* ${paymentInfo}\n` +
          `*Catalog:* ${result.catalogNumber}\n` +
          `*Quantity:* ${data.orderedMeters} meters\n` +
          `*Total Price:* ৳${result.order.totalPrice}`;
        
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

    revalidatePath(`/catalog/${result.catalogNumber}`);
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/orders');
    return { success: true, order: result.order };
  } catch (error: any) {
    console.error('Order failed:', error);
    return { success: false, error: error.message || 'Failed to place order' };
  }
}

export async function getRecentOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      dress: {
        include: {
          catalog: true,
        },
      },
    },
    take: 50,
  });
}

export async function updateOrderStatus(orderId: string, status: 'APPROVED' | 'CANCELLED' | 'IN_TRANSIT' | 'DELIVERED') {
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { dress: { include: { catalog: true } } },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === status) {
        throw new Error(`Order is already ${status}`);
      }

      if (order.status === 'CANCELLED') {
        throw new Error('Cannot update a cancelled order');
      }

      // Update the order status
      await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      // If cancelled, return the reserved stock
      if (status === 'CANCELLED') {
        await tx.dress.update({
          where: { id: order.dressId },
          data: {
            stockMeters: {
              increment: order.orderedMeters,
            },
            totalMetersSold: {
              decrement: order.orderedMeters,
            },
          },
        });
      }
      
      revalidatePath(`/catalog/${order.dress.catalog.catalogNumber}`);
    });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/orders');
    revalidatePath(`/track/${orderId}`);
    return { success: true };
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      return { success: false, error: error.message || 'Failed to update order status' };
    }
}

export async function trackOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        dress: {
          include: {
            catalog: true,
          }
        }
      }
    });

    if (!order) {
      return { success: false, error: 'Order not found. Please check your Reference ID.' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Error tracking order:', error);
    return { success: false, error: 'Failed to fetch order details. Please try again.' };
  }
}
