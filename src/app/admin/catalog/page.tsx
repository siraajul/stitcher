import { getCatalogs } from '@/app/actions/catalog';
import AddCatalogForm from './AddCatalogForm';
import Link from 'next/link';

export default async function AdminCatalogPage() {
  const catalogs = await getCatalogs();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Catalogs</h1>
      
      <AddCatalogForm />

      <h2 className="text-xl font-bold mb-4">Existing Catalogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map(catalog => (
          <Link key={catalog.id} href={`/admin/catalog/${catalog.id}`} className="block">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-zinc-900 transition-colors">#{catalog.catalogNumber}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                  {catalog._count.dresses} dresses
                </span>
              </div>
              <p className="text-sm text-gray-500">Created {new Date(catalog.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
