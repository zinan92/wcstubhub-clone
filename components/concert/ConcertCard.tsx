'use client';

import Image from 'next/image';
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
  artistImageUrl,
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

  // Use placeholder if artistImageUrl is empty
  const imageSrc = artistImageUrl || 'https://picsum.photos/seed/concert/400/400';

  return (
    <Link href={`/events/${id}`}>
      <div className="relative bg-white rounded-xl shadow-card overflow-hidden mb-4 hover:shadow-elevated transition-all">
        {/* Full-width Artist Image with Gradient Overlay */}
        <div className="relative w-full h-40">
          <Image
            src={imageSrc}
            alt={artistName}
            fill
            className="object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Artist info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-4 h-4 text-white/90" />
              <span className="text-sm font-semibold">{artistName}</span>
            </div>
            <h3 className="text-lg font-bold line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-4">
          {/* Date */}
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-accent-500" />
            <span className="text-sm text-gray-700 font-medium">{formatDate(date)}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span className="text-sm text-gray-700 font-medium line-clamp-1">{venue}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-500">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Concert</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
