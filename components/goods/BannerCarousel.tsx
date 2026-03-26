'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Shirt, Star } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

const banners = [
  {
    id: 1,
    title: 'FIFA World Cup 2026',
    subtitle: 'Official Team Jerseys',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    icon: Trophy,
  },
  {
    id: 2,
    title: 'National Team Kits',
    subtitle: 'Authentic Match Jerseys',
    gradient: 'from-purple-600 via-pink-500 to-red-400',
    icon: Shirt,
  },
  {
    id: 3,
    title: 'Premium Collection',
    subtitle: 'Limited Edition',
    gradient: 'from-green-600 via-teal-500 to-blue-400',
    icon: Star,
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      goToPrevious();
    }
  };

  return (
    <div className="relative w-full">
      {/* Banner container */}
      <div
        className="relative overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => {
            const Icon = banner.icon;
            return (
              <div key={banner.id} className="w-full flex-shrink-0">
                <div className={`w-full h-40 bg-gradient-to-r ${banner.gradient} flex flex-col items-center justify-center text-white px-6`}>
                  <Icon className="w-12 h-12 mb-2 opacity-90" />
                  <h2 className="text-2xl font-bold text-center mb-1">{banner.title}</h2>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Next banner"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Dot indicators with animation */}
      <div className="flex justify-center gap-2 mt-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="min-h-[44px] flex items-center justify-center p-3 active:scale-90"
            aria-label={`Go to banner ${index + 1}`}
          >
            <m.div
              className={`rounded-full ${
                index === currentIndex
                  ? 'bg-primary-500'
                  : 'bg-muted-300'
              }`}
              animate={{
                width: index === currentIndex ? 16 : 8,
                height: index === currentIndex ? 8 : 8,
                opacity: index === currentIndex ? 1 : 0.6,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
