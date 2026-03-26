'use client';

import { CheckCircle2, Clock, Headphones, ShieldCheck } from 'lucide-react';

interface TrustMessagingProps {
  variant?: 'refund' | 'support' | 'guarantee' | 'delivery';
  className?: string;
}

const messagingConfig = {
  refund: {
    icon: CheckCircle2,
    title: 'Easy Refunds',
    message: 'Full refund if your order doesn\'t arrive or isn\'t as described',
    iconColor: 'text-success-500',
  },
  support: {
    icon: Headphones,
    title: '24/7 Support',
    message: 'Get help anytime with our dedicated customer support team',
    iconColor: 'text-accent-500',
  },
  guarantee: {
    icon: ShieldCheck,
    title: '100% Guarantee',
    message: 'Every purchase is protected by our Buyer Protection program',
    iconColor: 'text-primary-500',
  },
  delivery: {
    icon: Clock,
    title: 'Secure Delivery',
    message: 'Fast and secure delivery with tracking for every order',
    iconColor: 'text-accent-500',
  },
};

export function TrustMessaging({ variant = 'guarantee', className = '' }: TrustMessagingProps) {
  const config = messagingConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-surface-50 mb-0.5">{config.title}</p>
        <p className="text-xs text-surface-300">{config.message}</p>
      </div>
    </div>
  );
}

interface TrustMessagingGroupProps {
  variants: Array<'refund' | 'support' | 'guarantee' | 'delivery'>;
  className?: string;
}

export function TrustMessagingGroup({ variants, className = '' }: TrustMessagingGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {variants.map((variant) => (
        <TrustMessaging key={variant} variant={variant} />
      ))}
    </div>
  );
}
