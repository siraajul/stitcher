'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on home page or main admin dashboard
  if (pathname === '/' || pathname === '/admin') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-[60] md:top-6 md:left-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-gray-100 text-gray-900 transition-all"
        aria-label="Go back"
      >
        <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
      </motion.button>
    </div>
  );
}
