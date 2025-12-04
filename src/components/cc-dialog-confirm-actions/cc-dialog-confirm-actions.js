import { LitElement, css, html } from 'lit';
import { isStringEmpty } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import { CcDialogCloseRequestEvent } from '../cc-dialog/cc-dialog.events.js';
import { CcDialogConfirmEvent } from './cc-dialog-confirm-actions.events.js';

/**
 * A reusable action buttons component for `<cc-dialog>` with Cancel and Confirm/Submit buttons.
 *
 * This component is opinionated about its layout (including top margin) as it's designed to be
 * placed after content requiring user confirmation. It handles responsive layout, button states
 * (waiting, disabled), and events to maximize consistency and reduce boilerplate.
 *
 * @cssdisplay block
 *
 * @cssprop {Length} --cc-dialog-confirm-actions-margin-top - Override the top margin (defaults: `2.75em` on large layouts, `2em` on narrow layouts)
 */
export class CcDialogConfirmActions extends LitElement {
  static get properties() {
    return {
      cancelLabel: { type: String, attribute: 'cancel-label' },
      submitIntent: { type: String, attribute: 'submit-intent' },
      submitLabel: { type: String, attribute: 'submit-label' },
      waiting: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Sets the label for the cancel button. Optional, only provide a value if you want to override the default label of the cancel button. */
    this.cancelLabel = null;

    /** @type {string|null} Sets the label for the submit button */
    this.submitLabel = null;

    /** @type {'primary'|'danger'} Sets the color of the submit button */
    this.submitIntent = 'primary';

    /** @type {boolean} Disables the form inputs and buttons, and shows a loading indicator in the submit button */
    this.waiting = false;
  }

  _onCancel() {
    this.dispatchEvent(new CcDialogCloseRequestEvent());
  }

  _onConfirm() {
    this.dispatchEvent(new CcDialogConfirmEvent());
  }

  render() {
    return html`
      <div class="dialog-actions">
        <cc-button outlined @cc-click="${this._onCancel}" ?disabled="${this.waiting}" type="reset">
          ${!isStringEmpty(this.cancelLabel) ? this.cancelLabel : i18n('cc-dialog-confirm-actions.cancel')}
        </cc-button>
        <cc-button
          ?primary="${this.submitIntent === 'primary'}"
          ?danger="${this.submitIntent === 'danger'}"
          type="submit"
          ?waiting="${this.waiting}"
          @cc-click="${this._onConfirm}"
        >
          ${this.submitLabel}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          container: host / inline-size;
          display: block;
        }

        .dialog-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: var(--cc-dialog-confirm-actions-margin-top, 2.75em);
        }

        @container host (max-width: 27em) {
          .dialog-actions {
            display: grid;
            justify-content: stretch;
            margin-top: var(--cc-dialog-confirm-actions-margin-top, 2em);
          }
        }
      `,
    ];
  }
}

customElements.define('cc-dialog-confirm-actions', CcDialogConfirmActions);
