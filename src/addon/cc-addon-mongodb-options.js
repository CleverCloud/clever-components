import './cc-addon-option-form.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { ccAddonEncryptionAtRestOption } from '../templates/cc-addon-encryption-at-rest-option.js';

/**
 * A component that displays the available options of a MongoDB add-on.
 *
 * @typedef {import('./types.js').Option} Option
 * @typedef {import('./types.js').GenericOptions} GenericOptions
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<GenericOptions>} cc-addon-mongodb-options:submit - Fires when the form is submitted.
 */
export class CcAddonMongodbOptions extends LitElement {

  static get properties () {
    return {
      options: { type: Array },
    };
  }

  constructor () {
    super();

    /** @type {Option[]} List of options for this add-on. */
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
            return ccAddonEncryptionAtRestOption(option);
          default:
            return null;
        }
      })
      .filter((option) => option != null);
  }

  render () {
    const options = this._getFormOptions();
    const title = i18n('cc-addon-mongodb-options.title');

    return html`
      <cc-addon-option-form title="${title}" .options=${options} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${i18n('cc-addon-mongodb-options.description')}</div>
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

window.customElements.define('cc-addon-mongodb-options', CcAddonMongodbOptions);
