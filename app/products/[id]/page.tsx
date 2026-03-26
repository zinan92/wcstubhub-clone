'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import AnimatedModal from '@/components/ui/AnimatedModal';
import Button from '@/components/ui/Button';
import { BuyerProtection, TrustBadgesGroup, TrustMessaging } from '@/components/trust';
import ListingEntryModal from '@/components/listing/ListingEntryModal';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  remainingQty: number;
  isVerified: boolean;
  isBuyerProtected: boolean;
  hasSecureDelivery: boolean;
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showForSaleDialog, setShowForSaleDialog] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [intentHandled, setIntentHandled] = useState(false);

  useEffect(() => {
    const initParams = async () => {
      const { id } = await params;
      setProductId(id);
    };
    initParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle transaction intent after login
  useEffect(() => {
    if (status === 'authenticated' && !intentHandled && productId) {
      const action = searchParams.get('action');
      if (action === 'purchase') {
        setShowPurchaseDialog(true);
        setIntentHandled(true);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        router.replace(url.pathname + url.search);
      } else if (action === 'forsale') {
        setShowForSaleDialog(true);
        setIntentHandled(true);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        router.replace(url.pathname + url.search);
      }
    }
  }, [status, searchParams, intentHandled, productId, router]);

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    if (status !== 'authenticated') {
      // Redirect to login with callback URL and purchase intent
      router.push(`/login?callbackUrl=${encodeURIComponent(`/products/${productId}?action=purchase`)}`);
      return;
    }
    setShowPurchaseDialog(true);
  };

  const handleForSale = () => {
    if (status !== 'authenticated') {
      // Redirect to login with callback URL and listing intent
      router.push(`/login?callbackUrl=${encodeURIComponent(`/products/${productId}?action=forsale`)}`);
      return;
    }
    setShowForSaleDialog(true);
  };

  const closePurchaseDialog = () => {
    setShowPurchaseDialog(false);
  };

  const closeForSaleDialog = () => {
    setShowForSaleDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="px-4 pt-16">
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900 truncate">
            Product Details
          </h1>
        </div>
      </div>

      {/* Product Image - 40%+ viewport height with rounded corners */}
      <div className="w-full h-[45vh] bg-gray-100 relative overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-b-card"
        />
      </div>

      {/* Product Information */}
      <div className="px-4 py-6">
        {/* Product Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {product.name}
        </h2>

        {/* Price Section - Large bold accent-colored */}
        <div className="mb-5">
          <p className="text-sm text-gray-500 mb-1">Price</p>
          <p className="text-4xl font-bold text-accent-500">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Remaining Quantity - Styled as Badge */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Availability</p>
          <span className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full">
            {product.remainingQty} units remaining
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {/* Trust Badges - Conditionally rendered */}
        {(product.isVerified || product.isBuyerProtected || product.hasSecureDelivery) && (
          <div className="mb-6">
            <TrustBadgesGroup 
              badges={[
                ...(product.isVerified ? ['verified' as const] : []),
                ...(product.isBuyerProtected ? ['buyer-protected' as const] : []),
                ...(product.hasSecureDelivery ? ['secure-delivery' as const] : []),
              ]} 
              size="sm" 
            />
          </div>
        )}

        {/* Buyer Protection - Compact */}
        <div className="mb-6">
          <BuyerProtection variant="compact" />
        </div>

        {/* Trust Messaging near CTA */}
        <div className="mb-24 space-y-3">
          <TrustMessaging variant="guarantee" />
          <TrustMessaging variant="refund" />
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-20 z-20">
        <div className="flex gap-3">
          {/* For Sale Button - Using shared Button component */}
          <Button
            onClick={handleForSale}
            variant="outline"
            size="lg"
            className="flex-1 min-h-[44px]"
          >
            For sale
          </Button>

          {/* Purchase Button - Using shared Button component */}
          <Button
            onClick={handlePurchase}
            variant="primary"
            size="lg"
            className="flex-1 min-h-[44px]"
          >
            Purchase
          </Button>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      <AnimatedModal isOpen={showPurchaseDialog} onClose={closePurchaseDialog}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Success
          </h3>
          <p className="text-gray-700 mb-6 text-center">
            Purchase request submitted successfully
          </p>
          <Button
            onClick={closePurchaseDialog}
            variant="primary"
            size="lg"
            className="w-full min-h-[44px]"
          >
            OK
          </Button>
        </div>
      </AnimatedModal>

      {/* For Sale Listing Entry Flow */}
      {product && (
        <ListingEntryModal
          isOpen={showForSaleDialog}
          onClose={closeForSaleDialog}
          itemName={product.name}
          itemPrice={product.price}
          maxQuantity={product.remainingQty}
          itemType="product"
        />
      )}
    </div>
  );
}
