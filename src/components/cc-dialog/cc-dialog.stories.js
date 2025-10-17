import { html, render } from 'lit';
import { iconRemixImageCircleFill as imageIcon } from '../../assets/cc-remix.icons.js';
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
          content-body="This is a simple dialog using only properties."
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
          content-body="Are you sure you want to save these changes?"
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
          content-body="Are you sure you want to delete this resource? This action cannot be undone."
          submit-label="Delete"
          cancel-label="Cancel"
          submit-intent="danger"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const submitWithCustomCancelLabel = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete Resource</cc-button>
        <cc-dialog
          open
          heading="Delete Resource"
          content-body="Are you sure you want to delete this resource? This action cannot be undone."
          submit-label="Delete"
          cancel-label="Discard"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const waitingStateWithNoSubmit = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Process Action</cc-button>
        <cc-dialog
          open
          waiting
          heading="Waiting"
          content-body="Users cannot close this dialog as long as it's in waiting mode. Most legitimate usecases should contain a submit button or confirm form."
        >
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waitingStateWithSubmit = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Process Action</cc-button>
        <cc-dialog
          open
          waiting
          heading="Waiting"
          content-body="Users cannot close this dialog as long as it's in waiting mode."
          submit-label="Submit"
        >
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waitingStateWithConfirmForm = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Process Action</cc-button>
        <cc-dialog
          open
          waiting
          heading="Waiting"
          confirm-input-label="Enter a value"
          confirm-text-to-input="a value"
          submit-label="Submit"
        >
          <p slot="content-body">Text slotted into content-body</p>
        </cc-dialog>
      `,
      container,
    );
    const ccDialogElement = getDialog(container);
    ccDialogElement.updateComplete.then(() => {
      ccDialogElement.shadowRoot.querySelector('cc-input-text').value = 'a value';
    });
  },
});

// ========================================
// SLOT-BASED STORIES
// ========================================
// These stories demonstrate using slots for rich, custom content.
// Use slots when you need complex markup, forms, or styled content.

export const slotWithHeading = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Custom Heading</cc-button>
        <cc-dialog open content-body="Content passed through the content-body prop">
          <div slot="heading">
            <cc-icon .icon="${imageIcon}" a11y-name="An icon to show that you may slot other HTML elements"></cc-icon>
            <span>Slotted heading with HTML elements!</span>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const slotWithContentBody = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Form</cc-button>
        <cc-dialog open heading="Heading passed through the heading prop">
          <div slot="content-body">
            <cc-notice intent="info">
              <div slot="message">This notice is slotted into content-body.</div>
            </cc-notice>
            <p style="margin-bottom: 0; margin-top: 2em;">This content is slotted into content-body</p>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const slotWithActions = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Multi-Action</cc-button>
        <cc-dialog
          open
          heading="Heading passed through the heading prop"
          content-body="Content passed through the content-body prop"
        >
          <div slot="heading">Choose an Action</div>
          <div slot="actions">
            <cc-button outlined>Save and come back later</cc-button>
            <cc-button danger>Delete draft</cc-button>
            <cc-button primary>Publish</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const slotWithReplacingAllContent = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Custom Dialog</cc-button>
        <cc-dialog open>
          <div slot="content" style="padding: 1em;">
            <h2 style="margin-top: 0; color: #3b82f6;">Fully Custom</h2>
            <p>This dialog uses the content slot for complete customization.</p>
            <p>You have full control over layout, styling, and structure.</p>
            <div style="display: flex; gap: 1em; margin-top: 2em;">
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

export const confirmForm = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete my-app</cc-button>
        <cc-dialog
          open
          heading="Archive Application"
          content-body="This action may be reverted at any time."
          confirm-text-to-input="my-app"
          confirm-input-label="Type the application name to confirm"
          submit-label="Archive Application"
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const confirmFormWithDangerSubmit = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete my-app</cc-button>
        <cc-dialog
          open
          heading="Delete Application"
          content-body="This will permanently delete the application 'my-app' and all its data. This action cannot be undone."
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

export const confirmToDeleteWithInputAutofocus = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" danger>Delete database</cc-button>
        <cc-dialog
          open
          heading="Delete Database"
          content-body="This will permanently delete the database 'production-db' and all its data. This action cannot be undone."
          confirm-text-to-input="production-db"
          confirm-input-label="Type 'production-db' to confirm deletion"
          submit-label="Delete Database"
          submit-intent="danger"
          autofocus-input
        ></cc-dialog>
      `,
      container,
    );
  },
});

export const longContent = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>View Terms</cc-button>
        <cc-dialog open heading="Terms and Conditions" submit-label="Accept" cancel-label="Decline">
          <div slot="content-body">
            <p>Please read these terms carefully before proceeding.</p>
            <h2>1. Introduction</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
            <h2>2. Usage Rights</h2>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
            <h2>3. Limitations</h2>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <h2>4. Privacy</h2>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
            <h2>5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>
            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any
              reason whatsoever.
            </p>
            <h2>7. Governing Law</h2>
            <p>
              These terms shall be governed and construed in accordance with the laws of the jurisdiction, without
              regard to its conflict of law provisions.
            </p>
            <h2>8. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive
              property of the company and its licensors.
            </p>
            <h2>9. Indemnification</h2>
            <p>
              You agree to defend, indemnify and hold harmless the company and its licensee and licensors from and
              against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses.
            </p>
            <h2>10. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at support@example.com.</p>
            <h3>10.1. Support Hours</h3>
            <p>Our support team is available Monday to Friday, 9am to 5pm.</p>
            <h3>10.2. Feedback</h3>
            <p>We welcome your feedback and suggestions to improve our service.</p>
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
        <cc-dialog heading="Programmatic Control" content-body="This dialog can be controlled programmatically.">
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
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-dialog
          open
          heading="Already Open"
          content-body="This dialog was opened automatically."
          submit-label="Close"
        >
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

/**
 * @param {HTMLElement} container
 * @returns {CcDialog|null}
 */
function getDialog(container) {
  return container.querySelector('cc-dialog');
}
