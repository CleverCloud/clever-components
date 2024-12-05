import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { ccAddonEncryptionAtRestOption } from '../../templates/cc-addon-encryption-at-rest-option/cc-addon-encryption-at-rest-option.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-option-form/cc-addon-option-form.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 * @typedef {import('../common.types.js').EncryptionAddonOption} EncryptionAddonOption
 */

/**
 * A component that displays the available options of a MySQL add-on.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<AddonOptionStates>} cc-addon-mysql-options:submit - Fires when the form is submitted.
 */
export class CcAddonMysqlOptions extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<EncryptionAddonOption>} List of options for this add-on. */
    this.options = [];
  }

  /** @param {CustomEvent<AddonOptionStates>} event */
  _onFormOptionsSubmit({ detail }) {
    dispatchCustomEvent(this, 'submit', detail);
  }

  _getFormOptions() {
    return this.options
      .map((option) => {
        switch (option.name) {
          case 'encryption':
            return ccAddonEncryptionAtRestOption(option);
          default:
            return null;
        }
      })
      .filter((option) => option != null);
  }

  render() {
    const options = this._getFormOptions();
    const heading = i18n('cc-addon-mysql-options.title');

    return html`
      <cc-addon-option-form
        heading="${heading}"
        .options=${options}
        @cc-addon-option-form:submit="${this._onFormOptionsSubmit}"
      >
        <div slot="description">${i18n('cc-addon-mysql-options.description')}</div>
      </cc-addon-option-form>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-mysql-options', CcAddonMysqlOptions);
