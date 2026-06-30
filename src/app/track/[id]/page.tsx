import { trackOrderById } from '@/app/actions/order';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Package, Truck, Image as ImageIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function TrackOrderDetailsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const resolvedParams = await params;
  const result = await trackOrderById(resolvedParams.id);

  if (!result.success || !result.order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't find an order with the ID: <br/>
            <span className="font-mono text-xs text-gray-400 mt-2 block">{resolvedParams.id}</span>
          </p>
          <Link href="/track" className="inline-flex items-center justify-center w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Try Another ID
          </Link>
        </div>
      </div>
    );
  }

  const { order } = result;

  // Status mapping
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'PENDING': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'Pending Approval', step: 1 };
      case 'APPROVED': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'Order Approved', step: 2 };
      case 'IN_TRANSIT': return { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'In Transit', step: 3 };
      case 'CANCELLED': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', text: 'Order Cancelled', step: -1 };
      case 'DELIVERED': return { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'Delivered', step: 4 };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', text: status, step: 0 };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 pt-6">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/track" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Search
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Header */}
          <div className={`${statusInfo.bg} ${statusInfo.border} border-b p-4 sm:p-6 text-center`}>
            <div className={`w-16 h-16 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 ${statusInfo.color}`}>
              <StatusIcon size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{statusInfo.text}</h1>
            <p className="text-sm font-medium text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Customer Details Snapshot */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Delivery Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Name</p>
                  <p className="font-semibold text-sm text-gray-900 truncate">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="font-semibold text-sm text-gray-900 truncate">{order.phoneNumber.replace(/.(?=.{4})/g, '*')}</p>
                </div>
              </div>
            </div>

            {/* Order Item */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Item Details</h3>
              <div className="flex items-center gap-4 border border-gray-100 rounded-2xl p-3">
                {order.dress.imageUrl ? (
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={order.dress.imageUrl} alt={order.dress.name} fill sizes="64px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Catalog {order.dress.catalog.catalogNumber}</p>
                      <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">{order.dress.name}</h4>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700">
                      Qty: {order.orderedMeters}m
                    </span>
                    <span className="font-black text-black">
                      ৳{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Total Amount</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{order.paymentMode}</p>
              </div>
              <p className="text-2xl font-black text-black">৳{order.totalPrice.toFixed(2)}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <Link 
                href={`/catalog/${order.dress.catalog.catalogNumber}?reorder=${order.dress.id}#dress-${order.dress.id}`}
                className="w-full inline-flex items-center justify-center bg-zinc-900 text-white font-bold py-3.5 rounded-xl transition-all hover:bg-black shadow-md flex gap-2"
              >
                <Package size={18} />
                Reorder This Item
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
