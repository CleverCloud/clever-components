import { ConsumptionPlan, Plan, PricingSection } from '../common.types.js';

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

export interface CountablePlanWithQuantity extends ConsumptionPlan {
  quantity: number;
  sections: PricingSection[];
}
