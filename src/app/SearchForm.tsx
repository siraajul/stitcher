'use client';

import { motion } from 'framer-motion';

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
          className="w-full bg-white text-rose-950 border-2 border-transparent shadow-2xl shadow-rose-200/40 rounded-full py-4 pl-6 pr-32 text-lg focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all placeholder:text-zinc-400"
          required
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-2 bottom-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-full px-6 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Search
        </motion.button>
      </div>
    </div>
  );
}
