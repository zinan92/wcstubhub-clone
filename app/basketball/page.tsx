'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/goods/SearchBar';
import BasketballCard from '@/components/basketball/BasketballCard';
import { MatchCardSkeleton } from '@/components/ui/Skeleton';

interface BasketballEvent {
  id: string;
  title: string;
  type: string;
  team1: string;
  team2: string;
  date: string;
  venue: string;
  price: number;
}

export default function BasketballPage() {
  const [events, setEvents] = useState<BasketballEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<BasketballEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch basketball events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?type=basketball');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching basketball events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events in real-time as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.team1?.toLowerCase().includes(query) ||
          event.team2?.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Find matches"
        />
      </div>

      {/* Basketball Banner */}
      <div className="px-4 pb-4">
        <div className="w-full h-40 rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 flex items-center justify-center overflow-hidden">
          <div className="text-center text-white px-6">
            <span className="text-6xl mb-2 block">🏀</span>
            <h2 className="text-2xl font-bold mb-1">NBA Season 2026</h2>
            <p className="text-sm opacity-90">Premium Court Experience</p>
          </div>
        </div>
      </div>

      {/* Basketball Section Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏀</span>
          <h2 className="text-lg font-semibold text-gray-900">Basketball</h2>
        </div>
      </div>

      {/* Match Cards */}
      <div className="px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No matches found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <BasketballCard
              key={event.id}
              id={event.id}
              team1={event.team1}
              team2={event.team2}
              date={event.date}
              venue={event.venue}
              price={event.price}
            />
          ))
        )}
      </div>
    </main>
  );
}
