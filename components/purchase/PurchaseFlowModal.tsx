'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedModal from '@/components/ui/AnimatedModal';
import Button from '@/components/ui/Button';

interface PurchaseFlowModalProps {
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

export default function PurchaseFlowModal({
  isOpen,
  onClose,
  itemId,
  itemName,
  itemPrice,
  itemImageUrl,
  maxQuantity,
  itemType,
}: PurchaseFlowModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FlowStep>('quantity');
  const [quantity, setQuantity] = useState(1);
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
      const response = await fetch('/api/user/owned-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType,
          itemId,
          itemName,
          itemImageUrl,
          purchasePrice: itemPrice,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create purchase');
      }

      setCurrentStep('success');
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    // Reset state
    setCurrentStep('quantity');
    setQuantity(1);
    // Redirect to My Tickets
    router.push('/my/tickets');
  };

  const handleCancel = () => {
    // Reset state
    setCurrentStep('quantity');
    setQuantity(1);
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
        Purchase {itemType === 'event' ? 'Tickets' : 'Items'}
      </h3>
      <p className="text-gray-700 mb-4">
        Select the quantity you want to purchase
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item
        </label>
        <p className="text-gray-900 font-semibold">{itemName}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per {itemType === 'event' ? 'ticket' : 'item'}
        </label>
        <p className="text-gray-900 font-semibold text-xl text-primary-600">
          ${itemPrice.toFixed(2)}
        </p>
      </div>

      <div className="mb-6">
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
          disabled={quantity <= 0 || quantity > maxQuantity}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    const totalPrice = quantity * itemPrice;

    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>
        <p className="text-gray-700 mb-6">
          Review your order details
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
            <span className="text-gray-900 font-medium">${itemPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-primary-600 font-bold text-lg">${totalPrice.toFixed(2)}</span>
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
    const totalPrice = quantity * itemPrice;

    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Purchase
        </h3>
        <p className="text-gray-700 mb-6">
          Are you ready to complete your purchase?
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-blue-800">
            This is a pseudo purchase flow. Your order will be recorded and visible in My Tickets.
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
            {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
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
          Purchase Complete!
        </h3>
        <p className="text-gray-700 mb-6">
          Your {itemType === 'event' ? 'tickets' : 'items'} have been added to My Tickets
        </p>
      </div>

      <Button
        onClick={handleSuccess}
        variant="primary"
        size="lg"
        className="w-full min-h-[44px]"
      >
        View My Tickets
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
