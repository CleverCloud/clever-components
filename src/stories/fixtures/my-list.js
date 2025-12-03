import { LitElement, css, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { LostFocusController } from "../../controllers/lost-focus-controller.js";
import "../../components/cc-button/cc-button.js";

/**
 * @typedef {import('../../components/cc-button/cc-button.js').CcButton} CcButton
 * @typedef {import('../../components/common.events.js').CcClickEvent} CcClickEvent
 */

export class MyList extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<string>} */
    this.items = [];

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      /** @type {CcButton} */
      const ccButtonElement = suggestedElement?.querySelector('cc-button');
      ccButtonElement?.focus();
    });
  }

  /** @param {CcClickEvent} event */
  _onRemove(event) {
    const ccButtonElement = /** @type {CcButton} */ (event.currentTarget);
    const item = ccButtonElement.dataset.name;
    ccButtonElement.waiting = true;
    setTimeout(() => {
      this.items = this.items.filter((e) => e !== item);
    }, 2000);
  }

  focus() {
    const ccButtonElement = /** @type {CcButton} */ (this.shadowRoot.querySelector('cc-button'));
    ccButtonElement.focus();
  }

  render() {
    return repeat(
      this.items,
      (item) => item,
      (item) => html`
        <div class="item">
          <cc-button @cc-click="${this._onRemove}" data-name="${item}">Remove</cc-button>
          <span>${item}</span>
        </div>
      `,
    );
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        div {
          margin-bottom: 0.2em;
        }
      `,
    ];
  }
}
window.customElements.define('my-list', MyList);
