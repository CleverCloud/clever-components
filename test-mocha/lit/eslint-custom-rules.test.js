import { RuleTester } from 'eslint';
import sortLitGetPropertiesTestData from './sort-lit-get-properties.test-data.js';

const ruleTester = new RuleTester();

describe('eslint lit custom rules', () => {
  ruleTester.run(
    sortLitGetPropertiesTestData.name,
    sortLitGetPropertiesTestData.rule,
    sortLitGetPropertiesTestData.tests,
  );
});
