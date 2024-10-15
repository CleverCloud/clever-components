import { PlanWithQuantity } from '../cc-pricing-estimation/cc-pricing-estimation.js';

export interface SelectedPlansById {
  [key: string]: PlanWithQuantity;
}
