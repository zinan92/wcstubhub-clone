'use client';

import Link from 'next/link';
import { Calendar, MapPin, Music } from 'lucide-react';

interface ConcertCardProps {
  id: string;
  artistName: string;
  title: string;
  artistImageUrl: string;
  date: string;
  venue: string;
  price: number;
}

export default function ConcertCard({
  id,
  artistName,
  title,
  date,
  venue,
  price,
}: ConcertCardProps) {
  const formatDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <Link href={`/events/${id}`}>
      <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl shadow-card overflow-hidden mb-4 hover:shadow-elevated transition-all active:scale-[0.98]">
        {/* Music note decorative elements */}
        <div className="absolute top-2 right-2 text-6xl opacity-10">🎵</div>
        <div className="absolute bottom-2 left-2 text-5xl opacity-10">🎤</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-5 transform -rotate-12">🎸</div>

        {/* Gradient header section with artist info - enhanced for WCAG AA contrast */}
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-6 text-white">
          {/* Dark gradient overlay for better text contrast (WCAG AA: 4.5:1) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
          
          {/* Content with proper z-index */}
          <div className="relative z-10">
            {/* Large music icon */}
            <div className="flex justify-center mb-3">
              <div className="text-6xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">🎵</div>
            </div>

            {/* Artist name - prominent */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Music className="w-5 h-5 drop-shadow-sm" />
              <span className="text-base font-bold drop-shadow-sm">{artistName}</span>
            </div>

            {/* Tour title */}
            <h3 className="text-xl font-bold text-center line-clamp-2 mb-1 drop-shadow-sm leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-5 bg-white">
          {/* Date */}
          <div className="flex items-center gap-2 mb-2.5">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-800 font-medium">{formatDate(date)}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700 font-medium line-clamp-1">{venue}</span>
          </div>

          {/* Separator */}
          <div className="border-t border-purple-100 mb-4"></div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-full font-semibold shadow-soft">Concert</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
