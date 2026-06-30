'use client';

import { useState, useRef } from 'react';
import { uploadDressPhoto } from '@/app/actions/upload';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface DressPhotoUpdaterProps {
  dress: any;
}

export default function DressPhotoUpdater({ dress }: Readonly<DressPhotoUpdaterProps>) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dressId', dress.id);

    const res = await uploadDressPhoto(formData);
    if (!res.success) {
      alert(res.error || 'Failed to upload photo');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      {dress.imageUrl ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
          <Image 
            src={dress.imageUrl} 
            alt={dress.name} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:text-zinc-200 transition-colors"
              title="Change Photo"
            >
              <ImagePlus size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-zinc-800 hover:border-zinc-800 hover:bg-zinc-50 transition-colors"
          title="Upload Photo"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
        </button>
      )}

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
