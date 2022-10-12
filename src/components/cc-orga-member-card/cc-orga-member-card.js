import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import '../cc-badge/cc-badge.js';
import '../cc-select/cc-select.js';
import '../cc-stretch-to-max-content/cc-stretch-to-max-content.js';

const tickSvg = new URL('../../assets/tick.svg', import.meta.url).href;
const tickBlueSvg = new URL('../../assets/tick-blue.svg', import.meta.url).href;
const closeSvg = new URL('../../assets/delete-neutral.svg', import.meta.url).href;
const trashSvg = new URL('../../assets/trash-red.svg', import.meta.url).href;
const errorSvg = new URL('../../assets/error.svg', import.meta.url).href;
const penSvg = new URL('../../assets/pen.svg', import.meta.url).href;
const profileSvg = new URL('../../assets/profile.svg', import.meta.url).href;

const BREAKPOINT_MEDIUM = 740;
const BREAKPOINT_SMALL = 580;
const BREAKPOINT_TINY = 350;

/**
 * @typedef {import('./cc-orga-member-card.types.js').OrgaMemberCardState} OrgaMemberCardState
 * @typedef {import('./cc-orga-member-card.types.js').EditMemberPayload} EditMemberPayload
 */

/**
 * A component displaying information about a member from a given organisation.
 *
 * ## Details
 *
 * * This component also provides a way to edit the role of the member.
 *
 * @cssdisplay block
 *
 * TODO change event types
 * @event {CustomEvent<EditMemberPayload>} cc-orga-member-card:update - Fires the `id` of the member and the new `role` to be updated.
 * @event {CustomEvent<string>} cc-orga-member-card:delete - Fires the `id` of the member to be removed from the org.
 * @event {CustomEvent} cc-orga-member-card:toggle-editing - Fires the `id` of the member related to the card and `isEditing` boolean to specify when card is in edit mode or not. This allows the list component to close all other cards in edit mode to leave only one pending edition at once.
 */
