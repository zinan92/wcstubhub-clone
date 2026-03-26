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
      <div className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-card p-5 mb-4 hover:shadow-elevated transition-all overflow-hidden">
        {/* Basketball decorative elements */}
        <div className="absolute top-2 right-2 text-6xl opacity-10">🏀</div>
        <div className="absolute bottom-2 left-2 text-4xl opacity-10">🏀</div>
        
        {/* Teams with basketball theme */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">{team1}</div>
              <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="px-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-full">
                VS
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">{team2}</div>
              <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Court graphic */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-700 mb-2 text-center font-medium">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Venue */}
        <div className="text-sm text-gray-700 mb-3 text-center font-medium">
          📍 {venue}
        </div>

        {/* Price */}
        <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-center">
          ${price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
