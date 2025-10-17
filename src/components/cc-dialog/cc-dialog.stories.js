import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import './cc-dialog.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog>',
  component: 'cc-dialog',
};

/**
 * @typedef {import('./cc-dialog.js').CcDialog} CcDialog
 */

const conf = {
  component: 'cc-dialog',
  displayMode: 'flex-wrap',
};

// ========================================
// PROPERTY-BASED STORIES
// ========================================
// These stories demonstrate using component properties for simple configurations.
// Use props when you need basic text content and standard button layouts.

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Simple Dialog</cc-button>
        <cc-dialog
          open
          heading="Welcome"
          content="This is a simple dialog using only properties."
          submit-label="Got it"
          cancel-label="Close"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const submitIntentWithPrimary = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Save Changes</cc-button>
        <cc-dialog
          open
          heading="Save Changes"
          content="Are you sure you want to save these changes?"
          submit-label="Save"
          cancel-label="Cancel"
          submit-intent="primary"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const submitIntentWithDanger = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete Resource</cc-button>
        <cc-dialog
          open
          heading="Delete Resource"
          content="Are you sure you want to delete this resource? This action cannot be undone."
          submit-label="Delete"
          cancel-label="Cancel"
          submit-intent="danger"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const waitingState = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Process Action</cc-button>
        <cc-dialog
          open
          waiting
          heading="Processing"
          content="Click Submit to see the waiting state."
          submit-label="Submit"
          cancel-label="Cancel"
        >
        </cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// SLOT-BASED STORIES
// ========================================
// These stories demonstrate using slots for rich, custom content.
// Use slots when you need complex markup, forms, or styled content.

