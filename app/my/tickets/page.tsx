'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Ticket } from 'lucide-react';
import Image from 'next/image';
import EmptyState from '@/components/ui/EmptyState';
import { BuyerProtection } from '@/components/trust';

interface OwnedAsset {
  id: string;
  itemType: 'product' | 'event';
  itemId: string;
  itemName: string;
  itemImageUrl: string;
  purchasePrice: number;
  quantity: number;
  quantityAvailable: number;
  status: string;
  referenceNumber: string;
  purchasedAt: string;
  deliveredAt?: string | null;
}

export default function MyTicketsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [ownedAssets, setOwnedAssets] = useState<OwnedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnedAssets = async () => {
      try {
        setError(null);
        const response = await fetch('/api/user/owned-assets');
        if (response.ok) {
          const data = await response.json();
          setOwnedAssets(data);
        } else {
          setError('Failed to load tickets. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching owned assets:', error);
        setError('Unable to connect. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOwnedAssets();
    }
  }, [session]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
      delivered: { label: 'Delivered', className: 'bg-blue-100 text-blue-700' },
      listed: { label: 'Listed for Sale', className: 'bg-purple-100 text-purple-700' },
      sold: { label: 'Sold', className: 'bg-gray-100 text-gray-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
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
          <h1 className="text-xl font-bold text-muted-900">My Tickets</h1>
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
            <h3 className="text-lg font-semibold text-red-900 mb-1">Unable to Load Tickets</h3>
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
        ) : ownedAssets.length === 0 ? (
          <>
            <EmptyState
              icon={Ticket}
              heading="No tickets yet"
              subtext="Your purchased tickets will appear here"
            />
            <div className="mt-6">
              <BuyerProtection variant="compact" />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {ownedAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Asset Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={asset.itemImageUrl}
                          alt={asset.itemName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Asset Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                          {asset.itemName}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(asset.status)}
                          <span className="text-xs text-gray-500">
                            {asset.itemType === 'event' ? 'Event' : 'Product'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold text-primary-600">
                            ${asset.purchasePrice.toFixed(2)}
                          </p>
                          <span className="text-sm text-gray-500">× {asset.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Asset Metadata */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ref #</span>
                        <span className="text-gray-900 font-medium">{asset.referenceNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Purchased</span>
                        <span className="text-gray-900">{formatDate(asset.purchasedAt)}</span>
                      </div>
                      {asset.deliveredAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Delivered</span>
                          <span className="text-gray-900">{formatDate(asset.deliveredAt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Quantity</span>
                        <span className="text-gray-900">
                          {asset.quantityAvailable} of {asset.quantity} available
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Paid</span>
                        <span className="text-gray-900 font-semibold">
                          ${(asset.purchasePrice * asset.quantity).toFixed(2)}
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
