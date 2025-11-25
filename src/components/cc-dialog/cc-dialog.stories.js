import { html, render } from 'lit';
import { iconRemixImageCircleFill as imageIcon } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-dialog-confirmation-form/cc-dialog-confirmation-form.js';
import '../cc-notice/cc-notice.js';
import './cc-dialog.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog>',
  component: 'cc-dialog',
};

/**
 * @typedef {import('./cc-dialog.js').CcDialog} CcDialog
 * @typedef {import('../cc-dialog-confirmation-form/cc-dialog-confirmation-form.js').CcDialogConfirmationForm} CcDialogConfirmationForm
 */

const conf = {
  component: 'cc-dialog',
  displayMode: 'flex-wrap',
  css: `
    p {
      margin: 0
    }
  `,
};

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Simple Dialog</cc-button>
        <cc-dialog open heading="Welcome">
          <p>This is a simple dialog using the heading property and default slot for content.</p>
          <p>Upon opening, focus is automatically set inside the dialog.</p>
          <p>By default, it can be closed by pressing Escape, clicking outside, or clicking the close button.</p>
          <p>Upon closing, focus is automatically set back to the opening button.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withIcon = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog with Icon</cc-button>
        <cc-dialog open heading="Information" .headingIcon="${imageIcon}" heading-icon-a11y-name="Information icon">
          <p>This dialog displays an icon before the heading.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withHiddenHeading = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog with Icon</cc-button>
        <cc-dialog open hidden-heading heading="A dialog with no visible heading">
          <p>This dialog has no heading.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withHiddenCloseButton = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
        <cc-dialog open heading="No Close Button" hidden-close-button>
          <p>This dialog has the close button hidden. You'll need to provide your own way to close it.</p>
          <cc-button @cc-click="${() => getDialog(container).hide()}" primary>Close</cc-button>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const closedByNone = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Modal Dialog</cc-button>
        <cc-dialog open heading="Modal Dialog" closed-by="none">
          <p>
            This dialog cannot be closed with the Escape key or by clicking outside. The close button is the only way to
            close it.
          </p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const closedByCloseRequest = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
        <cc-dialog open heading="Close Request Only" closed-by="closerequest">
          <p>
            This dialog can only be closed with the close button or the Escape key, not by clicking outside the dialog.
          </p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const slotWithHeading = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Custom Heading</cc-button>
        <cc-dialog open>
          <div slot="heading">
            <cc-icon .icon="${imageIcon}" a11y-name="Custom icon"></cc-icon>
            <span>Slotted heading with HTML elements!</span>
          </div>
          <p>Content goes in the default slot.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const slotWithRichContent = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Rich Content</cc-button>
        <cc-dialog open heading="Rich Content">
          <cc-notice intent="info">
            <div slot="message">This notice is part of the dialog content.</div>
          </cc-notice>
          <p style="margin-top: 1em;">You can slot any content you need into the dialog body.</p>
          <div style="display: flex; justify-content: end; gap: 1em; margin-top: 1.5em;">
            <cc-button @cc-click="${() => getDialog(container).hide()}" outlined>Cancel</cc-button>
            <cc-button>Save Draft</cc-button>
            <cc-button primary>Publish</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withLongContentAndScroll = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getDialog(container).show()}" primary>View Terms</cc-button>
        <cc-dialog open heading="Terms and Conditions">
          <p>Please read these terms carefully before proceeding.</p>
          <h2>1. Introduction</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <h2>2. Usage Rights</h2>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <h2>3. Limitations</h2>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
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
            These terms shall be governed and construed in accordance with the laws of the jurisdiction, without regard
            to its conflict of law provisions.
          </p>
          <h2>8. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property
            of the company and its licensors.
          </p>
          <h2>9. Indemnification</h2>
          <p>
            You agree to defend, indemnify and hold harmless the company and its licensee and licensors from and against
            any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses.
          </p>
          <h2>10. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at support@example.com.</p>
          <h3>10.1. Support Hours</h3>
          <p>Our support team is available Monday to Friday, 9am to 5pm.</p>
          <h3>10.2. Feedback</h3>
          <p>We welcome your feedback and suggestions to improve our service.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const imperativeApi = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <div style="display: flex; gap: 1em; flex-wrap: wrap;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open via show()</cc-button>
          <cc-button @cc-click="${() => (getDialog(container).open = !getDialog(container).open)}">
            Toggle via open property
          </cc-button>
        </div>
        <cc-dialog open heading="Programmatic Control">
          <p>This dialog can be controlled programmatically using the show(), hide() methods or the open property.</p>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const simpleConfirmation = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Demo with confirmation form" @cc-dialog-close="${onClose}">
          <cc-notice intent="info">
            <div slot="message">
              See stories of the <code>cc-dialog-confirmation-form</code> component for more examples.
            </div>
          </cc-notice>
          <p style="margin: 0">This is a simple confirmation without input validation.</p>
          <cc-dialog-confirmation-form submit-label="Delete" submit-intent="danger" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const confirmationForm = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Demo with confirmation form" @cc-dialog-close="${onClose}">
          <cc-notice intent="info">
            <div slot="message">
              See stories of the <code>cc-dialog-confirmation-form</code> component for more examples.
            </div>
          </cc-notice>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-text-to-input="text-to-confirm"
            confirm-input-label="Type 'text-to-confirm' to confirm"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
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
