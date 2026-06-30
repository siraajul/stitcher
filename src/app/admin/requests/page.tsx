import { getPendingStockRequests } from '@/app/actions/stock-request';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, User, Phone, Ruler } from 'lucide-react';
// @ts-ignore - TS language server caching issue with new files
import RequestActionButtons from './RequestActionButtons';

export const metadata = {
  title: 'Stock Requests | Admin',
};

export default async function RequestsPage() {
  const requests = await getPendingStockRequests();

  const pendingRequests = requests.filter((r: any) => r.status === 'PENDING');
  const reviewedRequests = requests.filter((r: any) => r.status === 'REVIEWED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Stock Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Customers requesting restocks for sold-out dresses.
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Clock className="text-amber-500" size={20} />
          Pending Review ({pendingRequests.length})
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-gray-500">No pending requests.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((request: any) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                    Pending Review
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dress Details</p>
                    <div className="font-medium text-gray-900">
                      <Link href={`/catalog/${request.dress.catalog.catalogNumber}`} className="hover:text-blue-600 transition-colors">
                        {request.dress.name}
                      </Link>
                    </div>
                    <p className="text-xs text-gray-500">Catalog: {request.dress.catalog.catalogNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Info</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={14} className="text-gray-400" /> {request.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                      <Phone size={14} className="text-gray-400" /> {request.phoneNumber}
                    </div>
                  </div>

                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Requested Amount</p>
                     <div className="flex items-center gap-2 text-sm font-bold text-rose-600">
                      <Ruler size={14} className="text-rose-500" /> {request.requestedMeters} meters
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <RequestActionButtons requestId={request.id} currentStatus={request.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Requests */}
      <div className="pt-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 opacity-75">
          <CheckCircle2 className="text-green-500" size={20} />
          Reviewed ({reviewedRequests.length})
        </h2>
        
        {reviewedRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-75">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {reviewedRequests.map((request: any) => (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                        <div className="text-xs text-gray-500 font-mono">{request.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.dress.name}</div>
                        <div className="text-xs text-gray-500">{request.dress.catalog.catalogNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {request.requestedMeters}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden grid gap-3 p-3 bg-gray-50/50">
              {reviewedRequests.map((request: any) => (
                <div key={request.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{request.customerName}</div>
                      <div className="text-xs text-gray-500 font-mono">{request.phoneNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">{request.requestedMeters}m</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{new Date(request.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-50">
                    <div className="text-sm font-medium text-gray-800">{request.dress.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Cat: {request.dress.catalog.catalogNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
