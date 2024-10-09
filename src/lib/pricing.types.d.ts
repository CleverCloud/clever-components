import { PricingSection } from 'src/components/common.types.js';

export type PricingSimulatorState = Partial<{
  [key in PricingSection['type']]: Omit<PricingSection, 'type'> & { quantity: number };
}>;
