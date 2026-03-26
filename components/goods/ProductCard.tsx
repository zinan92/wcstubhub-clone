'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ListingIntelligenceBadges } from '@/components/listing-intelligence';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white rounded-xl shadow-card border border-muted-200 overflow-hidden hover:shadow-elevated transition-all active:scale-[0.98] duration-200"
    >
      <div className="aspect-square bg-surface-100 relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-medium text-muted-900 line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-accent-500 mb-2">
          ${product.price.toFixed(2)}
        </p>
        <ListingIntelligenceBadges
          isBestValue={product.isBestValue}
          isSellingFast={product.isSellingFast}
          remainingQty={product.remainingQty}
          urgencyThreshold={product.urgencyThreshold ?? undefined}
          isVerified={product.isVerified}
          size="sm"
        />
      </div>
    </Link>
  );
}
