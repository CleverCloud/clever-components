import { CcBeta } from './cc-beta.js';

export type PositionType = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';

declare global {
  interface HTMLElementTagNameMap {
    'cc-beta': CcBeta;
  }
}
