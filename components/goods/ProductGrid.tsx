'use client';

import { m } from 'motion/react';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        heading="No products found"
        subtext="Try a different search term"
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <m.div
      className="grid grid-cols-2 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <m.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
}
