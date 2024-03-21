import '../cc-input-text/cc-input-text.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const SKELETON_DATA = {
  apm: { user: '', password: '', authenticationToken: '' },
  kibana: { domainName: '', user: '', password: '' },
  pulsar: { url: '', authenticationToken: '' }
};

/**
 * @typedef {import('./cc-addon-credentials.types.js').Credential} Credential
 * @typedef {import('../common.types.js').ToggleStateType} ToggleStateType
 * @typedef {import('./cc-addon-credentials.types.js').AddonType} AddonType
 * @typedef {import('./cc-addon-credentials.types.js').AddonCredentialsState} AddonCredentialsState
 */

/**
 * A component to display an add-on credentials.
 *
 * @cssdisplay block
 */
export class CcAddonCredentials extends LitElement {

  static get properties () {
    return {
      addonType: { type: String },
      image: { type: String },
      name: { type: String },
      state: { type: Object },
      toggleState: { type: Boolean, attribute: 'toggle-state' },
    };
  }

  constructor () {
    super();

    /** @type {AddonType|null} Sets the type of the add-on. */
    this.addonType = null;

    /** @type {string|null} Sets the URL of the image to use. An icon image is expected. */
    this.image = null;

    /** @type {string|null} Sets the display name of the add-on. */
    this.name = null;

    /** @type {ToggleStateType} Sets the toggle state of the inner block. */
    this.toggleState = 'off';

    /** @type {AddonCredentialsState} Sets the toggle state of the inner block. */
    this.state = { type: 'loading' };

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
      <cc-block image=${ifDefined(this.image ?? undefined)} state=${this.toggleState}>
        <div slot="title">${i18n('cc-addon-credentials.title', { name: this.name })}</div>

        ${this.state.type === 'error' ? html`
            <cc-notice intent="warning" message="${i18n('cc-addon-credentials.loading-error')}"></cc-notice>
        ` : ''}

        ${this.state.type === 'loading' ? html `
            <div>${this._getDescription(this.addonType)}</div>
        `}
          
          
        ${(this.state.type === 'loaded' || this.state.type === 'loading') ? html`
          <div>${this._getDescription(this.addonType)}</div>
          ${this.state.credentials != null ? html`
            <div class="credential-list">
              ${this.state.credentials.map(({ type, secret, value }) => html`
                <cc-input-text readonly clipboard
                  ?secret=${secret}
                  ?skeleton=${value == null}
                  value=${ifDefined(value)}
                  label=${this._getFieldName(type)}
                ></cc-input-text>
              `)}
            </div>
          ` : ''}
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
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);

          flex: 1 1 18em;
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
