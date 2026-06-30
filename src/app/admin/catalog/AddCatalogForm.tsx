'use client';

import { useState } from 'react';
import { createCatalog } from '@/app/actions/catalog';
import { FolderPlus, Hash, Layers, Image as ImageIcon } from 'lucide-react';

export default function AddCatalogForm() {
  const [catalogNumber, setCatalogNumber] = useState('');
  const [dressesCount, setDressesCount] = useState(30);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const res = await createCatalog(catalogNumber, dressesCount, imageUrl);
    if (res.success) {
      setMessage(`Catalog ${catalogNumber} created successfully with ${dressesCount} dresses!`);
      setCatalogNumber('');
      setImageUrl('');
    } else {
      setMessage(res.error || 'Failed to create catalog.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-zinc-50 text-zinc-900 p-3 rounded-xl">
          <FolderPlus size={28} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Add New Catalog</h3>
          <p className="text-sm text-gray-500 mt-1">Quickly generate a new catalog with empty dress slots.</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="w-full flex-1">
            <label htmlFor="catalogNumber" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Catalog Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Hash size={18} className="text-gray-400" />
              </div>
              <input 
                id="catalogNumber"
                type="text" 
                required
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-zinc-800 focus:ring-0 transition-colors focus:outline-none font-bold text-gray-900"
                placeholder="e.g. 1001"
              />
            </div>
          </div>
          
          <div className="w-full flex-1">
            <label htmlFor="dressesCount" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Number of Dresses</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Layers size={18} className="text-gray-400" />
              </div>
              <input 
                id="dressesCount"
                type="number" 
                required
                min="1"
                max="100"
                value={dressesCount}
                onChange={(e) => setDressesCount(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-zinc-800 focus:ring-0 transition-colors focus:outline-none font-bold text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Default Image URL <span className="text-gray-400 font-normal lowercase">(optional)</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <ImageIcon size={18} className="text-gray-400" />
            </div>
            <input 
              id="imageUrl"
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-zinc-800 focus:ring-0 transition-colors focus:outline-none font-bold text-gray-900"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-zinc-900 hover:bg-black text-white font-bold py-3.5 px-10 mt-4 md:mt-0 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? 'Adding...' : 'Create Catalog'}
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`mt-5 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
