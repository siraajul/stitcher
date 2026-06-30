import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      dress: {
        include: { catalog: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
      </div>

      <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders. Check out our catalogs!</p>
            <Link href="/catalog" className="inline-block bg-zinc-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors">
              Browse Catalogs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4 flex-1">
                  {order.dress.imageUrl ? (
                    <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <Image src={order.dress.imageUrl} alt={order.dress.name} fill sizes="(max-width: 640px) 100px, 120px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                      <ImageIcon size={24} className="opacity-50" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        order.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'DELIVERED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                      {order.dress.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-3">
                      Catalog: {order.dress.catalog.catalogNumber}
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-1">
                      <p><span className="font-semibold text-gray-900">Reference ID:</span> <span className="font-mono">{order.id}</span></p>
                      <p><span className="font-semibold text-gray-900">Customer:</span> {order.customerName}</p>
                      <p><span className="font-semibold text-gray-900">Phone:</span> {order.phoneNumber}</p>
                      <p><span className="font-semibold text-gray-900">Payment:</span> {order.paymentMode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center sm:items-end justify-between sm:flex-col sm:justify-center sm:text-right border-t border-gray-100 sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0 gap-4 sm:gap-2">
                  <div>
                    <div className="text-sm text-gray-500 font-medium">
                      {order.orderedMeters} Meters
                    </div>
                    <div className="text-lg font-extrabold text-zinc-900">
                      ৳{order.totalPrice.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/catalog/${order.dress.catalog.catalogNumber}?reorder=${order.dress.id}#dress-${order.dress.id}`}
                      className="inline-flex items-center justify-center bg-gray-100 text-gray-900 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      Reorder
                    </Link>
                    <Link 
                      href={`/track/${order.id}`}
                      className="inline-flex items-center justify-center bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                      Track Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
