import { getRecentOrders } from '@/app/actions/order';
import OrderActions from './OrderActions';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await getRecentOrders();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">No orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
            <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</div>
            <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Details</div>
            <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog & Dress</div>
            <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Meters</div>
            <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status / Action</div>
          </div>
          
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-5 md:gap-4 hover:border-zinc-300 transition-colors p-5 md:px-6 md:py-4 md:items-center">
                <div className="flex justify-between md:block mb-3 md:mb-0">
                  <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Date</span>
                  <div className="text-right md:text-left">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between md:block mb-3 md:mb-0">
                  <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Customer</span>
                  <div className="text-right md:text-left">
                    <Link href={`/admin/orders/${order.id}`} className="block group">
                      <div className="text-sm font-bold text-blue-600 group-hover:underline">{order.customerName}</div>
                      <div className="text-sm text-zinc-900 font-medium mt-0.5 font-mono">{order.phoneNumber}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {order.id.slice(-8)}</div>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between md:block mb-4 md:mb-0">
                  <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Dress</span>
                  <div className="text-right md:text-left">
                    <div className="text-sm text-gray-900 font-bold mb-0.5">
                      #{order.dress.catalog.catalogNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.dress.name}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between md:block md:text-right mb-5 md:mb-0 items-center">
                  <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Meters</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-zinc-50 text-black border border-zinc-100">
                    {order.orderedMeters}m
                  </span>
                </div>

                <div className="flex justify-end md:block md:text-right pt-4 md:pt-0 border-t border-gray-100 md:border-0">
                  <OrderActions orderId={order.id} status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
