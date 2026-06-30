'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Library, ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { handleSignOut } from '@/app/actions/auth';

export default function MobileNav({ isAdmin }: Readonly<{ isAdmin?: boolean }>) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  const adminNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Catalogs', href: '/admin/catalog', icon: Library },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] select-none">
      {navItems.map((item) => {
        if (item.href === '#logout') {
          return (
            <form key={item.name} action={handleSignOut} className="flex-1 flex flex-col items-center py-3 transition-colors text-red-400 active:text-red-600 md:hover:text-red-600">
              <button type="submit" className="flex flex-col items-center w-full">
                <LogOut size={22} className="mb-1" />
                <span className="text-[10px] font-bold leading-none">{item.name}</span>
              </button>
            </form>
          );
        }

        // Special active logic so /admin doesn't match /admin/catalog
        const isActive = 
          pathname === item.href || 
          (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));
        
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              isActive ? 'text-zinc-900' : 'text-gray-400 active:text-gray-600 md:hover:text-gray-600'
            }`}
          >
            <Icon size={22} className="mb-1" />
            <span className="text-[10px] font-bold leading-none">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
