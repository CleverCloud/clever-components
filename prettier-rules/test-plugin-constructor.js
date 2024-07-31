import { expect } from 'chai';
import * as prettier from 'prettier';

const code = `
class MyComponent extends LitElement { 
  constructor() {
    super();

    /** @type {string} */
    this.code = null;

    /** @type {string} */
    this.name = null;

    /** @type {string} */
    this.infra = null;

    /** @type {string} */
    this.flagUrl = null;

    /** @type {string} */
    this.country = null;

    /** @type {string} */
    this.countryCode = null;

    /** @type {ZoneImage[]} */
    this.images = [];

    /** @type {string[]} */
    this.tags = [];

    /** @type {boolean} */
    this.disabled = false;

    /** @type {boolean} */
    this.selected = false;
  }
 }
`;

const validCode = `
  class MyComponent extends LitElement {
    constructor() {
      super();

      /** @type {string} */
      this.code = null;

      /** @type {string} */
      this.country = null;

      /** @type {string} */
      this.countryCode = null;

      /** @type {boolean} */
      this.disabled = false;

      /** @type {string} */
      this.flagUrl = null;

      /** @type {ZoneImage[]} */
      this.images = [];

      /** @type {string} */
      this.infra = null;

      /** @type {string} */
      this.name = null;

      /** @type {boolean} */
      this.selected = false;

      /** @type {string[]} */
      this.tags = [];
    }
  }
`;

describe('sort constructor prettier', () => {
  prettier
    .format(code, {
      parser: 'babel',
      plugins: ['./prettier-rules/sort-constructor.cjs'],
    })
    .then((prettierCode) => {
      console.log(prettierCode);
      expect(prettierCode).equals(validCode);
    });
});
