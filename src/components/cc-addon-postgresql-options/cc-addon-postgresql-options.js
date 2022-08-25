import '../cc-addon-option-form/cc-addon-option-form.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { ccAddonEncryptionAtRestOption } from '../../templates/cc-addon-encryption-at-rest-option/cc-addon-encryption-at-rest-option.js';

/**
 * @typedef {import('./cc-addon-postgresql-options.types.js').Option} Option
 * @typedef {import('./cc-addon-postgresql-options.types.js').GenericOptions} GenericOptions
 */

/**
 * A component that displays the available options of a PostgreSQL add-on.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<GenericOptions>} cc-addon-postgresql-options:submit - Fires when the form is submitted.
 */
export class CcAddonPostgresqlOptions extends LitElement {

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
    const title = i18n('cc-addon-postgresql-options.title');

    return html`
      <cc-addon-option-form title="${title}" .options=${options} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${i18n('cc-addon-postgresql-options.description')}</div>
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

window.customElements.define('cc-addon-postgresql-options', CcAddonPostgresqlOptions);
