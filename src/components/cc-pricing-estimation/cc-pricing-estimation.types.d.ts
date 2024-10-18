import { PricingSection } from '../cc-pricing-product-consumption/cc-pricing-product-consumption.js';
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

export interface RuntimePlanWithQuantity extends Plan {
  pricingType: 'runtime';
  quantity: number;
}

export interface CountablePlanWithQuanty extends Plan {
  pricingType: 'countable';
  quantity: number;
  sections: PricingSection[];
}
