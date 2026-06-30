'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/app/actions/auth';
import { Home, LayoutDashboard, Library, ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

export default function DesktopNav({ isAdmin }: Readonly<{ isAdmin?: boolean }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  const adminNavItems = [
    { name: 'Storefront', href: '/', icon: Home },
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Catalogs', href: '/admin/catalog', icon: Library },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Logout', href: '#logout', icon: LogOut },
  ];

  const clientNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalogs', href: '/catalog', icon: Library },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Track', href: '/track', icon: Search },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (isAdmin && !isAdminRoute) {
    clientNavItems.push({ name: 'Admin', href: '/admin', icon: LayoutDashboard });
  }

  const navItems = isAdminRoute ? adminNavItems : clientNavItems;

  return (
    <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-zinc-200/50 rounded-full px-3 py-2 flex items-center gap-1 border border-white/40">
        <Link href="/" className="px-4 py-2 text-xl font-black tracking-tighter text-black uppercase mr-2 hover:opacity-80 transition-opacity">
          Stitcher
        </Link>

        <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full">
          {navItems.map((item) => {
            if (item.href === '#logout') {
              return (
                <form key={item.name} action={handleSignOut}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="text-red-500" />
                    {item.name}
                  </motion.button>
                </form>
              );
            }

            const isActive = 
              pathname === item.href || 
              (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <MotionLink
                whileTap={{ scale: 0.95 }}
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-rose-50 text-rose-700 shadow-sm ring-1 ring-rose-200/50' 
                    : 'text-zinc-500 hover:text-rose-700 hover:bg-rose-50/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-rose-700' : 'text-zinc-400'} />
                {item.name}
              </MotionLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
