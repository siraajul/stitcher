'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCatalogs() {
  return await prisma.catalog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { dresses: true },
      },
    },
  });
}

export async function getFeaturedDresses() {
  return await prisma.dress.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    take: 12, // Show up to 12 available dresses on homepage
    include: {
      catalog: true, // We need catalog to show the catalog number
    },
  });
}

export async function getCatalogByNumber(catalogNumber: string) {
  console.log('Fetching catalog:', catalogNumber);
  return await prisma.catalog.findUnique({
    where: { catalogNumber },
    include: {
      dresses: {
        orderBy: { name: 'asc' },
      },
    },
  });
}

export async function getCatalogById(id: string) {
  return await prisma.catalog.findUnique({
    where: { id },
    include: {
      dresses: {
        orderBy: { name: 'asc' },
      },
    },
  });
}

export async function createCatalog(catalogNumber: string, dressesCount: number, defaultImageUrl?: string) {
  try {
    const catalog = await prisma.catalog.create({
      data: {
        catalogNumber,
      },
    });

    const fabricPhotos = [
      '/uploads/cloths/1.jpg',
      '/uploads/cloths/2.webp',
      '/uploads/cloths/3.jpeg',
      '/uploads/cloths/4.jpeg',
      '/uploads/cloths/5.webp',
      '/uploads/cloths/6.jpg',
      '/uploads/cloths/7.webp',
      '/uploads/cloths/8.jpeg',
      '/uploads/cloths/9.jpeg'
    ];

    if (dressesCount > 0) {
      const dressesData = Array.from({ length: dressesCount }).map((_, i) => ({
        name: `Dress ${i + 1}`,
        stockMeters: 0,
        catalogId: catalog.id,
        imageUrl: defaultImageUrl || fabricPhotos[i % fabricPhotos.length],
      }));

      await prisma.dress.createMany({
        data: dressesData,
      });
    }

    revalidatePath('/admin/catalog');
    revalidatePath('/');
    return { success: true, catalog };
  } catch (error) {
    console.error('Failed to create catalog:', error);
    return { success: false, error: 'Failed to create catalog. It might already exist.' };
  }
}

export async function updateDressStock(dressId: string, newStock: number) {
  try {
    await prisma.dress.update({
      where: { id: dressId },
      data: { stockMeters: newStock },
    });
    
    // Using string manipulation for cache invalidation
    revalidatePath('/admin/catalog/[id]', 'page');
    revalidatePath('/catalog/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update stock:', error);
    return { success: false, error: 'Failed to update stock' };
  }
}

export async function updateDressPrice(dressId: string, newPrice: number) {
  try {
    const dress = await prisma.dress.update({
      where: { id: dressId },
      // @ts-ignore
      data: { pricePerMeter: newPrice },
    });
    
    revalidatePath(`/admin/catalog/${dress.catalogId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update price:', error);
    return { success: false, error: 'Failed to update price' };
  }
}

export async function addDressToCatalog(catalogId: string, name: string) {
  try {
    const dress = await prisma.dress.create({
      data: {
        name,
        catalogId,
        stockMeters: 0,
        // @ts-ignore
        pricePerMeter: 0,
      },
    });
    revalidatePath(`/admin/catalog/${catalogId}`);
    return { success: true, dress };
  } catch (error) {
    console.error('Failed to add dress:', error);
    return { success: false, error: 'Failed to add dress' };
  }
}

export async function deleteDress(dressId: string, catalogId: string) {
  try {
    await prisma.dress.delete({
      where: { id: dressId },
    });
    revalidatePath(`/admin/catalog/${catalogId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete dress:', error);
    return { success: false, error: 'Failed to delete dress. Ensure there are no pending orders for it.' };
  }
}

export async function updateCatalogName(id: string, newCatalogNumber: string) {
  try {
    const existing = await prisma.catalog.findUnique({ where: { catalogNumber: newCatalogNumber } });
    if (existing && existing.id !== id) {
      return { success: false, error: 'Catalog name already exists' };
    }
    await prisma.catalog.update({
      where: { id },
      data: { catalogNumber: newCatalogNumber },
    });
    revalidatePath('/admin/catalog');
    revalidatePath(`/admin/catalog/${id}`);
    revalidatePath(`/catalog/${newCatalogNumber}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update catalog name:', error);
    return { success: false, error: 'Failed to update catalog name' };
  }
}

export async function updateDressName(dressId: string, newName: string) {
  try {
    const dress = await prisma.dress.update({
      where: { id: dressId },
      data: { name: newName },
    });
    
    revalidatePath(`/admin/catalog/${dress.catalogId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update dress name:', error);
    return { success: false, error: 'Failed to update dress name' };
  }
}
