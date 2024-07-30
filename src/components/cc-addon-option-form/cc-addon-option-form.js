import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-addon-option/cc-addon-option.js';
import '../cc-block-new/cc-block-new.js';
import '../cc-button/cc-button.js';

/**
 * @typedef {import('../common.types.js').AddonOption} AddonOption
 */

/**
 * A component that displays a form of `<cc-addon-option>`.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<object>} cc-addon-option-form:submit - Fires when the form is submitted.
 *
 * @slot description - The description of the add-on and available options.
 */
export class CcAddonOptionForm extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
      title: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {AddonOption[]} List of Option object to render. */
    this.options = null;

    /** @type {string} Title of the whole options form. */
    this.title = null;

    /** @type {object} */
    this._optionsStates = {};
  }

  _onSubmit() {
    // If some options were not changed, fill them here
    this.options.forEach((option) => {
      if (this._optionsStates[option.name] == null) {
        this._optionsStates[option.name] = option.enabled || false;
      }
    });

    dispatchCustomEvent(this, 'submit', this._optionsStates);
  }

  _onOptionToggle({ detail }, optionName) {
    this._optionsStates[optionName] = detail;
  }

  render() {
    return html`
      <cc-block-new>
        <div slot="header-title">${this.title}</div>
        <div slot="content-body" class="content">
          <slot name="description"></slot>
          ${this.options.map((option) => {
            const enabled = option.enabled || false;
            return html` <cc-addon-option
              title="${option.title}"
              .icon="${option.icon}"
              logo="${option.logo}"
              ?enabled=${enabled}
              @cc-addon-option:input=${(e) => this._onOptionToggle(e, option.name)}
            >
              ${option.description}
            </cc-addon-option>`;
          })}
        </div>
        <div slot="content-footer" class="button-bar">
          <cc-button primary @cc-button:click=${this._onSubmit}> ${i18n('cc-addon-option-form.confirm')} </cc-button>
        </div>

        <a slot="footer-right" href="#">
          <cc-icon .icon="${iconInfo}"></cc-icon>
          Addon Options Reference</a
        >
      </cc-block-new>
    `;
  }

  static get styles() {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .content {
          display: grid;
          gap: 1em;
        }

        .button-bar {
          display: grid;
          justify-content: flex-end;
        }

        [name='description'] {
          line-height: 1.5;
        }

        .option-warning {
          display: grid;
          gap: 0.5em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .option-warning p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-option-form', CcAddonOptionForm);
