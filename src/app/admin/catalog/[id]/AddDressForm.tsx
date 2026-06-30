'use client';

import { useState } from 'react';
import { addDressToCatalog } from '@/app/actions/catalog';
import { Plus, Loader2 } from 'lucide-react';

export default function AddDressForm({ catalogId }: { catalogId: string }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const res = await addDressToCatalog(catalogId, name);
    if (res.success) {
      setName('');
    } else {
      alert(res.error || 'Failed to add dress');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Dress Name..."
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none text-gray-900 placeholder:text-gray-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="bg-zinc-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors flex items-center gap-1"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        Add Dress
      </button>
    </form>
  );
}
