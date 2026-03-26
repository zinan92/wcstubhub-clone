'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { BuyerProtection, TrustMessaging } from '@/components/trust';

export default function MyTicketsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-muted-200 sticky top-0 z-10 shadow-soft">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-surface-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-muted-700" />
          </button>
          <h1 className="text-xl font-bold text-muted-900">My Tickets</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Empty State - Placeholder for future implementation */}
        <EmptyState
          icon={Ticket}
          heading="No tickets yet"
          subtext="Your purchased tickets will appear here"
        />

        {/* Trust and Support Messaging */}
        <div className="mt-6 space-y-4">
          <BuyerProtection variant="compact" />
        </div>
      </div>
    </main>
  );
}
