'use client';

import { TrendingUp, Flame, AlertCircle, BadgeCheck } from 'lucide-react';

export type IntelligenceBadgeType = 'best-value' | 'selling-fast' | 'urgency' | 'verified-listing';

interface IntelligenceBadgeProps {
  type: IntelligenceBadgeType;
  urgencyCount?: number; // For "Only X left" display
  size?: 'sm' | 'md';
  className?: string;
}

const badgeConfig: Record<IntelligenceBadgeType, {
  icon: typeof TrendingUp;
  getLabel: (urgencyCount?: number) => string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}> = {
  'best-value': {
    icon: TrendingUp,
    getLabel: () => 'Best Value',
    bgColor: 'bg-success-900/30',
    textColor: 'text-success-400',
    iconColor: 'text-success-500',
  },
  'selling-fast': {
    icon: Flame,
    getLabel: () => 'Selling Fast',
    bgColor: 'bg-error-900/30',
    textColor: 'text-error-400',
    iconColor: 'text-error-500',
  },
  'urgency': {
    icon: AlertCircle,
    getLabel: (urgencyCount) => `Only ${urgencyCount} left`,
    bgColor: 'bg-warning-900/30',
    textColor: 'text-warning-400',
    iconColor: 'text-warning-500',
  },
  'verified-listing': {
    icon: BadgeCheck,
    getLabel: () => 'Verified Listing',
    bgColor: 'bg-primary-900/30',
    textColor: 'text-primary-400',
    iconColor: 'text-primary-500',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 gap-1',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  md: {
    container: 'px-3 py-1.5 gap-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm',
  },
};

export function IntelligenceBadge({ 
  type, 
  urgencyCount, 
  size = 'sm', 
  className = '' 
}: IntelligenceBadgeProps) {
  const config = badgeConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;
  const label = config.getLabel(urgencyCount);

  return (
    <div
      className={`inline-flex items-center rounded-full border border-current/20 ${config.bgColor} ${config.textColor} ${sizeStyles.container} ${className}`}
    >
      <Icon className={`${sizeStyles.icon} ${config.iconColor}`} />
      <span className={`font-medium ${sizeStyles.text}`}>{label}</span>
    </div>
  );
}

interface ListingIntelligenceBadgesProps {
  isBestValue?: boolean;
  isSellingFast?: boolean;
  remainingQty?: number;
  urgencyThreshold?: number;
  isVerified?: boolean;
  isOfficial?: boolean; // For events
  size?: 'sm' | 'md';
  className?: string;
}

export function ListingIntelligenceBadges({
  isBestValue = false,
  isSellingFast = false,
  remainingQty = 0,
  urgencyThreshold,
  isVerified = false,
  isOfficial = false,
  size = 'sm',
  className = '',
}: ListingIntelligenceBadgesProps) {
  const badges: Array<{ type: IntelligenceBadgeType; urgencyCount?: number }> = [];

  if (isBestValue) {
    badges.push({ type: 'best-value' });
  }

  if (isSellingFast) {
    badges.push({ type: 'selling-fast' });
  }

  // Show urgency only if remainingQty is at or below threshold
  if (urgencyThreshold && remainingQty > 0 && remainingQty <= urgencyThreshold) {
    badges.push({ type: 'urgency', urgencyCount: remainingQty });
  }

  // For products use isVerified, for events use isOfficial
  if (isVerified || isOfficial) {
    badges.push({ type: 'verified-listing' });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge, index) => (
        <IntelligenceBadge
          key={`${badge.type}-${index}`}
          type={badge.type}
          urgencyCount={badge.urgencyCount}
          size={size}
        />
      ))}
    </div>
  );
}
