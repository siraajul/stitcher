'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchGlobal } from '@/app/actions/search';
import { Search, Image as ImageIcon, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<{ catalogs: any[]; dresses: any[] }>({ catalogs: [], dresses: [] });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length === 0) {
        setResults({ catalogs: [], dresses: [] });
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      if (results.catalogs.length > 0) {
        router.push(`/catalog/${results.catalogs[0].catalogNumber}`);
      } else if (results.dresses.length > 0) {
        router.push(`/catalog/${results.dresses[0].catalog.catalogNumber}?reorder=${results.dresses[0].id}`);
      } else {
        router.push(`/catalog/${query.trim()}`);
      }
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative z-50" ref={searchRef}>
      <div className="relative flex items-center group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search size={20} className="text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Search by dress name or catalog #..."
          className="w-full appearance-none bg-white text-zinc-900 border-2 border-transparent shadow-2xl shadow-rose-200/40 rounded-3xl py-3.5 md:py-4 pl-12 pr-28 text-sm md:text-base focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all placeholder:text-zinc-500"
          required
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-1.5 bottom-1.5 md:top-2 md:bottom-2 bg-zinc-900 hover:bg-black text-white font-bold rounded-2xl px-4 md:px-6 text-sm md:text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Search
        </motion.button>
      </div>

      <AnimatePresence>
        {isFocused && query.trim().length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left"
          >
            {isLoading ? (
              <div className="p-6 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : results.catalogs.length === 0 && results.dresses.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No results found for "{query}"
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                {results.catalogs.length > 0 && (
                  <div className="p-2 border-b border-gray-50">
                    <h3 className="text-xs font-bold text-gray-400 uppercase px-3 pt-2 pb-1">Catalogs</h3>
                    {results.catalogs.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => {
                          router.push(`/catalog/${cat.catalogNumber}`);
                          setIsFocused(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Catalog {cat.catalogNumber}</p>
                          <p className="text-xs text-gray-500">View all dresses</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {results.dresses.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase px-3 pt-2 pb-1">Dresses</h3>
                    {results.dresses.map(dress => (
                      <button 
                        key={dress.id} 
                        onClick={() => {
                          router.push(`/catalog/${dress.catalog.catalogNumber}?reorder=${dress.id}`);
                          setIsFocused(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 flex items-center justify-center border border-gray-200">
                          {dress.imageUrl ? (
                            <Image src={dress.imageUrl} alt={dress.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <ImageIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="font-bold text-gray-900 text-sm truncate pr-2">{dress.name}</p>
                            <p className="text-sm font-bold text-gray-900 flex-shrink-0">৳{Number(dress.pricePerMeter).toFixed(0)}</p>
                          </div>
                          <p className="text-xs text-gray-500 flex justify-between items-center">
                            <span>Cat: {dress.catalog.catalogNumber}</span>
                            <span className={dress.stockMeters > 0 ? "text-emerald-600 font-medium" : "text-rose-500 font-medium"}>
                              {dress.stockMeters > 0 ? `${dress.stockMeters}m stock` : 'Out of stock'}
                            </span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
