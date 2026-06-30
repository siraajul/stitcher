'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderModal from './OrderModal';
import StockRequestModal from './StockRequestModal';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DressCard({ dress }: Readonly<{ dress: any }>) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const searchParams = useSearchParams();
  
  const isOutOfStock = dress.stockMeters <= 0;
  const isLowStock = !isOutOfStock && dress.stockMeters < 10;

  useEffect(() => {
    if (searchParams?.get('reorder') === dress.id && !isOutOfStock) {
      setIsOrderModalOpen(true);
    }
  }, [searchParams, dress.id, isOutOfStock]);

  let cardBorderClass = 'border-gray-100';
  let stockTextColorClass = 'text-gray-900';
  if (isOutOfStock) {
    cardBorderClass = 'border-gray-300 grayscale opacity-60';
    stockTextColorClass = 'text-gray-500';
  } else if (isLowStock) {
    cardBorderClass = 'border-amber-200/50';
    stockTextColorClass = 'text-amber-500';
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`bg-white shadow-sm border ${cardBorderClass} md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden group`}
      >
        
        {/* Image Area */}
        <div className="relative w-full aspect-[4/5] bg-zinc-50 border-b border-zinc-100/50 flex items-center justify-center overflow-hidden">
          {dress.imageUrl ? (
            <Image 
              src={dress.imageUrl} 
              alt={dress.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <span className="text-sm font-medium uppercase tracking-widest opacity-50">No Image</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 z-20 transition-transform duration-300 md:group-hover:-translate-y-1">
            <div className="bg-white/90 backdrop-blur-md text-zinc-900 px-1.5 md:px-3 py-0.5 md:py-1 border border-white/50 shadow-sm rounded-lg">
              <span className="text-sm sm:text-base md:text-lg font-bold">৳{Number(dress.pricePerMeter).toFixed(2)}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 ml-0.5 md:ml-1">/m</span>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-1 md:gap-2">
            {isOutOfStock && (
              <span className="bg-rose-50 text-rose-600 text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 border border-rose-100 uppercase tracking-tight rounded-md">
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-50 text-amber-600 text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 border border-amber-100 uppercase tracking-tight rounded-md">
                Low Stock
              </span>
            )}
          </div>
        </div>

        <div className="p-3 md:p-5 flex-1 flex flex-col bg-white">
          <div className="mb-2 md:mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-black mb-0.5 md:mb-1 truncate">{dress.name}</h3>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-500">REF: {dress.id.slice(-8)}</p>
          </div>
          
          <div className="mt-auto pt-2 md:pt-4 border-t border-gray-100">
            <div className="flex gap-4 md:gap-6">
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-0.5 md:mb-1">Stock</p>
                <p className={`text-sm sm:text-base md:text-xl font-bold leading-none ${stockTextColorClass}`}>
                  {dress.stockMeters}<span className="text-[10px] sm:text-[11px] md:text-xs font-normal text-gray-500 ml-0.5 md:ml-1">m</span>
                </p>
              </div>
              {dress.totalMetersSold > 0 && (
                <div>
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-0.5 md:mb-1">Sold</p>
                  <p className="text-sm sm:text-base md:text-xl font-bold leading-none text-black">
                    {dress.totalMetersSold}<span className="text-[10px] sm:text-[11px] md:text-xs font-normal text-gray-500 ml-0.5 md:ml-1">m</span>
                  </p>
                </div>
              )}
            </div>
          
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => isOutOfStock ? setIsRequestModalOpen(true) : setIsOrderModalOpen(true)}
              className={`mt-3 md:mt-4 w-full py-2 md:py-2.5 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] md:text-sm transition-all rounded-xl ${
                isOutOfStock 
                  ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200' 
                  : 'bg-rose-700 text-white md:hover:bg-rose-800 md:hover:shadow-lg md:hover:shadow-rose-700/20'
              }`}
            >
              {isOutOfStock ? 'Request Restock' : 'Order Now'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {isOrderModalOpen && (
        <OrderModal dress={dress} onClose={() => setIsOrderModalOpen(false)} />
      )}

      {isRequestModalOpen && (
        <StockRequestModal dress={dress} onClose={() => setIsRequestModalOpen(false)} />
      )}
    </>
  );
}
