import { getCatalogById } from '@/app/actions/catalog';
import DressStockUpdater from './DressStockUpdater';
import DressPhotoUpdater from './DressPhotoUpdater';
import DressPriceUpdater from './DressPriceUpdater';
import AddDressForm from './AddDressForm';
import DeleteDressButton from './DeleteDressButton';
import EditCatalogName from './EditCatalogName';
import EditDressName from './EditDressName';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminCatalogDetailsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const resolvedParams = await params;
  const catalog = await getCatalogById(resolvedParams.id);

  if (!catalog) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin/catalog" className="text-gray-500 hover:text-black">
          &larr; Back
        </Link>
        <EditCatalogName catalogId={catalog.id} initialName={catalog.catalogNumber} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">Dresses in this Catalog</h2>
            <span className="bg-zinc-100 text-black text-xs px-3 py-1 rounded-full font-medium">
              {catalog.dresses.length} Total
            </span>
          </div>
          <AddDressForm catalogId={catalog.id} />
        </div>
        
        <div className="divide-y divide-gray-100">
          {catalog.dresses.map((dress) => (
            <div key={dress.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <DressPhotoUpdater dress={dress} />
                <div>
                  <EditDressName dressId={dress.id} initialName={dress.name} />
                  <p className="text-sm text-gray-500">ID: {dress.id}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price / Meter</span>
                    <DressPriceUpdater dress={dress} />
                  </div>
                  <div className="flex flex-col items-end border-l pl-4 border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Update Stock</span>
                    <DressStockUpdater dress={dress} />
                  </div>
                  <div className="flex flex-col items-end border-l pl-4 border-gray-100 self-stretch justify-center">
                    <DeleteDressButton dressId={dress.id} catalogId={catalog.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
