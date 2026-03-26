'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedModal from '@/components/ui/AnimatedModal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface ListingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemImageUrl: string;
  maxQuantity: number;
  itemType: 'product' | 'event';
}

type FlowStep = 'quantity' | 'summary' | 'confirm' | 'success';

export default function ListingEntryModal({
  isOpen,
  onClose,
  itemId,
  itemName,
  itemPrice,
  itemImageUrl,
  maxQuantity,
  itemType,
}: ListingEntryModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<FlowStep>('quantity');
  const [quantity, setQuantity] = useState(1);
  const [askPrice, setAskPrice] = useState(itemPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityNext = () => {
    if (quantity > 0 && quantity <= maxQuantity) {
      setCurrentStep('summary');
    }
  };

  const handleSummaryNext = () => {
    setCurrentStep('confirm');
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType,
          itemId,
          itemName,
          itemImageUrl,
          askPrice,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      setCurrentStep('success');
    } catch (error) {
      console.error('Error creating listing:', error);
      showToast('Failed to create listing. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    // Reset state
    setCurrentStep('quantity');
    setQuantity(1);
    setAskPrice(itemPrice);
    // Redirect to My Listings
    router.push('/my/listings');
  };

  const handleCancel = () => {
    // Reset state
    setCurrentStep('quantity');
    setQuantity(1);
    setAskPrice(itemPrice);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'summary') {
      setCurrentStep('quantity');
    } else if (currentStep === 'confirm') {
      setCurrentStep('summary');
    }
  };

  const renderQuantityStep = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Create Listing
      </h3>
      <p className="text-gray-700 mb-4">
        List your {itemType === 'event' ? 'tickets' : 'items'} for sale
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item
        </label>
        <p className="text-gray-900 font-semibold">{itemName}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Quantity (max {maxQuantity})
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="askPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Ask Price (per {itemType === 'event' ? 'ticket' : 'item'})
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            id="askPrice"
            type="number"
            min="0.01"
            step="0.01"
            value={askPrice}
            onChange={(e) => setAskPrice(parseFloat(e.target.value) || itemPrice)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCancel}
          variant="outline"
          size="lg"
          className="flex-1 min-h-[44px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleQuantityNext}
          variant="primary"
          size="lg"
          className="flex-1 min-h-[44px]"
          disabled={quantity <= 0 || quantity > maxQuantity || askPrice <= 0}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    const totalValue = quantity * askPrice;
    
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Listing Summary
        </h3>
        <p className="text-gray-700 mb-6">
          Review your listing details
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Item</span>
            <span className="text-gray-900 font-medium">{itemName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span className="text-gray-900 font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per unit</span>
            <span className="text-gray-900 font-medium">${askPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-gray-900 font-semibold">Total Value</span>
            <span className="text-primary-600 font-bold text-lg">${totalValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="flex-1 min-h-[44px]"
          >
            Back
          </Button>
          <Button
            onClick={handleSummaryNext}
            variant="primary"
            size="lg"
            className="flex-1 min-h-[44px]"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirmStep = () => {
    const totalValue = quantity * askPrice;

    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Listing
        </h3>
        <p className="text-gray-700 mb-6">
          Are you ready to list your {itemType === 'event' ? 'tickets' : 'items'} for sale?
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Total Value:</strong> ${totalValue.toFixed(2)}
          </p>
          <p className="text-sm text-blue-800">
            This is a pseudo listing flow. Your listing will be recorded and visible in My Listings.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="flex-1 min-h-[44px]"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="lg"
            className="flex-1 min-h-[44px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Confirm Listing'}
          </Button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Listing Created!
        </h3>
        <p className="text-gray-700 mb-6">
          Your {itemType === 'event' ? 'tickets' : 'items'} are now listed for sale
        </p>
      </div>

      <Button
        onClick={handleSuccess}
        variant="primary"
        size="lg"
        className="w-full min-h-[44px]"
      >
        View My Listings
      </Button>
    </div>
  );

  return (
    <AnimatedModal isOpen={isOpen} onClose={handleCancel}>
      {currentStep === 'quantity' && renderQuantityStep()}
      {currentStep === 'summary' && renderSummaryStep()}
      {currentStep === 'confirm' && renderConfirmStep()}
      {currentStep === 'success' && renderSuccessStep()}
    </AnimatedModal>
  );
}
