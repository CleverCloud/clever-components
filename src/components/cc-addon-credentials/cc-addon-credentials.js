import '../cc-input-text/cc-input-text.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/**
 * @typedef {import('./cc-addon-credentials.types.d.ts').Credential} Credential
 * @typedef {import('../common.types.d.ts').ToggleStateType} ToggleStateType
 * @typedef {import('./cc-addon-credentials.types.d.ts').AddonType} AddonType
 */

/**
 * A component to display an add-on credentials.
 *
 * ## Details
 *
 * * When the `value` of a credential is nullish, a skeleton UI pattern is displayed (loading hint).
 *
 * @cssdisplay block
 */
export class CcAddonCredentials extends LitElement {

  static get properties () {
    return {
      credentials: { type: Array },
      error: { type: Boolean },
      icon: { type: String },
      name: { type: String },
      toggleState: { type: Boolean, attribute: 'toggle-state' },
      type: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {Credential[]|null} Sets the list of add-on credentials. */
    this.credentials = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {string|null} Sets the URL of the icon to use. */
    this.icon = null;

    /** @type {string|null} Sets the display name of the add-on. */
    this.name = null;

    /** @type {ToggleStateType} Sets the toggle state of the inner block. */
    this.toggleState = 'off';

    /** @type {AddonType}  Sets the type of the add-on. */
    this.type = null;
  }

  _getDescription (addonType) {
    switch (addonType) {
      case 'apm':
        return i18n('cc-addon-credentials.description.apm');
      case 'elasticsearch':
        return i18n('cc-addon-credentials.description.elasticsearch');
      case 'kibana':
        return i18n('cc-addon-credentials.description.kibana');
      case 'pulsar':
        return i18n('cc-addon-credentials.description.pulsar');
      default:
        return '';
    }
  }

  _getFieldName (fieldType) {
    switch (fieldType) {
      case 'auth-token':
        return i18n('cc-addon-credentials.field.auth-token');
      case 'host':
        return i18n('cc-addon-credentials.field.host');
      case 'password':
        return i18n('cc-addon-credentials.field.password');
      case 'url':
        return i18n('cc-addon-credentials.field.url');
      case 'user':
        return i18n('cc-addon-credentials.field.user');
      default:
        return '';
    }
  }

  render () {
    return html`
      <cc-block icon=${ifDefined(this.icon ?? undefined)} state=${this.toggleState}>
        <div slot="title">${i18n('cc-addon-credentials.title', { name: this.name })}</div>

        ${!this.error ? html`
          <div>${this._getDescription(this.type)}</div>

          ${this.credentials != null ? html`
            <cc-flex-gap class="credential-list">
              ${this.credentials.map(({ type, secret, value }) => html`
                <cc-input-text readonly clipboard
                  ?secret=${secret}
                  ?skeleton=${value == null}
                  value=${ifDefined(value)}
                  label=${this._getFieldName(type)}
                ></cc-input-text>
              `)}
            </cc-flex-gap>
          ` : ''}
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-addon-credentials.loading-error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .credential-list {
          --cc-gap: 1rem;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
          flex: 1 0 18rem;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-credentials', CcAddonCredentials);
