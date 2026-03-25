'use client';

import { m, AnimatePresence } from 'motion/react';

export interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AnimatedModal({ isOpen, onClose, children }: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <m.div
            data-testid="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Panel */}
          <m.div
            data-testid="modal-panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-t-modal sm:rounded-modal shadow-elevated max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
