'use client';

import { Shield, BadgeCheck, Truck, Lock } from 'lucide-react';

export type TrustBadgeType = 'verified' | 'official' | 'secure-delivery' | 'buyer-protected';

interface TrustBadgeProps {
  type: TrustBadgeType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeConfig: Record<TrustBadgeType, {
  icon: typeof Shield;
  label: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}> = {
  verified: {
    icon: BadgeCheck,
    label: 'Verified',
    bgColor: 'bg-success-900/30',
    textColor: 'text-success-400',
    iconColor: 'text-success-500',
  },
  official: {
    icon: Shield,
    label: 'Official',
    bgColor: 'bg-primary-900/30',
    textColor: 'text-primary-400',
    iconColor: 'text-primary-500',
  },
  'secure-delivery': {
    icon: Truck,
    label: 'Secure Delivery',
    bgColor: 'bg-accent-900/30',
    textColor: 'text-accent-400',
    iconColor: 'text-accent-500',
  },
  'buyer-protected': {
    icon: Lock,
    label: 'Buyer Protection',
    bgColor: 'bg-success-900/30',
    textColor: 'text-success-400',
    iconColor: 'text-success-500',
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
  lg: {
    container: 'px-4 py-2 gap-2',
    icon: 'w-5 h-5',
    text: 'text-base',
  },
};

export function TrustBadge({ type, size = 'md', className = '' }: TrustBadgeProps) {
  const config = badgeConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center rounded-full border border-current/20 ${config.bgColor} ${config.textColor} ${sizeStyles.container} ${className}`}
    >
      <Icon className={`${sizeStyles.icon} ${config.iconColor}`} />
      <span className={`font-medium ${sizeStyles.text}`}>{config.label}</span>
    </div>
  );
}

interface TrustBadgesGroupProps {
  badges: TrustBadgeType[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrustBadgesGroup({ badges, size = 'md', className = '' }: TrustBadgesGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => (
        <TrustBadge key={badge} type={badge} size={size} />
      ))}
    </div>
  );
}
