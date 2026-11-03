import { BadgeIntent } from '../cc-badge/cc-badge.types.js';

export interface ProductNotice {
  title: string;
  /** HTML limited to what `sanitize()` allows */
  message: string;
  intent: Exclude<BadgeIntent, 'neutral'>;
}
