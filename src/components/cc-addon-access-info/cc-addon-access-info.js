import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-input-text/cc-input-text.js';
import { CcNgDisable, CcNgEnable } from './cc-addon-access-info.events.js';

/**
 * @typedef {import('./cc-addon-access-info.types.js').AddonAccessInfo} AddonAccessInfo
 * @typedef {import('./cc-addon-access-info.types.js').AddonAccessInfoNetworkGroup} AddonAccessInfoNetworkGroup
 */

// NOTE: I think it would be better if we passed an array of properties with { name: keyof Content, type: Secret | Raw | Activable, value: string | ActivationInfo };
/** @type {Array<AddonAccessInfo['code']>} */
const infoToDisplayAsString = [
  'user',
  'apiUrl',
  'port',
  'host',
  'tenant',
  'apiKey',
  'directHost',
  'directPort',
  'databaseName',
  'clusterFullName',
];
/** @type {Array<AddonAccessInfo['code']>} */
const infoToDisplayAsInput = ['password', 'directUri', 'uri', 'apiPassword', 'token'];

export class CcAddonAccessInfo extends LitElement {
  static get properties() {
    return {
      info: { type: Object },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {Array<AddonAccessInfo>} */
    this.info = [];

    /** @type {boolean} */
    this.skeleton = false;
  }

  /**
   *
   * @param {AddonAccessInfo['code']|AddonAccessInfoNetworkGroup['code']} code
   */
  _getLabelFromCode(code) {
    switch (code) {
      case 'apiClientSecret':
        return i18n('cc-addon-access-info.name.api-client-secret');
      case 'apiClientUser':
        return i18n('cc-addon-access-info.name.api-client-user');
      case 'apiUrl':
        return i18n('cc-addon-access-info.name.api-url');
      case 'clusterFullName':
        return i18n('cc-addon-access-info.name.cluster-full-name');
      case 'databaseName':
        return i18n('cc-addon-access-info.name.database-name');
      case 'directHost':
        return i18n('cc-addon-access-info.name.direct-host');
      case 'directPort':
        return i18n('cc-addon-access-info.name.direct-port');
      case 'directUri':
        return i18n('cc-addon-access-info.name.direct-uri');
      case 'host':
        return i18n('cc-addon-access-info.name.host');
      case 'ng':
        return i18n('cc-addon-access-info.name.network-group');
      case 'password':
        return i18n('cc-addon-access-info.name.password');
      case 'port':
        return i18n('cc-addon-access-info.name.port');
      case 'token':
        return i18n('cc-addon-access-info.name.token');
      case 'uri':
        return i18n('cc-addon-access-info.name.uri');
      case 'user':
        return i18n('cc-addon-access-info.name.user');
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
    console.log(this.info);
    return html`
      <dl class="info-list">
        ${this.info.map((addonAccessInfo) => this._renderData(addonAccessInfo, this.skeleton))}</div>
      </dl>
    `;
  }

  /**
   *
   * @param {AddonAccessInfo} _
   * @param {boolean} skeleton
   */
  _renderData({ code, value }, skeleton) {
    const label = this._getLabelFromCode(code);
    return html`
      <div class="info-list-item">
        <dt>${label}</dt>
        <dd>
          ${infoToDisplayAsString.includes(code)
            ? html`
                <span class="${classMap({ skeleton })}">${value}</span>
                <cc-clipboard .value="${value}"></cc-clipboard>
              `
            : ''}
          ${infoToDisplayAsInput.includes(code)
            ? html`<cc-input-text
                label="${label}"
                hidden-label
                clipboard
                secret
                .value="${value}"
                ?skeleton="${skeleton}"
              ></cc-input-text>`
            : ''}
          ${code === 'ng' ? this._renderNetworkGroupInfo(value, skeleton) : ''}
        </dd>
      </div>
    `;
  }

  /**
   * @param {AddonAccessInfoNetworkGroup['value']} networkGroupInfo
   * @param {boolean} skeleton
   **/
  _renderNetworkGroupInfo(networkGroupInfo, skeleton) {
    // TODO: handle focus loss with lostFocusController
    if (networkGroupInfo.status === 'enabled' || networkGroupInfo.status === 'disabling') {
      return html`
        <span class="${classMap({ skeleton })}">${networkGroupInfo.id}</span>
        <cc-clipboard .value="${networkGroupInfo.id}"></cc-clipboard>
        <cc-button
          link
          @cc-click="${this._onNgDisable}"
          ?skeleton="${skeleton}"
          .waiting="${networkGroupInfo.status === 'disabling'}"
        >
          ${i18n('cc-addon-access-info.ng.disable')}
        </cc-button>
      `;
    }

    return html`
      <cc-button
        link
        @cc-click="${this._onNgEnable}"
        ?skeleton="${skeleton}"
        .waiting="${networkGroupInfo.status === 'enabling'}"
      >
        ${i18n('cc-addon-access-info.ng.enable')}
      </cc-button>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      css`
        :host {
          display: block;
        }

        dl,
        dt,
        dd {
          margin: 0;
          padding: 0;
        }

        .info-list-item {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          padding: 1em 0.5em;
        }

        .info-list-item:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
        }

        dt {
          flex: 1 1 min(15em, 100%);
          font-weight: bold;
        }

        dd {
          align-items: center;
          display: flex;
          flex: 1 1 min(15em, 100%);
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .skeleton {
          background-color: #bbb !important;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-access-info', CcAddonAccessInfo);
