'use client';

import { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import BannerCarousel from '@/components/goods/BannerCarousel';
import SearchOverlay from '@/components/goods/SearchOverlay';
import ProductGrid from '@/components/goods/ProductGrid';
import FloatingCustomerService from '@/components/goods/FloatingCustomerService';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Banner Carousel */}
      <div className="px-4 pt-4 pb-3">
        <BannerCarousel />
      </div>

      {/* Search Trigger */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-muted-200 rounded-full shadow-soft hover:shadow-card transition-all"
        >
          <Search className="w-5 h-5 text-muted-400" />
          <span className="text-muted-500">Find products</span>
        </button>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Commodities Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold text-muted-900">Commodities</h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <m.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </m.div>
          ) : (
            <m.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductGrid products={products} />
            </m.div>
          )}
        </AnimatePresence>
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
