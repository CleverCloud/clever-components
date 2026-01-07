import { describe, expect, it } from 'vitest';
import { camelCase, camelCaseToSpacedCapitalized, kebabCase, pascalCase, snakeCase } from '../src/lib/change-case.js';

const TEST_PASCAL_CASES = [
  ['', ''],
  ['test', 'Test'],
  ['test string', 'TestString'],
  ['Test String', 'TestString'],
  ['TestString', 'TestString'],
  ['dot.case', 'DotCase'],
  ['TestV2', 'TestV2'],
  ['version 1.2.10', 'Version_1_2_10'],
  ['version 1.21.0', 'Version_1_21_0'],
];

const TEST_CAMEL_CASES = [
  ['', ''],
  ['test', 'test'],
  ['test string', 'testString'],
  ['Test String', 'testString'],
  ['TestString', 'testString'],
  ['dot.case', 'dotCase'],
  ['TestV2', 'testV2'],
  ['version 1.2.10', 'version_1_2_10'],
  ['version 1.21.0', 'version_1_21_0'],
];

const TEST_SNAKE_CASES = [
  ['', ''],
  ['test', 'test'],
  ['test string', 'test_string'],
  ['Test String', 'test_string'],
  ['TestString', 'test_string'],
  ['dot.case', 'dot_case'],
  ['TestV2', 'test_v2'],
  ['version 1.2.10', 'version_1_2_10'],
  ['version 1.21.0', 'version_1_21_0'],
];

const TEST_KEBAB_CASES = [
  ['', ''],
  ['test', 'test'],
  ['test string', 'test-string'],
  ['Test String', 'test-string'],
  ['TestString', 'test-string'],
  ['dot.case', 'dot-case'],
  ['TestV2', 'test-v2'],
  ['version 1.2.10', 'version-1-2-10'],
  ['version 1.21.0', 'version-1-21-0'],
];

const TESTS_SPACED_CAPITALIZED_CASES = [
  ['', ''],
  ['string', 'String'],
  ['dotCase', 'Dot Case'],
  ['PascalCase', 'Pascal Case'],
  ['snakeCase', 'Snake Case'],
  ['version_1_2_10', 'Version_1_2_10'],
  ['version1_2_10', 'Version1_2_10'],
];

describe('pascalCase', () => {
  for (const [input, output] of TEST_PASCAL_CASES) {
    it(`${input} => ${output}`, () => {
      expect(pascalCase(input)).toBe(output);
    });
  }
});

describe('camelCase', () => {
  for (const [input, output] of TEST_CAMEL_CASES) {
    it(`${input} => ${output}`, () => {
      expect(camelCase(input)).toBe(output);
    });
  }
});

describe('snakeCase', () => {
  for (const [input, output] of TEST_SNAKE_CASES) {
    it(`${input} => ${output}`, () => {
      expect(snakeCase(input)).toBe(output);
    });
  }
});

describe('kebabCase', () => {
  for (const [input, output] of TEST_KEBAB_CASES) {
    it(`${input} => ${output}`, () => {
      expect(kebabCase(input)).toBe(output);
    });
  }
});

describe('camelCaseToSpacedCapitalized', () => {
  for (const [input, output] of TESTS_SPACED_CAPITALIZED_CASES) {
    it(`${input} => ${output}`, () => {
      expect(camelCaseToSpacedCapitalized(input)).toBe(output);
    });
  }
});
