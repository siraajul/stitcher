'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/app/actions/auth';
import { Home, LayoutDashboard, Library, ShoppingCart, User, LogOut, Search } from 'lucide-react';

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
      <div className="bg-white/80 backdrop-blur-md shadow-xl shadow-gray-200/50 rounded-full px-3 py-2 flex items-center gap-1 border border-white/50">
        <Link href="/" className="px-4 py-2 text-xl font-black tracking-tighter text-black uppercase mr-2 hover:opacity-80 transition-opacity">
          Stitcher
        </Link>

        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full">
          {navItems.map((item) => {
            if (item.href === '#logout') {
              return (
                <form key={item.name} action={handleSignOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="text-red-500" />
                    {item.name}
                  </button>
                </form>
              );
            }

            const isActive = 
              pathname === item.href || 
              (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-zinc-900' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
