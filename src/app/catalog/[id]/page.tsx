import { getCatalogByNumber } from '@/app/actions/catalog';
import DressCard from './DressCard';
import Link from 'next/link';
import { ArrowLeft, BookOpen, SearchX } from 'lucide-react';

export default async function CatalogPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const resolvedParams = await params;
  const catalogNumber = resolvedParams.id;
  const catalog = await getCatalogByNumber(catalogNumber);

  if (!catalog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full">
          <SearchX size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Catalog Not Found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We couldn't find a catalog with the number <span className="font-bold text-gray-900">"{catalogNumber}"</span>. 
            Please check the number and try searching again.
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg w-full">
            <ArrowLeft size={20} /> Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <header className="w-full px-6 pt-8 pb-12 md:-mt-24 md:pt-36 bg-gradient-to-b from-rose-950 via-rose-900 to-zinc-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 text-white rounded-lg hidden sm:block backdrop-blur-sm">
                <BookOpen size={20} />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Catalog <span className="text-rose-200">#{catalog.catalogNumber}</span>
              </h1>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold text-white">
            {catalog.dresses.length} {catalog.dresses.length === 1 ? 'Dress' : 'Dresses'}
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {catalog.dresses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Dresses Yet</h3>
            <p className="text-gray-500">This catalog has been created but no dresses are available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {catalog.dresses.map((dress) => (
              <div key={dress.id} id={`dress-${dress.id}`}>
                <DressCard dress={dress} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
