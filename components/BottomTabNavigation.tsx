'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Trophy, Dumbbell, Music, User } from 'lucide-react';

const tabs = [
  { label: 'Goods', path: '/', icon: ShoppingBag },
  { label: 'Football', path: '/football', icon: Trophy },
  { label: 'Basketball', path: '/basketball', icon: Dumbbell },
  { label: 'Concert', path: '/concert', icon: Music },
  { label: 'My', path: '/my', icon: User },
];

export default function BottomTabNavigation() {
  const pathname = usePathname();

  const isActive = (tabPath: string) => {
    if (tabPath === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(tabPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-[600px] mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
