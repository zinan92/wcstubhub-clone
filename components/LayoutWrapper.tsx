'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import BottomTabNavigation from './BottomTabNavigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show bottom tabs on login, register, or admin pages
  const hideBottomTabs = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname.startsWith('/admin');

  return (
    <SessionProvider>
      {children}
      {!hideBottomTabs && <BottomTabNavigation />}
    </SessionProvider>
  );
}
