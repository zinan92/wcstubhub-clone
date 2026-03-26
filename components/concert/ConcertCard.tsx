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

        {/* Gradient header section with artist info */}
        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6 text-white">
          {/* Large music icon */}
          <div className="flex justify-center mb-3">
            <div className="text-6xl">🎵</div>
          </div>

          {/* Artist name */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Music className="w-4 h-4" />
            <span className="text-sm font-semibold">{artistName}</span>
          </div>

          {/* Tour title */}
          <h3 className="text-lg font-bold text-center line-clamp-2 mb-1">
            {title}
          </h3>
        </div>

        {/* Event Details */}
        <div className="p-4 bg-white/80 backdrop-blur-sm">
          {/* Date */}
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-700 font-medium">{formatDate(date)}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-700 font-medium line-clamp-1">{venue}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full font-medium">Concert</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
