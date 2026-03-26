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
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 rounded-xl shadow-card p-6 mb-4 hover:shadow-elevated transition-all overflow-hidden active:scale-[0.98] border border-orange-500/20">
        {/* Basketball decorative elements with glow effect */}
        <div className="absolute top-3 right-3 text-6xl opacity-20 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">🏀</div>
        <div className="absolute bottom-3 left-3 text-5xl opacity-15 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">🏀</div>
        
        {/* Subtle glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
        
        {/* Teams with basketball dark theme */}
        <div className="relative flex items-center justify-between mb-5 z-10">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="text-lg font-bold text-white text-center leading-tight px-2">{team1}</div>
            <div className="w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
          </div>
          
          {/* VS Badge */}
          <div className="px-5">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-4 py-2 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.6)]">
              VS
            </div>
          </div>
          
          {/* Team 2 */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="text-lg font-bold text-white text-center leading-tight px-2">{team2}</div>
            <div className="w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
          </div>
        </div>

        {/* Court graphic - basketball hoop icon */}
        <div className="flex justify-center mb-4 relative z-10">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-full border-2 border-orange-400 flex items-center justify-center bg-orange-500/10 shadow-[0_0_8px_rgba(249,115,22,0.3)]">
              <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_4px_rgba(249,115,22,0.8)]"></div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-orange-500/20 mb-4 relative z-10"></div>

        {/* Date and Time */}
        <div className="text-sm text-orange-100 mb-2 text-center font-medium relative z-10">
          <span>{formattedDate}</span>
          <span className="mx-2 text-orange-300">•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Venue */}
        <div className="text-sm text-orange-200/90 mb-4 text-center relative z-10">
          📍 {venue}
        </div>

        {/* Price */}
        <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent text-center relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          ${price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
