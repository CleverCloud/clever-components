import { PricingSection, SectionType } from '../common.types.js';

interface PricingProductConsumptionStateLoading {
  type: 'loading';
}

interface PricingProductConsumptionStateError {
  type: 'error';
}

interface PricingProductConsumptionStateLoaded {
  type: 'loaded';
  name: string;
  sections: PricingSection[];
}

export type PricingProductConsumptionState =
  | PricingProductConsumptionStateLoading
  | PricingProductConsumptionStateError
  | PricingProductConsumptionStateLoaded;

export type SectionStates = Partial<
  Record<
    SectionType,
    {
      isClosed: boolean;
      quantity: number;
      unitValue: string;
    }
  >
>;
