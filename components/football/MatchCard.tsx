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
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl shadow-card p-6 mb-4 hover:shadow-elevated transition-all active:scale-[0.98] overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-100/30 to-primary-100/30 rounded-full blur-2xl -z-0"></div>
        
        {/* Content with proper z-index */}
        <div className="relative z-10">
          {/* Teams with prominent flags in VS layout */}
          <div className="flex items-center justify-between mb-5">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <span className="text-6xl drop-shadow-sm">{team1Flag}</span>
              <span className="font-bold text-gray-900 text-center text-sm leading-tight px-2">{team1}</span>
            </div>
            
            {/* VS Badge */}
            <div className="px-5">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-sm px-4 py-2 rounded-full shadow-soft">
                VS
              </div>
            </div>
            
            {/* Team 2 */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <span className="text-6xl drop-shadow-sm">{team2Flag}</span>
              <span className="font-bold text-gray-900 text-center text-sm leading-tight px-2">{team2}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 mb-4"></div>

          {/* Date and Time */}
          <div className="text-sm text-gray-700 mb-2 text-center font-medium">
            <span>{formattedDate}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Venue */}
          <div className="text-sm text-gray-600 mb-4 text-center">
            📍 {venue}
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-primary-600 text-center">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}
