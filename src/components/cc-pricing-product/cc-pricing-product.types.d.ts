import { Feature, Plan } from '../common.types.js';

interface PricingProductStateLoading {
  state: 'loading';
}

interface PricingProductStateError {
  state: 'error';
}

interface PricingProductStateLoaded {
  state: 'loaded';
  productFeatures: Feature[];
  name: string;
  plans: Plan[];
}

export type PricingProductState = PricingProductStateLoading | PricingProductStateError | PricingProductStateLoaded;
