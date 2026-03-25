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
      className="fixed bottom-24 right-4 z-40 bg-[#0066FF] text-white p-4 rounded-full shadow-lg hover:bg-[#0052CC] transition-colors"
      aria-label="Customer service"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
