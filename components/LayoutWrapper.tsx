'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LazyMotion, domAnimation } from 'motion/react';
import BottomTabNavigation from './BottomTabNavigation';
import { ToastProvider } from './ui/Toast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show bottom tabs on login, register, admin, product detail, or event detail pages
  const hideBottomTabs = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/events/');

  return (
    <SessionProvider>
      <LazyMotion features={domAnimation}>
        <ToastProvider>
          {children}
          {!hideBottomTabs && <BottomTabNavigation />}
        </ToastProvider>
      </LazyMotion>
    </SessionProvider>
  );
}
