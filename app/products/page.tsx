'use client';

import { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import SearchOverlay from '@/components/goods/SearchOverlay';
import ProductCard from '@/components/goods/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { BuyerProtection } from '@/components/trust/BuyerProtection';
import { TrustBadgesGroup } from '@/components/trust/TrustBadges';

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

export default function ProductsPage() {
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
      {/* Search Trigger */}
      <div className="px-4 pt-4 pb-3">
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

      {/* Products Banner */}
      <div className="px-4 pb-4">
        <div className="w-full h-40 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
          <div className="text-center text-white px-6">
            <Package className="w-16 h-16 mx-auto mb-2 opacity-90" />
            <h2 className="text-2xl font-bold mb-1">Team Merchandise</h2>
            <p className="text-sm opacity-90">Official Products & Gear</p>
          </div>
        </div>
      </div>

      {/* Products Section Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
        </div>
      </div>

      {/* Trust Architecture - visible to all users */}
      <div className="px-4 pb-4">
        <BuyerProtection variant="compact" />
      </div>

      {/* Trust Badges */}
      <div className="px-4 pb-4">
        <TrustBadgesGroup 
          badges={['verified', 'buyer-protected', 'secure-delivery']} 
          size="sm"
        />
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
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </m.div>
          ) : products.length === 0 ? (
            <m.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                icon={Package}
                heading="No products found"
                subtext="Try a different search term"
              />
            </m.div>
          ) : (
            <m.div
              key="content"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="grid grid-cols-2 gap-4"
            >
              {products.map((product) => (
                <m.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3 },
                    },
                  }}
                >
                  <ProductCard product={{
                    ...product,
                    urgencyThreshold: product.urgencyThreshold ?? undefined,
                  }} />
                </m.div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
