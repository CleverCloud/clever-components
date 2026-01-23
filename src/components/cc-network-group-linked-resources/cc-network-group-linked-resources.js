import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getDevHubUrl } from '../../lib/dev-hub-url.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-network-group-member-card/cc-network-group-member-card.js';
import '../cc-notice/cc-notice.js';
import { CcNetworkGroupMemberUnlinkEvent } from './cc-network-group-linked-resources.events.js';

/**
 * @import { NetworkGroupLinkedResourcesState } from './cc-network-group-linked-resources.types.js'
 * @import { CcNetworkGroupMemberUnlinkRequestEvent } from '../cc-network-group-member-card/cc-network-group-member-card.events.js'
 * @import { PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component displaying the list of linked resources (members) in a network group.
 *
 * @cssdisplay block
 *
 * @fires {CcNetworkGroupMemberUnlinkEvent} cc-network-group-member-unlink - Fired when a member unlink is confirmed.
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

    /** @type {Ref<HTMLDivElement>} Ref to the empty text container */
    this._emptyTextRef = createRef();

    /** @type {string|null} Used to track the id of the member to unlink to dispatch the proper event payload */
    this._memberIdToUnlink = null;

    new LostFocusController(this, 'cc-network-group-member-card', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this._emptyTextRef.value?.focus();
        return;
      }

      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      }
    });
  }

  /** @param {string} memberIdToUnlink */
  _onUnlinkMember(memberIdToUnlink) {
    this.dispatchEvent(new CcNetworkGroupMemberUnlinkEvent(memberIdToUnlink));
  }

  /**
   * @param {CcNetworkGroupMemberUnlinkRequestEvent} e
   */
  _onUnlinkMemberRequest(e) {
    this._memberIdToUnlink = e.detail;
  }

  _onDialogClose() {
    this._memberIdToUnlink = null;
  }

  /** @param {PropertyValues<CcNetworkGroupLinkedResources>} changedProperties */
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
          ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
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
                    (member, index) => html`
                      <cc-network-group-member-card
                        .state=${{
                          type: isUnlinking && member.id === this._memberIdToUnlink ? 'unlinking' : 'idle',
                          member,
                        }}
                        ?open=${index === 0}
                        ?disabled=${isUnlinking && member.id !== this._memberIdToUnlink}
                        @cc-network-group-member-unlink-request=${this._onUnlinkMemberRequest}
                      ></cc-network-group-member-card>
                    `,
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
   * @param {string} memberIdToUnlink
   * @param {boolean} isUnlinking
   **/
  _renderUnlinkDialog(memberIdToUnlink, isUnlinking) {
    return html`
      <cc-dialog
        ?open="${memberIdToUnlink != null}"
        heading="${i18n('cc-network-group-linked-resources.unlink.dialog.heading')}"
        @cc-close="${this._onDialogClose}"
      >
        <p>${i18n('cc-network-group-linked-resources.unlink.dialog.desc')}</p>
        <cc-dialog-confirm-actions
          submit-label="${i18n('cc-network-group-linked-resources.unlink.dialog.unlink-btn')}"
          submit-intent="danger"
          @cc-confirm="${() => this._onUnlinkMember(memberIdToUnlink)}"
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

        cc-dialog p {
          margin: 0;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-linked-resources', CcNetworkGroupLinkedResources);
