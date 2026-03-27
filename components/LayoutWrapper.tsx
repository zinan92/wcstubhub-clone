'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LazyMotion, domAnimation } from 'motion/react';
import BottomTabNavigation from './BottomTabNavigation';
import TopNavBar from './TopNavBar';
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

  // Don't show top nav on admin pages
  const hideTopNav = pathname.startsWith('/admin');

  return (
    <SessionProvider>
      <LazyMotion features={domAnimation}>
        <ToastProvider>
          {!hideTopNav && <TopNavBar />}
          {/* Add top padding to prevent content from being hidden behind fixed nav */}
          <div className={!hideTopNav ? 'pt-14' : ''}>
            {children}
          </div>
          {!hideBottomTabs && <BottomTabNavigation />}
        </ToastProvider>
      </LazyMotion>
    </SessionProvider>
  );
}
