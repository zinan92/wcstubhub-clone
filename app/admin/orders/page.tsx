'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Order {
  id: string;
  orderNumber: string;
  itemName: string;
  itemImageUrl: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  status: 'to_be_paid' | 'paid';
  transactionTime: string;
  user: {
    email: string | null;
    name: string | null;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${statusFilter}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
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
    return status === 'to_be_paid' ? 'To be paid' : 'Paid';
  };

  const getTotalPrice = (order: Order) => {
    return order.purchasePrice * order.quantity;
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
          <h1 className="text-3xl font-bold text-muted-900">Order Management</h1>
          <p className="text-muted-600 mt-2">View all customer orders</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-card">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{orders.length} Orders</span>
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
          <option value="to_be_paid">To be paid</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-muted-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-muted-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {order.user.email || order.user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {order.itemImageUrl && (
                          <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                            <Image
                              src={order.itemImageUrl}
                              alt={order.itemName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="font-medium text-muted-900">
                          {order.itemName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      <div className="font-semibold">
                        ${getTotalPrice(order).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-500">
                        ${order.purchasePrice.toFixed(2)} each
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-700">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'paid' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-700 text-sm">
                      {formatDate(order.transactionTime)}
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
