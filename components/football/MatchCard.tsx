import Link from 'next/link';

interface MatchCardProps {
  id: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  date: string;
  venue: string;
  price: number;
}

export default function MatchCard({
  id,
  team1,
  team2,
  team1Flag,
  team2Flag,
  date,
  venue,
  price,
}: MatchCardProps) {
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
        {/* Teams with flags */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{team1Flag}</span>
            <span className="font-semibold text-gray-900">{team1}</span>
          </div>
          
          <span className="text-gray-400 font-bold mx-3">VS</span>
          
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="font-semibold text-gray-900 text-right">{team2}</span>
            <span className="text-2xl">{team2Flag}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-600 mb-2">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Venue */}
        <div className="text-sm text-gray-600 mb-3">
          📍 {venue}
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-[#0066FF]">
          ${price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
