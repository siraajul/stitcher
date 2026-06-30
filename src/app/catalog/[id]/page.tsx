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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full transition-colors"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zinc-50 text-zinc-900 rounded-lg hidden sm:block">
                <BookOpen size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Catalog <span className="text-zinc-900">#{catalog.catalogNumber}</span>
              </h1>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
            {catalog.dresses.length} Dresses
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
