import sortLitGetProperties from '../../eslint/lit/custom-rules/sort-lit-get-properties.js';

export default {
  name: 'sort-lit-get-properties',
  rule: sortLitGetProperties,
  tests: {
    valid: [
      {
        name: 'already sorted properties',
        code: `
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
        `,
      },
      {
        name: 'no properties method',
        code: `
          class MyComponent extends LitElement {
            static get styles() {
              return css\`div { color: red; }\`;
            }
          }
        `,
      },
      {
        name: 'single property should be ignored',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return {
                a: { type: String },
              };
            }
          }
        `,
      },
      {
        name: 'empty properties should be ignored',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return {};
            }
          }
        `,
      },
      {
        name: 'unknown spread element should be ignored',
        code: `
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
        `,
      },
    ],
    invalid: [
      {
        name: 'should sort properties alphabetically',
        code: `
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
        `,
        errors: [
          {
            messageId: 'unsortedProperties',
          },
        ],
        output: `
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
        `,
      },
      {
        name: 'should move ...super.properties to the top',
        code: `
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
        `,
        errors: [
          {
            messageId: 'unsortedProperties',
          },
        ],
        output: `
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
        `,
      },
    ],
  },
};
