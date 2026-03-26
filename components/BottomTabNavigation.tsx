'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Trophy, Dumbbell, Music, User } from 'lucide-react';
import { m } from 'motion/react';

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
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-50">
      <div className="flex justify-around items-center h-16 max-w-[600px] mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full relative min-h-[44px] min-w-[44px]"
            >
              {active && (
                <m.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <m.div
                animate={{ scale: active ? 1 : 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <Icon className={`w-6 h-6 mb-1 transition-colors ${
                  active ? 'text-primary-500' : 'text-gray-500'
                }`} />
                <span className={`text-xs font-medium transition-colors ${
                  active ? 'text-primary-500' : 'text-gray-500'
                }`}>{tab.label}</span>
              </m.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
