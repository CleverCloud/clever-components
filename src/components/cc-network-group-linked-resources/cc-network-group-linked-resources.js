import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  iconRemixArrowUpSLine as iconArrowUp,
  iconRemixHashtag as iconId,
  iconRemixInformationFill as iconInfo,
  iconRemixInstallLine as iconIp,
  iconRemixKey_2Fill as iconKey,
  iconRemixRadioButtonLine as iconPeerType,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getDevHubUrl } from '../../lib/dev-hub-url.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcNetworkGroupMemberUnlinkEvent } from './cc-network-group-linked-resources.events.js';

/**
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupLinkedResourcesState} NetworkGroupLinkedResourcesState
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupMember} NetworkGroupMember
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupPeer} NetworkGroupPeer
 * @typedef {import('../cc-button/cc-button.js').CcButton} CcButton
 * @typedef {import('lit').PropertyValues<CcNetworkGroupLinkedResources>} CcNetworkGroupLinkedResourcesPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDivElement>} HTMLDivElementRef
 */

export class CcNetworkGroupLinkedResources extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _memberIdToUnlink: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupLinkedResourcesState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {HTMLDialogElementRef} Ref to the "confirm unlink" dialog */
    this._confirmUnlinkDialogRef = createRef();

    /** @type {HTMLDivElementRef} Ref to the empty text container */
    this._emptyTextRef = createRef();

    /** @type {string|null} Used to track the id of the member to unlink to dispatch the proper event payload */
    this._memberIdToUnlink = null;

    new LostFocusController(this, '.member-card', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this._emptyTextRef.value?.focus();
        return;
      }

      /** @type {CcButton} */
      const deleteBtnElement = suggestedElement.querySelector('cc-button[danger]');
      const detailsElement = suggestedElement.querySelector('details');
      if (suggestedElement.classList.contains('member-card--with-peers') && !detailsElement?.open) {
        detailsElement.querySelector('summary')?.focus();
      } else {
        deleteBtnElement?.focus();
      }
    });
  }

  /** @param {string} memberIdToUnlink */
  _onUnlinkMember(memberIdToUnlink) {
    this.dispatchEvent(new CcNetworkGroupMemberUnlinkEvent(memberIdToUnlink));
  }

  /** @param {string} memberId */
  _onUnlinkMemberRequest(memberId) {
    this._memberIdToUnlink = memberId;
  }

  _onDialogClose() {
    this._memberIdToUnlink = null;
  }

  /** @param {CcNetworkGroupLinkedResourcesPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    // when the member has been unlinked (or if it failed), we need to close the dialog
    const wasUnlinking = changedProperties.get('state')?.type === 'unlinking';
    const isNotUnlinking = this.state.type !== 'unlinking';
    if (wasUnlinking && isNotUnlinking) {
      this._memberIdToUnlink = null;
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`
        <cc-notice intent="warning" message="${i18n('cc-network-group-linked-resources.error')}"></cc-notice>
      `;
    }

    const isUnlinking = this.state.type === 'unlinking';

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-linked-resources.heading')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-network-group-linked-resources.intro')}</p>
          ${this.state.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
          ${this.state.type === 'loaded' && this.state.memberList.length === 0
            ? html`
                <div class="empty" ${ref(this._emptyTextRef)} tabindex="-1">
                  <p>${i18n('cc-network-group-linked-resources.member-list.empty')}</p>
                </div>
              `
            : ''}
          ${(this.state.type === 'loaded' || this.state.type === 'unlinking') && this.state.memberList.length > 0
            ? html`
                <div class="member-list">
                  ${repeat(
                    this.state.memberList,
                    (member) => member.id,
                    (member, index) =>
                      this._renderMember({
                        member,
                        isOneMemberUnlinking: isUnlinking,
                        isThisMemberUnlinking: isUnlinking && member.id === this._memberIdToUnlink,
                        isOpenByDefault: index === 0,
                      }),
                  )}
                </div>
              `
            : ''}
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <div slot="link">
            <cc-link href="${getDevHubUrl('/cli/network-groups')}" .icon="${iconInfo}">
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
      ${this._renderUnlinkDialog(this._memberIdToUnlink, isUnlinking)}
    `;
  }

  /**
   * @param {object} _
   * @param {NetworkGroupMember} _.member
   * @param {boolean} _.isOpenByDefault
   * @param {boolean} _.isOneMemberUnlinking
   * @param {boolean} _.isThisMemberUnlinking
   **/
  _renderMember({ member, isOpenByDefault, isOneMemberUnlinking, isThisMemberUnlinking }) {
    if (member.peerList.length === 0) {
      return html`
        <div class="member-card member-card--without-peers" tabindex="-1">
          <div class="member-card--without-peers__header">
            <div class="member-card--without-peers__header__identity">
              <cc-img
                class="member-card--without-peers__header__identity__logo"
                src="${member.logo.url}"
                a11y-name="${member.logo.a11yName}"
              >
              </cc-img>
              <span class="member-card--without-peers__header__identity__label">${member.label}</span>
            </div>

            <span class="member-card--without-peers__header__peers-btn__nb">
              ${i18n('cc-network-group-linked-resources.member.nb-of-peers', {
                nbOfPeers: member.peerList.length,
              })}
            </span>
          </div>

          <div class="member-card--without-peers__footer">
            <div class="member-card--without-peers__footer__domain">
              <!-- FIXME: link is not really relevant since it can only accessed by member peers -->
              <span>${member.domainName}</span>
              <cc-clipboard value="${member.domainName}"></cc-clipboard>
            </div>

            <cc-button
              class="member-card---without-peers__footer__unlink-btn"
              danger
              outlined
              @cc-click="${() => this._onUnlinkMemberRequest(member.id)}"
              ?disabled="${isOneMemberUnlinking && !isThisMemberUnlinking}"
              ?waiting="${isThisMemberUnlinking}"
            >
              ${i18n('cc-network-group-linked-resources.member.unlink')}
            </cc-button>
          </div>
        </div>
      `;
    }
    return html`
      <div class="member-card member-card--with-peers" tabindex="-1">
        <details class="member-card--with-peers__details" ?open="${isOpenByDefault}">
          <!-- FIXME: cannot remember why we need the tabindex on summary, check and document -->
          <summary class="member-card--with-peers__details__header" tabindex="0">
            <div class="member-card--with-peers__details__header__identity">
              <cc-img
                class="member-card--with-peers__details__header__identity__logo"
                src="${member.logo.url}"
                a11y-name="${member.logo.a11yName}"
              >
              </cc-img>
              <span class="member-card--with-peers__details__header__identity__label">${member.label}</span>
            </div>
            <span class="member-card--with-peers__details__header__peers__nb">
              ${i18n('cc-network-group-linked-resources.member.nb-of-peers', {
                nbOfPeers: member.peerList.length,
              })}
            </span>
            <cc-icon class="member-card--with-peers__details__header__arrow-icon" .icon="${iconArrowUp}"></cc-icon>
          </summary>
          <div class="member-card--with-peers__details__domain">
            <!-- FIXME: link is not really relevant since it can only accessed by member peers -->
            <span>${member.domainName}</span>
            <cc-clipboard value="${member.domainName}"></cc-clipboard>
          </div>
          <div class="peer-list">${member.peerList.map((peer) => this._renderPeer(peer))}</div>
          <cc-button
            class="member-card--with-peers__details__unlink-btn"
            danger
            outlined
            @cc-click="${() => this._onUnlinkMemberRequest(member.id)}"
            ?disabled="${isOneMemberUnlinking && !isThisMemberUnlinking}"
            ?waiting="${isThisMemberUnlinking}"
          >
            ${i18n('cc-network-group-linked-resources.member.unlink')}
          </cc-button>
        </details>
        <div class="member-card--with-peers__domain">
          <!-- FIXME: link is not really relevant since it can only accessed by member peers -->
          <span>${member.domainName}</span>
          <cc-clipboard value="${member.domainName}"></cc-clipboard>
        </div>
      </div>
    `;
  }

  /** @param {NetworkGroupPeer} peer */
  _renderPeer(peer) {
    return html`
      <div class="peer-card">
        <span class="peer-card__label">${peer.label}</span>
        <dl class="metadata-list">
          <div class="metadata-item metadata-item--id">
            <dt>
              <cc-icon
                .icon="${iconId}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.id')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.id}</span></dd>
          </div>
          <div class="metadata-item metadata-item--key">
            <dt>
              <cc-icon
                .icon="${iconKey}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.key')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.publicKey}</span></dd>
          </div>
          <div class="metadata-item metadata-item--ip">
            <dt>
              <cc-icon
                .icon="${iconIp}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.ip')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.ip}</span></dd>
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
              <span>${peer.type}</span>
            </dd>
          </div>
        </dl>
      </div>
    `;
  }

  /**
   * @param {string} memberIdToUnlink
   * @param {boolean} isUnlinking
   **/
  _renderUnlinkDialog(memberIdToUnlink, isUnlinking) {
    return html`
      <cc-dialog
        ?open="${memberIdToUnlink != null}"
        heading="${i18n('cc-network-group-linked-resources.unlink.dialog.heading')}"
        @cc-dialog-close="${this._onDialogClose}"
      >
        <p>${i18n('cc-network-group-linked-resources.unlink.dialog.desc')}</p>
        <cc-dialog-confirm-actions
          submit-label="${i18n('cc-network-group-linked-resources.unlink.dialog.unlink-btn')}"
          submit-intent="danger"
          @cc-dialog-confirm="${() => this._onUnlinkMember(memberIdToUnlink)}"
          ?waiting="${isUnlinking}"
        >
        </cc-dialog-confirm-actions>
      </cc-dialog>
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

        .empty:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .member-list {
          display: grid;
          gap: 0.5em;
        }

        .member-card {
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default, 0.25em);
          padding: 1em;
        }

        .member-card--without-peers__header,
        .member-card--with-peers__details__header {
          display: flex;
          gap: 1em;
        }

        .member-card--with-peers__details__header {
          cursor: pointer;
          margin: -1em -1em 0.5em;
          padding: 1em;
        }

        .member-card--without-peers__header {
          justify-content: space-between;
        }

        .member-card--with-peers__details__header__arrow-icon {
          --cc-icon-size: 2em;

          transition: all 0.3s;
        }

        .member-card--with-peers__details__header:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .member-card--with-peers__details__header:focus {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .member-card--with-peers__details:not([open]) .member-card--with-peers__details__header__arrow-icon {
          transform: rotate(180deg);
          transition: all 0.3s;
        }

        /* TODO: more complex than that, we need a rotate when :hover not open, a rotate when :hover open */
        .member-card--with-peers__details__header:hover .member-card--with-peers__details__header__arrow-icon {
          transform: rotate(360deg);
          transition: all 0.3s;
        }

        .member-card--without-peers__header__identity,
        .member-card--with-peers__details__header__identity {
          align-items: center;
          align-self: center;
          display: flex;
          flex: 1 1 auto;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .member-card--with-peers__details__header__identity__label {
          color: var(--cc-color-text-primary-strongest);
          flex: 1 1 0;
          font-weight: bold;
        }

        .member-card--without-peers__header__identity__logo,
        .member-card--with-peers__details__header__identity__logo {
          border-radius: var(--cc-border-radius-small, 0.15em);
          height: 1.5em;
          width: 1.5em;
        }

        .member-card--without-peers__footer {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: space-between;
          margin-top: 1em;
        }

        .member-card--with-peers__domain cc-clipboard,
        .member-card--without-peers__footer__domain cc-clipboard,
        .member-card--with-peers__details__domain cc-clipboard {
          display: inline-block;
          vertical-align: middle;
        }

        details[open] + .member-card--with-peers__domain {
          display: none;
        }

        .member-card--with-peers__details__header__peers__nb {
          align-items: center;
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default);
          cursor: pointer;
          display: flex;
          flex: 0 0 auto;
          font-style: italic;
          gap: 1em;
          padding: 0.5em;
        }

        .member-card--with-peers__details__header__peers-btn:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .member-card--with-peers__details__unlink-btn {
          display: block;
          margin-left: auto;
          width: fit-content;
        }

        .peer-list {
          display: grid;
          gap: 0.5em;
          margin-block: 1em;
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

        @container peer-card (max-width: 10em) {
          .metadata-list {
            flex-direction: column;
          }
        }

        .metadata-item {
          display: flex;
          gap: 0.5em;
          word-break: break-all;
        }

        cc-dialog p {
          margin: 0;
        }

        button:focus {
          outline: solid 2px red;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-linked-resources', CcNetworkGroupLinkedResources);
