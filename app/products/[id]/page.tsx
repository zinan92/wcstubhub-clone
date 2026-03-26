'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  remainingQty: number;
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showForSaleDialog, setShowForSaleDialog] = useState(false);
  const [productId, setProductId] = useState<string>('');

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

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    setShowPurchaseDialog(true);
  };

  const handleForSale = () => {
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

      {/* Product Image - Full Width */}
      <div className="w-full aspect-square bg-gray-100 relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="px-4 py-4">
        {/* Product Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {product.name}
        </h2>

        {/* Price */}
        <p className="text-3xl font-bold text-primary-500 mb-4">
          ${product.price.toFixed(2)}
        </p>

        {/* Remaining Quantity */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Remaining Quantity</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.remainingQty} units
          </p>
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
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-20 z-20">
        <div className="flex gap-3">
          {/* For Sale Button - Outline Style */}
          <button
            onClick={handleForSale}
            className="flex-1 px-6 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            For sale
          </button>

          {/* Purchase Button - Gradient Style */}
          <button
            onClick={handlePurchase}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      {showPurchaseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Success
            </h3>
            <p className="text-gray-700 mb-6 text-center">
              Purchase request submitted successfully
            </p>
            <button
              onClick={closePurchaseDialog}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* For Sale Confirmation Dialog */}
      {showForSaleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Success
            </h3>
            <p className="text-gray-700 mb-6 text-center">
              Listing request submitted successfully
            </p>
            <button
              onClick={closeForSaleDialog}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
