import { AxeBuilder } from '@axe-core/playwright';

// Page-level rules that don't apply to component testing
const DISABLED_RULES = [
  'document-title',
  'html-has-lang',
  'landmark-one-main',
  'page-has-heading-one',
  'region',
  'frame-title',
];

/** @param {import('vitest/node').BrowserCommandContext} ctx */
export const runAccessibilityCheck = async (ctx) => {
  if (ctx.provider.name === 'playwright') {
    const page = ctx.page;
    try {
      const results = await new AxeBuilder({ page })
        .include('[name="vitest-iframe"]')
        .disableRules(DISABLED_RULES)
        .analyze();
      return results;
    } catch (error) {
      console.error('Axe analysis failed:', error);
    }
  }
};

export default function BrowserCommands() {
  return {
    name: 'vitest:custom-commands',
    config() {
      return {
        test: {
          browser: {
            commands: {
              runAccessibilityCheck,
            },
          },
        },
      };
    },
  };
}
