'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import Image from 'next/image';

interface Listing {
  id: string;
  referenceNumber: string;
  itemName: string;
  itemImageUrl: string;
  askPrice: number;
  quantity: number;
  status: string;
  listedAt: string;
  soldAt: string | null;
  cancelledAt: string | null;
  seller: {
    email: string | null;
    name: string | null;
  };
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/admin/listings' 
        : `/api/admin/listings?status=${statusFilter}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError('Failed to load listings');
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted-100 text-muted-800';
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'pending_sale':
        return 'bg-warning-100 text-warning-800';
      case 'sold':
        return 'bg-info-100 text-info-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      case 'expired':
        return 'bg-surface-100 text-muted-600';
      default:
        return 'bg-surface-100 text-muted-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-error-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-muted-900">Listings Management</h1>
          <p className="text-muted-600 mt-2">View all user-created listings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-card">
          <Tag className="w-5 h-5" />
          <span className="font-semibold">{listings.length} Listings</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-muted-700">Status Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-muted-300 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="pending_sale">Pending Sale</option>
          <option value="sold">Sold</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-muted-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Ask Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Listed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Sold/Cancelled
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-200">
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-500">
                    No listings found.
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-muted-900">
                        {listing.referenceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {listing.seller.email || listing.seller.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {listing.itemImageUrl && (
                          <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                            <Image
                              src={listing.itemImageUrl}
                              alt={listing.itemName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="font-medium text-muted-900">
                          {listing.itemName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      <div className="font-semibold">
                        ${listing.askPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {listing.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                        {formatStatus(listing.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-700 text-sm">
                      {formatDate(listing.listedAt)}
                    </td>
                    <td className="px-6 py-4 text-muted-700 text-sm">
                      {formatDate(listing.soldAt || listing.cancelledAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
