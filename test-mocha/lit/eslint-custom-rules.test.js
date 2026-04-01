import { RuleTester } from 'eslint';
import sortLitElementMembersTestData from './sort-lit-element-members.test-data.js';
import sortLitGetPropertiesTestData from './sort-lit-get-properties.test-data.js';

const ruleTester = new RuleTester();

describe('eslint lit custom rules', () => {
  ruleTester.run(
    sortLitGetPropertiesTestData.name,
    sortLitGetPropertiesTestData.rule,
    sortLitGetPropertiesTestData.tests,
  );

  ruleTester.run(
    sortLitElementMembersTestData.name,
    sortLitElementMembersTestData.rule,
    sortLitElementMembersTestData.tests,
  );
});
