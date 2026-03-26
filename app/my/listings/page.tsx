'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import Image from 'next/image';
import EmptyState from '@/components/ui/EmptyState';
import { BuyerProtection } from '@/components/trust';

interface Listing {
  id: string;
  itemType: 'product' | 'event';
  itemId: string;
  itemName: string;
  itemImageUrl: string;
  askPrice: number;
  quantity: number;
  status: string;
  referenceNumber: string;
  listedAt: string;
  soldAt?: string | null;
  cancelledAt?: string | null;
}

export default function MyListingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null);
        const response = await fetch('/api/user/listings');
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        } else {
          setError('Failed to load listings. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Unable to connect. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchListings();
    }
  }, [session]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      active: { label: 'Active', className: 'bg-green-100 text-green-700' },
      pending_sale: { label: 'Pending Sale', className: 'bg-yellow-100 text-yellow-700' },
      sold: { label: 'Sold', className: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
      expired: { label: 'Expired', className: 'bg-gray-100 text-gray-600' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
          <h1 className="text-xl font-bold text-muted-900">My Listings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">Unable to Load Listings</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-soft animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <>
            <EmptyState
              icon={Tag}
              heading="No listings yet"
              subtext="Items you list for sale will appear here"
            />
            <div className="mt-6">
              <BuyerProtection variant="compact" />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Listing Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={listing.itemImageUrl}
                          alt={listing.itemName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Listing Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                          {listing.itemName}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(listing.status)}
                          <span className="text-xs text-gray-500">
                            {listing.itemType === 'event' ? 'Event' : 'Product'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold text-primary-600">
                            ${listing.askPrice.toFixed(2)}
                          </p>
                          <span className="text-sm text-gray-500">× {listing.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Listing Metadata */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ref #</span>
                        <span className="text-gray-900 font-medium">{listing.referenceNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Listed</span>
                        <span className="text-gray-900">{formatDate(listing.listedAt)}</span>
                      </div>
                      {listing.soldAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sold</span>
                          <span className="text-gray-900">{formatDate(listing.soldAt)}</span>
                        </div>
                      )}
                      {listing.cancelledAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Cancelled</span>
                          <span className="text-gray-900">{formatDate(listing.cancelledAt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Value</span>
                        <span className="text-gray-900 font-semibold">
                          ${(listing.askPrice * listing.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Messaging */}
            <div className="mt-6">
              <BuyerProtection variant="compact" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
