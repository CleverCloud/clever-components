import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import i18nAlwaysArrowWithSanitizeTestData from './i18n-always-arrow-with-sanitize.test-data.js';
import i18nAlwaysSanitizeWithHtmlTestData from './i18n-always-sanitize-with-html.test-data.js';
import i18nAlwaysTemplateLiteralSanitizeTestData from './i18n-always-template-literal-sanitize.test-data.js';
import i18nNoParamlessArrowTestData from './i18n-no-paramless-arrow.test-data.js';
import i18nNoSanitizeWithoutHtmlTestData from './i18n-no-sanitize-without-html.test-data.js';
import i18nOrderTestData from './i18n-order.test-data.js';
import i18nValidKeyTestData from './i18n-valid-key.test-data.js';
import i18nValidValueTestData from './i18n-valid-value.test-data.js';

// Configure RuleTester to use vitest's describe/it
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

describe('eslint custom rules', () => {
  ruleTester.run(
    i18nAlwaysArrowWithSanitizeTestData.name,
    i18nAlwaysArrowWithSanitizeTestData.rule,
    i18nAlwaysArrowWithSanitizeTestData.tests,
  );

  ruleTester.run(
    i18nAlwaysSanitizeWithHtmlTestData.name,
    i18nAlwaysSanitizeWithHtmlTestData.rule,
    i18nAlwaysSanitizeWithHtmlTestData.tests,
  );

  ruleTester.run(
    i18nAlwaysTemplateLiteralSanitizeTestData.name,
    i18nAlwaysTemplateLiteralSanitizeTestData.rule,
    i18nAlwaysTemplateLiteralSanitizeTestData.tests,
  );

  ruleTester.run(
    i18nNoParamlessArrowTestData.name,
    i18nNoParamlessArrowTestData.rule,
    i18nNoParamlessArrowTestData.tests,
  );

  ruleTester.run(
    i18nNoSanitizeWithoutHtmlTestData.name,
    i18nNoSanitizeWithoutHtmlTestData.rule,
    i18nNoSanitizeWithoutHtmlTestData.tests,
  );

  ruleTester.run(i18nOrderTestData.name, i18nOrderTestData.rule, i18nOrderTestData.tests);

  ruleTester.run(i18nValidKeyTestData.name, i18nValidKeyTestData.rule, i18nValidKeyTestData.tests);

  ruleTester.run(i18nValidValueTestData.name, i18nValidValueTestData.rule, i18nValidValueTestData.tests);
});
