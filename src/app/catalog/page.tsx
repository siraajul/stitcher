import { getCatalogs } from '@/app/actions/catalog';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

export default async function CatalogPage() {
  const catalogs = await getCatalogs();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catalogs</h1>
      </div>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {catalogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No catalogs available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catalogs.map((catalog) => (
              <Link 
                key={catalog.id} 
                href={`/catalog/${catalog.catalogNumber}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all"
              >
                <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <FolderOpen size={56} className="text-zinc-400 group-hover:text-zinc-800 transition-colors" />
                </div>
                <div className="p-5 border-t border-gray-50">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    Catalog {catalog.catalogNumber}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {catalog._count.dresses} {catalog._count.dresses === 1 ? 'Design' : 'Designs'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
