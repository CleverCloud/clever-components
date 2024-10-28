import {
  CountablePlanWithQuantity,
  RuntimePlanWithQuantity,
} from '../cc-pricing-estimation/cc-pricing-estimation.types.js';

export interface SelectedPlansById {
  [planId: string]: RuntimePlanWithQuantity | CountablePlanWithQuantity;
}
