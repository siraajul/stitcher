'use client';

import { useState } from 'react';
import { placeStockRequest } from '@/app/actions/stock-request';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StockRequestModal({ dress, onClose }: Readonly<{ dress: any, onClose: () => void }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    requestedMeters: ''
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const requestedMetersNum = Number(formData.requestedMeters);
    if (Number.isNaN(requestedMetersNum) || requestedMetersNum <= 0) {
      setError('Please enter a valid requested amount');
      setIsSubmitting(false);
      return;
    }

    const result = await placeStockRequest({
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      requestedMeters: requestedMetersNum,
      dressId: dress.id,
    });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      setError(result.error || 'Failed to submit request');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={isSubmitting ? undefined : onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Request Restock</h2>
              <p className="text-sm text-gray-500 mt-1">{dress.name}</p>
            </div>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-500 mb-6">We'll notify you when {dress.name} is back in stock.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input
                      id="customerName"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="requestedMeters" className="block text-sm font-semibold text-gray-700 mb-1.5">Requested Amount (Meters)</label>
                    <input
                      id="requestedMeters"
                      type="number"
                      required
                      min="0.5"
                      step="0.1"
                      value={formData.requestedMeters}
                      onChange={e => setFormData({...formData, requestedMeters: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                      placeholder="How many meters do you need?"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${isSubmitting ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/20'}`}
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
