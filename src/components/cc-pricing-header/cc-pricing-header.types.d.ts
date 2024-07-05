import { Zone } from '../common.types.js';

export interface PricingHeaderStateLoading {
  type: 'loading';
}

export interface PricingHeaderStateError {
  type: 'error';
}

export interface PricingHeaderStateLoaded {
  type: 'loaded';
  zones: Zone[];
}

export type PricingHeaderState = PricingHeaderStateLoading | PricingHeaderStateError | PricingHeaderStateLoaded;
