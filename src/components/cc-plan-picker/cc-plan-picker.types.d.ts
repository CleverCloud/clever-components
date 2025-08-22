import { BadgeIntent } from '../cc-badge/cc-badge.types.js';
import { IconModel } from '../common.types.js';

export interface PlanItem {
  id: string;
  badge?: PlanBadge;
  name: string;
  details?: PlanDetails[];
  disabled?: boolean;
  selected?: boolean;
  relatedPlans?: Array<Omit<PlanItem, 'relatedPlans'>>;
}

export interface PlanBadge {
  content: string;
  intent?: BadgeIntent;
}

export interface PlanDetails {
  icon: IconModel;
  value: string;
}
