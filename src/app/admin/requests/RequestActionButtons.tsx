'use client';

import { useState } from 'react';
import { updateStockRequestStatus } from '@/app/actions/stock-request';
import { Check, Loader2 } from 'lucide-react';

export default function RequestActionButtons({ requestId, currentStatus }: Readonly<{ requestId: string, currentStatus: string }>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkReviewed = async () => {
    setIsLoading(true);
    await updateStockRequestStatus(requestId, 'REVIEWED');
    setIsLoading(false);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleMarkReviewed}
        disabled={isLoading || currentStatus === 'REVIEWED'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        Mark as Reviewed
      </button>
    </div>
  );
}
