import { html } from "lit";
import { CcDialogConfirmActions } from "../../components/cc-dialog-confirm-actions/cc-dialog-confirm-actions.js";
import { CcDialogConfirmForm } from "../../components/cc-dialog-confirm-form/cc-dialog-confirm-form.js";

/**
 * @param {HTMLElement} container
 * @returns {import("../../components/cc-dialog/cc-dialog.stories.js").CcDialog|null}
 */
export function getDialog(container) {
  return container.querySelector('cc-dialog');
}

/**
 * Creates event handlers for dialog interactions
 * @param {HTMLElement} container
 * @param {import("../../components/cc-dialog/cc-dialog.stories.js").CcDialogConfirmForm['tagName']|import("../../components/cc-dialog-confirm-actions/cc-dialog-confirm-actions.stories.js").CcDialogConfirmActions['tagName']} componentSelector
 * @returns {{onClose: Function, onConfirm: Function}}
 */
export function getDialogHandlers(container, componentSelector) {
  const onClose = () => {
    const output = container.querySelector('#close-event-output');
    const timestamp = new Date().toLocaleTimeString();
    output.textContent = `Dialog closed at ${timestamp}`;
  };

  const onConfirm = () => {
    const output = container.querySelector('#confirm-event-output');
    const timestamp = new Date().toLocaleTimeString();
    output.textContent = `Dialog confirmed at ${timestamp}`;

    const component = /** @type {import("../../components/cc-dialog/cc-dialog.stories.js").CcDialogConfirmForm|import("../../components/cc-dialog-confirm-actions/cc-dialog-confirm-actions.stories.js").CcDialogConfirmActions|null} */ (
      container.querySelector(componentSelector)
    );

    if (component instanceof CcDialogConfirmForm || component instanceof CcDialogConfirmActions) {
      component.waiting = true;

      setTimeout(() => {
        getDialog(container).open = false;
        component.waiting = false;
      }, 1000);
    }
  };

  return { onClose, onConfirm };
}



/**
 * Creates the standard testing UI with button and output divs
 * @param {HTMLElement} container
 * @returns {import('lit').TemplateResult}
 */
export function createTestingUI(container) {
  return html`
    <div style="display: flex; flex-direction: column; gap: 1em;">
      <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
      <div
        id="confirm-event-output"
        style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
      >
        Confirm the dialog to see the event output
      </div>
      <div id="close-event-output" style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;">
        Close the dialog to see the event output
      </div>
    </div>
  `;
}
