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
import { useToast } from '@/components/ui/Toast';

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
  const { showToast } = useToast();
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
    showToast('Logged out successfully', 'info');
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
    <main className="min-h-screen bg-surface-50 pb-20">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-4 pt-6 pb-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar - min 64px, border-radius-full */}
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 relative border-4 border-white/30 shadow-lg">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <DefaultAvatar className="w-20 h-20" />
              )}
            </div>
            
            <div className="text-white">
              <p className="text-sm opacity-90 font-medium">Account</p>
              <p className="font-semibold text-base">{profile.email}</p>
            </div>
          </div>

          {/* VIP Badge */}
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
            <p className="text-white text-sm font-semibold">VIP {profile.vipLevel}</p>
          </div>
        </div>

        {/* Invite Code & Credit Points */}
        <div className="flex gap-6 text-white text-sm">
          <div>
            <p className="opacity-80 mb-1">Invite code</p>
            <p className="font-semibold text-base">{profile.inviteCode || 'N/A'}</p>
          </div>
          <div>
            <p className="opacity-80 mb-1">Credit points</p>
            <p className="font-semibold text-base">{profile.creditPoints}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards with shadows */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="grid grid-cols-3 divide-x divide-muted-200">
            <div className="text-center px-2">
              <p className="text-xs text-muted-500 mb-1.5 font-medium">Balance</p>
              <p className="text-lg font-bold text-primary-600">{formatCurrency(profile.balance)}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xs text-muted-500 mb-1.5 font-medium">Shares</p>
              <p className="text-lg font-bold text-primary-600">{profile.sharesHeld}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xs text-muted-500 mb-1.5 font-medium">Points</p>
              <p className="text-lg font-bold text-primary-600">{profile.integrationPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List - with consistent padding, dividers */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
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
                    staggerChildren: 0.025,
                  },
                },
              }}
            >
              {menuItems.map((item, index) => (
                <m.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.2 },
                    },
                  }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-4 hover:bg-surface-50 active:bg-surface-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-${item.color.replace('text-', '')}-100 flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="text-muted-900 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-400" />
                  </Link>
                  {/* Divider between items */}
                  {index < menuItems.length - 1 && (
                    <div className="mx-4 border-t border-muted-200" />
                  )}
                </m.div>
              ))}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-error-500 hover:bg-error-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-soft transition-all active:scale-[0.98]"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
