'use client';

import { useState, useEffect } from 'react';
import { Users, Package, Calendar, ShoppingCart } from 'lucide-react';

interface Stats {
  users: number;
  products: number;
  events: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users ?? 0,
      icon: Users,
      bgColor: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: stats?.products ?? 0,
      icon: Package,
      bgColor: 'bg-green-500',
      link: '/admin/products',
    },
    {
      title: 'Total Events',
      value: stats?.events ?? 0,
      icon: Calendar,
      bgColor: 'bg-purple-500',
      link: '/admin/events',
    },
    {
      title: 'Total Orders',
      value: stats?.orders ?? 0,
      icon: ShoppingCart,
      bgColor: 'bg-orange-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Links Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-5 h-5 text-gray-600 mr-3" />
            <span className="font-medium text-gray-700">Manage Products</span>
          </a>
          <a
            href="/admin/events"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600 mr-3" />
            <span className="font-medium text-gray-700">Manage Events</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-600 mr-3" />
            <span className="font-medium text-gray-700">View Users</span>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600 mr-3" />
            <span className="font-medium text-gray-700">View Orders</span>
          </a>
        </div>
      </div>
    </div>
  );
}
