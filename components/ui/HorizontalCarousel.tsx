'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode, useRef, useEffect } from 'react';
import Skeleton from './Skeleton';

interface HorizontalCarouselProps {
  title: string;
  seeAllHref?: string;
  children: ReactNode;
}

export default function HorizontalCarousel({ title, seeAllHref, children }: HorizontalCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for arrow keys
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        container.scrollBy({ left: -300, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        container.scrollBy({ left: 300, behavior: 'smooth' });
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="w-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-muted-900">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 active:text-primary-700 transition-colors min-h-[44px] px-2 flex items-center"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        data-testid="carousel-scroll-container"
        tabIndex={0}
        className="overflow-x-auto overflow-y-hidden scroll-smooth hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
        role="region"
        aria-label={`${title} carousel`}
      >
        <div className="flex gap-3 px-4 pb-2">
          {/* Each child wrapped with snap alignment */}
          {Array.isArray(children) 
            ? children.map((child, index) => (
                <div
                  key={index}
                  data-snap-child
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {child}
                </div>
              ))
            : <div
                data-snap-child
                className="flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {children}
              </div>
          }
          {/* Peek spacer - creates visual hint that more content exists */}
          <div className="flex-shrink-0 w-10" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

interface HorizontalCarouselSkeletonProps {
  title: string;
  cardCount?: number;
}

export function HorizontalCarouselSkeleton({ title, cardCount = 5 }: HorizontalCarouselSkeletonProps) {
  return (
    <section className="w-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-muted-900">{title}</h2>
      </div>

      {/* Horizontal scroll container */}
      <div
        data-testid="carousel-scroll-container"
        className="overflow-x-auto overflow-y-hidden scroll-smooth hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
        }}
      >
        <div className="flex gap-3 px-4 pb-2">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div
              key={index}
              data-testid="carousel-skeleton-card"
              className="flex-shrink-0 w-[280px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="bg-white rounded-xl shadow-card border border-muted-200 overflow-hidden">
                {/* Image skeleton */}
                <Skeleton className="w-full h-40" />
                
                {/* Content skeleton */}
                <div className="p-3.5 space-y-2">
                  {/* Title lines */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  
                  {/* Price */}
                  <Skeleton className="h-5 w-1/3 mt-2" />
                  
                  {/* Badge */}
                  <Skeleton className="h-5 w-20 mt-2 rounded-full" />
                </div>
              </div>
            </div>
          ))}
          {/* Peek spacer */}
          <div className="flex-shrink-0 w-10" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
