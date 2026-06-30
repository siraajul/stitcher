'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, ShoppingCart, ArrowLeft, Scissors, LogOut } from 'lucide-react';
import { handleSignOut } from '@/app/actions/auth';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Catalogs', href: '/admin/catalog', icon: Library },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col min-h-screen sticky top-0 h-screen">
      {/* Logo Area */}
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="bg-zinc-900 text-white p-2 rounded-xl shadow-sm">
          <Scissors size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Stitcher Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-zinc-50 text-black' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-zinc-900' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-50 space-y-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>
        <form action={handleSignOut}>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
