'use client';

import { useState } from 'react';
import { deleteDress } from '@/app/actions/catalog';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteDressButton({ dressId, catalogId }: Readonly<{ dressId: string, catalogId: string }>) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dress? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    const res = await deleteDress(dressId, catalogId);
    if (!res.success) {
      alert(res.error || 'Failed to delete dress');
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Dress"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
