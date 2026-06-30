import { getRecentOrders } from '../actions/order';
import { getDashboardStats, getStockDistribution, getRecentOrderTrend, getTopSellingDresses, getRevenueByCatalog } from '../actions/dashboard';
import Link from 'next/link';
import { LayoutDashboard, Package, Shirt, ShoppingBag, ArrowRight, CreditCard, Clock } from 'lucide-react';
import StockPieChart from '@/components/admin/StockPieChart';
import OrdersBarChart from '@/components/admin/OrdersBarChart';
import RevenuePieChart from '@/components/admin/RevenuePieChart';
import TopDressesChart from '@/components/admin/TopDressesChart';

export default async function AdminDashboard() {
  const [stats, orders, stockDistribution, orderTrend, topDresses, revenueData] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getStockDistribution(),
    getRecentOrderTrend(),
    getTopSellingDresses(),
    getRevenueByCatalog(),
  ]);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Welcome back. Here is what's happening with your store today.</p>
        </div>
      </div>
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalogs</h3>
            <div className="p-1.5 bg-zinc-50 text-zinc-900 rounded-lg shrink-0 ml-2">
              <LayoutDashboard size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalCatalogs}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Dresses</h3>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 ml-2">
              <Shirt size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalDresses}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stock</h3>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 ml-2">
              <Package size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalStockMeters}<span className="text-xs font-medium text-gray-400 ml-1">m</span></p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</h3>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 ml-2">
              <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</h3>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 ml-2">
              <CreditCard size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">৳{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</h3>
            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg shrink-0 ml-2">
              <Clock size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Sales Trend (Last 7 Days)</h2>
          <OrdersBarChart data={orderTrend} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Top Selling Dresses</h2>
          <TopDressesChart data={topDresses} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Revenue by Catalog</h2>
          <RevenuePieChart data={revenueData} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Stock Distribution by Catalog</h2>
          <StockPieChart data={stockDistribution} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-zinc-900 hover:text-black text-sm font-medium flex items-center gap-1 group">
            View all <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No recent orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dress</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Meters Sold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders/${order.id}`} className="block group">
                        <div className="text-sm font-medium text-blue-600 group-hover:underline">{order.customerName}</div>
                        {order.phoneNumber && <div className="text-xs text-gray-500 font-mono mt-0.5">{order.phoneNumber}</div>}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-50 text-black">
                        {order.dress.catalog.catalogNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.dress.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {order.orderedMeters}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
