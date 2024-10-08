import { FormattedFeature, Plan } from '../common.types.js';

interface PricingProductStateLoading {
  state: 'loading';
}

interface PricingProductStateError {
  state: 'error';
}

interface PricingProductStateLoaded {
  state: 'loaded';
  productFeatures: FormattedFeature[];
  name: string;
  plans: Plan[];
}

export type PricingProductState = PricingProductStateLoading | PricingProductStateError | PricingProductStateLoaded;
