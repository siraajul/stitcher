import SearchForm from './SearchForm';
import { getAvailableDresses } from '@/app/actions/catalog';
import DressCard from '@/app/catalog/[id]/DressCard';
import { ChevronDown, Search, Package, Zap } from 'lucide-react';

export default async function Home() {
  const availableDresses = await getAvailableDresses();
  return (
    <div className="bg-white flex flex-col">
      
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-64px)] flex flex-col relative bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/30">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight mb-6">
            Fabric Catalog
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Search our collection by catalog number. Check real-time stock and place your orders.
          </p>
          <SearchForm />
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-8 text-center max-w-4xl mx-auto opacity-80 px-4 md:px-0">
          <div className="flex flex-col items-center">
            <div className="mb-3 md:mb-4 bg-zinc-100 p-4 rounded-full text-zinc-900 shadow-sm border border-zinc-200">
              <Search size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base leading-tight">Quick Search</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-tight max-w-[12rem]">Find any catalog instantly.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 md:mb-4 bg-zinc-100 p-4 rounded-full text-zinc-900 shadow-sm border border-zinc-200">
              <Package size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base leading-tight">Live Inventory</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-tight max-w-[12rem]">See how many meters are in stock.</p>
          </div>
          <div className="flex flex-col items-center col-span-2 md:col-span-1 mt-2 md:mt-0">
            <div className="mb-3 md:mb-4 bg-zinc-100 p-4 rounded-full text-zinc-900 shadow-sm border border-zinc-200">
              <Zap size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base leading-tight">Instant Orders</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-tight max-w-[12rem]">Place orders and reserve stock.</p>
          </div>
        </div>
        </main>

        {/* Scroll Indicator */}
        <a href="#available-stock" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Scroll to explore</span>
          <ChevronDown size={20} className="text-gray-500" />
        </a>
      </div>

      {/* Available Stocks Section */}
      {availableDresses.length > 0 && (
        <section id="available-stock" className="w-full bg-white py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 border-b border-gray-200 pb-4 text-center md:text-left">
              <h2 className="text-2xl font-bold text-black tracking-tight uppercase">
                Available In Stock
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {availableDresses.map((dress) => (
                <div key={dress.id} className="relative">
                  {/* Catalog Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white text-black border border-gray-300 text-xs font-semibold px-2 py-1 shadow-sm uppercase tracking-wider">
                      Cat: {dress.catalog.catalogNumber}
                    </span>
                  </div>
                  <DressCard dress={dress} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="py-6 text-center text-sm text-gray-400 relative z-10">
        &copy; {new Date().getFullYear()} Stitcher Fashion. All rights reserved.
      </footer>
    </div>
  );
}
