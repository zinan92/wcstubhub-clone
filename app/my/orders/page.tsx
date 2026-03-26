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
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Order</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('purchase')}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              activeTab === 'purchase'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Purchase
            {activeTab === 'purchase' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('sale')}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              activeTab === 'sale'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            For sale
            {activeTab === 'sale' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Badge */}
                <div className="px-4 pt-3 pb-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                    Purchase
                  </span>
                </div>

                {/* Order Content */}
                <div className="px-4 pb-4">
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                      {order.itemImageUrl ? (
                        <Image
                          src={order.itemImageUrl}
                          alt={order.itemName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {order.itemName}
                      </h3>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Purchase price:</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency(order.purchasePrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Purchase quantity:</span>
                          <span className="text-gray-900">{order.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current price:</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency(order.currentPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shares held:</span>
                          <span className="text-gray-900">{order.sharesHeld}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status:</span>
                      {getStatusLabel(order.status)}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transaction time:</span>
                      <span className="text-gray-900">
                        {formatDateTime(order.transactionTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order number:</span>
                      <span className="text-gray-900 font-mono">
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
