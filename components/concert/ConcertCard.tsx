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

  return (
    <Link href={`/events/${id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Artist Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={artistImageUrl}
              alt={artistName}
              fill
              className="object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            {/* Artist Name */}
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-semibold text-gray-900">{artistName}</span>
            </div>

            {/* Event Title */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
              {title}
            </h3>

            {/* Date */}
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formatDate(date)}</span>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{venue}</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-500">
                {formatPrice(price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
