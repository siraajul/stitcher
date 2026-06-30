'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  const [totalCatalogs, totalDresses, totalOrders, totalStockResult, revenueResult, pendingOrders] = await Promise.all([
    prisma.catalog.count(),
    prisma.dress.count(),
    prisma.order.count(),
    prisma.dress.aggregate({
      _sum: { stockMeters: true },
    }),
    prisma.order.aggregate({
      where: { status: 'APPROVED' },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({
      where: { status: 'PENDING' },
    }),
  ]);

  return {
    totalCatalogs,
    totalDresses,
    totalOrders,
    totalStockMeters: totalStockResult._sum.stockMeters || 0,
    totalRevenue: revenueResult._sum.totalPrice || 0,
    pendingOrders,
  };
}

export async function getStockDistribution() {
  // Prisma doesn't directly support nested aggregation (sum of dress.stockMeters grouped by catalog.catalogNumber) in a single easy query with relationships in SQLite without raw queries, so we fetch and aggregate in JS or use raw SQL.
  // Given the scale (a few hundred catalogs), doing it in JS is fine and keeps it cross-database compatible.
  const catalogs = await prisma.catalog.findMany({
    include: {
      dresses: {
        select: { stockMeters: true },
      },
    },
  });

  const distribution = catalogs.map((cat) => {
    const totalStock = cat.dresses.reduce((sum, dress) => sum + dress.stockMeters, 0);
    return {
      name: `Catalog ${cat.catalogNumber}`,
      value: totalStock,
    };
  });

  // Sort by highest stock and take top 5, group the rest into 'Other'
  distribution.sort((a, b) => b.value - a.value);
  
  const top5 = distribution.slice(0, 5);
  const others = distribution.slice(5);
  
  if (others.length > 0) {
    const othersTotal = others.reduce((sum, item) => sum + item.value, 0);
    top5.push({ name: 'Other', value: othersTotal });
  }

  // Filter out any zero value items
  return top5.filter(item => item.value > 0);
}

export async function getRecentOrderTrend() {
  // Fetch orders from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
      orderedMeters: true,
    },
  });

  // Group by date string (e.g., "Mon", "Tue")
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trendMap = new Map<string, number>();

  // Initialize last 7 days in map to ensure empty days show as 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    // If multiple dates have the same day name (shouldn't happen in a 7-day span), we handle it.
    trendMap.set(dayName, 0);
  }

  recentOrders.forEach(order => {
    const dayName = days[order.createdAt.getDay()];
    const current = trendMap.get(dayName) || 0;
    trendMap.set(dayName, current + order.orderedMeters);
  });

  const trendData = Array.from(trendMap.entries()).map(([name, meters]) => ({
    name,
    meters,
  }));

  return trendData;
}

export async function getTopSellingDresses() {
  const dresses = await prisma.dress.findMany({
    orderBy: {
      totalMetersSold: 'desc',
    },
    take: 5,
    include: {
      catalog: true,
    }
  });

  return dresses.map(dress => ({
    name: dress.name,
    meters: dress.totalMetersSold,
  })).filter(dress => dress.meters > 0);
}

export async function getRevenueByCatalog() {
  const orders = await prisma.order.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      dress: {
        include: {
          catalog: true,
        }
      }
    }
  });

  const revenueMap = new Map<string, number>();

  orders.forEach(order => {
    if (!order.dress || !order.dress.catalog) return;
    const catalogName = `${order.dress.catalog.catalogNumber}`;
    const current = revenueMap.get(catalogName) || 0;
    revenueMap.set(catalogName, current + order.totalPrice);
  });

  const revenueData = Array.from(revenueMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // Sort by highest revenue
  revenueData.sort((a, b) => b.value - a.value);

  const top5 = revenueData.slice(0, 5);
  const others = revenueData.slice(5);
  
  if (others.length > 0) {
    const othersTotal = others.reduce((sum, item) => sum + item.value, 0);
    top5.push({ name: 'Other', value: othersTotal });
  }

  return top5.filter(item => item.value > 0);
}
