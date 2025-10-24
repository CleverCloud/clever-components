export type RangeSelectorMode = 'single' | 'range';

export interface RangeSelectorOption {
  body: string | Node;
  disabled?: boolean;
  value: string;
}

export interface RangeSelectorSelection {
  startValue: string;
  endValue: string;
}
