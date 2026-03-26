'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import {
  User,
  CreditCard,
  ShieldCheck,
  Bell,
  Star,
  Building2,
  Languages,
  ChevronRight,
  FileText,
} from 'lucide-react';
import DefaultAvatar from '@/components/ui/DefaultAvatar';

interface UserProfile {
  id: string;
  email: string | null;
  vipLevel: number;
  inviteCode: string | null;
  creditPoints: number;
  balance: number;
  sharesHeld: number;
  integrationPoints: number;
  avatarUrl: string | null;
}

export default function MyPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const menuItems = [
    { label: 'Order record', href: '/my/orders', icon: FileText, color: 'text-blue-500' },
    { label: 'Personal information', href: '/my/personal', icon: User, color: 'text-green-500' },
    { label: 'Bank card binding', href: '/my/bank-card', icon: CreditCard, color: 'text-purple-500' },
    { label: 'Security center', href: '/my/security', icon: ShieldCheck, color: 'text-red-500' },
    { label: 'Notification', href: '/my/notification', icon: Bell, color: 'text-yellow-500' },
    { label: 'VIP', href: '/my/vip', icon: Star, color: 'text-amber-500' },
    { label: 'Company Profile', href: '/my/company', icon: Building2, color: 'text-cyan-500' },
    { label: 'Language', href: '/my/language', icon: Languages, color: 'text-indigo-500' },
  ];

  const skeletonContent = (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="animate-pulse">
        <div className="h-48 bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="p-4 space-y-4">
          <div className="h-24 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  if (loading) {
    return skeletonContent;
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 p-4">
        <p className="text-gray-600">Failed to load profile</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Blue Gradient Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 px-4 pt-6 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <DefaultAvatar className="w-16 h-16" />
              )}
            </div>
            
            <div className="text-white">
              <p className="text-sm opacity-90">Account</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          {/* VIP Badge */}
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <p className="text-white text-sm font-medium">VIP:{profile.vipLevel}</p>
          </div>
        </div>

        {/* Invite Code & Credit Points */}
        <div className="flex gap-4 text-white text-sm">
          <div>
            <p className="opacity-80">Invite code</p>
            <p className="font-medium">{profile.inviteCode || 'N/A'}</p>
          </div>
          <div>
            <p className="opacity-80">Credit points</p>
            <p className="font-medium">{profile.creditPoints}</p>
          </div>
        </div>
      </div>

      {/* Balance Dashboard */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Available balance</p>
              <p className="text-base font-semibold text-gray-900">{formatCurrency(profile.balance)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Shares held</p>
              <p className="text-base font-semibold text-gray-900">{profile.sharesHeld}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Integration points</p>
              <p className="text-base font-semibold text-gray-900">{profile.integrationPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-2">
        <AnimatePresence mode="wait">
          <m.div
            key="menu"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.03,
                },
              },
            }}
            className="space-y-2"
          >
            {menuItems.map((item) => (
              <m.div
                key={item.label}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.2 },
                  },
                }}
              >
                <Link
                  href={item.href}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                      <span className="text-gray-900 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </m.div>
            ))}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all active:scale-[0.98]"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
