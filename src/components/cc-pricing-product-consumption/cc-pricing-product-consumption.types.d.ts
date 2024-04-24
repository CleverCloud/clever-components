import { PricingSection, SectionType } from '../common.types.js';

interface PricingProductConsumptionStateLoading {
  state: 'loading';
}

interface PricingProductConsumptionStateError {
  state: 'error';
}

interface PricingProductConsumptionStateLoaded {
  state: 'loaded';
  name: string;
  sections: PricingSection[];
}

export type PricingProductConsumptionState =
  | PricingProductConsumptionStateLoading
  | PricingProductConsumptionStateError
  | PricingProductConsumptionStateLoaded;

export type SectionStates = {
  [key in SectionType]: {
    isClosed: boolean;
    quantity: number;
    unitValue: number;
  };
};
