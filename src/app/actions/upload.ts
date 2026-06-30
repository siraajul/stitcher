'use server';

import { UTApi } from 'uploadthing/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export async function uploadDressPhoto(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const dressId = formData.get('dressId') as string;

    if (!file || !dressId) {
      return { success: false, error: 'File and Dress ID are required' };
    }

    // Upload to Uploadthing
    const response = await utapi.uploadFiles(file);
    
    if (response.error) {
      console.error('Uploadthing error:', response.error);
      return { success: false, error: response.error.message };
    }

    const imageUrl = response.data.url;

    // Update database
    const dress = await prisma.dress.update({
      where: { id: dressId },
      data: { imageUrl } as any,
      include: { catalog: true },
    });

    revalidatePath(`/admin/catalog/${dress.catalogId}`);
    // @ts-ignore - Bypass cached TS types
    revalidatePath(`/catalog/${dress.catalog.catalogNumber}`);

    return { success: true, imageUrl };
  } catch (error: any) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message || 'Failed to upload photo' };
  }
}
