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
      <div className="bg-white rounded-xl shadow-card p-5 mb-4 hover:shadow-elevated transition-all active:scale-[0.98]">
        {/* Teams with prominent flags in VS layout */}
        <div className="flex items-center justify-between mb-4">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl">{team1Flag}</span>
            <span className="font-bold text-gray-900 text-center text-sm">{team1}</span>
          </div>
          
          {/* VS Badge */}
          <div className="px-4">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-xs px-3 py-1.5 rounded-full">
              VS
            </div>
          </div>
          
          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl">{team2Flag}</span>
            <span className="font-bold text-gray-900 text-center text-sm">{team2}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100 mb-3"></div>

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
        <div className="text-xl font-bold text-primary-500 text-center">
          ${price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
