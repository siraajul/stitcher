'use server';

import { prisma } from '@/lib/prisma';

export async function getPhoneVerificationStatus(phoneNumber: string) {
  try {
    const verification = await prisma.phoneVerification.findUnique({
      where: { phoneNumber }
    });
    return { isVerified: verification?.isVerified === true };
  } catch (error) {
    return { isVerified: false };
  }
}

export async function initiatePhoneVerification(phoneNumber: string) {
  try {
    // Check if already verified
    const existing = await prisma.phoneVerification.findUnique({
      where: { phoneNumber }
    });

    if (existing?.isVerified) {
      return { success: true, verified: true, otpCode: null };
    }

    // Generate 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await prisma.phoneVerification.upsert({
      where: { phoneNumber },
      update: {
        otpCode,
        expiresAt,
        isVerified: false
      },
      create: {
        phoneNumber,
        otpCode,
        expiresAt,
        isVerified: false
      }
    });

    return { success: true, verified: false, otpCode };
  } catch (error) {
    console.error('Failed to initiate verification:', error);
    return { success: false, error: 'Failed to create verification session.' };
  }
}
