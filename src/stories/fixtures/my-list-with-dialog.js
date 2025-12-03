import { LitElement, css, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { LostFocusController } from "../../controllers/lost-focus-controller.js";
import "../../components/cc-button/cc-button.js";
import "../../components/cc-dialog/cc-dialog.js";

/**
 * @typedef {import('../../components/common.events.js').CcClickEvent} CcClickEvent
 * @typedef {import('../../components/cc-button/cc-button.js').CcButton} CcButton
 */

export class MyListWithDialog extends LitElement {
  static get properties() {
    return {
      _itemToDelete: { type: String, state: true },
      items: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<string>} */
    this.items = [];

    /** @type {string} */
    this._itemToDelete = null;

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      /** @type {CcButton} */
      const ccButtonElement = suggestedElement?.querySelector('cc-button');
      ccButtonElement?.focus();
    });
  }

  /** @param {CcClickEvent} event */
  _onClickRemove(event) {
    const ccButtonElement = /** @type {CcButton} */ (event.currentTarget);
    const item = ccButtonElement.dataset.name;
    this._itemToDelete = item;
  }

  _onConfirmDelete() {
    const dialogDeleteButton = /** @type {CcButton} */ (this.shadowRoot.querySelector('cc-dialog cc-button[primary]'));
    dialogDeleteButton.waiting = true;
    setTimeout(() => {
      this.items = this.items.filter((e) => e !== this._itemToDelete);
      dialogDeleteButton.waiting = false;
      this._itemToDelete = null;
    }, 1000);
  }

  _onCancelDelete() {
    this._itemToDelete = null;
  }

  render() {
    return html`
      ${repeat(
        this.items,
        (item) => item,
        (item) => html`
            <div class="item">
              <cc-button @cc-click=${this._onClickRemove} data-name="${item}">Remove</cc-button>
              <span>${item}</span>
            </div>
          `,
      )}

      <cc-dialog ?open="${this._itemToDelete != null}" heading="Confirm deletion">
        <p>Are you sure you want to delete "${this._itemToDelete}"?</p>
        <div class="dialog-buttons">
          <cc-button @cc-click="${this._onCancelDelete}">Cancel</cc-button>
          <cc-button @cc-click="${this._onConfirmDelete}" primary>Confirm</cc-button>
        </div>
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        div.item {
          margin-bottom: 0.2em;
        }

        .dialog-buttons {
          display: flex;
          gap: 0.5em;
          justify-content: flex-end;
          margin-top: 1em;
        }
      `,
    ];
  }
}
window.customElements.define('my-list-with-dialog', MyListWithDialog);
