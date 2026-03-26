'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface OwnedAsset {
  id: string;
  referenceNumber: string;
  itemName: string;
  itemImageUrl: string;
  purchasePrice: number;
  quantity: number;
  quantityAvailable: number;
  status: string;
  purchasedAt: string;
  deliveredAt: string | null;
  user: {
    email: string | null;
    name: string | null;
  };
}

export default function AdminOwnedAssetsPage() {
  const [ownedAssets, setOwnedAssets] = useState<OwnedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOwnedAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchOwnedAssets = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/admin/owned-assets' 
        : `/api/admin/owned-assets?status=${statusFilter}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch owned assets');
      }
      
      const data = await response.json();
      setOwnedAssets(data);
    } catch (err) {
      setError('Failed to load owned assets');
      console.error('Error fetching owned assets:', err);
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
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'confirmed':
        return 'bg-info-100 text-info-800';
      case 'delivered':
        return 'bg-success-100 text-success-800';
      case 'listed':
        return 'bg-primary-100 text-primary-800';
      case 'sold':
        return 'bg-muted-100 text-muted-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
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
          <h1 className="text-3xl font-bold text-muted-900">Owned Assets Management</h1>
          <p className="text-muted-600 mt-2">View all user-owned tickets and items</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-card">
          <Package className="w-5 h-5" />
          <span className="font-semibold">{ownedAssets.length} Assets</span>
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="listed">Listed</option>
          <option value="sold">Sold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Owned Assets Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-muted-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Purchased
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Delivered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-200">
              {ownedAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-500">
                    No owned assets found.
                  </td>
                </tr>
              ) : (
                ownedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-muted-900">
                        {asset.referenceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {asset.user.email || asset.user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {asset.itemImageUrl && (
                          <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                            <Image
                              src={asset.itemImageUrl}
                              alt={asset.itemName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="font-medium text-muted-900">
                          {asset.itemName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      <div className="font-semibold">
                        ${asset.purchasePrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {asset.quantity}
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {asset.quantityAvailable}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {formatStatus(asset.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-700 text-sm">
                      {formatDate(asset.purchasedAt)}
                    </td>
                    <td className="px-6 py-4 text-muted-700 text-sm">
                      {formatDate(asset.deliveredAt)}
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
