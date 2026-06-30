'use client';

import { useState } from 'react';
import { updateCatalogName } from '@/app/actions/catalog';
import { Edit2, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditCatalogName({ catalogId, initialName }: { catalogId: string, initialName: string }) {
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
    const res = await updateCatalogName(catalogId, name.trim());
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert(res.error || 'Failed to update catalog name');
      setName(initialName);
    }
    setLoading(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-3xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black w-48"
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
          className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setName(initialName);
          }}
          disabled={loading}
          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <h1 className="text-3xl font-bold text-gray-900">Catalog #{initialName}</h1>
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        title="Edit Catalog Name"
      >
        <Edit2 size={18} />
      </button>
    </div>
  );
}
