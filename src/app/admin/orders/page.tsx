import { getRecentOrders } from '@/app/actions/order';
import OrderActions from './OrderActions';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await getRecentOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog & Dress</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Meters</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status / Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="block group">
                      <div className="text-sm font-bold text-blue-600 group-hover:underline">{order.customerName}</div>
                      <div className="text-sm text-zinc-900 font-medium mt-0.5 font-mono">{order.phoneNumber}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {order.id.substring(0, 8)}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-bold mb-0.5">
                      #{order.dress.catalog.catalogNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.dress.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-zinc-50 text-black border border-zinc-100">
                      {order.orderedMeters}m
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <OrderActions orderId={order.id} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
