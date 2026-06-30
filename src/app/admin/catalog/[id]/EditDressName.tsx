'use client';

import { useState } from 'react';
import { updateDressName } from '@/app/actions/catalog';
import { Edit2, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditDressName({ dressId, initialName }: { dressId: string, initialName: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name.trim() || name.trim() === initialName) {
      setIsEditing(false);
      setName(initialName);
      return;
    }

    setLoading(true);
    const res = await updateDressName(dressId, name.trim());
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert(res.error || 'Failed to update dress name');
      setName(initialName);
    }
    setLoading(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-bold text-gray-900 text-lg bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-black w-40 placeholder:text-gray-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdate();
            if (e.key === 'Escape') {
              setIsEditing(false);
              setName(initialName);
            }
          }}
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="p-1 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setName(initialName);
          }}
          disabled={loading}
          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h3 className="font-bold text-gray-900 text-lg">{initialName}</h3>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all"
        title="Edit Dress Name"
      >
        <Edit2 size={14} />
      </button>
    </div>
  );
}
