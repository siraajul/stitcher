import SearchForm from './SearchForm';
import { getAvailableDresses } from '@/app/actions/catalog';
import DressCard from '@/app/catalog/[id]/DressCard';
import { ChevronDown, Search, Package, Zap } from 'lucide-react';

export default async function Home() {
  const availableDresses = await getAvailableDresses();
  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <div className="min-h-[100dvh] flex flex-col relative bg-zinc-50 overflow-hidden md:-mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200/60 via-zinc-50 to-zinc-50 pointer-events-none"></div>
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:pt-32 relative z-10">
        <div className="text-center mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-950 tracking-tighter mb-6">
            Fabric Catalog
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Search our collection by catalog number. Check real-time stock and place your orders.
          </p>
          <SearchForm />
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-8 text-center max-w-4xl mx-auto px-4 md:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">
          <div className="flex flex-col items-center">
            <div className="mb-3 md:mb-4 bg-white p-4 rounded-full text-rose-700 shadow-xl shadow-rose-200/40 border border-rose-100 ring-4 ring-rose-50">
              <Search size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base leading-tight">Quick Search</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-tight max-w-[12rem]">Find any catalog instantly.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 md:mb-4 bg-white p-4 rounded-full text-rose-700 shadow-xl shadow-rose-200/40 border border-rose-100 ring-4 ring-rose-50">
              <Package size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base leading-tight">Live Inventory</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-tight max-w-[12rem]">See how many meters are in stock.</p>
          </div>
          <div className="flex flex-col items-center col-span-2 sm:col-span-1 mt-2 md:mt-0">
            <div className="mb-3 md:mb-4 bg-white p-4 rounded-full text-rose-700 shadow-xl shadow-rose-200/40 border border-rose-100 ring-4 ring-rose-50">
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
        <section id="available-stock" className="w-full bg-zinc-50 py-16 border-t border-zinc-200/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 border-b border-zinc-200/60 pb-4 text-center md:text-left">
              <h2 className="text-2xl font-black text-rose-950 tracking-tight uppercase">
                Available In Stock
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
