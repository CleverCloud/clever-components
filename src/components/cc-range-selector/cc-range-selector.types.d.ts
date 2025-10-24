import type { TemplateResult } from 'lit';

export type RangeSelectorMode = 'single' | 'range';

export interface RangeSelectorOption {
  body: string | Node | TemplateResult;
  disabled?: boolean;
  value: string;
}

export interface RangeSelectorSelection {
  startValue: string;
  endValue: string;
}

export interface RenderOptionContext {
  //Selection index information
  indexes: {
    start: number;
    current: number;
    end: number;
  };
  // Whether the selector is in single selection mode
  isModeSingle: boolean;
  // Whether the selector is in range selection mode
  isModeRange: boolean;
  // Whether this is the last option in the list (used to control arrow visibility)
  isLastOption: boolean;
  // The next option in the list, used to determine arrow highlighting state
  nextOption: RangeSelectorOption;
}
