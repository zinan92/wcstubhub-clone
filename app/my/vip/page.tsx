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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

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
          <h1 className="text-xl font-semibold text-gray-900">VIP Upgrade System</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {vipTiers.map((tier) => {
            const isCurrent = tier.level === currentVipLevel;
            
            return (
              <div
                key={tier.id}
                className={`bg-white rounded-lg shadow-sm p-4 ${
                  isCurrent ? 'border-2 border-blue-500' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Crown className={`w-5 h-5 ${
                        isCurrent ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${
                          isCurrent ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {tier.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Automatically upgrades to {tier.name} after spending over {formatThreshold(tier.threshold)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
