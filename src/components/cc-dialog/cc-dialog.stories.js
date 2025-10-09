import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import './cc-dialog.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog>',
  component: 'cc-dialog',
};

const conf = {
  component: 'cc-dialog',
  displayMode: 'flex-wrap',
};

/**
 * @typedef {import('./cc-dialog.js').CcDialog} CcDialog
 */

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Dialog Title</div>
          <div slot="content">This is the dialog content.</div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button primary>Confirm</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withLongContent = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Long Content Dialog</div>
          <div slot="content">
            <p>This dialog contains more content to demonstrate how it handles longer text.</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button primary>Confirm</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const confirmationDialog = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Delete Resource</div>
          <div slot="content">
            <p>Are you sure you want to delete this resource?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button danger>Delete</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const formDialog = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Create New Item</div>
          <div slot="content">
            <cc-input-text label="Name" placeholder="Enter name"></cc-input-text>
            <cc-input-text label="Description" placeholder="Enter description" multi></cc-input-text>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button primary>Create</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});
export const simpleNotice = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Success</div>
          <div slot="content">
            <p>Your changes have been saved successfully.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" primary>OK</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withNoticeComponent = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Important Notice</div>
          <div slot="content">
            <cc-notice intent="warning">
              <div slot="message">This action will affect all connected services.</div>
            </cc-notice>
            <p>Are you sure you want to proceed?</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button warning>Proceed</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const programmaticControl = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Programmatically Opened</div>
          <div slot="content">
            <p>This dialog was opened using the show() method.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}">Close</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const events = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const dialog = document.createElement('cc-dialog');
    dialog.innerHTML = `
      <div slot="heading">Event Handling</div>
      <div slot="content">
        <p>Open the browser console to see events being dispatched.</p>
        <p>Events are logged when the dialog opens and closes.</p>
      </div>
      <div slot="actions">
        <cc-button>Close</cc-button>
      </div>
    `;

    dialog.addEventListener('cc-dialog-open', () => {
      console.log('Dialog opened');
    });

    dialog.addEventListener('cc-dialog-close', () => {
      console.log('Dialog closed');
    });

    const closeButton = dialog.querySelector('cc-button');
    closeButton.addEventListener('cc-click', () => {
      dialog.hide();
    });

    render(
      html`
        <cc-button @cc-click="${() => dialog.show()}" primary> Open Dialog </cc-button>
        ${dialog}
      `,
      container,
    );
  },
});

export const multipleActions = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Multiple Actions</div>
          <div slot="content">
            <p>Choose an option from the actions below.</p>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button success>Save</cc-button>
            <cc-button primary>Save & Continue</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const customSlot = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div style="padding: 2em;">
            <h2 style="margin-top: 0;">Custom Content</h2>
            <p>This dialog uses the default slot for complete customization.</p>
            <div style="display: flex; gap: 1em; margin-top: 2em;">
              <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
              <cc-button primary>OK</cc-button>
            </div>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const closeOnEscape = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Dialog </cc-button>
        <cc-dialog open>
          <div slot="heading">Try Closing Methods</div>
          <div slot="content">
            <p>You can close this dialog by:</p>
            <ul>
              <li>Clicking the X button</li>
              <li>Pressing Escape</li>
              <li>Clicking the Close button below</li>
            </ul>
          </div>
          <div slot="actions">
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}">Close</cc-button>
          </div>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const withAutofocus = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const handleSubmit = () => {
      getCcDialogElement(container).hide();
      alert('Form submitted successfully!');
    };

    render(
      html`
        <cc-button @cc-click="${() => getCcDialogElement(container).show()}" primary> Open Login Form </cc-button>
        <cc-dialog open>
          <div slot="heading">Login</div>
          <div slot="content">
            <p>
              You may use the <code>autofocus</code> attribute on a native HTML element or a Clever Cloud form control
              element so that it's focused upon dialog opening.
            </p>
            <p>
              <strong>Note:</strong> Using this attribute is generally discouraged for accessibility reasons. See
              <cc-link
                href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus#accessibility_concerns"
              >
                MDN autofocus accessibility concerns
              </cc-link>
              for more information.
            </p>
          </div>
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
            <cc-button @cc-click="${() => getCcDialogElement(container).hide()}" outlined>Cancel</cc-button>
            <cc-button @cc-click="${handleSubmit}" primary>Login</cc-button>
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
function getCcDialogElement(container) {
  return container.querySelector('cc-dialog');
}
