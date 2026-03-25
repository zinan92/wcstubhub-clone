'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={`animate-pulse bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite',
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div data-testid="product-card-skeleton" className="bg-white rounded-card shadow-card overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-square" />
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        
        {/* Price */}
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div data-testid="match-card-skeleton" className="bg-white rounded-card shadow-card p-4">
      <div className="space-y-3">
        {/* Teams section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <Skeleton className="h-4 w-8 mx-3" />
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        
        {/* Venue and time */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
