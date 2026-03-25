'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { MatchCardSkeleton } from '@/components/ui/Skeleton';

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
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showForSaleDialog, setShowForSaleDialog] = useState(false);
  const [eventId, setEventId] = useState<string>('');

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

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    setShowPurchaseDialog(true);
  };

  const handleForSale = () => {
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900 truncate">
            Event Details
          </h1>
        </div>
      </div>

      {/* Event Banner/Image */}
      {event.type === 'concert' && event.artistImageUrl ? (
        <div className="w-full aspect-square bg-gray-100">
          <Image
            src={event.artistImageUrl}
            alt={event.artistName || event.title}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <div className="text-center text-white">
            {event.type === 'football' || event.type === 'basketball' ? (
              <div className="flex items-center gap-4 text-4xl">
                {event.team1Flag && <span>{event.team1Flag}</span>}
                <span className="text-2xl font-bold">VS</span>
                {event.team2Flag && <span>{event.team2Flag}</span>}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Event Information */}
      <div className="px-4 py-4">
        {/* Event Title / Team Names */}
        {event.type === 'football' || event.type === 'basketball' ? (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {event.team1Flag && <span className="text-3xl">{event.team1Flag}</span>}
              <h2 className="text-xl font-bold text-gray-900">{event.team1}</h2>
              <span className="text-gray-400 font-bold mx-2">VS</span>
              <h2 className="text-xl font-bold text-gray-900">{event.team2}</h2>
              {event.team2Flag && <span className="text-3xl">{event.team2Flag}</span>}
            </div>
            <p className="text-center text-sm text-gray-600">{event.title}</p>
          </div>
        ) : (
          <div className="mb-4">
            {event.artistName && (
              <p className="text-sm font-semibold text-accent-500 mb-1">{event.artistName}</p>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          </div>
        )}

        {/* Date and Time */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="text-gray-700">
            <span className="font-medium">{formatDate(event.date)}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(event.date)}</span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-400" />
          <p className="text-gray-700">{event.venue}</p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
          <p className="text-3xl font-bold text-primary-500">${event.price.toFixed(2)}</p>
        </div>

        {/* Remaining Quantity */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Remaining Quantity</p>
          <p className="text-lg font-semibold text-gray-900">{event.remainingQty} tickets</p>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this Event</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-20 z-20">
        <div className="flex gap-3">
          {/* For Sale Button - Outline Style */}
          <button
            onClick={handleForSale}
            className="flex-1 px-6 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            For sale
          </button>

          {/* Purchase Button - Gradient Style */}
          <button
            onClick={handlePurchase}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      {showPurchaseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Success</h3>
            <p className="text-gray-700 mb-6 text-center">
              Purchase request submitted successfully
            </p>
            <button
              onClick={closePurchaseDialog}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* For Sale Confirmation Dialog */}
      {showForSaleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Success</h3>
            <p className="text-gray-700 mb-6 text-center">
              Listing request submitted successfully
            </p>
            <button
              onClick={closeForSaleDialog}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
