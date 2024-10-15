import { Plan } from '../common.types.js';

export type PricingEstimationState =
  | PricingEstimationStateLoaded
  | PricingEstimationStateLoading
  | PricingEstimationStateError;

export interface PricingEstimationStateError {
  type: 'error';
}

export interface PricingEstimationStateLoading {
  type: 'loading';
}

export interface PricingEstimationStateLoaded {
  type: 'loaded';
  prices: Array<FormattedProductPrice>;
}

export interface FormattedProductPrice {
  priceId: string;
  price: number;
}

export interface PlanWithQuantity extends Plan {
  quantity: number;
}
