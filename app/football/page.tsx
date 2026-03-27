'use client';

import { useState, useEffect } from 'react';
import { Trophy, Search } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import SearchOverlay from '@/components/goods/SearchOverlay';
import MatchCard from '@/components/football/MatchCard';
import { MatchCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { BuyerProtection } from '@/components/trust/BuyerProtection';
import { TrustBadgesGroup } from '@/components/trust/TrustBadges';

interface FootballEvent {
  id: string;
  title: string;
  type: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  date: string;
  venue: string;
  price: number;
  remainingQty: number;
  isBestValue: boolean;
  isSellingFast: boolean;
  urgencyThreshold: number | null;
  isOfficial: boolean;
}

export default function FootballPage() {
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch football events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?type=football');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching football events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Search Trigger */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-muted-200 rounded-full shadow-soft hover:shadow-card transition-all"
        >
          <Search className="w-5 h-5 text-muted-400" />
          <span className="text-muted-500">Find matches</span>
        </button>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* World Cup Banner */}
      <div className="px-4 pb-4">
        <div className="w-full h-40 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
          <div className="text-center text-white px-6">
            <Trophy className="w-16 h-16 mx-auto mb-2 opacity-90" />
            <h2 className="text-2xl font-bold mb-1">FIFA World Cup 2026</h2>
            <p className="text-sm opacity-90">USA · Canada · Mexico</p>
          </div>
        </div>
      </div>

      {/* Football Section Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Football</h2>
        </div>
      </div>

      {/* Trust Architecture - visible to all users */}
      <div className="px-4 pb-4">
        <BuyerProtection variant="compact" />
      </div>

      {/* Trust Badges */}
      <div className="px-4 pb-4">
        <TrustBadgesGroup 
          badges={['verified', 'buyer-protected', 'secure-delivery']} 
          size="sm"
        />
      </div>

      {/* Match Cards */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <m.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {[...Array(4)].map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </m.div>
          ) : events.length === 0 ? (
            <m.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                icon={Trophy}
                heading="No matches found"
                subtext="Try a different search term"
              />
            </m.div>
          ) : (
            <m.div
              key="content"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="space-y-4"
            >
              {events.map((event) => (
                <m.div
                  key={event.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3 },
                    },
                  }}
                >
                  <MatchCard
                    id={event.id}
                    team1={event.team1}
                    team2={event.team2}
                    team1Flag={event.team1Flag}
                    team2Flag={event.team2Flag}
                    date={event.date}
                    venue={event.venue}
                    price={event.price}
                    remainingQty={event.remainingQty}
                    isBestValue={event.isBestValue}
                    isSellingFast={event.isSellingFast}
                    urgencyThreshold={event.urgencyThreshold ?? undefined}
                    isOfficial={event.isOfficial}
                  />
                </m.div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
