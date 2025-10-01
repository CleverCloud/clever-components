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
import { generateDocsHref } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-code/cc-code.js';
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

    new LostFocusController(
      this,
      '[data-member-id], cc-dialog[open]',
      ({ suggestedElement, focusedElement, index, removedElement }) => {
        console.log('LOST FOCUS', { suggestedElement, focusedElement, index, removedElement });
        if (suggestedElement instanceof HTMLElement) {
          suggestedElement.querySelector('summary').focus();
        } else {
          this._emptyTextRef.value?.focus();
        }
      },
    );

    // new ListFocusManagementController(
    //   this,
    //   '[data-member-id]',
    //   ({ suggestedElement, lastRemovedElementIndex, removedElements }) => {
    //     if (suggestedElement instanceof HTMLElement) {
    //       console.log(suggestedElement.querySelector('summary'));
    //
    //       this._confirmUnlinkDialogRef.value?.updateComplete.then(() => {
    //         suggestedElement.querySelector('summary').focus();
    //       });
    //     } else {
    //       this._emptyTextRef.value?.focus();
    //     }
    //   },
    // );
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
    const previousState = changedProperties.get('state');
    const wasUnlinking = previousState?.type === 'unlinking';
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
        ${this._renderUnlinkDialog(this._memberIdToUnlink, this.state.type === 'unlinking')}
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

  /**
   * @param {object} _
   * @param {NetworkGroupMember} _.member
   * @param {boolean} _.isOpenByDefault
   * @param {boolean} _.isOneMemberUnlinking
   * @param {boolean} _.isThisMemberUnlinking
   **/
  _renderMember({ member, isOpenByDefault, isOneMemberUnlinking, isThisMemberUnlinking }) {
    return html`
      <div class="member-list__member-card" data-member-id="${member.id}">
        <details class="member-list__member-card__details" ?open="${isOpenByDefault}" data-member-id="${member.id}">
          <summary class="member-list__member-card__details__header" tabindex="0">
            <div class="member-list__member-card__details__header__identity">
              <cc-img
                class="member-list__member-card__details__header__identity__logo"
                src="${member.logo.url}"
                a11y-name="${member.logo.a11yName}"
              >
              </cc-img>
              <span class="member-list__member-card__details__header__identity__label">${member.label}</span>
            </div>
            <span class="member-list__member-card__details__header__peers-btn__nb">
              ${i18n('cc-network-group-linked-resources.member.nb-of-peers', {
                nbOfPeers: member.peerList.length,
              })}
            </span>
            <cc-icon class="member-list__member-card__details__header__arrow-icon" .icon="${iconArrowUp}"></cc-icon>
          </summary>
          <div class="member-list__member-card__details__domain">
            <!-- FIXME: link is not really relevant since it can only accessed by member peers -->
            <span>${member.domainName}</span>
            <cc-clipboard value="${member.domainName}"></cc-clipboard>
          </div>
          <div class="member-list__member-card__details__peer-list">
            ${member.peerList.map((peer) => this._renderPeer(peer))}
          </div>
          <cc-button
            class="member-list__member-card__details__unlink-btn"
            danger
            outlined
            @cc-click="${() => this._onUnlinkMemberRequest(member.id)}"
            ?disabled="${isOneMemberUnlinking && !isThisMemberUnlinking}"
            ?waiting="${isThisMemberUnlinking}"
          >
            ${i18n('cc-network-group-linked-resources.member.unlink')}
          </cc-button>
        </details>
        <div class="member-list__member-card__domain">
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
      <div class="member-list__member-card__details__peer-list__peer-card">
        <span class="member-list__member-card__details__peer-list__peer-card__label">${peer.label}</span>
        <dl class="member-list__member-card__details__peer-list__peer-card__metadata">
          <div class="member-list__member-card__details__peer-list__peer-card__metadata__id">
            <dt>
              <cc-icon
                .icon="${iconId}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.id')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.id}</span></dd>
          </div>
          <div class="member-list__member-card__details__peer-list__peer-card__metadata__key">
            <dt>
              <cc-icon
                .icon="${iconKey}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.key')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.publicKey}</span></dd>
          </div>
          <div class="member-list__member-card__details__peer-list__peer-card__metadata__ip">
            <dt>
              <cc-icon
                .icon="${iconIp}"
                a11y-name="${i18n('cc-network-group-linked-resources.peer.metadata.ip')}"
              ></cc-icon>
            </dt>
            <dd><span>${peer.ip}</span></dd>
          </div>
          <div class="member-list__member-card__details__peer-list__peer-card__metadata__peer-type">
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
        slot="content"
        ?open="${memberIdToUnlink != null}"
        @cancel="${this._onDialogClose}"
        ${ref(this._confirmUnlinkDialogRef)}
      >
        <div slot="heading">${i18n('cc-network-group-linked-resources.unlink.dialog.heading')}</div>
        <p slot="content">${i18n('cc-network-group-linked-resources.unlink.dialog.desc')}</p>
        <div slot="actions">
          <cc-button outlined @cc-click="${this._onDialogClose}" ?disabled="${isUnlinking}">
            ${i18n('cc-network-group-linked-resources.unlink.dialog.cancel-btn')}
          </cc-button>
          <cc-button
            class="dialog-unlink-btn"
            danger
            @cc-click="${() => this._onUnlinkMember(memberIdToUnlink)}"
            ?waiting="${isUnlinking}"
          >
            ${i18n('cc-network-group-linked-resources.unlink.dialog.unlink-btn')}
          </cc-button>
        </div>
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

        .member-list__member-card {
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default, 0.25em);
          padding: 1em;
        }

        .member-list__member-card__details__header {
          align-items: center;
          cursor: pointer;
          display: flex;
          gap: 1em;
          margin: -1em;
          padding: 0.5em 1em;
        }

        .member-list__member-card__details__header__arrow-icon {
          --cc-icon-size: 2em;

          transition: all 0.3s;
        }

        .member-list__member-card__details__header:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .member-list__member-card__details__header:focus {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .member-list__member-card__details:not([open]) .member-list__member-card__details__header__arrow-icon {
          transform: rotate(180deg);
          transition: all 0.3s;
        }

        /* TODO: more complex than that, we need a rotate when :hover not open, a rotate when :hover open */
        .member-list__member-card__details__header:hover .member-list__member-card__details__header__arrow-icon {
          transform: rotate(360deg);
          transition: all 0.3s;
        }

        .member-list__member-card__details__header__identity {
          align-items: center;
          align-self: center;
          display: flex;
          flex: 1 1 auto;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .member-list__member-card__details__header__identity__label {
          color: var(--cc-color-text-primary-strongest);
          font-weight: bold;
        }

        .member-list__member-card__details__header__identity__logo {
          border-radius: var(--cc-border-radius-small, 0.15em);
          height: 1.5em;
          width: 1.5em;
        }

        .member-list__member-card__domain,
        .member-list__member-card__details__domain {
          align-items: center;
          display: flex;
          gap: 1em;
          margin-top: 1.5em;
          overflow: hidden;
        }

        details[open] + .member-list__member-card__domain {
          display: none;
        }

        .member-list__member-card__details__header__domain span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .member-list__member-card__details__header__peers-btn {
          align-items: center;
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default);
          cursor: pointer;
          display: flex;
          font-style: italic;
          gap: 1em;
          padding: 0.5em;
        }

        .member-list__member-card__details__header__peers-btn:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .member-list__member-card__details__unlink-btn {
          display: block;
          margin-left: auto;
          width: fit-content;
        }

        .member-list__member-card__details__peer-list {
          display: grid;
          gap: 0.5em;
          margin-block: 1em;
        }

        .member-list__member-card__details__peer-list__peer-card {
          background-color: var(--cc-color-bg-neutral);
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default);
          display: grid;
          gap: 1em;
          padding: 1em;
        }

        .member-list__member-card__details__peer-list__peer-card__label {
          font-weight: bold;
        }

        .member-list__member-card__details__peer-list__peer-card__metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .member-list__member-card__details__peer-list__peer-card__metadata__key span {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-list__member-card__details__peer-list__peer-card__metadata__id,
        .member-list__member-card__details__peer-list__peer-card__metadata__key {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        cc-dialog p[slot='content'] {
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
