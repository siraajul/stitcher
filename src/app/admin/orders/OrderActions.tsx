'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/order';
import { Check, X, Loader2, Package, Truck } from 'lucide-react';

export default function OrderActions({ orderId, status }: Readonly<{ orderId: string, status: string }>) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: 'APPROVED' | 'CANCELLED' | 'IN_TRANSIT' | 'DELIVERED') => {
    if (newStatus === 'CANCELLED' && !confirm('Are you sure you want to cancel this order? The stock will be returned.')) {
      return;
    }
    if (newStatus === 'IN_TRANSIT' && !confirm('Mark this order as handed over to delivery partner?')) {
      return;
    }
    if (newStatus === 'DELIVERED' && !confirm('Mark this order as delivered?')) {
      return;
    }
    
    setLoading(true);
    const res = await updateOrderStatus(orderId, newStatus);
    if (!res.success) {
      alert(res.error || 'Failed to update order');
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader2 className="animate-spin text-gray-400 w-5 h-5 mx-auto" />;
  }

  if (status === 'CANCELLED') {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">CANCELLED</span>;
  }

  if (status === 'DELIVERED') {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">DELIVERED</span>;
  }

  if (status === 'IN_TRANSIT') {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mr-2">IN TRANSIT</span>;
  }

  return (
    <div className="flex gap-2 justify-end items-center">
      {status === 'PENDING' && (
        <button
          onClick={() => handleAction('APPROVED')}
          title="Approve Order"
          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors border border-emerald-100 shadow-sm flex items-center gap-1 text-xs font-bold pr-2.5"
        >
          <Check size={16} />
          Approve
        </button>
      )}

      {status === 'APPROVED' && (
        <button
          onClick={() => handleAction('IN_TRANSIT')}
          title="Mark In Transit"
          className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-colors border border-purple-100 shadow-sm flex items-center gap-1 text-xs font-bold pr-2.5"
        >
          <Truck size={16} />
          Transit
        </button>
      )}

      {status === 'IN_TRANSIT' && (
        <button
          onClick={() => handleAction('DELIVERED')}
          title="Mark Delivered"
          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-100 shadow-sm flex items-center gap-1 text-xs font-bold pr-2.5"
        >
          <Package size={16} />
          Deliver
        </button>
      )}

      <button
        onClick={() => handleAction('CANCELLED')}
        title="Cancel Order"
        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-100 shadow-sm flex items-center gap-1 text-xs font-bold pr-2.5"
      >
        <X size={16} />
        Cancel
      </button>
    </div>
  );
}
