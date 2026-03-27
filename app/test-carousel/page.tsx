'use client';

import { useState, useEffect } from 'react';
import HorizontalCarousel, { HorizontalCarouselSkeleton } from '@/components/ui/HorizontalCarousel';
import ProductCard from '@/components/goods/ProductCard';
import MatchCard from '@/components/football/MatchCard';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  remainingQty?: number;
  isBestValue?: boolean;
  isSellingFast?: boolean;
  urgencyThreshold?: number;
  isVerified?: boolean;
}

interface Event {
  id: string;
  title: string;
  type: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  date: string;
  venue: string;
  price: number;
}

export default function TestCarouselPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, eventsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/events')
        ]);
        const productsData = await productsRes.json();
        const eventsData = await eventsRes.json();
        
        // Filter football events from all events
        const footballEvents = eventsData.filter((e: Event) => e.type === 'football');
        
        setProducts(productsData.slice(0, 6));
        setEvents(footballEvents.slice(0, 6));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="pt-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-muted-900 px-4">
          HorizontalCarousel Component Test
        </h1>

        {/* Loading State */}
        {isLoading && (
          <>
            <HorizontalCarouselSkeleton title="Loading Products..." />
            <HorizontalCarouselSkeleton title="Loading Events..." />
          </>
        )}

        {/* Products Carousel */}
        {!isLoading && products.length > 0 && (
          <HorizontalCarousel 
            title="Team Merchandise" 
            seeAllHref="/products"
          >
            {products.map((product) => (
              <div key={product.id} className="w-[160px]">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalCarousel>
        )}

        {/* Events Carousel */}
        {!isLoading && events.length > 0 && (
          <HorizontalCarousel 
            title="Football Matches" 
            seeAllHref="/football"
          >
            {events.map((event) => (
              <div key={event.id} className="w-[280px]">
                <MatchCard
                  id={event.id}
                  team1={event.team1}
                  team2={event.team2}
                  team1Flag={event.team1Flag}
                  team2Flag={event.team2Flag}
                  date={event.date}
                  venue={event.venue}
                  price={event.price}
                />
              </div>
            ))}
          </HorizontalCarousel>
        )}

        {/* Another Section without See All link */}
        {!isLoading && products.length > 0 && (
          <HorizontalCarousel title="Popular Items">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="w-[160px]">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </div>
    </main>
  );
}
