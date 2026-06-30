'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderModal from './OrderModal';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function DressCard({ dress }: Readonly<{ dress: any }>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  
  const isOutOfStock = dress.stockMeters <= 0;
  const isLowStock = !isOutOfStock && dress.stockMeters < 10;

  useEffect(() => {
    if (searchParams?.get('reorder') === dress.id && !isOutOfStock) {
      setIsModalOpen(true);
    }
  }, [searchParams, dress.id, isOutOfStock]);

  let cardBorderClass = 'border-gray-100';
  let stockTextColorClass = 'text-gray-900';
  if (isOutOfStock) {
    cardBorderClass = 'border-red-100 opacity-75';
    stockTextColorClass = 'text-red-500';
  } else if (isLowStock) {
    cardBorderClass = 'border-amber-200';
    stockTextColorClass = 'text-amber-500';
  }

  return (
    <>
      <div className={`bg-white shadow-sm border ${cardBorderClass} hover:shadow-md transition-all duration-300 flex flex-col h-full`}>
        
        {/* Image Area */}
        <div className="relative w-full aspect-[4/5] bg-gray-50 border-b border-gray-100 flex items-center justify-center">
          {dress.imageUrl ? (
            <Image 
              src={dress.imageUrl} 
              alt={dress.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <span className="text-sm font-medium uppercase tracking-widest opacity-50">No Image</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 z-20">
            <div className="bg-white text-black px-1.5 md:px-3 py-0.5 md:py-1 border border-gray-200 shadow-sm">
              <span className="text-sm md:text-lg font-bold">৳{Number(dress.pricePerMeter).toFixed(2)}</span>
              <span className="text-[9px] md:text-xs text-gray-500 ml-0.5 md:ml-1">/m</span>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-1 md:gap-2">
            {isOutOfStock && (
              <span className="bg-red-50 text-red-700 text-[9px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 border border-red-100 uppercase tracking-wider">
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-50 text-amber-700 text-[9px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 border border-amber-100 uppercase tracking-wider">
                Low Stock
              </span>
            )}
          </div>
        </div>

        <div className="p-3 md:p-5 flex-1 flex flex-col bg-white">
          <div className="mb-2 md:mb-4">
            <h3 className="text-sm md:text-lg font-bold text-black mb-0.5 md:mb-1 truncate">{dress.name}</h3>
            <p className="text-[10px] md:text-xs text-gray-500">REF: {dress.id.substring(0, 8)}</p>
          </div>
          
          <div className="mt-auto pt-2 md:pt-4 border-t border-gray-100">
            <div className="flex justify-between md:justify-start md:gap-6">
              <div>
                <p className="text-[9px] md:text-xs font-bold text-gray-500 uppercase mb-0.5 md:mb-1">Stock</p>
                <p className={`text-sm md:text-xl font-bold leading-none ${stockTextColorClass}`}>
                  {dress.stockMeters}<span className="text-[10px] md:text-xs font-normal text-gray-500 ml-0.5 md:ml-1">m</span>
                </p>
              </div>
              {dress.totalMetersSold > 0 && (
                <div>
                  <p className="text-[9px] md:text-xs font-bold text-gray-500 uppercase mb-0.5 md:mb-1 text-right md:text-left">Sold</p>
                  <p className="text-sm md:text-xl font-bold leading-none text-black text-right md:text-left">
                    {dress.totalMetersSold}<span className="text-[10px] md:text-xs font-normal text-gray-500 ml-0.5 md:ml-1">m</span>
                  </p>
                </div>
              )}
            </div>
          
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={isOutOfStock}
              className={`mt-3 md:mt-4 w-full py-2 md:py-2.5 font-bold uppercase tracking-wider text-[10px] md:text-sm transition-colors ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isOutOfStock ? 'Sold Out' : 'Order Now'}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OrderModal dress={dress} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
