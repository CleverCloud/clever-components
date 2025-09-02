import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixFolderDownloadLine as iconDownload } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link';
import { CcNgDisable, CcNgEnable } from './cc-addon-credentials-content.events.js';

/** @type {Set<AddonCredential['code']>} */
const credentialsToDisplayAsString = new Set([
  'user',
  'api-url',
  'port',
  'host',
  'tenant',
  'api-key',
  'direct-host',
  'direct-port',
  'database-name',
  'cluster-full-name',
  'api-client-user',
  'api-server-url',
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
   * @returns {string} The translated label
   */
  _getLabelFromCode(code) {
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
        return i18n('cc-addon-credentials-content.code.network-group');
      case 'password':
        return i18n('cc-addon-credentials-content.code.password');
      case 'port':
        return i18n('cc-addon-credentials-content.code.port');
      case 'tenant':
        return i18n('cc-addon-credentials-content.code.tenant');
      case 'token':
        return i18n('cc-addon-credentials-content.code.token');
      case 'uri':
        return i18n('cc-addon-credentials-content.code.uri');
      case 'user':
        return i18n('cc-addon-credentials-content.code.user');
      case 'api-server-url':
        return i18n('cc-addon-credentials-content.code.api-server-url');
      case 'download-kubeconfig':
        return i18n('cc-addon-credentials-content.code.download-kubeconfig');
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
  _renderCredential({ code, value }, skeleton) {
    const label = this._getLabelFromCode(code);
    return html`
      <div class="credential">
        <dt>${label}</dt>
        <dd>
          ${credentialsToDisplayAsString.has(code)
            ? html`
                <span class="${classMap({ skeleton })}">${value}</span>
                ${!skeleton ? html`<cc-clipboard .value="${value}"></cc-clipboard>` : ''}
              `
            : ''}
          ${credentialsToDisplayAsInput.has(code)
            ? html`
                <cc-input-text
                  label="${label}"
                  hidden-label
                  clipboard
                  secret
                  .value="${value}"
                  readonly
                  ?skeleton="${skeleton}"
                ></cc-input-text>
              `
            : ''}
          ${code === 'ng' ? this._renderNgCredential(value, skeleton) : ''}
          ${code === 'download-kubeconfig' ? this._renderKubeconfigLink(value, skeleton) : ''}
        </dd>
      </div>
    `;
  }

  /**
   * @param {AddonCredentialNg['value']} ngCredential - The network group credential value.
   * @param {boolean} skeleton - Whether to display in skeleton state.
   **/
  _renderNgCredential(ngCredential, skeleton) {
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
          <span class="visually-hidden">${i18n('cc-addon-credentials-content.code.network-group')}</span>
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
        ${i18n('cc-addon-credentials-content.ng.enable')}
      </cc-button>
    `;
  }

  /**
   * @param {string} configLink - The link href value
   * @param {boolean} skeleton - Whether to display in skeleton state.
   **/
  _renderKubeconfigLink(configLink, skeleton) {
    return html`
      <cc-link .icon="${iconDownload}" href="${configLink}" .skeleton="${skeleton}">
        ${i18n('cc-addon-credentials-content.kubeconfig.link-text')}
      </cc-link>
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
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          padding-block: 1em;
        }

        .credential:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
        }

        dt {
          flex: 0 1 21em;
          font-weight: bold;
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
