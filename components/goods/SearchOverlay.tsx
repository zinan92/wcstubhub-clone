'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Package, Calendar } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface Event {
  id: string;
  title: string;
  type: string;
  price: number;
  venue: string;
  date: string;
}

interface SearchResults {
  products: Product[];
  events: Event[];
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ products: [], events: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch trending items when overlay opens
  useEffect(() => {
    if (isOpen) {
      fetchResults('');
      setQuery('');
      setShowTrending(true);
      // Auto-focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const fetchResults = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowTrending(value.trim() === '');

    // Debounce search by 300ms
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  };

  const handleResultClick = (type: 'product' | 'event', id: string) => {
    const path = type === 'product' ? `/products/${id}` : `/events/${id}`;
    router.push(path);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const allResults = [...results.products, ...results.events];
  const hasResults = allResults.length > 0;
  const showNoResults = !showTrending && query.trim() !== '' && !hasResults && !isLoading;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-overlay-title"
      className="fixed inset-0 z-50 bg-white flex flex-col"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-muted-200 bg-white sticky top-0">
        <button
          onClick={onClose}
          aria-label="Close search"
          className="p-2 -ml-2 hover:bg-muted-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-muted-600" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search products and events"
            className="w-full pl-11 pr-4 py-2.5 bg-muted-50 border border-muted-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <m.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </m.div>
          ) : showNoResults ? (
            <m.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 text-muted-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-900 mb-2">No results found</h3>
              <p className="text-muted-500">Try a different search term</p>
            </m.div>
          ) : (
            <m.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Section Title */}
              <h2 className="text-sm font-semibold text-muted-600 uppercase tracking-wide mb-3">
                {showTrending ? 'Trending' : 'Results'}
              </h2>

              {/* Products */}
              {results.products.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-muted-500 uppercase tracking-wide mb-2">
                    Products
                  </h3>
                  <div className="space-y-2">
                    {results.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick('product', product.id)}
                        aria-label={`View ${product.name}`}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-muted-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {product.imageUrl && (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-muted-900 truncate">{product.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              <Package className="w-3 h-3" />
                              Product
                            </span>
                            <span className="text-sm font-semibold text-primary-600">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-500 uppercase tracking-wide mb-2">
                    Events
                  </h3>
                  <div className="space-y-2">
                    {results.events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleResultClick('event', event.id)}
                        aria-label={`View ${event.title}`}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-muted-900 truncate">{event.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded capitalize">
                              {event.type}
                            </span>
                            <span className="text-sm font-semibold text-primary-600">
                              ${event.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-500 truncate mt-0.5">
                            {event.venue} • {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
