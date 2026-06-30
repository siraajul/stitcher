'use client';

import { useState } from 'react';
import { updateDressPrice } from '@/app/actions/catalog';

interface DressPriceUpdaterProps {
  dress: any;
}

export default function DressPriceUpdater({ dress }: Readonly<DressPriceUpdaterProps>) {
  const [price, setPrice] = useState(dress.pricePerMeter);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const res = await updateDressPrice(dress.id, price);
    if (res.success) {
      setEditing(false);
    } else {
      alert(res.error || 'Failed to update price');
      setPrice(dress.pricePerMeter); // reset
    }
    setLoading(false);
  };

  if (!editing) {
    return (
      <button 
        onClick={() => setEditing(true)}
        className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
      >
        ${dress.pricePerMeter.toFixed(2)} / m
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
        <input 
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-24 pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
      <button 
        onClick={handleUpdate}
        disabled={loading || price === dress.pricePerMeter}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Save'}
      </button>
      <button 
        onClick={() => {
          setEditing(false);
          setPrice(dress.pricePerMeter);
        }}
        disabled={loading}
        className="text-gray-500 hover:text-gray-700 px-2 py-1"
      >
        Cancel
      </button>
    </div>
  );
}
