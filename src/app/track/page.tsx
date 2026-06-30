'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ArrowRight, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [referenceId, setReferenceId] = useState('');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('stitcher_orders') || '[]');
      setRecentOrders(orders);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) return;
    router.push(`/track/${referenceId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 md:-mt-24">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-6">
        <div className="flex justify-center mb-6">
          <div className="bg-black text-white p-4 rounded-2xl shadow-lg">
            <Package size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Enter the Reference ID provided to you during checkout to see the current status of your dress.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="refId" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Order Reference ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                id="refId"
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="e.g. cmr0mxg..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none font-mono text-sm text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!referenceId.trim()}
            className="w-full bg-black text-white font-bold py-3.5 rounded-xl transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-md"
          >
            Track Order
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {recentOrders.length > 0 && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <History size={18} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order, i) => (
              <Link 
                key={order.id + i} 
                href={`/track/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm">{order.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-gray-500">{order.id}</span>
                    <span className="text-[10px] text-gray-400">• {new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