export class CcOrgaMemberCard extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      member: { type: Object },
      _size: { type: String, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {OrgaMemberCardState} Sets the state and data of the member */
    this.member = { state: 'loading' };

    /** @protected */
    this.breakpoints = {
      // used to switch to buttons wrapping below when component width < 740 and vertical card layout when < 580
      width: [BREAKPOINT_TINY, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM],
    };

    this._roleRef = createRef();
    this._removeButtonRef = createRef();
  }

  _getRoleOptions () {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-card.role-admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-card.role-developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-card.role-accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-card.role-manager') },
    ];
  }

  onResize ({ width }) {
    this._size = width;
  }

  _onRemoveMember () {
    dispatchCustomEvent(this, 'delete', {
      memberId: this.member.id,
      userIdentity: this.member.name ?? this.member.email,
    });
  }

  async _onToggleEdit () {
    const newState = this.member.state === 'loaded' ? 'editing' : 'loaded';

    this.member = {
      ...this.member,
      state: newState,
    };

    // edit toggling is managed by `cc-orga-member-list` so that only one card can be edited at a time.
    dispatchCustomEvent(this, 'toggle-editing', {
      memberId: this.member.id,
      newState,
    });

    /* Focus the `<select>` element when entering edit mode */
    if (newState === 'editing') {
      await this.updateComplete;
      this._roleRef.value.focus();
    }
  }

  _onRoleSubmit () {
    dispatchCustomEvent(this, 'update', {
      memberId: this.member.id,
      role: this._roleRef.value.value,
      userIdentity: this.member.name ?? this.member.email,
    });
  }

  /*
  * Focus the delete button within the card.
  * To be used when a card is removed, and you want to focus another card (LostFocusController).
  */
  focusDelete () {
    this._removeButtonRef.value.focus();
  }

  render () {

    const avatar = this.member.avatar ?? profileSvg;
    const waiting = this.member.state === 'updating' || this.member.state === 'deleting';
    const hasName = this.member.name != null;

    return html`
      <cc-img class="avatar ${classMap({ waiting })}" src=${avatar}></cc-img>
      <div
        class="identity ${classMap({ waiting })}"
        title="${ifDefined(this.member.jobTitle ?? undefined)}"
      >
        ${hasName || this.member.isCurrentUser ? html`
          <p class="name">
            ${hasName ? html`<strong>${this.member.name}</strong>` : ''}
            ${this.member.isCurrentUser ? html`
              <cc-badge>${i18n('cc-orga-member-card.current-user')}</cc-badge>
            ` : ''}
          </p>
        ` : ''}
        <p class="email">${this.member.email}</p>
        
      </div>

      ${this._renderStatusArea()}

      ${this._renderActionBtns()}
    `;
  }

  // TODO: document the "visible because same size"
  _renderStatusArea () {
    const isEditing = this.member.state === 'editing' || this.member.state === 'updating';
    const waiting = this.member.state === 'updating' || this.member.state === 'deleting';
    const hasError = this.member.error === 'last-admin';
    return html`
      <cc-stretch-to-max-content class="status ${classMap({ waiting })}" visible-element-id=${isEditing ? 'status-editing' : 'status-readonly'}>
        <div id="status-readonly" class="status__role-mfa">
          <cc-stretch-to-max-content ?disable-stretching=${this._size < BREAKPOINT_MEDIUM} ?center-content=${this._size > BREAKPOINT_SMALL} visible-element-id=${this.member.role}>
            ${this._getRoleOptions().map((role) => html`
                <cc-badge id="${role.value}" intent="info" weight="dimmed">${role.label}</cc-badge>
            `)}
          </cc-stretch-to-max-content>

          <cc-stretch-to-max-content ?center-content=${this._size > BREAKPOINT_SMALL} visible-element-id=${this.member.isMfaEnabled ? 'badge-mfa-enabled' : 'badge-mfa-disabled'}>
            <cc-badge id="badge-mfa-enabled" intent="success" weight="outlined" icon-src="${tickSvg}">
              ${i18n('cc-orga-member-card.mfa-enabled')}
            </cc-badge>
            <cc-badge id="badge-mfa-disabled" intent="danger" weight="outlined" icon-src="${errorSvg}">
              ${i18n('cc-orga-member-card.mfa-disabled')}
            </cc-badge>
          </cc-stretch-to-max-content>
        </div>

        <cc-select
          id="status-editing"
          label="${i18n('cc-orga-member-card.label-role')}"
          .options=${this._getRoleOptions()}
          .value=${live(this.member.role)}
          ?inline=${this._size > BREAKPOINT_TINY}
          ?disabled=${this.member.state === 'updating'}
          ${ref(this._roleRef)}
        >
        </cc-select>
      </cc-stretch-to-max-content>
      <div class="error-wrapper ${classMap({ 'out-of-flow': !hasError })}" aria-live="polite" aria-atomic="true">
        ${hasError ? html`<p>${i18n('cc-orga-member-card.error-last-admin')}</p>` : ''}
      </div>
    `;
  }

  _renderActionBtns () {
    const isBtnImgOnly = (this._size > BREAKPOINT_MEDIUM);
    const waiting = this.member.state === 'updating' || this.member.state === 'deleting';
    const isEditing = this.member.state === 'editing' || this.member.state === 'updating';
    const hasError = this.member.error === 'last-admin';
    const firstBtnIcon = isEditing ? closeSvg : penSvg;
    const secondBtnIcon = isEditing ? tickBlueSvg : trashSvg;
    const removeOrLeaveTextId = this.member.isCurrentUser ? 'btn-content-leave' : 'btn-content-remove';
    const removeOrLeaveTextString = this.member.isCurrentUser ? i18n('cc-orga-member-card.btn-leave') : i18n('cc-orga-member-card.btn-remove');

    return html`

      <div class="actions">
        <cc-button
          class="actions__first"
          ?primary=${!isEditing}
          outlined
          image=${firstBtnIcon}
          ?circle=${isBtnImgOnly}
          ?disabled=${waiting}
          ?hide-text=${isBtnImgOnly}
          accessible-name=${isEditing ? i18n('cc-orga-member-card.btn-cancel') : i18n('cc-orga-member-card.btn-edit')}
          @cc-button:click=${this._onToggleEdit}
        >
          <cc-stretch-to-max-content center-content visible-element-id=${isEditing ? 'btn-content-cancel' : 'btn-content-edit'}>
            <span id="btn-content-edit">${i18n('cc-orga-member-card.btn-edit')}</span>
            <span id="btn-content-cancel">${i18n('cc-orga-member-card.btn-cancel')}</span>
          </cc-stretch-to-max-content>
        </cc-button>
  
        <cc-button
          class="actions__second"
          ?danger=${!isEditing}
          ?primary=${isEditing}
          outlined
          image=${secondBtnIcon}
          ?disabled=${hasError}
          ?circle=${isBtnImgOnly}
          ?hide-text=${isBtnImgOnly}
          ?waiting=${waiting}
          accessible-name=${isEditing ? i18n('cc-orga-member-card.btn-validate') : removeOrLeaveTextString}
          @cc-button:click=${this._onRemoveMember}
          ${ref(this._removeButtonRef)}
        >
          <cc-stretch-to-max-content center-content visible-element-id=${isEditing ? 'btn-content-validate' : removeOrLeaveTextId}>
            <span id="btn-content-leave">${i18n('cc-orga-member-card.btn-leave')}</span>
            <span id="btn-content-remove">${i18n('cc-orga-member-card.btn-remove')}</span>
            <span id="btn-content-validate">${i18n('cc-orga-member-card.btn-validate')}</span>
          </cc-stretch-to-max-content>
        </cc-button>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        /*region big (> 740) & global */
        :host {
          align-items: center;
          display: grid;
          gap: 1em;
          grid-auto-flow: row;
          grid-template-areas: "avatar identity status actions";
          grid-template-columns: max-content 1fr max-content max-content;
        }

        .waiting {
          opacity: 0.5;
        }

        .avatar {
          border-radius: 100%;
          grid-area: avatar;
          height: 2.5em;
          width: 2.5em;
        }

        .identity {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
          grid-area: identity;
          justify-content: center;
          word-break: break-all;
        }
        
        .status {
          grid-area: status;
        }

        .actions {
          display: grid;
          gap: 0.5em;
          grid-area: actions;
          grid-template-columns: max-content max-content;
        }
        
        .status__role-mfa {
          align-items: center;
          display: grid;
          gap: 0.5em;
          grid-template-columns: min-content max-content;
        }

        p {
          margin: 0;
        }

        cc-badge {
          width: max-content;
        }
        
        .error-wrapper {
          display: flex;
          grid-area: unset;
          grid-column: 2 / -1;
          justify-content: end;
        }

        .error-wrapper.out-of-flow {
          grid-area: avatar / actions;
        }

        .error-wrapper p {
          background-color: var(--cc-color-bg-danger-weaker);
          border: 1px solid var(--cc-color-bg-danger);
          border-radius: 0.4em;
          padding: 0.5em 1em;
        }
        /*endregion */

        /*region medium (< 740) */
        :host([w-lt-740]) {
          grid-template-areas: "avatar identity status"
                               ". . actions";
          grid-template-columns: max-content 1fr max-content;
        }

        :host([w-lt-740]) .status,
        :host([w-lt-740]) .actions {
          justify-self: end;
        }
        /*endregion */

        /*region small (< 580) */
        :host([w-lt-580]) {
          grid-template-areas: "avatar identity"
                               ". status"
                               ". actions";
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-580]) .status {
          justify-self: start;
        }

        :host([w-lt-580]) .actions {
          justify-self: start;
        }
        /*endregion */

        /*region tiny (< 350)*/
        :host([w-lt-350]) .status,
        :host([w-lt-350]) cc-select {
          width: 100%;
        }
        
        :host([w-lt-350]) .actions {
          grid-template-columns: 1fr;
          justify-self: stretch;
        }

        :host([w-lt-350]) .status__role-mfa {
          grid-auto-flow: row;
          grid-template-columns: auto;
          width: 100%;
        }
        /*endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-card', CcOrgaMemberCard);
