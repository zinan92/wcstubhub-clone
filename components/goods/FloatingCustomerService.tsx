'use client';

import { MessageCircle } from 'lucide-react';

export default function FloatingCustomerService() {
  const handleClick = () => {
    // Non-functional placeholder - no action needed
    console.log('Customer service icon clicked');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-40 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all active:scale-90 min-h-[48px] min-w-[48px] flex items-center justify-center"
      aria-label="Customer service"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
