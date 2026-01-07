declare module 'vitest/browser' {
  interface BrowserCommands {
    runAccessibilityCheck: () => Promise<void>;
  }
}

export interface AccessibilityOptions {
  /** Rule IDs to disable */
  ignoredRules?: string[];
  /** Only run these rules */
  includedRules?: string[];
  /** WCAG tags to test (e.g., 'wcag2aa') */
  tags?: string[];
}

declare module 'vitest' {
  interface Assertion<T> {
    /**
     * Asserts that the element has no accessibility violations.
     * Uses axe-core to run accessibility checks.
     * @param options - Accessibility testing options
     */
    toBeAccessible(options?: AccessibilityOptions): Promise<void>;
  }
  interface AsymmetricMatchersContaining {
    toBeAccessible(options?: AccessibilityOptions): Promise<void>;
  }
}
