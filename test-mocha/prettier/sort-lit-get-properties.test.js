import { expect } from 'chai';
import dedent from 'dedent';
import { describe } from 'mocha';
import { format } from 'prettier';

describe('Prettier sort props from "static get properties()"', () => {
  it('should sort properties properly', async () => {
    const code = dedent`
      class MyComponent extends LitElement {
        static get properties() {
          return {
            ...super.properties,
            _myPrivA: { type: String },
            d: { type: String },
            a: { type: String },
            b: { type: String },
            e: { type: String },
            c: { type: String },
            _myPrivB: { type: String },
          };
        }
      }
    `;

    const validCode = dedent`
      class MyComponent extends LitElement {
        static get properties() {
          return {
            ...super.properties,
            a: { type: String },
            b: { type: String },
            c: { type: String },
            d: { type: String },
            e: { type: String },
            _myPrivA: { type: String },
            _myPrivB: { type: String },
          };
        }
      }
    `;
    const formattedCode = await formatPrettierCode(code);
    expect(formattedCode.trim()).to.equal(validCode);
  });

  it('should move the `...super.properties` to the top', async () => {
    const code = dedent`
      class MyComponent extends LitElement {
        static get properties() {
            return {
              _myPrivA: { type: String },
              d: { type: String },
              a: { type: String },
              b: { type: String },
              ...super.properties,
              e: { type: String },
              c: { type: String },
              _myPrivB: { type: String },
            };
        }
      }
    `;

    const validCode = dedent`
      class MyComponent extends LitElement {
        static get properties() {
          return {
            ...super.properties,
            a: { type: String },
            b: { type: String },
            c: { type: String },
            d: { type: String },
            e: { type: String },
            _myPrivA: { type: String },
            _myPrivB: { type: String },
          };
        }
      }
    `;
    const formattedCode = await formatPrettierCode(code);
    expect(formattedCode.trim()).to.equal(validCode);
  });

  it('should not order if there is an unknown SpreadElement', async () => {
    const code = dedent`
      class MyComponent extends LitElement {
        static get properties() {
            return {
              _myPrivA: { type: String },
              d: { type: String },
              a: { type: String },
              b: { type: String },
              e: { type: String },
              c: { type: String },
              _myPrivB: { type: String },
              ...foobar,
            };
        }
      }
    `;

    const validCode = dedent`
      class MyComponent extends LitElement {
        static get properties() {
          return {
            _myPrivA: { type: String },
            d: { type: String },
            a: { type: String },
            b: { type: String },
            e: { type: String },
            c: { type: String },
            _myPrivB: { type: String },
            ...foobar,
          };
        }
      }
    `;
    const formattedCode = await formatPrettierCode(code);
    expect(formattedCode.trim()).to.equal(validCode);
  });
});

/**
 *
 * @param {string} code
 * @returns {Promise<string>}
 */
function formatPrettierCode(code) {
  return format(code, {
    filepath: 'foo.js',
    plugins: ['./prettier-rules/sort-lit-get-properties.js'],
  });
}
