'use client';

import { m } from 'motion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90',
  secondary: 'bg-surface-700 text-white hover:bg-surface-800',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-blue-50',
  ghost: 'text-primary-500 hover:bg-blue-50',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  onClick,
  type,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <m.button
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      className={`
        relative font-semibold rounded-lg transition-all
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </m.button>
  );
}
