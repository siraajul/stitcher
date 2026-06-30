'use client';

import { useState, useEffect } from 'react';
import { placeOrder } from '@/app/actions/order';
import { X, CheckCircle2, Copy, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OrderModalProps {
  dress: any;
  onClose: () => void;
}

export default function OrderModal({ dress, onClose }: Readonly<OrderModalProps>) {
  const [meters, setMeters] = useState<number | ''>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('COD');
  const [mfsSenderNumber, setMfsSenderNumber] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('stitcher_customer_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
      }
    } catch(e) {
      console.error('Failed to parse saved customer details', e);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!meters || meters <= 0) return;
    if (meters > dress.stockMeters) {
      setError(`Cannot order more than ${dress.stockMeters} meters.`);
      return;
    }

    setLoading(true);
    setError('');

    const res = await placeOrder({
      dressId: dress.id,
      customerName,
      phoneNumber: phone,
      address,
      paymentMode,
      mfsSenderNumber: paymentMode === 'MFS' ? mfsSenderNumber : undefined,
      orderedMeters: Number(meters),
    });

    if (res.success && res.order) {
      setOrderId(res.order.id);
      setSuccess(true);
      
      // Save customer details for auto-fill on next order
      try {
        localStorage.setItem('stitcher_customer_details', JSON.stringify({
          customerName,
          phone,
          address
        }));
      } catch (e) {
        console.error('Failed to save customer details', e);
      }
      
      // Save to localStorage for frictionless tracking
      try {
        const existing = JSON.parse(localStorage.getItem('stitcher_orders') || '[]');
        existing.unshift({
          id: res.order.id,
          name: dress.name,
          date: new Date().toISOString()
        });
        localStorage.setItem('stitcher_orders', JSON.stringify(existing.slice(0, 10))); // keep last 10
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }
    } else {
      setError(res.error || 'Failed to place order');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">
            {success ? 'Order Receipt' : `Order ${dress.name}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 size={64} className="mx-auto mb-4 text-emerald-500" />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Order Pending</h4>
              <p className="text-gray-500 mb-8">Your stock has been reserved. Our admin will call you to verify and approve the order.</p>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-8 text-left relative">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Reference ID</p>
                <p className="text-lg font-mono text-gray-900 break-all pr-10">{orderId}</p>
                <button 
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors absolute right-4 top-1/2 -translate-y-1/2"
                  title="Copy Order ID"
                >
                  {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Please save this reference ID. You may be asked for it when you call us to finalize your purchase.
              </p>

              <div className="flex flex-col gap-3">
                <Link href={`/track/${orderId}`}>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-3 text-sm font-semibold text-white bg-zinc-900 rounded-xl hover:bg-black flex items-center justify-center w-full transition-all shadow-md"
                  >
                    Track Order Now
                  </motion.button>
                </Link>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-5 py-3 text-sm font-semibold text-zinc-900 bg-zinc-100 rounded-xl hover:bg-zinc-200 flex items-center justify-center w-full transition-all"
                >
                  Close
                </motion.button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="bg-gray-50 p-3 border border-gray-200 flex justify-between items-center mb-1 rounded-xl">
                <div className="flex items-center gap-2">
                  {dress.imageUrl ? (
                    <div className="relative w-10 h-10 border border-gray-200 rounded-lg overflow-hidden">
                      <Image src={dress.imageUrl} alt={dress.name} fill sizes="40px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageIcon size={16} />
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 font-bold text-[10px] uppercase block">Available</span>
                    <span className="text-black font-bold text-base leading-none">{dress.stockMeters}m</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-gray-500 font-bold text-[10px] uppercase block">Price</span>
                  <span className="text-black font-bold text-base leading-none">৳{Number(dress.pricePerMeter).toFixed(2)}/m</span>
                </div>
              </div>

              {/* Total Price Calculator Box */}
              <div className="bg-gray-100 p-3 border border-gray-200 rounded-xl flex justify-between items-center">
                <span className="text-gray-600 font-bold uppercase text-[10px]">Total Price:</span>
                <span className="text-xl font-black text-black">
                  ৳{((Number(meters) || 0) * dress.pricePerMeter).toFixed(2)}
                </span>
              </div>

              <div>
                <label htmlFor="meters" className="block text-xs font-semibold text-gray-700 mb-1">Quantity (Meters)</label>
                <input 
                  id="meters"
                  type="number" 
                  required
                  min="0.1"
                  step="0.1"
                  max={dress.stockMeters}
                  value={meters}
                  onChange={(e) => setMeters(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-transparent rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all shadow-sm"
                  placeholder="How many meters?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                  <input 
                    id="customerName"
                    name="name"
                    autoComplete="name"
                    type="text" 
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-50 border border-transparent rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input 
                    id="phone"
                    name="tel"
                    autoComplete="tel"
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-transparent rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all shadow-sm"
                    placeholder="017..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address</label>
                <textarea 
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-transparent rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all shadow-sm resize-none"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label htmlFor="paymentMode" className="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
                <select 
                  id="paymentMode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-zinc-50 border border-transparent rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all shadow-sm"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="MFS">bKash / Nagad / Others (MFS)</option>
                </select>
              </div>

              {paymentMode === 'MFS' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="mfsSenderNumber" className="block text-xs font-semibold text-gray-700 mb-1">Sender Number (MFS)</label>
                  <input 
                    id="mfsSenderNumber"
                    type="tel" 
                    required={paymentMode === 'MFS'}
                    value={mfsSenderNumber}
                    onChange={(e) => setMfsSenderNumber(e.target.value)}
                    className="w-full border border-amber-200 bg-amber-50 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-amber-700/60 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                    placeholder="Number you sent from"
                  />
                  <p className="text-[10px] text-amber-600 mt-1 font-medium leading-tight">Send money to our official number and enter your sender number.</p>
                </div>
              )}

              {error && <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-100 p-2 rounded-lg">{error}</p>}

              <div className="pt-2 flex gap-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white border border-gray-200 md:hover:bg-zinc-50 text-zinc-800 font-bold py-2.5 rounded-xl transition-all shadow-sm text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                whileTap={(loading || Number(meters) > dress.stockMeters) ? undefined : { scale: 0.95 }}
                type="submit"
                disabled={loading || Number(meters) > dress.stockMeters}
                className="flex-1 bg-rose-700 text-white px-3 py-2.5 font-bold uppercase tracking-wider text-xs md:hover:bg-rose-800 md:hover:shadow-md disabled:bg-rose-300 transition-all shadow-md rounded-xl"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
