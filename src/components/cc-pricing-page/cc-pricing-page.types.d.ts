import { CountablePlanWithQuanty, RuntimePlanWithQuantity } from '../cc-pricing-estimation/cc-pricing-estimation.js';

export interface SelectedPlansById {
  [key: string]: RuntimePlanWithQuantity | CountablePlanWithQuanty;
}
