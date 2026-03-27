'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import BannerCarousel from '@/components/goods/BannerCarousel';
import SearchOverlay from '@/components/goods/SearchOverlay';
import FloatingCustomerService from '@/components/goods/FloatingCustomerService';
import HorizontalCarousel, { HorizontalCarouselSkeleton } from '@/components/ui/HorizontalCarousel';
import ProductCard from '@/components/goods/ProductCard';
import MatchCard from '@/components/football/MatchCard';
import ConcertCard from '@/components/concert/ConcertCard';
import BasketballCard from '@/components/basketball/BasketballCard';
import { BuyerProtection } from '@/components/trust';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  remainingQty: number;
  isBestValue: boolean;
  isSellingFast: boolean;
  urgencyThreshold: number | null;
  isVerified: boolean;
}

interface Event {
  id: string;
  title: string;
  type: string;
  team1?: string;
  team2?: string;
  team1Flag?: string;
  team2Flag?: string;
  artistName?: string;
  artistImageUrl?: string;
  date: string;
  venue: string;
  price: number;
  remainingQty: number;
  isBestValue: boolean;
  isSellingFast: boolean;
  urgencyThreshold: number | null;
  isOfficial: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [footballEvents, setFootballEvents] = useState<Event[]>([]);
  const [concertEvents, setConcertEvents] = useState<Event[]>([]);
  const [basketballEvents, setBasketballEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, popularRes, footballRes, concertRes, basketballRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/events'),
          fetch('/api/events?type=football'),
          fetch('/api/events?type=concert'),
          fetch('/api/events?type=basketball'),
        ]);

        const [productsData, popularData, footballData, concertData, basketballData] = await Promise.all([
          productsRes.json(),
          popularRes.json(),
          footballRes.json(),
          concertRes.json(),
          basketballRes.json(),
        ]);

        setProducts(productsData.slice(0, 8)); // Show first 8 products
        setPopularEvents(popularData.slice(0, 8)); // Mix of top events
        setFootballEvents(footballData.slice(0, 8));
        setConcertEvents(concertData.slice(0, 8));
        setBasketballEvents(basketballData.slice(0, 8));
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
      {/* Banner Carousel */}
      <div className="px-4 pt-4 pb-3" data-testid="banner-carousel">
        <BannerCarousel />
      </div>

      {/* Search Trigger */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-muted-200 rounded-full shadow-soft hover:shadow-card transition-all"
        >
          <Search className="w-5 h-5 text-muted-400" />
          <span className="text-muted-500">Find events and products</span>
        </button>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Popular Events Carousel */}
      <div className="pb-6">
        {isLoading ? (
          <HorizontalCarouselSkeleton title="Popular Events" cardCount={5} />
        ) : (
          <HorizontalCarousel title="Popular Events" seeAllHref="/football">
            {popularEvents.map((event) => {
              if (event.type === 'football') {
                return (
                  <div key={event.id} className="w-[320px]">
                    <MatchCard
                      id={event.id}
                      team1={event.team1!}
                      team2={event.team2!}
                      team1Flag={event.team1Flag!}
                      team2Flag={event.team2Flag!}
                      date={event.date}
                      venue={event.venue}
                      price={event.price}
                      remainingQty={event.remainingQty}
                      isBestValue={event.isBestValue}
                      isSellingFast={event.isSellingFast}
                      urgencyThreshold={event.urgencyThreshold ?? undefined}
                      isOfficial={event.isOfficial}
                    />
                  </div>
                );
              } else if (event.type === 'concert') {
                return (
                  <div key={event.id} className="w-[280px]">
                    <ConcertCard
                      id={event.id}
                      artistName={event.artistName!}
                      title={event.title}
                      artistImageUrl={event.artistImageUrl!}
                      date={event.date}
                      venue={event.venue}
                      price={event.price}
                      remainingQty={event.remainingQty}
                      isBestValue={event.isBestValue}
                      isSellingFast={event.isSellingFast}
                      urgencyThreshold={event.urgencyThreshold ?? undefined}
                      isOfficial={event.isOfficial}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={event.id} className="w-[320px]">
                    <BasketballCard
                      id={event.id}
                      team1={event.team1!}
                      team2={event.team2!}
                      date={event.date}
                      venue={event.venue}
                      price={event.price}
                      remainingQty={event.remainingQty}
                      isBestValue={event.isBestValue}
                      isSellingFast={event.isSellingFast}
                      urgencyThreshold={event.urgencyThreshold ?? undefined}
                      isOfficial={event.isOfficial}
                    />
                  </div>
                );
              }
            })}
          </HorizontalCarousel>
        )}
      </div>

      {/* Football Matches Carousel */}
      <div className="pb-6">
        {isLoading ? (
          <HorizontalCarouselSkeleton title="Football Matches" cardCount={5} />
        ) : (
          <HorizontalCarousel title="Football Matches" seeAllHref="/football">
            {footballEvents.map((event) => (
              <div key={event.id} className="w-[320px]">
                <MatchCard
                  id={event.id}
                  team1={event.team1!}
                  team2={event.team2!}
                  team1Flag={event.team1Flag!}
                  team2Flag={event.team2Flag!}
                  date={event.date}
                  venue={event.venue}
                  price={event.price}
                  remainingQty={event.remainingQty}
                  isBestValue={event.isBestValue}
                  isSellingFast={event.isSellingFast}
                  urgencyThreshold={event.urgencyThreshold ?? undefined}
                  isOfficial={event.isOfficial}
                />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </div>

      {/* Live Concerts Carousel */}
      <div className="pb-6">
        {isLoading ? (
          <HorizontalCarouselSkeleton title="Live Concerts" cardCount={5} />
        ) : (
          <HorizontalCarousel title="Live Concerts" seeAllHref="/concert">
            {concertEvents.map((event) => (
              <div key={event.id} className="w-[280px]">
                <ConcertCard
                  id={event.id}
                  artistName={event.artistName!}
                  title={event.title}
                  artistImageUrl={event.artistImageUrl!}
                  date={event.date}
                  venue={event.venue}
                  price={event.price}
                  remainingQty={event.remainingQty}
                  isBestValue={event.isBestValue}
                  isSellingFast={event.isSellingFast}
                  urgencyThreshold={event.urgencyThreshold ?? undefined}
                  isOfficial={event.isOfficial}
                />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </div>

      {/* Basketball Games Carousel */}
      <div className="pb-6">
        {isLoading ? (
          <HorizontalCarouselSkeleton title="Basketball Games" cardCount={5} />
        ) : (
          <HorizontalCarousel title="Basketball Games" seeAllHref="/basketball">
            {basketballEvents.map((event) => (
              <div key={event.id} className="w-[320px]">
                <BasketballCard
                  id={event.id}
                  team1={event.team1!}
                  team2={event.team2!}
                  date={event.date}
                  venue={event.venue}
                  price={event.price}
                  remainingQty={event.remainingQty}
                  isBestValue={event.isBestValue}
                  isSellingFast={event.isSellingFast}
                  urgencyThreshold={event.urgencyThreshold ?? undefined}
                  isOfficial={event.isOfficial}
                />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </div>

      {/* Team Merchandise Carousel */}
      <div className="pb-6">
        {isLoading ? (
          <HorizontalCarouselSkeleton title="Team Merchandise" cardCount={5} />
        ) : (
          <HorizontalCarousel title="Team Merchandise" seeAllHref="/products">
            {products.map((product) => (
              <div key={product.id} className="w-[160px]">
                <ProductCard product={{
                  ...product,
                  urgencyThreshold: product.urgencyThreshold ?? undefined,
                }} />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </div>

      {/* Buyer Protection Section */}
      <div className="px-4 pt-6 pb-4">
        <BuyerProtection variant="compact" />
      </div>

      {/* Floating Customer Service Icon */}
      <FloatingCustomerService />
    </main>
  );
}
