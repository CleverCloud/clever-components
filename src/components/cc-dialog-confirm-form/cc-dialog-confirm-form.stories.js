import { html, render } from 'lit';
import { createTestingUI, getDialogHandlers } from '../../stories/fixtures/cc-dialog-helpers.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-notice/cc-notice.js';
import './cc-dialog-confirm-form.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog-confirm-form>',
  component: 'cc-dialog-confirm-form',
};

/**
 * @import { CcDialogConfirmForm } from './cc-dialog-confirm-form.js';
 * @import { CcInputText } from '../cc-input-text/cc-input-text.js';
 * @import { CcButton } from '../cc-button/cc-button.js';
 */

const conf = {
  component: 'cc-dialog-confirm-form',
};

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This is a simple confirmation dialog.</p>
          <cc-dialog-confirm-form
            submit-label="Confirm"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          ></cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const submitIntentWithDanger = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">Type the application name to confirm deletion.</p>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const autofocusInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">The input field is automatically focused when the dialog opens.</p>
          <cc-notice intent="warning" heading="Important considerations" style="margin-bottom: 1.5em">
            <p slot="message">
              Only use this if there is no important content before the text input that users should read first.
            </p>
            <p slot="message">
              This component must be present in the DOM before opening the dialog. If you're creating the dialog
              on-demand (e.g., rendering it only when showing), autofocus may not work reliably.
            </p>
          </cc-notice>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            autofocus-input
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );
    // Note: for auto
    /** @type {CcButton} */
    const openerButton = container.querySelector('cc-button');
    openerButton.updateComplete.then(() => {
      openerButton.shadowRoot.querySelector('button').click();
    });
  },
});

export const longConfirmTextToInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Delete Application Permanently" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This demonstrates a confirmation with a very long text that must be typed.</p>
          <cc-dialog-confirm-form
            submit-label="Delete permanently"
            submit-intent="danger"
            confirm-input-label="Type the full name to confirm deletion"
            confirm-text-to-input="my-very-long-application-name-that-is-difficult-to-type"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waiting = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Waiting State with Input" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This shows the waiting state with a confirmation input field.</p>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            waiting
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const errorWithEmpty = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Waiting State with Input" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This shows the waiting state with a confirmation input field.</p>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );

    /** @type {CcDialogConfirmForm} */
    const ccDialogConfirmForm = container.querySelector('cc-dialog-confirm-form');
    ccDialogConfirmForm.updateComplete.then(() => {
      const form = ccDialogConfirmForm.shadowRoot.querySelector('form');
      form.requestSubmit();
    });
  },
});

export const errorWithWrongInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Waiting State with Input" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This shows the waiting state with a confirmation input field.</p>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );

    /** @type {CcDialogConfirmForm} */
    const ccDialogConfirmForm = container.querySelector('cc-dialog-confirm-form');
    ccDialogConfirmForm.updateComplete.then(() => {
      /** @type {CcInputText} */
      const ccInputText = ccDialogConfirmForm.shadowRoot.querySelector('cc-input-text');
      const form = ccDialogConfirmForm.shadowRoot.querySelector('form');
      ccInputText.value = 'wrong-input';
      form.requestSubmit();
    });
  },
});

export const errorWithWrongInputAndCustomErrorMessage = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-form');

    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Waiting State with Input" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This shows the waiting state with a confirmation input field.</p>
          <cc-dialog-confirm-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            confirm-error-message="Invalid value. Enter the name of your app 'my-app' as value"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-form>
        </cc-dialog>
      `,
      container,
    );

    /** @type {CcDialogConfirmForm} */
    const ccDialogConfirmForm = container.querySelector('cc-dialog-confirm-form');
    ccDialogConfirmForm.updateComplete.then(() => {
      /** @type {CcInputText} */
      const ccInputText = ccDialogConfirmForm.shadowRoot.querySelector('cc-input-text');
      const form = ccDialogConfirmForm.shadowRoot.querySelector('form');
      ccInputText.value = 'wrong-input';
      form.requestSubmit();
    });
  },
});
