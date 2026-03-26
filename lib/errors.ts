/**
 * Custom error classes for better error handling and type safety
 */

export class OwnedAssetNotFoundError extends Error {
  constructor(message = 'Owned asset not found or does not belong to user') {
    super(message);
    this.name = 'OwnedAssetNotFoundError';
  }
}

export class InsufficientQuantityError extends Error {
  constructor(message = 'Insufficient quantity available for listing') {
    super(message);
    this.name = 'InsufficientQuantityError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
