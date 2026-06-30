'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (globalThis.window !== undefined && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    }
  }, []);

  return null;
}
