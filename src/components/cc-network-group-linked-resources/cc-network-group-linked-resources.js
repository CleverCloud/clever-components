import { css, html, LitElement } from 'lit';
import {
  iconRemixArrowRightSLine as iconArrowRight,
  iconRemixHashtag as iconId,
  iconRemixInformationFill as iconInfo,
  iconRemixInstallLine as iconIp,
  iconRemixKey_2Fill as iconKey,
  iconRemixRadioButtonLine as iconPeerType,
} from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-code/cc-code.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupLinkedResourcesState} NetworkGroupLinkedResourcesState
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupMember} NetworkGroupMember
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupPeer} NetworkGroupPeer
 */

export class CcNetworkGroupLinkedResources extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupLinkedResourcesState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  _onUnlinkMember() {
    // TODO: display dialog
  }

  render() {
    if (this.state.type === 'error') {
      return html`
        <cc-notice intent="warning" message="${i18n('cc-network-group-linked-resources.error')}"></cc-notice>
      `;
    }
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-linked-resources.heading')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-network-group-linked-resources.intro')}</p>
          ${this.state.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
          ${this.state.type === 'loaded' && this.state.memberList.length === 0
            ? html`
                <div class="empty">
                  <p>${i18n('cc-network-group-linked-resources.member-list.empty')}</p>
                </div>
              `
            : ''}
          ${this.state.type === 'loaded' && this.state.memberList.length > 0
            ? html`
                <div class="member-list">${this.state.memberList.map((member) => this._renderMember(member))}</div>
              `
            : ''}
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <div slot="link">
            <cc-link href="${generateDocsHref('/cli/network-groups')}" .icon="${iconInfo}">
              ${i18n('cc-network-group-linked-resources.documentation.text')}
            </cc-link>
          </div>
          <!-- TODO: contenttttt -->
          <div slot="content">
            <div class="cli-heading">${i18n('cc-network-group-linked-resources.cli.heading')}</div>
            <p>${i18n('cc-network-group-linked-resources.cli.content.instruction')}</p>
            <dl>
              <dt>${i18n('cc-network-group-linked-resources.cli...')}</dt>
              <dd>
                <cc-code>clever domain --app</cc-code>
              </dd>
            </dl>
          </div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /** @param {NetworkGroupMember} member */
  _renderMember(member) {
    const memberHref = new URL(`https://${member.domainName}`).href;
    return html`
      <div class="member-list__member-card">
        <div class="member-list__member-card__header">
          <div class="member-list__member-card__header__identity">
            <cc-img
              class="member-list__member-card__header__identity__logo"
              src="${member.logo.url}"
              a11y-name="${member.logo.a11yName}"
            >
            </cc-img>
            <span class="member-list__member-card__header__identity__label">${member.label}</span>
          </div>
          <!-- FIXME: link is not really relevant since it can only accessed by member peers -->
          <div class="member-list__member-card__header__domain">
            <span>${member.domainName}</span>
            <cc-clipboard value="${member.domainName}"></cc-clipboard>
          </div>
          <button class="member-list__member-card__header__peers-btn" aria-expanded="false">
            <span class="member-list__member-card__header__peers-btn__nb">
              ${i18n('cc-network-group-linked-resources.member.nb-of-peers', {
                nbOfPeers: member.peerList.length,
              })}
            </span>
            <cc-icon class="member-list__member-card__header__peer-btn__arrow-icon" .icon="${iconArrowRight}"></cc-icon>
          </button>
        </div>
        <div id="${member.id}-peers" class="member-list__member-card__peer-list">
          ${member.peerList.map((peer) => this._renderPeer(peer))}
        </div>
        <cc-button class="member-list__member-card__unlink-btn" danger outlined @cc-click="${this._onUnlinkMember}">
          ${i18n('cc-network-group-linked-resources.member.unlink')}
        </cc-button>
      </div>
    `;
  }

  /** @param {NetworkGroupPeer} peer */
  _renderPeer(peer) {
    return html`
      <div class="member-list__member-card__peer-list__peer-card">
        <span class="member-list__member-card__peer-list__peer-card__label">${peer.label}</span>
        <div class="member-list__member-card__peer-list__peer-card__metadata">
          <div class="member-list__member-card__peer-list__peer-card__metadata__id">
            <cc-icon
              .icon="${iconId}"
              a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.id')}"
            ></cc-icon>
            <span>${peer.id}</span>
          </div>
          <div class="member-list__member-card__peer-list__peer-card__metadata__key">
            <cc-icon
              .icon="${iconKey}"
              a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.key')}"
            ></cc-icon>
            <span>${peer.publicKey}</span>
          </div>
          <div class="member-list__member-card__peer-list__peer-card__metadata__ip">
            <cc-icon
              .icon="${iconIp}"
              a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.ip')}"
            ></cc-icon>
            <span>${peer.ip}</span>
          </div>
          <div class="member-list__member-card__peer-list__peer-card__metadata__peer-type">
            <cc-icon
              .icon="${iconPeerType}"
              a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.peer-type')}"
            ></cc-icon>
            <!-- TODO: i18n -->
            <span>${peer.type}</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderUnlinkDialog() {
    return html`<dialog aria-labelledby="unlink-dialog-heading"></dialog>`;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .intro {
          margin: 0 0 1em;
        }

        .empty {
          border: 1px solid var(--cc-color-border-neutral-weak);
          display: grid;
          font-weight: bold;
          gap: 1.5em;
          justify-items: center;
          padding: 1em;
        }

        .member-list {
          display: grid;
          gap: 0.5em;
        }

        .member-list__member-card {
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: grid;
          gap: 0.5em;
          padding: 1em;
        }

        .member-list__member-card__header {
          align-items: baseline;
          display: grid;
          gap: 1em;
          grid-template-areas:
            'identity peers-btn'
            'domain domain';
          grid-template-columns: 1fr auto;
        }

        .member-list__member-card__header__identity {
          align-items: center;
          align-self: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          grid-area: identity;
        }

        .member-list__member-card__header__identity__label {
          color: var(--cc-color-text-primary-strongest);
          font-weight: bold;
        }

        .member-list__member-card__header__identity__logo {
          border-radius: var(--cc-border-radius-small, 0.15em);
          height: 1.5em;
          width: 1.5em;
        }

        .member-list__member-card__header__domain {
          align-items: center;
          display: flex;
          gap: 1em;
          grid-area: domain;
          overflow: hidden;
        }

        .member-list__member-card__header__domain span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .member-list__member-card__header__peers-btn {
          align-items: center;
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default);
          cursor: pointer;
          display: flex;
          font-style: italic;
          gap: 1em;
          grid-area: peers-btn;
          padding: 0;
        }

        .member-list__member-card__header__peer-btn__arrow-icon {
          --cc-icon-size: 2em;
        }

        .member-list__member-card__unlink-btn {
          justify-self: flex-end;
        }

        .member-list__member-card__peer-list {
          display: grid;
          gap: 0.5em;
        }

        .member-list__member-card__peer-list__peer-card {
          background-color: var(--cc-color-bg-neutral);
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default);
          display: grid;
          gap: 1em;
          padding: 1em;
        }

        .member-list__member-card__peer-list__peer-card__label {
          font-weight: bold;
        }

        .member-list__member-card__peer-list__peer-card__metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .member-list__member-card__peer-list__peer-card__metadata__key span {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-list__member-card__peer-list__peer-card__metadata__id,
        .member-list__member-card__peer-list__peer-card__metadata__key {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-linked-resources', CcNetworkGroupLinkedResources);
