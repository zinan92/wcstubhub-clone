'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search, User } from 'lucide-react';
import DefaultAvatar from '@/components/ui/DefaultAvatar';
import SearchOverlay from '@/components/goods/SearchOverlay';

export default function TopNavBar() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Fixed Top Nav - z-50 (same as bottom tab bar, but positioned at top) */}
      <nav className="fixed top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="flex items-center justify-between h-14 px-4 max-w-[600px] mx-auto">
          {/* Logo/App Name - tapping navigates to / */}
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] min-w-[44px] py-2 transition-all active:scale-95"
            aria-label="Go to homepage"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WC</span>
            </div>
            <span className="font-bold text-lg text-gray-900">StubHub</span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon - opens SearchOverlay */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* User Icon - logged out: /login, logged in: /my */}
            <Link
              href={session ? '/my' : '/login'}
              aria-label={session ? 'Go to profile' : 'Go to login'}
              className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-full transition-colors active:scale-95 flex items-center justify-center"
            >
              {session ? (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <DefaultAvatar className="w-6 h-6" />
                </div>
              ) : (
                <User className="w-5 h-5 text-gray-700" />
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
