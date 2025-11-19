import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-input-text/cc-input-text.js';
import { CcNgDisable, CcNgEnable } from './cc-addon-credentials-content.events.js';

/** @type {Set<AddonCredential['code']>} */
const credentialsToDisplayAsString = new Set([
  'user',
  'api-url',
  'port',
  'host',
  'tenant-namespace',
  'api-key',
  'direct-host',
  'direct-port',
  'database-name',
  'cluster-full-name',
  'api-client-user',
  'initial-user',
  'open-api-url',
  'url',
]);
/** @type {Set<AddonCredential['code']>} */
const credentialsToDisplayAsInput = new Set([
  'password',
  'initial-password',
  'direct-uri',
  'uri',
  'api-password',
  'token',
  'api-client-secret',
]);

/**
 * @typedef {import('./cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('./cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 */

/**
 * Displays a list of addon credentials (such as usernames, passwords, URLs, etc.).
 *
 * ## Details
 *
 * * Renders each credential with a label and value, using appropriate controls (clipboard, input, etc.) depending on the credential type.
 * * Handles skeleton state for loading.
 * * Supports enabling/disabling network group access.
 *
 * @cssdisplay block
 */
export class CcAddonCredentialsContent extends LitElement {
  static get properties() {
    return {
      credentials: { type: Array, attribute: 'credentials' },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {Array<AddonCredential>} Sets the list of credentials displayed. The array order dictates the order in which credentials are rendered. */
    this.credentials = [];

    /** @type {boolean} Whether to display the component in skeleton (loading) state. */
    this.skeleton = false;

    new LostFocusController(this, '.ng-btn', ({ suggestedElement }) => {
      if (suggestedElement != null && suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      }
    });
  }

  /**
   * Returns the translated label for a given credential code.
   *
   * @param {AddonCredential['code']} code - The code of the access credential
   * @param {AddonCredentialNg['kind']} [ngKind] - The network group credential kind.
   * @returns {string} The translated label
   */
  _getLabelFromCode(code, ngKind) {
    switch (code) {
      case 'api-client-secret':
        return i18n('cc-addon-credentials-content.code.api-client-secret');
      case 'api-client-user':
        return i18n('cc-addon-credentials-content.code.api-client-user');
      case 'api-key':
        return i18n('cc-addon-credentials-content.code.api-key');
      case 'api-password':
        return i18n('cc-addon-credentials-content.code.api-password');
      case 'api-url':
        return i18n('cc-addon-credentials-content.code.api-url');
      case 'cluster-full-name':
        return i18n('cc-addon-credentials-content.code.cluster-full-name');
      case 'database-name':
        return i18n('cc-addon-credentials-content.code.database-name');
      case 'direct-host':
        return i18n('cc-addon-credentials-content.code.direct-host');
      case 'direct-port':
        return i18n('cc-addon-credentials-content.code.direct-port');
      case 'direct-uri':
        return i18n('cc-addon-credentials-content.code.direct-uri');
      case 'host':
        return i18n('cc-addon-credentials-content.code.host');
      case 'initial-password':
        return i18n('cc-addon-credentials-content.code.initial-password');
      case 'ng':
        return ngKind === 'standard'
          ? i18n('cc-addon-credentials-content.code.network-group-standard')
          : i18n('cc-addon-credentials-content.code.network-group-multi-instances');
      case 'password':
        return i18n('cc-addon-credentials-content.code.password');
      case 'port':
        return i18n('cc-addon-credentials-content.code.port');
      case 'tenant-namespace':
        return i18n('cc-addon-credentials-content.code.tenant-namespace');
      case 'token':
        return i18n('cc-addon-credentials-content.code.token');
      case 'uri':
        return i18n('cc-addon-credentials-content.code.uri');
      case 'user':
        return i18n('cc-addon-credentials-content.code.user');
      case 'initial-user':
        return i18n('cc-addon-credentials-content.code.initial-user');
      case 'open-api-url':
        return i18n('cc-addon-credentials-content.code.open-api-url');
      case 'url':
        return i18n('cc-addon-credentials-content.code.url');
      default:
        return code;
    }
  }

  _onNgEnable() {
    this.dispatchEvent(new CcNgEnable());
  }

  _onNgDisable() {
    this.dispatchEvent(new CcNgDisable());
  }

  render() {
    return html`
      <dl>
        ${this.credentials.map((credential) => this._renderCredential(credential, this.skeleton))}</div>
      </dl>
    `;
  }

  /**
   * @param {AddonCredential} credential - The addon credential to render.
   * @param {boolean} skeleton - Whether to display the credential in skeleton state.
   */
  _renderCredential(credential, skeleton) {
    const label = this._getLabelFromCode(credential.code, credential.code === 'ng' ? credential.kind : null);
    return html`
      <div
        class="credential ${classMap({ 'credential--align-center': credentialsToDisplayAsInput.has(credential.code) })}"
      >
        <dt>${label}</dt>
        <dd>
          ${credentialsToDisplayAsString.has(credential.code)
            ? html`
                <span class="${classMap({ skeleton })}">${credential.value}</span>
                ${!skeleton ? html`<cc-clipboard .value="${credential.value}"></cc-clipboard>` : ''}
              `
            : ''}
          ${credentialsToDisplayAsInput.has(credential.code)
            ? html`
                <cc-input-text
                  label="${label}"
                  hidden-label
                  clipboard
                  secret
                  .value="${credential.value}"
                  readonly
                  ?skeleton="${skeleton}"
                ></cc-input-text>
              `
            : ''}
          ${credential.code === 'ng' ? this._renderNgCredential(credential.value, credential.kind, skeleton) : ''}
        </dd>
      </div>
    `;
  }

  /**
   * @param {AddonCredentialNg['value']} ngCredential - The network group credential value.
   * @param {AddonCredentialNg['kind']} ngKind - The network group credential kind.
   * @param {boolean} skeleton - Whether to display in skeleton state.
   **/
  _renderNgCredential(ngCredential, ngKind, skeleton) {
    if (ngCredential.status === 'enabled' || ngCredential.status === 'disabling') {
      return html`
        <span class="${classMap({ skeleton })}">${ngCredential.id}</span>
        ${!skeleton ? html`<cc-clipboard .value="${ngCredential.id}"></cc-clipboard>` : ''}
        <cc-button
          class="ng-btn"
          link
          @cc-click="${this._onNgDisable}"
          ?skeleton="${skeleton}"
          .waiting="${ngCredential.status === 'disabling'}"
        >
          ${i18n('cc-addon-credentials-content.ng.disable')}
          <span class="visually-hidden"
            >${ngKind === 'standard'
              ? i18n('cc-addon-credentials-content.code.network-group-standard')
              : i18n('cc-addon-credentials-content.code.network-group-multi-instances')}</span
          >
        </cc-button>
      `;
    }

    return html`
      <cc-button
        class="ng-btn"
        link
        @cc-click="${this._onNgEnable}"
        ?skeleton="${skeleton}"
        .waiting="${ngCredential.status === 'enabling'}"
      >
        ${ngKind === 'standard'
          ? i18n('cc-addon-credentials-content.ng.enable-standard')
          : i18n('cc-addon-credentials-content.ng.enable-multi-instances')}
      </cc-button>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      css`
        :host {
          container-type: inline-size;
          display: block;
        }

        dl,
        dt,
        dd {
          margin: 0;
          padding: 0;
        }

        .credential {
          align-items: baseline;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          padding-block: 1em;
        }

        .credential--align-center {
          align-items: center;
        }

        .credential:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
        }

        dt {
          flex: 1 1 33%;
          font-weight: bold;
          max-width: 21em;
        }

        dd {
          align-items: center;
          display: flex;
          flex: 1 1 21em;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        cc-input-text {
          width: min(100%, 21em);
        }

        @container (max-width: 43em) {
          cc-input-text {
            width: 100%;
          }
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-credentials-content', CcAddonCredentialsContent);
