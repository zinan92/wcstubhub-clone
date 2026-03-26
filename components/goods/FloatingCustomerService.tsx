'use client';

import { m } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function FloatingCustomerService() {
  const handleClick = () => {
    // Non-functional placeholder - no action needed
    console.log('Customer service icon clicked');
  };

  return (
    <m.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-4 z-40 bg-primary-500 text-white p-4 rounded-full shadow-elevated hover:bg-primary-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
      aria-label="Customer service"
    >
      <MessageCircle className="w-6 h-6" />
    </m.button>
  );
}
