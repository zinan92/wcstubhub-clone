'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { MatchCardSkeleton } from '@/components/ui/Skeleton';
import AnimatedModal from '@/components/ui/AnimatedModal';
import Button from '@/components/ui/Button';
import { BuyerProtection, TrustBadgesGroup, TrustMessaging } from '@/components/trust';

interface Event {
  id: string;
  title: string;
  type: 'football' | 'basketball' | 'concert';
  team1?: string;
  team2?: string;
  team1Flag?: string;
  team2Flag?: string;
  artistName?: string;
  artistImageUrl?: string;
  date: string;
  venue: string;
  price: number;
  remainingQty: number;
  description?: string;
  isOfficial: boolean;
  isBuyerProtected: boolean;
  hasSecureDelivery: boolean;
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showForSaleDialog, setShowForSaleDialog] = useState(false);
  const [eventId, setEventId] = useState<string>('');
  const [intentHandled, setIntentHandled] = useState(false);

  useEffect(() => {
    const initParams = async () => {
      const { id } = await params;
      setEventId(id);
    };
    initParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          console.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Handle transaction intent after login
  useEffect(() => {
    if (status === 'authenticated' && !intentHandled && eventId) {
      const action = searchParams.get('action');
      if (action === 'purchase') {
        setShowPurchaseDialog(true);
        setIntentHandled(true);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        router.replace(url.pathname + url.search);
      } else if (action === 'forsale') {
        setShowForSaleDialog(true);
        setIntentHandled(true);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        router.replace(url.pathname + url.search);
      }
    }
  }, [status, searchParams, intentHandled, eventId, router]);

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    if (status !== 'authenticated') {
      // Redirect to login with callback URL and purchase intent
      router.push(`/login?callbackUrl=${encodeURIComponent(`/events/${eventId}?action=purchase`)}`);
      return;
    }
    setShowPurchaseDialog(true);
  };

  const handleForSale = () => {
    if (status !== 'authenticated') {
      // Redirect to login with callback URL and listing intent
      router.push(`/login?callbackUrl=${encodeURIComponent(`/events/${eventId}?action=forsale`)}`);
      return;
    }
    setShowForSaleDialog(true);
  };

  const closePurchaseDialog = () => {
    setShowPurchaseDialog(false);
  };

  const closeForSaleDialog = () => {
    setShowForSaleDialog(false);
  };

  const formatDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="px-4 pt-16">
          <MatchCardSkeleton />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden max-w-full">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 max-w-full">
        <div className="px-4 py-3 flex items-center max-w-full">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900 truncate min-w-0">
            Event Details
          </h1>
        </div>
      </div>

      {/* Event Banner/Image - Full-width at top with max-w-full to prevent overflow */}
      <div className="w-full max-w-full overflow-hidden">
        {event.type === 'concert' && event.artistImageUrl ? (
          <div className="w-full h-[40vh] bg-gray-100 relative overflow-hidden">
            <Image
              src={event.artistImageUrl}
              alt={event.artistName || event.title}
              fill
              className="object-cover"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        ) : event.type === 'concert' ? (
          <div className="w-full h-[40vh] bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-white px-6">
              <div className="text-6xl mb-4">🎵</div>
              <h2 className="text-2xl font-bold mb-2">{event.artistName || 'Concert'}</h2>
              <p className="text-sm opacity-90">Live Performance</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[35vh] bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
            <div className="text-center text-white px-4">
              {event.type === 'football' || event.type === 'basketball' ? (
                <div className="flex items-center gap-6 text-5xl flex-wrap justify-center">
                  {event.team1Flag && <span>{event.team1Flag}</span>}
                  <span className="text-3xl font-bold">VS</span>
                  {event.team2Flag && <span>{event.team2Flag}</span>}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Event Information */}
      <div className="px-4 py-6 max-w-full overflow-hidden">
        {/* Event Title / Team Names - PROMINENT hierarchy */}
        {event.type === 'football' || event.type === 'basketball' ? (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 flex-wrap">
              {event.team1Flag && <span className="text-3xl sm:text-4xl">{event.team1Flag}</span>}
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center">{event.team1}</h2>
              <span className="text-gray-400 font-bold text-lg sm:text-xl mx-1 sm:mx-2">VS</span>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center">{event.team2}</h2>
              {event.team2Flag && <span className="text-3xl sm:text-4xl">{event.team2Flag}</span>}
            </div>
            <p className="text-center text-base text-gray-600 font-medium">{event.title}</p>
          </div>
        ) : (
          <div className="mb-6">
            {event.artistName && (
              <p className="text-base font-semibold text-accent-500 mb-2">{event.artistName}</p>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{event.title}</h2>
          </div>
        )}

        {/* Date and Time - SECONDARY hierarchy */}
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <span className="font-medium">{formatDate(event.date)}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(event.date)}</span>
          </div>
        </div>

        {/* Venue - SECONDARY hierarchy */}
        <div className="flex items-center gap-2 mb-6 text-gray-600">
          <MapPin className="w-5 h-5 text-gray-400" />
          <p>{event.venue}</p>
        </div>

        {/* Price - ACCENT color, prominent */}
        <div className="mb-5">
          <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
          <p className="text-4xl font-bold text-accent-500">${event.price.toFixed(2)}</p>
        </div>

        {/* Remaining Quantity - Styled as badge */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Availability</p>
          <span className="inline-flex items-center px-3 py-1.5 bg-success-50 text-success-700 text-sm font-semibold rounded-full">
            {event.remainingQty} tickets remaining
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this Event</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {event.description}
            </p>
          </div>
        )}

        {/* Trust Badges - Conditionally rendered */}
        {(event.isOfficial || event.isBuyerProtected || event.hasSecureDelivery) && (
          <div className="mb-6">
            <TrustBadgesGroup 
              badges={[
                ...(event.isOfficial ? ['official' as const] : []),
                ...(event.isBuyerProtected ? ['buyer-protected' as const] : []),
                ...(event.hasSecureDelivery ? ['secure-delivery' as const] : []),
              ]} 
              size="sm" 
            />
          </div>
        )}

        {/* Buyer Protection - Compact */}
        <div className="mb-6">
          <BuyerProtection variant="compact" />
        </div>

        {/* Trust Messaging near CTA */}
        <div className="mb-24 space-y-3">
          <TrustMessaging variant="guarantee" />
          <TrustMessaging variant="support" />
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom, consistent with product detail */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-20 z-20 max-w-full">
        <div className="flex gap-3 max-w-full">
          {/* For Sale Button - Using shared Button component */}
          <Button
            onClick={handleForSale}
            variant="outline"
            size="lg"
            className="flex-1 min-h-[44px] min-w-0"
          >
            For sale
          </Button>

          {/* Purchase Button - Using shared Button component */}
          <Button
            onClick={handlePurchase}
            variant="primary"
            size="lg"
            className="flex-1 min-h-[44px] min-w-0"
          >
            Purchase
          </Button>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      <AnimatedModal isOpen={showPurchaseDialog} onClose={closePurchaseDialog}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Success</h3>
          <p className="text-gray-700 mb-6 text-center">
            Purchase request submitted successfully
          </p>
          <Button
            onClick={closePurchaseDialog}
            variant="primary"
            size="lg"
            className="w-full min-h-[44px]"
          >
            OK
          </Button>
        </div>
      </AnimatedModal>

      {/* For Sale Confirmation Dialog */}
      <AnimatedModal isOpen={showForSaleDialog} onClose={closeForSaleDialog}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Success</h3>
          <p className="text-gray-700 mb-6 text-center">
            Listing request submitted successfully
          </p>
          <Button
            onClick={closeForSaleDialog}
            variant="primary"
            size="lg"
            className="w-full min-h-[44px]"
          >
            OK
          </Button>
        </div>
      </AnimatedModal>
    </div>
  );
}
