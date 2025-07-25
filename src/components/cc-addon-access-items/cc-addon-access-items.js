import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-input-text/cc-input-text.js';
import { CcNgDisable, CcNgEnable } from './cc-addon-access-items.events.js';

/**
 * @typedef {import('./cc-addon-access-items.types.js').AddonAccessItem} AddonAccessItem
 * @typedef {import('./cc-addon-access-items.types.js').AddonAccessItemNetworkGroup} AddonAccessItemNetworkGroup
 */

/** @type {Set<AddonAccessItem['code']>} */
const itemsToDisplayAsString = new Set([
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
]);
/** @type {Set<AddonAccessItem['code']>} */
const itemsToDisplayAsInput = new Set([
  'password',
  'initial-password',
  'direct-uri',
  'uri',
  'api-password',
  'token',
  'api-client-secret',
]);

/**
 * Displays a list of addon access information items (such as credentials, URLs, etc.).
 *
 * ## Details
 *
 * * Renders each item with a label and value, using appropriate controls (clipboard, input, etc.) depending on the item type.
 * * Handles skeleton state for loading.
 * * Supports enabling/disabling network group access.
 *
 * @cssdisplay block
 */
export class CcAddonAccessItems extends LitElement {
  static get properties() {
    return {
      addonAccessItems: { type: Array, attribute: 'addon-access-items' },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {Array<AddonAccessItem>} Sets the list of items displayed. The array order dictates the order in which items are rendered. */
    this.addonAccessItems = [];

    /** @type {boolean} Whether to display the component in skeleton (loading) state. */
    this.skeleton = false;

    new LostFocusController(this, 'ng-btn', (suggestedElement) => {
      // TODO
      console.log(suggestedElement);
    });
  }

  /**
   * Returns the translated label for a given item code.
   *
   * @param {AddonAccessItem['code']} code - The code of the access item.
   * @returns {string} The translated label.
   */
  _getLabelFromCode(code) {
    switch (code) {
      case 'api-client-secret':
        return i18n('cc-addon-access-items.code.api-client-secret');
      case 'api-client-user':
        return i18n('cc-addon-access-items.code.api-client-user');
      case 'api-key':
        return i18n('cc-addon-access-items.code.api-key');
      case 'api-password':
        return i18n('cc-addon-access-items.code.api-password');
      case 'api-url':
        return i18n('cc-addon-access-items.code.api-url');
      case 'cluster-full-name':
        return i18n('cc-addon-access-items.code.cluster-full-name');
      case 'database-name':
        return i18n('cc-addon-access-items.code.database-name');
      case 'direct-host':
        return i18n('cc-addon-access-items.code.direct-host');
      case 'direct-port':
        return i18n('cc-addon-access-items.code.direct-port');
      case 'direct-uri':
        return i18n('cc-addon-access-items.code.direct-uri');
      case 'host':
        return i18n('cc-addon-access-items.code.host');
      case 'initial-password':
        return i18n('cc-addon-access-items.code.initial-password');
      case 'ng':
        return i18n('cc-addon-access-items.code.network-group');
      case 'password':
        return i18n('cc-addon-access-items.code.password');
      case 'port':
        return i18n('cc-addon-access-items.code.port');
      case 'tenant':
        return i18n('cc-addon-access-items.code.tenant');
      case 'token':
        return i18n('cc-addon-access-items.code.token');
      case 'uri':
        return i18n('cc-addon-access-items.code.uri');
      case 'user':
        return i18n('cc-addon-access-items.code.user');
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
        ${this.addonAccessItems.map((addonAccessInfo) => this._renderItem(addonAccessInfo, this.skeleton))}</div>
      </dl>
    `;
  }

  /**
   * @param {AddonAccessItem} param0 - The access item to render.
   * @param {boolean} skeleton - Whether to display the item in skeleton state.
   */
  _renderItem({ code, value }, skeleton) {
    const label = this._getLabelFromCode(code);
    return html`
      <div class="list-item">
        <dt><label for="${code}">${label}</label></dt>
        <dd>
          ${itemsToDisplayAsString.has(code)
            ? html`
                <span class="${classMap({ skeleton })}">${value}</span>
                ${!skeleton ? html`<cc-clipboard .value="${value}"></cc-clipboard>` : ''}
              `
            : ''}
          ${itemsToDisplayAsInput.has(code)
            ? html`<cc-input-text
                id="${code}"
                clipboard
                secret
                .value="${value}"
                readonly
                ?skeleton="${skeleton}"
              ></cc-input-text>`
            : ''}
          ${code === 'ng' ? this._renderNetworkGroupInfo(value, skeleton) : ''}
        </dd>
      </div>
    `;
  }

  /**
   * @param {AddonAccessItemNetworkGroup['value']} networkGroupInfo - The network group info value.
   * @param {boolean} skeleton - Whether to display in skeleton state.
   **/
  _renderNetworkGroupInfo(networkGroupInfo, skeleton) {
    // TODO: handle focus loss with lostFocusController
    if (networkGroupInfo.status === 'enabled' || networkGroupInfo.status === 'disabling') {
      return html`
        <span class="${classMap({ skeleton })}">${networkGroupInfo.id}</span>
        ${!skeleton ? html`<cc-clipboard .value="${networkGroupInfo.id}"></cc-clipboard>` : ''}
        <cc-button
          class="ng-btn"
          link
          @cc-click="${this._onNgDisable}"
          ?skeleton="${skeleton}"
          .waiting="${networkGroupInfo.status === 'disabling'}"
        >
          ${i18n('cc-addon-access-items.ng.disable')}
        </cc-button>
      `;
    }

    return html`
      <cc-button
        class="ng-btn"
        link
        @cc-click="${this._onNgEnable}"
        ?skeleton="${skeleton}"
        .waiting="${networkGroupInfo.status === 'enabling'}"
      >
        ${i18n('cc-addon-access-items.ng.enable')}
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

        .list-item {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          padding-block: 1em;
        }

        .list-item:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
        }

        dt {
          flex: 1 1 min(21em, 100%);
          font-weight: bold;
        }

        dd {
          align-items: center;
          display: flex;
          flex: 100 1 min(21em, 100%);
          flex-wrap: wrap;
          gap: 0.5em;
        }

        cc-input-text {
          width: min(21em, 100%);
        }

        .skeleton {
          background-color: #bbb !important;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
customElements.define('cc-addon-access-items-beta', CcAddonAccessItems);
