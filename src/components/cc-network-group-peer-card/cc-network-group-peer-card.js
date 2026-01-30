import { css, html, LitElement } from 'lit';
import {
  iconRemixDownload_2Fill as iconDownload,
  iconRemixHashtag as iconId,
  iconRemixInstallLine as iconIp,
  iconRemixKey_2Fill as iconKey,
  iconRemixRadioButtonLine as iconPeerType,
} from '../../assets/cc-remix.icons.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-link/cc-link.js';

/** @import { NetworkGroupPeer } from './cc-network-group-peer-card.types.js' */

export class CcNetworkGroupPeerCard extends LitElement {
  static get properties() {
    return {
      peer: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupPeer} Sets the peer info */
    this.peer = null;
  }

  /** @param {string} type */
  _getPeerType(type) {
    switch (type) {
      case 'CleverPeer':
        return i18n('cc-network-group-peer-card.metadata.peer-type.clever-peer');
      case 'ExternalPeer':
        return i18n('cc-network-group-peer-card.metadata.peer-type.external-peer');
      default:
        return type;
    }
  }

  render() {
    return html`
      <div class="peer-card">
        <div class="peer-card__header">
          <span class="peer-card__header__label">${this.peer.label}</span>
          ${this.peer.type === 'ExternalPeer' && !isStringEmpty(this.peer.configLink)
            ? html`
                <a
                  class="config-download-link"
                  href="${this.peer.configLink}"
                  target="_blank"
                  rel="noopener"
                  title="${i18n('cc-network-group-peer-card.external-peer.config-link', { label: this.peer.label })}"
                  download="peer-configuration-${this.peer.label}.txt"
                >
                  <cc-icon .icon="${iconDownload}"></cc-icon>
                  <span class="visually-hidden">
                    ${i18n('cc-network-group-peer-card.external-peer.config-link', { label: this.peer.label })}
                  </span>
                </a>
              `
            : ''}
        </div>
        <dl class="metadata-list">
          <div class="metadata-item metadata-item--id">
            <dt>
              <cc-icon .icon="${iconId}" a11y-name="${i18n('cc-network-group-peer-card.metadata.id')}"></cc-icon>
            </dt>
            <dd><span>${this.peer.id}</span></dd>
          </div>
          <div class="metadata-item metadata-item--key">
            <dt>
              <cc-icon .icon="${iconKey}" a11y-name="${i18n('cc-network-group-peer-card.metadata.key')}"></cc-icon>
            </dt>
            <dd><span>${this.peer.publicKey}</span></dd>
          </div>
          <div class="metadata-item metadata-item--ip">
            <dt>
              <cc-icon .icon="${iconIp}" a11y-name="${i18n('cc-network-group-peer-card.metadata.ip')}"></cc-icon>
            </dt>
            <dd><span>${this.peer.ip}</span></dd>
          </div>
          <div class="metadata-item metadata-item--peer-type">
            <dt>
              <cc-icon
                .icon="${iconPeerType}"
                a11y-name="${i18n('cc-network-group-peer-card.metadata.peer-type')}"
              ></cc-icon>
            </dt>
            <dd>
              <span>${this._getPeerType(this.peer.type)}</span>
            </dd>
          </div>
        </dl>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: block;
        }

        dl,
        dd,
        dt {
          font-weight: normal;
          margin: 0;
          padding: 0;
        }

        .peer-card {
          background-color: var(--cc-color-bg-neutral);
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default);
          container: peer-card / inline-size;
          display: grid;
          gap: 1em;
          padding: 1em;
        }

        .peer-card__header {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: space-between;
        }

        .peer-card__header__label {
          font-weight: bold;
        }

        .metadata-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        @container peer-card (max-width: 35em) {
          .metadata-list {
            flex-direction: column;
          }
        }

        .metadata-item {
          display: flex;
          gap: 0.5em;
          word-break: break-all;
        }

        .config-download-link {
          align-items: center;
          border: solid 1px var(--cc-color-text-primary-strongest);
          border-radius: 100%;
          color: var(--cc-color-text-primary-strongest);
          display: flex;
          flex: 0 0 auto;
          height: 1.5em;
          justify-content: center;
          width: 1.5em;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-peer-card', CcNetworkGroupPeerCard);
