'use server';

import { prisma } from '@/lib/prisma';

export async function searchGlobal(query: string) {
  if (!query || query.trim().length === 0) return { catalogs: [], dresses: [] };
  
  const safeQuery = query.trim();

  try {
    // Search for catalogs matching the number
    const catalogs = await prisma.catalog.findMany({
      where: {
        catalogNumber: {
          contains: safeQuery,
          mode: 'insensitive'
        }
      },
      take: 5
    });

    // Search for dresses matching the name
    const dresses = await prisma.dress.findMany({
      where: {
        name: {
          contains: safeQuery,
          mode: 'insensitive'
        }
      },
      include: {
        catalog: true
      },
      take: 10
    });

    return { catalogs, dresses };
  } catch (error) {
    console.error('Search error:', error);
    return { catalogs: [], dresses: [] };
  }
}
