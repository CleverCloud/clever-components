import sortLitElementMembers from '../../eslint/lit/custom-rules/sort-lit-element-members.js';

export default {
  name: 'sort-lit-element-members',
  rule: sortLitElementMembers,
  tests: {
    valid: [
      {
        name: 'already sorted members with all groups',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            static get formAssociated() {
              return true;
            }

            constructor() {
              super();
            }

            publicMethod() {}

            _privateMethod() {}

            _onClick() {}

            connectedCallback() {
              super.connectedCallback();
            }

            willUpdate() {}

            render() {
              return html\`\`;
            }

            _renderItem() {}

            static get styles() {
              return css\`\`;
            }
          }
        `,
      },
      {
        name: 'non-LitElement class should be ignored',
        code: `
          class MyService {
            constructor() {}
            render() {}
            connect() {}
          }
        `,
      },
      {
        name: 'LitElement subclass detected via static get properties',
        code: `
          class MyComponent extends CcFormControlElement {
            static get properties() {
              return { a: { type: String } };
            }

            constructor() {
              super();
            }

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'single member should be ignored',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }
          }
        `,
      },
      {
        name: 'only some groups present but in correct order',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            constructor() {
              super();
            }

            render() {
              return html\`\`;
            }

            static get styles() {
              return css\`\`;
            }
          }
        `,
      },
    ],
    invalid: [
      {
        name: 'render before static get properties',
        code: `
          class MyComponent extends LitElement {
            render() {
              return html\`\`;
            }

            static get properties() {
              return { a: { type: String } };
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'error message direction reflects where the member should actually move',
        code: `
          class OtherComponent extends LitElement {
            render() {
              return html\`\`;
            }

            static get properties() {
              return { b: { type: String } };
            }
          }
        `,
        errors: [
          {
            messageId: 'unsortedMemberAfter',
            data: { currentGroup: 'render()', expectedGroup: 'static get properties()' },
          },
          {
            messageId: 'unsortedMemberBefore',
            data: { currentGroup: 'static get properties()', expectedGroup: 'render()' },
          },
        ],
        output: `
          class OtherComponent extends LitElement {
            static get properties() {
              return { b: { type: String } };
            }

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'static get styles before render',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            static get styles() {
              return css\`\`;
            }

            render() {
              return html\`\`;
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            render() {
              return html\`\`;
            }

            static get styles() {
              return css\`\`;
            }
          }
        `,
      },
      {
        name: 'event handler before private method',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            _onClick() {}

            _helperMethod() {}

            render() {
              return html\`\`;
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            _helperMethod() {}

            _onClick() {}

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'comments should move with their members',
        code: `
          class MyComponent extends LitElement {
            // The render method
            render() {
              return html\`\`;
            }

            // The properties
            static get properties() {
              return { a: { type: String } };
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            // The properties
            static get properties() {
              return { a: { type: String } };
            }

            // The render method
            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'same group members preserve relative order',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            render() {
              return html\`\`;
            }

            publicMethodB() {}

            publicMethodA() {}

            static get styles() {
              return css\`\`;
            }
          }
        `,
        errors: [
          { messageId: 'unsortedMemberAfter' },
          { messageId: 'unsortedMemberBefore' },
          { messageId: 'unsortedMemberBefore' },
        ],
        output: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            publicMethodB() {}

            publicMethodA() {}

            render() {
              return html\`\`;
            }

            static get styles() {
              return css\`\`;
            }
          }
        `,
      },
      {
        name: 'LitElement lifecycle before custom element lifecycle',
        code: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            willUpdate() {}

            connectedCallback() {
              super.connectedCallback();
            }

            render() {
              return html\`\`;
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            static get properties() {
              return { a: { type: String } };
            }

            connectedCallback() {
              super.connectedCallback();
            }

            willUpdate() {}

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'LitElement subclass detected via static get properties',
        code: `
          class MyComponent extends CcFormControlElement {
            render() {
              return html\`\`;
            }

            static get properties() {
              return { a: { type: String } };
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends CcFormControlElement {
            static get properties() {
              return { a: { type: String } };
            }

            render() {
              return html\`\`;
            }
          }
        `,
      },
      {
        name: 'extends LitElement without static get properties or styles',
        code: `
          class MyComponent extends LitElement {
            render() {
              return html\`\`;
            }

            constructor() {
              super();
            }
          }
        `,
        errors: [{ messageId: 'unsortedMemberAfter' }, { messageId: 'unsortedMemberBefore' }],
        output: `
          class MyComponent extends LitElement {
            constructor() {
              super();
            }

            render() {
              return html\`\`;
            }
          }
        `,
      },
    ],
  },
};
