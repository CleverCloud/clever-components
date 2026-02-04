import { css, html, LitElement, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-network-group-member-card/cc-network-group-member-card.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import {
  CcNetworkGroupMemberLinkEvent,
  CcNetworkGroupMemberUnlinkEvent,
} from './cc-network-group-member-list.events.js';

/**
 * @import { NetworkGroupMemberListState, NetworkGroupMemberLinkFormState } from './cc-network-group-member-list.types.js'
 * @import { CcNetworkGroupMemberUnlinkRequestEvent } from '../cc-network-group-member-card/cc-network-group-member-card.events.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 * @import { PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component displaying the list of linked resources (members) in a network group.
 *
 * @cssdisplay block
 */
export class CcNetworkGroupMemberList extends LitElement {
  static get properties() {
    return {
      linkFormState: { type: Object, attribute: 'link-form-state' },
      memberListState: { type: Object, attribute: 'member-list-state' },
      _memberIdToUnlink: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupMemberLinkFormState} Sets the state of the link form */
    this.linkFormState = { type: 'loading' };

    /** @type {NetworkGroupMemberListState} Sets the state of the member list */
    this.memberListState = { type: 'loading' };

    /** @type {Ref<HTMLDivElement>} Ref to the empty text container */
    this._emptyTextRef = createRef();

    /** @type {Ref<HTMLFormElement>} Ref to the link form */
    this._linkFormRef = createRef();

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

  /** @param {{ member: string }} formData */
  _onLinkMember({ member }) {
    this.dispatchEvent(new CcNetworkGroupMemberLinkEvent(member));
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

  resetLinkForm() {
    this._linkFormRef.value?.reset();
  }

  /** @param {PropertyValues<CcNetworkGroupMemberList>} changedProperties */
  willUpdate(changedProperties) {
    // when the member has been unlinked (or if it failed), we need to close the dialog
    const wasUnlinking = changedProperties.get('memberListState')?.type === 'unlinking';
    const isNotUnlinking = this.memberListState.type !== 'unlinking';
    if (wasUnlinking && isNotUnlinking) {
      this._memberIdToUnlink = null;
    }
  }

  render() {
    const isUnlinking = this.memberListState.type === 'unlinking';

    return html`
      ${this._renderMemberList({
        state: this.memberListState,
        memberIdToUnlink: this._memberIdToUnlink,
        emptyTextRef: this._emptyTextRef,
      })}
      ${this._renderLinkForm({ state: this.linkFormState })}
      ${this._renderUnlinkDialog(this._memberIdToUnlink, isUnlinking)}
    `;
  }

  /**
   * Renders the member list block with all its states.
   *
   * @param {object} params
   * @param {NetworkGroupMemberListState} params.state - The state of the member list
   * @param {string|null} params.memberIdToUnlink - ID of the member being unlinked
   * @param {Ref<HTMLDivElement>} params.emptyTextRef - Ref for the empty text element
   * @returns {import('lit').TemplateResult}
   */
  _renderMemberList({ state, memberIdToUnlink, emptyTextRef }) {
    const isUnlinking = state.type === 'unlinking';
    const hasMembers = state.type === 'loaded' || state.type === 'unlinking' ? state.memberList.length > 0 : false;

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-member-list.heading')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-network-group-member-list.intro')}</p>
          ${state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
          ${state.type === 'error'
            ? html`<cc-notice intent="warning" message="${i18n('cc-network-group-member-list.error')}"></cc-notice>`
            : ''}
          ${state.type === 'loaded' && !hasMembers
            ? html`
                <div class="empty" ${ref(emptyTextRef)} tabindex="-1">
                  <p>${i18n('cc-network-group-member-list.member-list.empty')}</p>
                </div>
              `
            : ''}
          ${(state.type === 'loaded' || state.type === 'unlinking') && hasMembers
            ? html`
                <div class="member-list">
                  ${repeat(
                    state.memberList,
                    (member) => member.id,
                    (member, index) => html`
                      <cc-network-group-member-card
                        .member=${member}
                        ?is-open=${index === 0}
                        ?is-unlinking=${isUnlinking && member.id === memberIdToUnlink}
                        ?is-disabled=${isUnlinking && member.id !== memberIdToUnlink}
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
            <cc-link href="${getDocUrl('/develop/network-groups')}" .icon="${iconInfo}">
              ${i18n('cc-network-group-member-list.documentation.text')}
            </cc-link>
          </div>
          <!-- TODO: contenttttt -->
          <div slot="content">
            <div class="cli-heading">${i18n('cc-network-group-member-list.cli.heading')}</div>
            <p>${i18n('cc-network-group-member-list.cli.content.instruction')}</p>
            <dl>
              <dt>${i18n('cc-network-group-member-list.cli')}</dt>
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
   * @param {string} memberIdToUnlink
   * @param {boolean} isUnlinking
   **/
  _renderUnlinkDialog(memberIdToUnlink, isUnlinking) {
    return html`
      <cc-dialog
        ?open="${memberIdToUnlink != null}"
        heading="${i18n('cc-network-group-member-list.unlink.dialog.heading')}"
        @cc-close="${this._onDialogClose}"
      >
        <p>${i18n('cc-network-group-member-list.unlink.dialog.desc')}</p>
        <cc-dialog-confirm-actions
          submit-label="${i18n('cc-network-group-member-list.unlink.dialog.unlink-btn')}"
          submit-intent="danger"
          @cc-confirm="${() => this._onUnlinkMember(memberIdToUnlink)}"
          ?waiting="${isUnlinking}"
        >
        </cc-dialog-confirm-actions>
      </cc-dialog>
    `;
  }

  /**
   * Renders the link form block with all its states.
   * @param {object} params
   * @param {NetworkGroupMemberLinkFormState} params.state - The state of the link form
   * @returns {import('lit').TemplateResult}
   */
  _renderLinkForm({ state }) {
    /** @type {Array<Option>} */
    const selectOptions = state.type === 'idle' || state.type === 'linking' ? state.selectOptions : [];
    const isLoading = state.type === 'loading';
    const isLinking = state.type === 'linking';
    const hasOptions = selectOptions.length > 0;
    const sortedSelectOptions = selectOptions.toSorted((optionA, optionB) =>
      optionA.label.localeCompare(optionB.label),
    );
    const defaultValue = sortedSelectOptions[0]?.value ?? nothing;

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-member-list.link-form.heading')}</div>
        <div slot="content">
          ${state.type === 'error'
            ? html` <cc-notice intent="warning" message="${i18n('cc-network-group-member-list.error')}"></cc-notice> `
            : ''}
          ${!isLoading && !hasOptions
            ? html`
                <div class="empty-form">
                  <p>${i18n('cc-network-group-member-list.link-form.empty')}</p>
                </div>
              `
            : html`
                <form class="link-form" ${formSubmit(this._onLinkMember.bind(this))} ${ref(this._linkFormRef)}>
                  <cc-select
                    label="${i18n('cc-network-group-member-list.link-form.select-label')}"
                    class="link-form__select"
                    ?disabled="${isLoading || isLinking}"
                    .options="${sortedSelectOptions}"
                    name="member"
                    .value="${defaultValue}"
                    .resetValue="${defaultValue}"
                  ></cc-select>
                  <cc-button
                    class="link-form__submit"
                    outlined
                    primary
                    type="submit"
                    ?skeleton="${isLoading}"
                    ?waiting="${isLinking}"
                  >
                    ${i18n('cc-network-group-member-list.link-form.button')}
                  </cc-button>
                </form>
              `}
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: grid;
          gap: 1em;
        }

        .intro {
          margin: 0 0 1em;
        }

        .empty,
        .empty-form {
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

        .link-form {
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .link-form__select {
          flex: 100 1 20em;
        }

        .link-form__submit {
          flex: 1 1 auto;
        }

        cc-dialog p {
          margin: 0;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-member-list', CcNetworkGroupMemberList);
