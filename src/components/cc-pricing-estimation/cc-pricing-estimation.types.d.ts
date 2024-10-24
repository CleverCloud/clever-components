import { PricingSection } from '../cc-pricing-product-consumption/cc-pricing-product-consumption.js';
import { ConsumptionPlan, Plan } from '../common.types.js';

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
  runtimePrices: Array<FormattedRuntimePrice>;
  countablePrices: Array<PricingSection>;
}

export interface FormattedRuntimePrice {
  priceId: string;
  price: number;
}

export interface RuntimePlanWithQuantity extends Plan {
  quantity: number;
}

export interface CountablePlanWithQuanty extends ConsumptionPlan {
  quantity: number;
  sections: PricingSection[];
}
