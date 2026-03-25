'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import BannerCarousel from '@/components/goods/BannerCarousel';
import SearchBar from '@/components/goods/SearchBar';
import ProductGrid from '@/components/goods/ProductGrid';
import FloatingCustomerService from '@/components/goods/FloatingCustomerService';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products in real-time as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Banner Carousel */}
      <div className="px-4 pt-4 pb-3">
        <BannerCarousel />
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Find products"
        />
      </div>

      {/* Commodities Section */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#0066FF]" />
          <h2 className="text-lg font-semibold text-gray-900">Commodities</h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>

      {/* Floating Customer Service Icon */}
      <FloatingCustomerService />
    </main>
  );
}
