'use client';

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import SearchBar from '@/components/goods/SearchBar';
import MatchCard from '@/components/football/MatchCard';

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
}

export default function FootballPage() {
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FootballEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch football events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?type=football');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching football events:', error);
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

      {/* World Cup Banner */}
      <div className="px-4 pb-4">
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src="https://picsum.photos/seed/worldcup/800/320"
            alt="World Cup"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Football Section Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#0066FF]" />
          <h2 className="text-lg font-semibold text-gray-900">Football</h2>
        </div>
      </div>

      {/* Match Cards */}
      <div className="px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No matches found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <MatchCard
              key={event.id}
              id={event.id}
              team1={event.team1}
              team2={event.team2}
              team1Flag={event.team1Flag}
              team2Flag={event.team2Flag}
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
