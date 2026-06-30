import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Package, CreditCard, Tag } from 'lucide-react';
import OrderActions from '../OrderActions';

export default async function AdminOrderDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      dress: {
        include: { catalog: true }
      },
      user: true,
    }
  });

  if (!order) {
    notFound();
  }

  let statusColor = 'bg-yellow-100 text-yellow-700';
  if (order.status === 'APPROVED') {
    statusColor = 'bg-green-100 text-green-700';
  } else if (order.status === 'CANCELLED') {
    statusColor = 'bg-red-100 text-red-700';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 font-mono">ID: {order.id}</p>
        </div>
        <div className="ml-auto">
          <OrderActions orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User size={20} className="text-gray-400" /> Customer Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold font-mono text-gray-900">{order.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-semibold text-gray-900 break-words">{order.address || 'Not Provided'}</p>
            </div>
            {order.user && (
              <div>
                <p className="text-sm text-gray-500">Registered Account</p>
                <p className="font-semibold text-gray-900">{order.user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" /> Order Summary
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Date Placed</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1 ${statusColor}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package size={20} className="text-gray-400" /> Product Details
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
              {order.dress.imageUrl ? (
                <Image 
                  src={order.dress.imageUrl} 
                  alt={order.dress.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package size={40} />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <Link href={`/admin/catalog/${order.dress.catalogId}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 mb-1">
                  <Tag size={14} /> Catalog #{order.dress.catalog.catalogNumber}
                </Link>
                <h3 className="text-2xl font-bold text-gray-900">{order.dress.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Quantity</p>
                  <p className="text-lg font-semibold text-gray-900">{order.orderedMeters} Meters</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per Meter</p>
                  <p className="text-lg font-semibold text-gray-900">৳{order.dress.pricePerMeter}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-sm md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-full shrink-0">
              <CreditCard size={28} className="text-white" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-3xl md:text-4xl font-black">৳{order.totalPrice.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between gap-8">
              <span className="text-zinc-400 text-sm">Payment Method</span>
              <span className={`font-bold text-sm px-2 py-0.5 rounded ${order.paymentMode === 'MFS' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {order.paymentMode === 'MFS' ? 'Mobile Financial Services' : 'Cash on Delivery'}
              </span>
            </div>
            {order.paymentMode === 'MFS' && order.mfsSenderNumber && (
              <div className="flex items-center justify-between gap-8 border-t border-white/10 pt-2 mt-2">
                <span className="text-zinc-400 text-sm">Sender Number</span>
                <span className="font-mono font-bold text-white">{order.mfsSenderNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
