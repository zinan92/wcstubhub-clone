'use client';

import { Shield, CheckCircle2, Headphones, RefreshCcw } from 'lucide-react';

interface BuyerProtectionProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export function BuyerProtection({ variant = 'full', className = '' }: BuyerProtectionProps) {
  if (variant === 'compact') {
    return (
      <div className={`rounded-card bg-gradient-to-br from-primary-900/10 to-accent-900/10 border border-primary-900/20 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-50 mb-1">Buyer Protection</h3>
            <p className="text-xs text-surface-300">
              100% Money-Back Guarantee. Every purchase is protected.{' '}
              <button className="text-primary-400 hover:text-primary-300 underline">
                Learn more
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-card bg-gradient-to-br from-primary-900/10 to-accent-900/10 border border-primary-900/20 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <Shield className="w-8 h-8 text-primary-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-surface-50">Buyer Protection</h2>
          <p className="text-sm text-surface-300">Shop with confidence</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-surface-100">100% Money-Back Guarantee</p>
            <p className="text-xs text-surface-400">Every purchase is protected. Full refund if your order doesn&apos;t arrive or isn&apos;t as described</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Headphones className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-surface-100">24/7 Customer Support</p>
            <p className="text-xs text-surface-400">Get help anytime with our dedicated support team</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RefreshCcw className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-surface-100">Secure Delivery</p>
            <p className="text-xs text-surface-400">Fast and secure delivery with tracking for every order</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-surface-800">
        <button className="text-sm text-primary-400 hover:text-primary-300 underline">
          Learn more
        </button>
      </div>
    </div>
  );
}
