import { LitElement, css, html } from "lit";
import { createRef } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { LostFocusController } from "../../controllers/lost-focus-controller.js";
import "../../components/cc-dialog/cc-dialog.js";
import "../../components/cc-button/cc-button.js";

/**
 * @typedef {import('../../components/cc-dialog/cc-dialog.js').CcDialog} CcDialog
 * @typedef {import('lit/directives/ref.js').Ref<CcDialog>} CcDialogRef
 * @typedef {import('lit').PropertyValues<MyDialogListExample>} MyDialogListExamplePropertyValues
 */

export class MyDialogListExample extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      _itemToRemove: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {Array<{ id: string, name: string }>} */
    this.items = [];

    /** @type {{ id: string, name: string }|null} */
    this._itemToRemove = null;

    /** @type {CcDialogRef} */
    this._dialogRef = createRef();

    new LostFocusController(this, '.remove-btn', ({ suggestedElement, removedElements }) => {
      console.log('focus lost', removedElements, suggestedElement)
      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      } else {
        this.shadowRoot.getElementById('empty').focus();
      }
    });
  }

  /** @param {{ id: string, name: string }} item */
  _onRemoveRequest(item) {
    this._itemToRemove = item;
  }

  _onDialogClose() {
    this._itemToRemove = null;
  }

  _onRemoveConfirm() {
    this.dispatchEvent(new CustomEvent('remove-item', { detail: this._itemToRemove }))
  }

  /** @param {MyDialogListExamplePropertyValues} changedProperties */
  willUpdate(changedProperties) {
    const currentItems = this.items ?? [];
    const previousItems = changedProperties.get('items') ?? [];
    // if an item has been removed
    if (currentItems.length < previousItems.length) {
      // close the dialog
      this._itemToRemove = null;
    }
  }

  /** @param {MyDialogListExamplePropertyValues} changedProperties */
  updated(changedProperties) {
    const currentItems = this.items ?? [];
    const previousItems = changedProperties.get('items') ?? [];
    // if an item has been removed
    if (currentItems.length < previousItems.length) {
      const currentIds = new Set(currentItems.map(item => item.id));
      const removed = previousItems.filter(item => !currentIds.has(item.id));
      console.log(removed);
    }
  }

  render() {
    return html`
      <cc-dialog
        ?open="${this._itemToRemove != null}"
        heading="Confirm removal of ${this._itemToRemove?.name}"
        submit-label="Remove"
        submit-intent="danger"
        @cc-dialog-close="${this._onDialogClose}"
        @cc-dialog-confirm="${this._onRemoveConfirm}"
      >
      </cc-dialog>
      <ul id="item-list">
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => html`
            <li class="item">
              <span>${item.name}</span>
              <cc-button class="remove-btn" @cc-click="${() => this._onRemoveRequest(item)}" danger>Remove</cc-button>
            </li>
          `,
        )}
        ${this.items.length === 0 ? html`<p id="empty" tabindex="-1">All items have been removed! Focus should be moved here</p>` : ''}
      </ul>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        ul {
          display: grid;
          gap: 0.5em;
        }

        li {
          align-items: center;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
          display: flex;
          gap: 1em;
          padding-bottom: 0.5em;
          padding-inline: 0.5em;
        }
      `,
    ]
  }
}
window.customElements.define('my-dialog-list-example', MyDialogListExample);
