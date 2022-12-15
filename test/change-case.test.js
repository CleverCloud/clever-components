import { expect } from '@bundled-es-modules/chai';
import { pascalCase } from '../src/lib/change-case.js';

const TEST_CASES = [
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

describe('pascalCase', () => {
  for (const [input, output] of TEST_CASES) {
    it(`${input} => ${output}`, () => {
      expect(pascalCase(input)).to.equal(output);
    });
  }
});
