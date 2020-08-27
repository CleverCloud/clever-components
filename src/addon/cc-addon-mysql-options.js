import './cc-addon-option-form.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { ccAddonEncryptionAtRestOption } from '../templates/cc-addon-encryption-at-rest-option.js';

const ENCRYPTION_DOCUMENTATION_URL = 'https://www.clever-cloud.com/doc/addons/mysql/#encryption-at-rest';

/**
 * A component that displays the available options of a MySQL add-on.
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-addon-mysql-options.js)
 *
 * * ## Type definitions
 *
 * ```js
 * interface Option {
 *   name: string,
 *   enabled: boolean,
 *   // Option specific params
 *   price: number, // for "encryption" option
 * }
 * ```
 *
 * ```js
 * interface Options {
 *   encryption: boolean,
 * }
 * ```
 *
 * @prop {Option[]} options - List of options for this add-on.
 *
 * @event {CustomEvent<Options>} cc-addon-mysql-options:submit - Fires when the form is submitted.
 */
export class CcAddonMysqlOptions extends LitElement {

  static get properties () {
    return {
      options: { type: Array },
    };
  }

  constructor () {
    super();
    this.options = [];
  }

  _onFormOptionsSubmit ({ detail }) {
    dispatchCustomEvent(this, 'submit', detail);
  }

  _getFormOptions () {
    return this.options
      .map((option) => {
        switch (option.name) {
          case 'encryption':
            return ccAddonEncryptionAtRestOption(ENCRYPTION_DOCUMENTATION_URL, option);
          default:
            return null;
        };
      })
      .filter((option) => option != null);
  }

  render () {
    const options = this._getFormOptions();
    const title = i18n('cc-addon-mysql-options.title');

    return html`
      <cc-addon-option-form title="${title}" .options=${options} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${i18n('cc-addon-mysql-options.description')}</div>
      </cc-addon-option-form>
    `;
  }

  static get styles () {
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
