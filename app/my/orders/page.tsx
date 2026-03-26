'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import Image from 'next/image';
import EmptyState from '@/components/ui/EmptyState';

interface Order {
  id: string;
  userId: string;
  itemType: 'product' | 'event';
  itemId: string;
  itemName: string;
  itemImageUrl: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  sharesHeld: number;
  status: 'paid' | 'to_be_paid';
  orderNumber: string;
  transactionTime: string;
  createdAt: string;
}

type TabType = 'purchase' | 'sale';

export default function OrderRecordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('purchase');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/orders?type=${activeTab}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [session, activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'paid') {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
        To be paid
      </span>
    );
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
          <h1 className="text-xl font-bold text-muted-900">Order Records</h1>
        </div>

        {/* Tabs with pill indicator */}
        <div className="flex px-4 pb-1 gap-2">
          <button
            onClick={() => handleTabChange('purchase')}
            className={`flex-1 py-2.5 text-center font-semibold transition-all rounded-lg ${
              activeTab === 'purchase'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-muted-600 hover:bg-surface-100'
            }`}
          >
            Purchase
          </button>
          <button
            onClick={() => handleTabChange('sale')}
            className={`flex-1 py-2.5 text-center font-semibold transition-all rounded-lg ${
              activeTab === 'sale'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-muted-600 hover:bg-surface-100'
            }`}
          >
            For Sale
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-500">Loading...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-card overflow-hidden"
              >
                {/* Order Content */}
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Item Thumbnail - prominent */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-100 relative shadow-sm">
                      {order.itemImageUrl ? (
                        <Image
                          src={order.itemImageUrl}
                          alt={order.itemName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-200 flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Status Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-muted-900 line-clamp-2 flex-1">
                          {order.itemName}
                        </h3>
                        {getStatusLabel(order.status)}
                      </div>
                      
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-600">Price:</span>
                          <span className="font-bold text-primary-600">
                            {formatCurrency(order.purchasePrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-600">Quantity:</span>
                          <span className="text-muted-900 font-medium">{order.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-600">Current:</span>
                          <span className="font-semibold text-accent-600">
                            {formatCurrency(order.currentPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-muted-100 space-y-1.5 text-xs text-muted-600">
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="text-muted-900 font-mono">
                        {formatDateTime(order.transactionTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Order #:</span>
                      <span className="text-muted-900 font-mono">
                        {order.orderNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <EmptyState
            icon={Package}
            heading="No orders yet"
            subtext="Your orders will appear here"
          />
        )}
      </div>
    </main>
  );
}
