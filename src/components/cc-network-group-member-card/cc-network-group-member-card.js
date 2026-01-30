import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowRightLine as iconArrowRight,
  iconRemixArrowUpSLine as iconArrowUp,
} from '../../assets/cc-remix.icons.js';
import { isStringEmpty } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-expand/cc-expand.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-network-group-peer-card/cc-network-group-peer-card.js';
import { CcNetworkGroupMemberUnlinkRequestEvent } from './cc-network-group-member-card.events.js';

/**
 * @import { NetworkGroupMember } from './cc-network-group-member-card.types.js'
 * @import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js'
 * @import { CcButton } from '../cc-button/cc-button.js'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component displaying a network group member card.
 *
 * The card displays member information (logo, label, domain name) and its associated peers.
 * When the member has peers, the card is collapsible to show/hide the peer list.
 * When the member has no peers, the card displays a simpler layout.
 *
 * @cssdisplay block
 *
 * @fires {CcNetworkGroupMemberUnlinkRequestEvent} cc-network-group-member-unlink-request - Fired when the user clicks the unlink button.
 */
export class CcNetworkGroupMemberCard extends LitElement {
  static get properties() {
    return {
      isDisabled: { type: Boolean, attribute: 'is-disabled' },
      isOpen: { type: Boolean, attribute: 'is-open' },
      isUnlinking: { type: Boolean, attribute: 'is-unlinking' },
      member: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Disables the unlink button (used when another member is being unlinked) */
    this.isDisabled = false;

    /** @type {boolean} Whether the member is currently being unlinked */
    this.isUnlinking = false;

    /** @type {NetworkGroupMember} Sets the data of the member */
    this.member = {
      id: '',
      label: '',
      logo: { url: '', a11yName: '' },
      domainName: '',
      kind: 'APPLICATION',
      peerList: [],
    };

    /** @type {boolean} Whether the details are open by default (only applies when member has peers) */
    this.isOpen = false;

    /** @type {Ref<CcButton>} Ref to the unlink button */
    this._unlinkButtonRef = createRef();
  }

  _onUnlinkRequest() {
    this.dispatchEvent(new CcNetworkGroupMemberUnlinkRequestEvent(this.member.id));
  }

  /**
   * @param {NetworkGroupMember['kind']} kind
   * @returns {string}
   *
   * Returns the appropriate dashboard link text based on the member kind
   **/
  _getDashboardLinkText(kind) {
    switch (kind) {
      case 'APPLICATION':
        return i18n('cc-network-group-member-card.link.dashboard-application');
      case 'ADDON':
        return i18n('cc-network-group-member-card.link.dashboard-addon');
      case 'EXTERNAL':
        return '';
    }
  }

  focus() {
    this.isOpen = true;
    this.updateComplete.then(() => {
      this._unlinkButtonRef.value?.focus();
    });
  }

  render() {
    const hasPeers = this.member.peerList.length > 0;

    if (hasPeers) {
      return this._renderWithPeers({
        member: this.member,
        isUnlinking: this.isUnlinking,
        isDisabled: this.isDisabled,
        isOpen: this.isOpen,
      });
    }

    return this._renderWithoutPeers({
      member: this.member,
      isUnlinking: this.isUnlinking,
      isDisabled: this.isDisabled,
    });
  }

  /**
   * @param {Object} params
   * @param {NetworkGroupMember} params.member
   * @param {boolean} params.isUnlinking
   * @param {boolean} params.isDisabled
   *
   * Renders the card variant for members without peers (simple layout)
   **/
  _renderWithoutPeers({ member, isUnlinking, isDisabled }) {
    return html`
      <div class="member-card">
        <div class="header">
          ${this._renderIdentity(member.logo, member.label)} ${this._renderPeersCount(member.peerList.length)}
        </div>
        ${this._renderDomain(member.domainName)}
        ${this._renderFooter({ isUnlinking, isDisabled, dashboardUrl: member.dashboardUrl, kind: member.kind })}
      </div>
    `;
  }

  /**
   * @param {Object} params
   * @param {NetworkGroupMember} params.member
   * @param {boolean} params.isUnlinking
   * @param {boolean} params.isDisabled
   * @param {boolean} params.isOpen
   *
   * Renders the card variant for members with peers (collapsible layout)
   **/
  _renderWithPeers({ member, isUnlinking, isDisabled, isOpen }) {
    return html`
      <cc-expand>
        <div class="member-card">
          <details class="collapsible" ?open="${isOpen}">
            <summary class="header header-clickable">
              ${this._renderIdentity(member.logo, member.label)}
              <div class="peers-toggle">
                ${this._renderPeersCount(member.peerList.length)}
                <cc-icon class="arrow-icon" .icon="${iconArrowUp}"></cc-icon>
              </div>
            </summary>
            <div class="details-content">
              ${this._renderDomain(member.domainName)} ${this._renderPeerList(member.peerList)}
              ${this._renderFooter({
                isUnlinking,
                isDisabled,
                dashboardUrl: member.dashboardUrl ?? '',
                kind: member.kind,
              })}
            </div>
          </details>
          <div class="domain-collapsed">${this._renderDomain(member.domainName)}</div>
        </div>
      </cc-expand>
    `;
  }

  /**
   * @param {{ url: string, a11yName: string }} logo
   * @param {string} label
   *
   * Renders the member identity section (logo + label)
   **/
  _renderIdentity(logo, label) {
    return html`
      <div class="identity">
        <cc-img class="identity-logo" src="${logo.url}" a11y-name="${logo.a11yName}"></cc-img>
        <span class="identity-label">${label}</span>
      </div>
    `;
  }

  /**
   * @param {number} nbOfPeers
   *
   * Renders the peer count text
   **/
  _renderPeersCount(nbOfPeers) {
    return html`
      <span class="peers-count"> ${i18n('cc-network-group-member-card.nb-of-peers', { nbOfPeers })} </span>
    `;
  }

  /**
   * @param {string} domainName
   *
   * Renders the domain name with clipboard button
   **/
  _renderDomain(domainName) {
    return html`
      <div class="domain">
        ${domainName}
        <cc-clipboard value="${domainName}"></cc-clipboard>
      </div>
    `;
  }

  /**
   * @param {NetworkGroupPeer[]} peerList
   * Renders the peer list
   **/
  _renderPeerList(peerList) {
    return html`
      <div class="peer-list">
        ${peerList.map((peer) => html`<cc-network-group-peer-card .peer="${peer}"></cc-network-group-peer-card>`)}
      </div>
    `;
  }

  /**
   * @param {Object} params
   * @param {boolean} params.isUnlinking
   * @param {boolean} params.isDisabled
   * @param {string} [params.dashboardUrl]
   * @param {NetworkGroupMember['kind']} params.kind
   *
   * Renders the footer section (dashboard link + unlink button)
   **/
  _renderFooter({ isUnlinking, isDisabled, dashboardUrl, kind }) {
    return html`
      <div class="footer">
        ${!isStringEmpty(dashboardUrl)
          ? html`
              <div class="dashboard-link">
                <cc-link href="${dashboardUrl}">${this._getDashboardLinkText(kind)}</cc-link>
                <cc-icon class="dashboard-link-icon" .icon="${iconArrowRight}"></cc-icon>
              </div>
            `
          : ''}
        <cc-button
          class="unlink-btn"
          danger
          outlined
          ?disabled="${isDisabled}"
          ?waiting="${isUnlinking}"
          a11y-name="${i18n('cc-network-group-member-card.unlink.a11y-name', { label: this.member.label })}"
          @cc-click="${this._onUnlinkRequest}"
          ${ref(this._unlinkButtonRef)}
        >
          ${i18n('cc-network-group-member-card.unlink')}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          --member-card-padding: 1em;

          display: block;
        }

        .member-card {
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default, 0.25em);
          container: member-card / inline-size;
          padding: var(--member-card-padding);
        }

        /* region Header */

        .header {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          justify-content: space-between;
          margin-bottom: var(--member-card-padding);
          margin-inline: calc(var(--member-card-padding) * -1);
          margin-top: calc(var(--member-card-padding) * -1);
          padding: var(--member-card-padding);
        }

        .header-clickable {
          cursor: pointer;
        }

        .header-clickable:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .header-clickable:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: -2px;
        }

        /* endregion */

        /* region Identity */

        .identity {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          gap: 0.5em;
        }

        .identity-logo {
          border-radius: var(--cc-border-radius-small, 0.15em);
          flex: 0 0 auto;
          height: 1.5em;
          width: 1.5em;
        }

        .identity-label {
          color: var(--cc-color-text-primary-strongest);
          flex: 1 1 10em;
          font-weight: bold;
        }

        /* endregion */

        /* region Peers */

        .peers-toggle {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .peers-count {
          font-style: italic;
        }

        .arrow-icon {
          --cc-icon-size: 2em;

          transform: rotate(0deg);
          transition: transform 0.5s;
        }

        .collapsible:not([open]) .arrow-icon {
          transform: rotate(180deg);
        }

        .header-clickable:hover .arrow-icon {
          transform: rotate(90deg);
        }

        /* endregion */

        /* region Domain */

        .domain {
          word-break: break-all;
        }

        .domain cc-clipboard {
          display: inline-block;
          vertical-align: middle;
        }

        /* Hide collapsed domain when details is open */
        .collapsible[open] + .domain-collapsed {
          display: none;
        }

        /* endregion */

        /* region Peer list */

        .peer-list {
          display: grid;
          gap: 0.5em;
          margin-block: 1em;
        }

        /* endregion */

        /* region Footer */

        .footer {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: space-between;
          margin-top: 1em;
        }

        .dashboard-link {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .dashboard-link-icon {
          --cc-icon-color: var(--cc-color-text-primary-highlight);
        }

        .unlink-btn {
          margin-left: auto;
        }

        @container member-card (max-width: 25em) {
          .unlink-btn {
            width: 100%;
          }
        }

        /* endregion */
      `,
    ];
  }
}

customElements.define('cc-network-group-member-card', CcNetworkGroupMemberCard);
