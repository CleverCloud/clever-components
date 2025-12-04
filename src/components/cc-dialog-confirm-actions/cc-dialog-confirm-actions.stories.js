import { html, render } from 'lit';
import { createTestingUI, getDialogHandlers } from '../../stories/fixtures/cc-dialog-helpers.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-dialog/cc-dialog.js';
import './cc-dialog-confirm-actions.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog-confirm-actions>',
  component: 'cc-dialog-confirm-actions',
};

/**
 * @typedef {import('./cc-dialog-confirm-actions.js').CcDialogConfirmActions} CcDialogConfirmActions
 * @typedef {import('../cc-dialog/cc-dialog.js').CcDialog} CcDialog
 */

const conf = {
  component: 'cc-dialog-confirm-actions',
};

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-actions');
    render(
      html`
        ${createTestingUI(container)}
        <cc-dialog open heading="Simple confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This is a simple confirmation dialog.</p>
          <cc-dialog-confirm-actions submit-label="Confirm" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirm-actions>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const submitIntentWithDanger = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-actions');

    render(
      html`
        <cc-dialog open heading="Delete Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This action cannot be undone.</p>
          <cc-dialog-confirm-actions submit-label="Delete" submit-intent="danger" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirm-actions>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const cancelLabel = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-actions');

    render(
      html`
        <cc-dialog open heading="Unsaved modifications" @cc-dialog-close="${onClose}">
          <p style="margin: 0">You have unsaved modifications.</p>
          <cc-dialog-confirm-actions submit-label="Save" cancel-label="Discard" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirm-actions>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waiting = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const { onClose, onConfirm } = getDialogHandlers(container, 'cc-dialog-confirm-actions');

    render(
      html`
        <cc-dialog open heading="Delete Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This action cannot be undone.</p>
          <cc-dialog-confirm-actions
            submit-label="Delete"
            submit-intent="danger"
            waiting
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirm-actions>
        </cc-dialog>
      `,
      container,
    );
  },
});
