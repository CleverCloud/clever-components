import { css, html, LitElement } from 'lit';
import { iconRemixArrowUpSLine as iconArrowUp } from '../../assets/cc-remix.icons.js';
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
      isUnlinking: { type: Boolean, attribute: 'is-unlinking' },
      member: { type: Object },
      open: { type: Boolean },
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
    this.open = false;
  }

  _onUnlinkRequest() {
    this.dispatchEvent(new CcNetworkGroupMemberUnlinkRequestEvent(this.member.id));
  }

  render() {
    const hasPeers = this.member.peerList.length > 0;

    if (hasPeers) {
      return this._renderWithPeers({
        member: this.member,
        isUnlinking: this.isUnlinking,
        isDisabled: this.isDisabled,
        isOpen: this.open,
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
      <div class="member-card member-card--without-peers">
        <div class="header">
          ${this._renderIdentity(member.logo, member.label)} ${this._renderPeersCount(member.peerList.length)}
        </div>
        ${this._renderDomain(member.domainName)}
        ${this._renderFooter({ isUnlinking, isDisabled, dashboardUrl: member.dashboardUrl })}
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
        <div class="member-card member-card--with-peers">
          <details class="details" ?open="${isOpen}">
            <!-- Note: tabindex="0" needed on summary for consistent focus behavior across browsers TODO: check why exactly because i cannot remember -->
            <summary class="header header--clickable" tabindex="0">
              ${this._renderIdentity(member.logo, member.label)}
              <div class="peers-toggle">
                ${this._renderPeersCount(member.peerList.length)}
                <cc-icon class="arrow-icon" .icon="${iconArrowUp}"></cc-icon>
              </div>
            </summary>
            <div class="details-content">
              ${this._renderDomain(member.domainName)} ${this._renderPeerList(member.peerList)}
              ${this._renderFooter({ isUnlinking, isDisabled, dashboardUrl: member.dashboardUrl ?? '' })}
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
        <cc-img class="identity__logo" src="${logo.url}" a11y-name="${logo.a11yName}"></cc-img>
        <span class="identity__label">${label}</span>
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
      <span class="peers-count"> ${i18n('cc-network-group-member-list.member.nb-of-peers', { nbOfPeers })} </span>
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
   *
   * Renders the footer section (dashboard link + unlink button)
   **/
  _renderFooter({ isUnlinking, isDisabled, dashboardUrl }) {
    return html`
      <div class="footer">
        ${!isStringEmpty(dashboardUrl)
          ? html`
              <div class="dashboard-link">
                <cc-link href="${dashboardUrl}">${i18n('')}</cc-link>
              </div>
            `
          : ''}
        <cc-button
          class="unlink-btn"
          danger
          outlined
          ?disabled="${isDisabled}"
          ?waiting="${isUnlinking}"
          @cc-click="${this._onUnlinkRequest}"
        >
          ${i18n('cc-network-group-member-list.member.unlink')}
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

        .header--clickable {
          cursor: pointer;
        }

        .header--clickable:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .header--clickable:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: -2px;
        }

        /* endregion */

        /* region Identity */

        .identity {
          align-items: center;
          display: flex;
          flex: 1 0 0;
          gap: 0.5em;
        }

        .identity__logo {
          border-radius: var(--cc-border-radius-small, 0.15em);
          height: 1.5em;
          width: 1.5em;
        }

        .identity__label {
          color: var(--cc-color-text-primary-strongest);
          flex: 1 1 10em;
          font-weight: bold;
        }

        /* endregion */

        /* region Peers toggle (with-peers variant) */

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

        .details:not([open]) .arrow-icon {
          transform: rotate(180deg);
        }

        .header--clickable:hover .arrow-icon {
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
        .details[open] + .domain-collapsed {
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
