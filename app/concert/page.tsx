'use client';

import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import Image from 'next/image';
import SearchBar from '@/components/goods/SearchBar';
import ConcertCard from '@/components/concert/ConcertCard';
import { MatchCardSkeleton } from '@/components/ui/Skeleton';

interface ConcertEvent {
  id: string;
  title: string;
  type: string;
  artistName: string;
  artistImageUrl: string;
  date: string;
  venue: string;
  price: number;
}

export default function ConcertPage() {
  const [events, setEvents] = useState<ConcertEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ConcertEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch concert events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?type=concert');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching concert events:', error);
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
          event.artistName?.toLowerCase().includes(query) ||
          event.title?.toLowerCase().includes(query)
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
          placeholder="Find a star or performance"
        />
      </div>

      {/* Concert Banner */}
      <div className="px-4 pb-4">
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src="https://picsum.photos/seed/concert/800/320"
            alt="Concert"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Concert Section Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Concert</h2>
        </div>
      </div>

      {/* Concert Cards */}
      <div className="px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No concerts found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <ConcertCard
              key={event.id}
              id={event.id}
              artistName={event.artistName}
              title={event.title}
              artistImageUrl={event.artistImageUrl}
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
