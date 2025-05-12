import { css, html, LitElement } from 'lit';
import { ccAddonEncryptionAtRestOption } from '../../templates/cc-addon-encryption-at-rest-option/cc-addon-encryption-at-rest-option.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-option-form/cc-addon-option-form.js';

/**
 * @typedef {import('../common.types.js').EncryptionAddonOption} EncryptionAddonOption
 */

/**
 * A component that displays the available options of a PostgreSQL add-on.
 *
 * @cssdisplay block
 */
export class CcAddonPostgresqlOptions extends LitElement {
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
    const heading = i18n('cc-addon-postgresql-options.title');

    return html`
      <cc-addon-option-form heading="${heading}" .options=${options}>
        <div slot="description">${i18n('cc-addon-postgresql-options.description')}</div>
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

window.customElements.define('cc-addon-postgresql-options', CcAddonPostgresqlOptions);
