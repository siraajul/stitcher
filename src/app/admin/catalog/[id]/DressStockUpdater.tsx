'use client';

import { useState } from 'react';
import { updateDressStock } from '@/app/actions/catalog';

export default function DressStockUpdater({ dress }: { dress: any }) {
  const [stock, setStock] = useState(dress.stockMeters);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setSaved(false);
    const res = await updateDressStock(dress.id, stock);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert(res.error || 'Failed to update stock');
      setStock(dress.stockMeters); // Revert
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="w-24 border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-zinc-800 focus:outline-none text-gray-900 placeholder:text-gray-500"
      />
      <span className="text-gray-500 text-sm">meters</span>
      <button
        onClick={handleUpdate}
        disabled={loading || stock === dress.stockMeters}
        className="ml-4 bg-gray-900 hover:bg-black text-white px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Saving...' : saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  );
}
