'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Crown } from 'lucide-react';

interface VipTier {
  id: string;
  level: number;
  name: string;
  threshold: number;
}

interface UserProfile {
  vipLevel: number;
}

export default function VipUpgradeSystemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [vipTiers, setVipTiers] = useState<VipTier[]>([]);
  const [currentVipLevel, setCurrentVipLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch VIP tiers
        const tiersResponse = await fetch('/api/vip-tiers');
        if (tiersResponse.ok) {
          const tiersData = await tiersResponse.json();
          setVipTiers(tiersData);
        }

        // Fetch user profile for current VIP level
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const profileData: UserProfile = await profileResponse.json();
          setCurrentVipLevel(profileData.vipLevel);
        }
      } catch (error) {
        console.error('Failed to fetch VIP data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const formatThreshold = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toLocaleString('en-US')}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toLocaleString('en-US')}K`;
    }
    return `$${amount.toLocaleString('en-US')}`;
  };

  // Tier-specific visual treatments with metallic gradients
  const getTierStyle = (level: number, isCurrent: boolean) => {
    const tierStyles: Record<number, { gradient: string; iconBg: string; iconColor: string; border: string }> = {
      1: {
        gradient: 'from-gray-400 via-gray-300 to-gray-400',
        iconBg: 'bg-gradient-to-br from-gray-300 to-gray-400',
        iconColor: 'text-gray-700',
        border: 'border-gray-300'
      },
      2: {
        gradient: 'from-amber-600 via-amber-400 to-amber-600',
        iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        iconColor: 'text-amber-900',
        border: 'border-amber-400'
      },
      3: {
        gradient: 'from-slate-400 via-slate-200 to-slate-400',
        iconBg: 'bg-gradient-to-br from-slate-200 to-slate-400',
        iconColor: 'text-slate-700',
        border: 'border-slate-300'
      },
      4: {
        gradient: 'from-yellow-500 via-yellow-300 to-yellow-500',
        iconBg: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
        iconColor: 'text-yellow-900',
        border: 'border-yellow-400'
      },
      5: {
        gradient: 'from-cyan-500 via-cyan-300 to-cyan-500',
        iconBg: 'bg-gradient-to-br from-cyan-300 to-cyan-500',
        iconColor: 'text-cyan-900',
        border: 'border-cyan-400'
      },
      6: {
        gradient: 'from-purple-600 via-purple-400 to-purple-600',
        iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
        iconColor: 'text-purple-900',
        border: 'border-purple-400'
      },
      7: {
        gradient: 'from-pink-600 via-pink-400 to-pink-600',
        iconBg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        iconColor: 'text-pink-900',
        border: 'border-pink-400'
      },
      8: {
        gradient: 'from-indigo-700 via-purple-500 to-pink-500',
        iconBg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
        iconColor: 'text-white',
        border: 'border-purple-400'
      }
    };

    return tierStyles[level] || tierStyles[1];
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-50 pb-20">
        <div className="text-center py-12">
          <p className="text-muted-500">Loading...</p>
        </div>
      </main>
    );
  }

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
          <h1 className="text-xl font-bold text-muted-900">VIP Tiers</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {vipTiers.map((tier) => {
            const isCurrent = tier.level === currentVipLevel;
            const style = getTierStyle(tier.level, isCurrent);
            
            return (
              <div
                key={tier.id}
                className={`rounded-xl shadow-card overflow-hidden transition-all ${
                  isCurrent ? 'ring-4 ring-primary-500 ring-offset-2 scale-[1.02]' : ''
                }`}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${style.gradient} p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.iconBg} shadow-lg`}>
                      <Crown className={`w-7 h-7 ${style.iconColor}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white drop-shadow-md">
                          {tier.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/90 text-primary-600 shadow-sm">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/90 drop-shadow font-medium mt-0.5">
                        Level {tier.level}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="bg-white p-4">
                  <p className="text-sm text-muted-700 leading-relaxed">
                    Automatically upgrades after spending over{' '}
                    <span className="font-bold text-muted-900">{formatThreshold(tier.threshold)}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
