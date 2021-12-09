import './cc-addon-option.js';
import '../atoms/cc-button.js';
import '../molecules/cc-block.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { linkStyles } from '../templates/cc-link.js';

/**
 * A component that displays a form of `<cc-addon-option>`.
 *
 * @typedef {import('./types.js').Option} Option
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Object>} cc-addon-option-form:submit - Fires when the form is submitted.
 *
 * @slot description - The description of the add-on and available options.
 */
export class CcAddonOptionForm extends LitElement {

  static get properties () {
    return {
      options: { type: Array },
      title: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {Option[]} List of Option object to render. */
    this.options = null;

    /** @type {string} Title of the whole options form. */
    this.title = null;

    /** @type {Object} */
    this._optionsStates = {};
  }

  _onSubmit () {
    // If some options were not changed, fill them here
    this.options.forEach((option) => {
      if (this._optionsStates[option.name] == null) {
        this._optionsStates[option.name] = option.enabled || false;
      }
    });

    dispatchCustomEvent(this, 'submit', this._optionsStates);
  }

  _onOptionToggle ({ detail }, optionName) {
    this._optionsStates[optionName] = detail;
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">${this.title}</div>
        <slot name="description"></slot>
        ${this.options.map((option) => {
          const enabled = option.enabled || false;
          return html`
            <cc-addon-option
              title="${option.title}"
              logo="${option.logo}"
              ?enabled=${enabled}
              @cc-addon-option:input=${(e) => this._onOptionToggle(e, option.name)}
            >
              ${option.description}
            </cc-addon-option>`;
        })}
        <div class="button-bar">
          <cc-button primary @cc-button:click=${this._onSubmit}>
            ${i18n('cc-addon-option-form.confirm')}
          </cc-button>
        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .button-bar {
          display: grid;
          justify-content: flex-end;
        }

        [name="description"] {
          line-height: 1.5;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-option-form', CcAddonOptionForm);
