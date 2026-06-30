'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, ShoppingCart, User, Search, LayoutDashboard, ShoppingBag, LogOut, LibrarySquare, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);
import { handleSignOut } from '@/app/actions/auth';

export default function MobileNav({ isAdmin }: Readonly<{ isAdmin?: boolean }>) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  const adminNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Catalogs', href: '/admin/catalog', icon: LibrarySquare },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Requests', href: '/admin/requests', icon: ClipboardList },
    { name: 'Logout', href: '#logout', icon: LogOut },
  ];

  const clientNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalog', href: '/catalog', icon: Library },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Track', href: '/track', icon: Search },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (isAdmin && !isAdminRoute) {
    clientNavItems.push({ name: 'Admin', href: '/admin', icon: LayoutDashboard });
  }

  const navItems = isAdminRoute ? adminNavItems : clientNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 flex justify-around items-center pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] select-none">
      {navItems.map((item) => {
        if (item.href === '#logout') {
          return (
            <form key={item.name} action={handleSignOut} className="flex-1 flex flex-col items-center py-3 transition-colors text-red-400 active:text-red-600 md:hover:text-red-600">
              <motion.button whileTap={{ scale: 0.9 }} type="submit" className="flex flex-col items-center w-full">
                <LogOut size={22} className="mb-1" />
                <span className="text-[10px] font-bold leading-none">{item.name}</span>
              </motion.button>
            </form>
          );
        }

        // Special active logic so /admin doesn't match /admin/catalog
        const isActive = 
          pathname === item.href || 
          (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));
        
        const Icon = item.icon;
        
        return (
          <MotionLink
            whileTap={{ scale: 0.9 }}
            key={item.name}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              isActive ? 'text-rose-700' : 'text-zinc-400 active:text-rose-600 md:hover:text-rose-600'
            }`}
          >
            <Icon size={22} className="mb-1" />
            <span className="text-[10px] font-bold leading-none">{item.name}</span>
          </MotionLink>
        );
      })}
    </div>
  );
}
