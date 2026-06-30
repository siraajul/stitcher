'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [catalogNumber, setCatalogNumber] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (catalogNumber.trim()) {
      router.push(`/catalog/${catalogNumber.trim()}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={catalogNumber}
          onChange={(e) => setCatalogNumber(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Enter catalog number (e.g. 420)"
          className="w-full bg-white text-gray-900 border-2 border-transparent shadow-lg rounded-full py-4 pl-6 pr-32 text-lg focus:outline-none focus:border-zinc-800 focus:ring-4 focus:ring-zinc-800/20 transition-all placeholder:text-gray-400"
          required
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-2 bottom-2 bg-zinc-900 hover:bg-black text-white font-bold rounded-full px-6 transition-colors shadow-md hover:shadow-lg cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
}
