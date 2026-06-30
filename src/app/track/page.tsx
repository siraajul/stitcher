'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ArrowRight } from 'lucide-react';

export default function TrackOrderPage() {
  const [referenceId, setReferenceId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) return;
    router.push(`/track/${referenceId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none font-mono text-sm"
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
    </div>
  );
}