export const headingSlot = makeStory(conf, {
  docs: `
Demonstrates the \`heading\` slot for rich heading content.
Use this when you need icons, badges, or styled headings.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Custom Heading</cc-button>
        <cc-dialog>
          open
          <div slot="heading" style="display: flex; align-items: center; gap: 0.5em;">
            <span>🎉</span>
            <span>Success!</span>
          </div>
          <div slot="content">
            <p>Your operation completed successfully.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getDialog(container).hide()}" primary>OK</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const contentSlot = makeStory(conf, {
  docs: `
Demonstrates the \`content\` slot for rich content.
Use this when you need forms, lists, or complex layouts.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Form</cc-button>
        <cc-dialog>
          open
          <div slot="heading">Create New Item</div>
          <div slot="content">
            <cc-input-text label="Name" placeholder="Enter name" required></cc-input-text>
            <cc-input-text label="Description" placeholder="Enter description" multi></cc-input-text>
            <cc-notice intent="info">
              <div slot="message">All fields are required.</div>
            </cc-notice>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Cancel</cc-button>
            <cc-button primary>Create</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const actionsSlot = makeStory(conf, {
  docs: `
Demonstrates the \`actions\` slot for custom button layouts.
Use this when you need multiple buttons or custom action arrangements.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Multi-Action</cc-button>
        <cc-dialog>
          open
          <div slot="heading">Choose an Action</div>
          <div slot="content">
            <p>You can save your work, save and continue, or discard changes.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Discard</cc-button>
            <cc-button success>Save</cc-button>
            <cc-button primary>Save & Continue</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const defaultSlot = makeStory(conf, {
  docs: `
Demonstrates the default slot for complete customization.
Use this when you need full control over the dialog layout and styling.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Custom Dialog</cc-button>
        <cc-dialog>
          open
          <div style="padding: 2em;">
            <h2 style="margin-top: 0; color: #3b82f6;">Fully Custom</h2>
            <p>This dialog uses the default slot for complete customization.</p>
            <p>You have full control over layout, styling, and structure.</p>
            <div style="display: flex; gap: 1em; margin-top: 2em; justify-content: flex-end;">
              <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Cancel</cc-button>
              <cc-button primary>OK</cc-button>
            </div>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// CONFIRMATION PATTERN STORIES
// ========================================
// These stories demonstrate the type-to-confirm pattern for dangerous operations.

export const confirmToDelete = makeStory(conf, {
  docs: `
Demonstrates the confirmation pattern using \`confirm-text-to-input\` and \`confirm-input-label\`.
This creates a type-to-confirm flow, perfect for irreversible destructive actions.
The user must type the exact text to enable the submit button.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete my-app</cc-button>
        <cc-dialog
          open
          heading="Delete Application"
          content="This will permanently delete the application 'my-app' and all its data. This action cannot be undone."
          confirm-text-to-input="my-app"
          confirm-input-label="Type the application name to confirm"
          submit-label="Delete Application"
          cancel-label="Cancel"
          submit-intent="danger"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const confirmToDeleteWithAutofocus = makeStory(conf, {
  docs: `
Same as confirmToDelete but with \`autofocus-input\` enabled.
The confirmation input will be automatically focused when the dialog opens.

**Note:** Using autofocus is generally discouraged for accessibility reasons.
See MDN's autofocus accessibility concerns for more information.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete database</cc-button>
        <cc-dialog
          open
          heading="Delete Database"
          content="This will permanently delete the database 'production-db' and all its data. This action cannot be undone."
          confirm-text-to-input="production-db"
          confirm-input-label="Type 'production-db' to confirm deletion"
          submit-label="Delete Database"
          cancel-label="Cancel"
          submit-intent="danger"
          autofocus-input
        ></cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// MIXED APPROACH STORIES
// ========================================
// These stories show when to mix props and slots effectively.

export const propsWithSlotContent = makeStory(conf, {
  docs: `
Shows using props for structure (heading, buttons) while using the content slot for rich content.
This is a good balance for most use cases.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Show Warning</cc-button>
        <cc-dialog
          open
          heading="Important Warning"
          submit-label="I Understand"
          cancel-label="Cancel"
          submit-intent="primary"
        >
          <div slot="content">
            <cc-notice intent="warning">
              <div slot="message">This action will affect all connected services.</div>
            </cc-notice>
            <p>Proceeding will:</p>
            <ul>
              <li>Restart all running instances</li>
              <li>Disconnect active sessions</li>
              <li>Clear cached data</li>
            </ul>
            <p>Are you sure you want to continue?</p>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const longContent = makeStory(conf, {
  docs: `
Shows how the dialog handles longer content with scrolling.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>View Terms</cc-button>
        <cc-dialog heading="Terms and Conditions" submit-label="Accept" cancel-label="Decline">
          open
          <div slot="content">
            <p>Please read these terms carefully before proceeding.</p>
            <h3>1. Introduction</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
            <h3>2. Usage Rights</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
            <h3>3. Limitations</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <h3>4. Privacy</h3>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
            <h3>5. Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time.</p>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// PROGRAMMATIC CONTROL STORIES
// ========================================

export const programmaticControl = makeStory(conf, {
  docs: `
Demonstrates programmatic control using \`show()\` and \`hide()\` methods.
You can also control the dialog via the \`open\` property.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <div style="display: flex; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open via show()</cc-button>
          <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Close via hide()</cc-button>
          <cc-button @cc-click="${() => (getDialog(container).open = !getDialog(container).open)}">
            Toggle via open property
          </cc-button>
        </div>
        <cc-dialog heading="Programmatic Control" content="This dialog can be controlled programmatically.">
          open
          <div slot="actions">
            <cc-button @cc-click="${() => getDialog(container).hide()}" primary>Close</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const openByDefault = makeStory(conf, {
  docs: `
Shows a dialog that is open by default using the \`open\` attribute.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-dialog open heading="Already Open" content="This dialog was opened automatically." submit-label="Close">
          open
        </cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// ACCESSIBILITY STORIES
// ========================================

export const withAutofocusInput = makeStory(conf, {
  docs: `
Demonstrates autofocus on form inputs within the dialog.

**Important:** Using autofocus is generally discouraged for accessibility reasons.
Users with screen readers may find it disorienting. Only use when appropriate.
See [MDN autofocus accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus#accessibility_concerns).
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Login Form</cc-button>
        <cc-dialog heading="Login">
          open
          <form slot="content">
            <cc-input-text
              autofocus
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            ></cc-input-text>
            <cc-input-text
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            ></cc-input-text>
          </form>
          <div slot="actions">
            <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Cancel</cc-button>
            <cc-button primary>Login</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * @param {HTMLElement} container
 * @returns {CcDialog|null}
 */
function getDialog(container) {
  return container.querySelector('cc-dialog');
}
