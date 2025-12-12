import { css, html, LitElement } from 'lit';
import {
  iconRemixHashtag as iconId,
  iconRemixInstallLine as iconIp,
  iconRemixKey_2Fill as iconKey,
  iconRemixRadioButtonLine as iconPeerType,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';

/**
 * @import { NetworkGroupPeer } from './cc-network-group-peer-card.types.js'
 */

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

  render() {
    return html`
      <div class="peer-card">
        <span class="peer-card__label">${this.peer.label}</span>
        <dl class="metadata-list">
          <div class="metadata-item metadata-item--id">
            <dt>
              <cc-icon
                .icon="${iconId}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.id')}"
              ></cc-icon>
            </dt>
            <dd><span>${this.peer.id}</span></dd>
          </div>
          <div class="metadata-item metadata-item--key">
            <dt>
              <cc-icon
                .icon="${iconKey}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.key')}"
              ></cc-icon>
            </dt>
            <dd><span>${this.peer.publicKey}</span></dd>
          </div>
          <div class="metadata-item metadata-item--ip">
            <dt>
              <cc-icon
                .icon="${iconIp}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.ip')}"
              ></cc-icon>
            </dt>
            <dd><span>${this.peer.ip}</span></dd>
          </div>
          <div class="metadata-item metadata-item--peer-type">
            <dt>
              <cc-icon
                .icon="${iconPeerType}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.peer-type')}"
              ></cc-icon>
            </dt>
            <dd>
              <!-- TODO: i18n -->
              <span>${this.peer.type}</span>
            </dd>
          </div>
        </dl>
      </div>
    `;
  }

  static get styles() {
    return [
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

        .peer-card__label {
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
      `,
    ];
  }
}

customElements.define('cc-network-group-peer-card', CcNetworkGroupPeerCard);
