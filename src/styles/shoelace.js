import {css} from 'lit-element';

export const shoelaceStyles = css`
  :host {
    --sl-color-black: #000;
    --sl-color-white: #fff;
    --sl-color-gray-50: #f9fafb;
    --sl-color-gray-100: #f3f4f6;
    --sl-color-gray-200: #e5e7eb;
    --sl-color-gray-300: #d1d5db;
    --sl-color-gray-400: #9ca3af;
    --sl-color-gray-500: #6b7280;
    --sl-color-gray-600: #4b5563;
    --sl-color-gray-700: #374151;
    --sl-color-gray-800: #1f2937;
    --sl-color-gray-900: #111827;
    --sl-color-gray-950: #0d131e;
    --sl-color-primary-50: #f0f9ff;
    --sl-color-primary-100: #e0f2fe;
    --sl-color-primary-200: #bae6fd;
    --sl-color-primary-300: #7dd3fc;
    --sl-color-primary-400: #38bdf8;
    --sl-color-primary-500: #0ea5e9;
    --sl-color-primary-600: #0284c7;
    --sl-color-primary-700: #0369a1;
    --sl-color-primary-800: #075985;
    --sl-color-primary-900: #0c4a6e;
    --sl-color-primary-950: #082e45;
    --sl-color-primary-text: var(--sl-color-white);
    --sl-color-success-50: #f0fdf4;
    --sl-color-success-100: #dcfce7;
    --sl-color-success-200: #bbf7d0;
    --sl-color-success-300: #86efac;
    --sl-color-success-400: #4ade80;
    --sl-color-success-500: #22c55e;
    --sl-color-success-600: #16a34a;
    --sl-color-success-700: #15803d;
    --sl-color-success-800: #166534;
    --sl-color-success-900: #14532d;
    --sl-color-success-950: #0d381e;
    --sl-color-success-text: var(--sl-color-white);
    --sl-color-info-50: #f9fafb;
    --sl-color-info-100: #f3f4f6;
    --sl-color-info-200: #e5e7eb;
    --sl-color-info-300: #d1d5db;
    --sl-color-info-400: #9ca3af;
    --sl-color-info-500: #6b7280;
    --sl-color-info-600: #4b5563;
    --sl-color-info-700: #374151;
    --sl-color-info-800: #1f2937;
    --sl-color-info-900: #111827;
    --sl-color-info-950: #0d131e;
    --sl-color-info-text: var(--sl-color-white);
    --sl-color-warning-50: #fffbeb;
    --sl-color-warning-100: #fef3c7;
    --sl-color-warning-200: #fde68a;
    --sl-color-warning-300: #fcd34d;
    --sl-color-warning-400: #fbbf24;
    --sl-color-warning-500: #f59e0b;
    --sl-color-warning-600: #d97706;
    --sl-color-warning-700: #b45309;
    --sl-color-warning-800: #92400e;
    --sl-color-warning-900: #78350f;
    --sl-color-warning-950: #4d220a;
    --sl-color-warning-text: var(--sl-color-white);
    --sl-color-danger-50: #fef2f2;
    --sl-color-danger-100: #fee2e2;
    --sl-color-danger-200: #fecaca;
    --sl-color-danger-300: #fca5a5;
    --sl-color-danger-400: #f87171;
    --sl-color-danger-500: #ef4444;
    --sl-color-danger-600: #dc2626;
    --sl-color-danger-700: #b91c1c;
    --sl-color-danger-800: #991b1b;
    --sl-color-danger-900: #7f1d1d;
    --sl-color-danger-950: #481111;
    --sl-color-danger-text: var(--sl-color-white);
    --sl-border-radius-small: 0.125rem;
    --sl-border-radius-medium: 0.25rem;
    --sl-border-radius-large: 0.5rem;
    --sl-border-radius-x-large: 1rem;
    --sl-border-radius-circle: 50%;
    --sl-border-radius-pill: 9999px;
    --sl-shadow-x-small: 0 1px 0 #0d131e0d;
    --sl-shadow-small: 0 1px 2px #0d131e1a;
    --sl-shadow-medium: 0 2px 4px #0d131e1a;
    --sl-shadow-large: 0 2px 8px #0d131e1a;
    --sl-shadow-x-large: 0 4px 16px #0d131e1a;
    --sl-spacing-xxx-small: 0.125rem;
    --sl-spacing-xx-small: 0.25rem;
    --sl-spacing-x-small: 0.5rem;
    --sl-spacing-small: 0.75rem;
    --sl-spacing-medium: 1rem;
    --sl-spacing-large: 1.25rem;
    --sl-spacing-x-large: 1.75rem;
    --sl-spacing-xx-large: 2.25rem;
    --sl-spacing-xxx-large: 3rem;
    --sl-spacing-xxxx-large: 4.5rem;
    --sl-transition-x-slow: 1000ms;
    --sl-transition-slow: 500ms;
    --sl-transition-medium: 250ms;
    --sl-transition-fast: 150ms;
    --sl-transition-x-fast: 50ms;
    --sl-font-mono:
            SFMono-Regular,
            Consolas,
            "Liberation Mono",
            Menlo,
            monospace;
    --sl-font-sans:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif,
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol";
    --sl-font-serif:
            Georgia,
            "Times New Roman",
            serif;
    --sl-font-size-xx-small: 0.625rem;
    --sl-font-size-x-small: 0.75rem;
    --sl-font-size-small: 0.875rem;
    --sl-font-size-medium: 1rem;
    --sl-font-size-large: 1.25rem;
    --sl-font-size-x-large: 1.5rem;
    --sl-font-size-xx-large: 2.25rem;
    --sl-font-size-xxx-large: 3rem;
    --sl-font-size-xxxx-large: 4.5rem;
    --sl-font-weight-light: 300;
    --sl-font-weight-normal: 400;
    --sl-font-weight-semibold: 500;
    --sl-font-weight-bold: 700;
    --sl-letter-spacing-dense: -0.015em;
    --sl-letter-spacing-normal: normal;
    --sl-letter-spacing-loose: 0.075em;
    --sl-line-height-dense: 1.4;
    --sl-line-height-normal: 1.8;
    --sl-line-height-loose: 2.2;
    --sl-focus-ring-color-primary: #0ea5e954;
    --sl-focus-ring-color-success: #22c55e54;
    --sl-focus-ring-color-info: #6b728054;
    --sl-focus-ring-color-warning: #f59e0b54;
    --sl-focus-ring-color-danger: #ef444454;
    --sl-focus-ring-width: 3px;
    --sl-button-font-size-small: var(--sl-font-size-x-small);
    --sl-button-font-size-medium: var(--sl-font-size-small);
    --sl-button-font-size-large: var(--sl-font-size-medium);
    --sl-input-height-small: 1.875rem;
    --sl-input-height-medium: 2.5rem;
    --sl-input-height-large: 3.125rem;
    --sl-input-background-color: var(--sl-color-white);
    --sl-input-background-color-hover: var(--sl-color-white);
    --sl-input-background-color-focus: var(--sl-color-white);
    --sl-input-background-color-disabled: var(--sl-color-gray-100);
    --sl-input-border-color: var(--sl-color-gray-300);
    --sl-input-border-color-hover: var(--sl-color-gray-400);
    --sl-input-border-color-focus: var(--sl-color-primary-500);
    --sl-input-border-color-disabled: var(--sl-color-gray-300);
    --sl-input-border-width: 1px;
    --sl-input-border-radius-small: var(--sl-border-radius-medium);
    --sl-input-border-radius-medium: var(--sl-border-radius-medium);
    --sl-input-border-radius-large: var(--sl-border-radius-medium);
    --sl-input-font-family: var(--sl-font-sans);
    --sl-input-font-weight: var(--sl-font-weight-normal);
    --sl-input-font-size-small: var(--sl-font-size-small);
    --sl-input-font-size-medium: var(--sl-font-size-medium);
    --sl-input-font-size-large: var(--sl-font-size-large);
    --sl-input-letter-spacing: var(--sl-letter-spacing-normal);
    --sl-input-color: var(--sl-color-gray-700);
    --sl-input-color-hover: var(--sl-color-gray-700);
    --sl-input-color-focus: var(--sl-color-gray-700);
    --sl-input-color-disabled: var(--sl-color-gray-900);
    --sl-input-icon-color: var(--sl-color-gray-400);
    --sl-input-icon-color-hover: var(--sl-color-gray-600);
    --sl-input-icon-color-focus: var(--sl-color-gray-600);
    --sl-input-placeholder-color: var(--sl-color-gray-400);
    --sl-input-placeholder-color-disabled: var(--sl-color-gray-600);
    --sl-input-spacing-small: var(--sl-spacing-small);
    --sl-input-spacing-medium: var(--sl-spacing-medium);
    --sl-input-spacing-large: var(--sl-spacing-large);
    --sl-input-label-font-size-small: var(--sl-font-size-small);
    --sl-input-label-font-size-medium: var(--sl-font-size-medium);
    --sl-input-label-font-size-large: var(--sl-font-size-large);
    --sl-input-label-color: inherit;
    --sl-input-help-text-font-size-small: var(--sl-font-size-x-small);
    --sl-input-help-text-font-size-medium: var(--sl-font-size-small);
    --sl-input-help-text-font-size-large: var(--sl-font-size-medium);
    --sl-input-help-text-color: var(--sl-color-gray-400);
    --sl-toggle-size: 1rem;
    --sl-overlay-background-color: #37415180;
    --sl-panel-background-color: var(--sl-color-white);
    --sl-panel-border-color: var(--sl-color-gray-200);
    --sl-tooltip-border-radius: var(--sl-border-radius-medium);
    --sl-tooltip-background-color: var(--sl-color-gray-900);
    --sl-tooltip-color: var(--sl-color-white);
    --sl-tooltip-font-family: var(--sl-font-sans);
    --sl-tooltip-font-weight: var(--sl-font-weight-normal);
    --sl-tooltip-font-size: var(--sl-font-size-small);
    --sl-tooltip-line-height: var(--sl-line-height-dense);
    --sl-tooltip-padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-small);
    --sl-tooltip-arrow-size: 5px;
    --sl-tooltip-arrow-start-end-offset: 8px;
    --sl-z-index-drawer: 700;
    --sl-z-index-dialog: 800;
    --sl-z-index-dropdown: 900;
    --sl-z-index-toast: 950;
    --sl-z-index-tooltip: 1000;
  }
  .sl-scroll-lock {
    overflow: hidden !important;
  }
`;
