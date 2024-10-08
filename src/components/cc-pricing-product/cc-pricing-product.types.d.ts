import { FormattedFeature, Plan } from '../common.types.js';

interface PricingProductStateLoading {
  type: 'loading';
}

interface PricingProductStateError {
  type: 'error';
}

interface PricingProductStateLoaded {
  type: 'loaded';
  productFeatures: FormattedFeature[];
  name: string;
  plans: Plan[];
}

export type PricingProductState = PricingProductStateLoading | PricingProductStateError | PricingProductStateLoaded;
