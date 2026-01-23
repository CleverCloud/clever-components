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
 * @import { NetworkGroupMemberCardState } from './cc-network-group-member-card.types.js'
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
      disabled: { type: Boolean },
      open: { type: Boolean },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Disables the unlink button (used when another member is being unlinked) */
    this.disabled = false;

    /** @type {boolean} Whether the details are open by default (only applies when member has peers) */
    this.open = false;

    /** @type {NetworkGroupMemberCardState} Sets the state and data of the member */
    this.state = {
      type: 'idle',
      member: {
        id: '',
        label: '',
        logo: { url: '', a11yName: '' },
        domainName: '',
        kind: 'APPLICATION',
        peerList: [],
      },
    };
  }

  _onUnlinkRequest() {
    this.dispatchEvent(new CcNetworkGroupMemberUnlinkRequestEvent(this.state.member.id));
  }

  render() {
    const hasPeers = this.state.member.peerList.length > 0;

    if (hasPeers) {
      return this._renderWithPeers();
    }
    return this._renderWithoutPeers();
  }

  /** Renders the member identity section (logo + label) */
  _renderIdentity() {
    const { logo, label } = this.state.member;

    return html`
      <div class="identity">
        <cc-img class="identity__logo" src="${logo.url}" a11y-name="${logo.a11yName}"></cc-img>
        <span class="identity__label">${label}</span>
      </div>
    `;
  }

  /** Renders the peer count text */
  _renderPeersCount() {
    const nbOfPeers = this.state.member.peerList.length;

    return html`
      <span class="peers-count"> ${i18n('cc-network-group-member-list.member.nb-of-peers', { nbOfPeers })} </span>
    `;
  }

  /** Renders the domain name with clipboard button */
  _renderDomain() {
    const { domainName } = this.state.member;

    return html`
      <div class="domain">
        ${domainName}
        <cc-clipboard value="${domainName}"></cc-clipboard>
      </div>
    `;
  }

  /** Renders the optional dashboard link */
  _renderDashboardLink() {
    const { dashboardUrl } = this.state.member;

    if (isStringEmpty(dashboardUrl)) {
      return '';
    }

    return html`
      <div class="dashboard-link">
        <cc-link href="${dashboardUrl}"></cc-link>
      </div>
    `;
  }

  /** Renders the unlink button with proper states */
  _renderUnlinkButton() {
    const isUnlinking = this.state.type === 'unlinking';

    return html`
      <cc-button
        class="unlink-btn"
        danger
        outlined
        ?disabled="${this.disabled}"
        ?waiting="${isUnlinking}"
        @cc-click="${this._onUnlinkRequest}"
      >
        ${i18n('cc-network-group-member-list.member.unlink')}
      </cc-button>
    `;
  }

  /** Renders the footer section (dashboard link + unlink button) */
  _renderFooter() {
    return html` <div class="footer">${this._renderDashboardLink()} ${this._renderUnlinkButton()}</div> `;
  }

  /** Renders the peer list */
  _renderPeerList() {
    return html`
      <div class="peer-list">
        ${this.state.member.peerList.map(
          (peer) => html`<cc-network-group-peer-card .peer="${peer}"></cc-network-group-peer-card>`,
        )}
      </div>
    `;
  }

  /** Renders the card variant for members without peers (simple layout) */
  _renderWithoutPeers() {
    return html`
      <div class="member-card member-card--without-peers">
        <div class="header">${this._renderIdentity()} ${this._renderPeersCount()}</div>
        ${this._renderDomain()} ${this._renderFooter()}
      </div>
    `;
  }

  /** Renders the card variant for members with peers (collapsible layout) */
  _renderWithPeers() {
    return html`
      <cc-expand>
        <div class="member-card member-card--with-peers">
          <details class="details" ?open="${this.open}">
            <!-- Note: tabindex="0" needed on summary for consistent focus behavior across browsers -->
            <summary class="header header--clickable" tabindex="0">
              ${this._renderIdentity()}
              <div class="peers-toggle">
                ${this._renderPeersCount()}
                <cc-icon class="arrow-icon" .icon="${iconArrowUp}"></cc-icon>
              </div>
            </summary>
            <div class="details-content">${this._renderDomain()} ${this._renderPeerList()} ${this._renderFooter()}</div>
          </details>
          <div class="domain-collapsed">${this._renderDomain()}</div>
        </div>
      </cc-expand>
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
