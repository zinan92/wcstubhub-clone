import Link from 'next/link';

interface BasketballCardProps {
  id: string;
  team1: string;
  team2: string;
  date: string;
  venue: string;
  price: number;
}

export default function BasketballCard({
  id,
  team1,
  team2,
  date,
  venue,
  price,
}: BasketballCardProps) {
  // Format date
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/events/${id}`}>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
        {/* Teams with basketball icon */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{team1}</span>
            <span className="text-gray-400 font-bold mx-3">VS</span>
            <span className="font-semibold text-gray-900">{team2}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-600 mb-2 text-center">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Venue */}
        <div className="text-sm text-gray-600 mb-3 text-center">
          📍 {venue}
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-primary-500 text-center">
          ${price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
