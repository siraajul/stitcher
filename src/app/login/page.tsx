'use client';

import { useState } from 'react';
import { loginUser } from '@/app/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    setError('');
    
    const res = await loginUser(formData);
    
    // If it succeeds, the server action throws a redirect which Next.js catches.
    // If we reach here with an error, we handle it:
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 md:-mt-24">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In to Stitcher</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-zinc-800 focus:ring-0 transition-colors focus:outline-none font-medium text-gray-900 placeholder:text-gray-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-zinc-800 focus:ring-0 transition-colors focus:outline-none font-medium text-gray-900 placeholder:text-gray-500"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link href="/register" className="text-zinc-900 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
