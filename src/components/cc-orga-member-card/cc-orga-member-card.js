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
import '../cc-stretch/cc-stretch.js';

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
 * @typedef {import('./cc-orga-member-card.types.js').DeleteMember} DeleteMember
 * @typedef {import('./cc-orga-member-card.types.js').UpdateMember} UpdateMember
 * @typedef {import('./cc-orga-member-card.types.js').Authorisations} Authorisations
 */

/**
 * A component showing information about a member from a given organisation.
 *
 * ## Details
 *
 * - This component provides a way to delete the member from the organisation.
 * - This component provides a way to edit the role of the member within a given organisation.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-orga-member-card:toggle-editing - Fires the `id` of the member related to the card and `isEditing` boolean to specify when card is in edit mode or not. This allows the list component to close all other cards in edit mode to leave only one in edit mode at once.
 * @event {CustomEvent<DeleteMember>} cc-orga-member-card:delete - Fires the `id` of the member to be removed from the org with their name or email.
 * @event {CustomEvent<UpdateMember>} cc-orga-member-card:update - Fires the `id` of the member, their new `role` and their name or email.
 */
export class CcOrgaMemberCard extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      authorisations: { type: Object },
      member: { type: Object },
      _size: { type: String, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Authorisations} Sets the authorisations that control the display of the edit / remove buttons. */
    this.authorisations = {
      edit: false,
      delete: false,
    };

    /** @type {OrgaMemberCardState} Sets the state and data of the member. */
    this.member = { state: 'loading' };

    /** @protected */
    this.breakpoints = {
      // used to switch to buttons wrapping below when component width < 740 and vertical card layout when < 580, buttons and badges below each other when < 350.
      width: [BREAKPOINT_TINY, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM],
    };

    /** @type {Ref<CcInputText>} */
    this._removeButtonRef = createRef();

    /** @type {Ref<CcSelect>} */
    this._roleRef = createRef();

    /** @type {string} Set by `withResizeObserver` mixin. See the `onResize` method for more info. */
    this._size = '';
  }

  _getRoleOptions () {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-card.role-admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-card.role-developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-card.role-accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-card.role-manager') },
    ];
  }

  /* The accessible name provides more info than the visible text. It mentions the member being edited / to be edited. */
  _getFirstBtnAccessibleName () {
    const memberIdentity = this.member.name ?? this.member.email;
    if (this.member.state === 'editing' || this.member.state === 'updating') {
      return i18n('cc-orga-member-card.btn.cancel.accessible-name', { memberIdentity });
    }
    else {
      return i18n('cc-orga-member-card.btn.edit.accessible-name', { memberIdentity });
    }
  }

  /* The accessible name provides more info than the visible text. It mentions the member to remove if relevant (no need to specify it for the "leave" button). */
  _getSecondBtnAccessibleName () {
    const memberIdentity = this.member.name ?? this.member.email;
    if (this.member.state === 'editing' || this.member.state === 'updating') {
      return i18n('cc-orga-member-card.btn.validate.accessible-name', { memberIdentity });
    }

    if (this.member.isCurrentUser) {
      return i18n('cc-orga-member-card.btn.leave.accessible-name');
    }

    return i18n('cc-orga-member-card.btn.delete.accessible-name', { memberIdentity });
  }

  /*
  * Switch the state between `loaded` and `editing`.
  * Dispatch a `toggle-editing` event so that `cc-orga-member-list` may close all other cards in edit mode.
  * Focus the role `select` element after entering edit mode.
  */
  async _onToggleEdit () {
    const newState = this.member.state === 'loaded' ? 'editing' : 'loaded';

    this.member = {
      ...this.member,
      state: newState,
    };

    // warn the `cc-orga-member-list` component so that it closes all other cards.
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

  _onDeleteMember () {
    // since not every member has set a name, we send either the name or the email to provide context in the toast message
    dispatchCustomEvent(this, 'delete', {
      memberId: this.member.id,
      memberIdentity: this.member.name ?? this.member.email,
    });
  }

  _onUpdateMember () {
    // since not every member has set a name, we send either the name or the email to provide context in the toast message
    dispatchCustomEvent(this, 'update', {
      memberId: this.member.id,
      role: this._roleRef.value.value,
      memberIdentity: this.member.name ?? this.member.email,
    });
  }

  /*
  * Focus the delete button within the card.
  * To be used when a card is removed, and you want to focus another card (LostFocusController).
  */
  focusDeleteBtn () {
    this._removeButtonRef.value.focus();
  }

  /* Used by the `withResizeObserver` mixin. */
  onResize ({ width }) {
    this._size = width;
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

  /*
  * This sub render heavily relies on `cc-stretch`:
  *
  *  - to make sure all badges are centered in desktop within a column which size is based on the longest text present inside.
  *  - to make sure there is no layout shifts when switching between edit and readonly modes.
  */
  _renderStatusArea () {

    const isEditing = this.member.state === 'editing' || this.member.state === 'updating';
    const waiting = this.member.state === 'updating' || this.member.state === 'deleting';
    const hasError = this.member.error === 'last-admin';

    return html`
      <cc-stretch
        class="status ${classMap({ waiting })}"
        visible-element-id=${isEditing ? 'status-editing' : 'status-readonly'}
      >
        <div id="status-readonly" class="status__role-mfa">
          <cc-stretch
            ?disable-stretching=${this._size < BREAKPOINT_MEDIUM}
            visible-element-id=${this.member.role}
          >
            ${this._getRoleOptions().map((role) => html`
              <cc-badge id="${role.value}" intent="info" weight="dimmed">${role.label}</cc-badge>
            `)}
          </cc-stretch>

          <cc-stretch
            ?disable-stretching=${this._size < BREAKPOINT_MEDIUM}
            visible-element-id=${this.member.isMfaEnabled ? 'badge-mfa-enabled' : 'badge-mfa-disabled'}
          >
            <cc-badge id="badge-mfa-enabled" intent="success" weight="outlined" icon-src="${tickSvg}">
              ${i18n('cc-orga-member-card.mfa-enabled')}
            </cc-badge>
            <cc-badge id="badge-mfa-disabled" intent="danger" weight="outlined" icon-src="${errorSvg}">
              ${i18n('cc-orga-member-card.mfa-disabled')}
            </cc-badge>
          </cc-stretch>
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
      </cc-stretch>
      <!-- 
        a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it.
        We have to add a conditional class to the wrapper when it does not contain any message to cancel the gap applied automatically within the grid. 
       -->
      <div class="error-wrapper ${classMap({ 'out-of-flow': !hasError })}" aria-live="polite" aria-atomic="true">
        <!-- TODO replace the <p> with a <cc-notice> when it's ready -->
        ${hasError ? html`<p>${i18n('cc-orga-member-card.error-last-admin')}</p>` : ''}
      </div>
    `;
  }

  /*
  * This sub render also relies on `cc-stretch` to make sure buttons have the same size whatever their visible text may be (edit vs readonly mode).
  * We rely on the `accessible-name` prop on `cc-button` to make sure assistive get the relevant text with some context in addition.
  */
  _renderActionBtns () {

    const isBtnImgOnly = (this._size > BREAKPOINT_MEDIUM);
    const waiting = this.member.state === 'updating' || this.member.state === 'deleting';
    const isEditing = this.member.state === 'editing' || this.member.state === 'updating';
    const hasError = this.member.error === 'last-admin';
    const firstBtnIcon = isEditing ? closeSvg : penSvg;
    const secondBtnIcon = isEditing ? tickBlueSvg : trashSvg;
    const removeOrLeaveSpanId = this.member.isCurrentUser ? 'btn-content-leave' : 'btn-content-remove';

    return html`
      
      <div class="actions">
        ${this.authorisations.edit ? html`
            <cc-button
              class="actions__first"
              ?primary=${!isEditing}
              outlined
              image=${firstBtnIcon}
              ?circle=${isBtnImgOnly}
              ?disabled=${waiting}
              ?hide-text=${isBtnImgOnly}
              accessible-name=${this._getFirstBtnAccessibleName()}
              @cc-button:click=${this._onToggleEdit}
            >
              <cc-stretch visible-element-id=${isEditing ? 'btn-content-cancel' : 'btn-content-edit'}>
                <span id="btn-content-edit">${i18n('cc-orga-member-card.btn.edit.visible-text')}</span>
                <span id="btn-content-cancel">${i18n('cc-orga-member-card.btn.cancel.visible-text')}</span>
              </cc-stretch>
            </cc-button>
        ` : ''}
  
        ${(this.authorisations.delete || this.member.isCurrentUser) ? html`
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
              accessible-name=${this._getSecondBtnAccessibleName()}
              @cc-button:click=${isEditing ? this._onUpdateMember : this._onDeleteMember}
              ${ref(this._removeButtonRef)}
            >
              <cc-stretch visible-element-id=${isEditing ? 'btn-content-validate' : removeOrLeaveSpanId}>
                <span id="btn-content-leave">${i18n('cc-orga-member-card.btn.leave.visible-text')}</span>
                <span id="btn-content-remove">${i18n('cc-orga-member-card.btn.delete.visible-text')}</span>
                <span id="btn-content-validate">${i18n('cc-orga-member-card.btn.validate.visible-text')}</span>
              </cc-stretch>
            </cc-button>
        ` : ''}
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
          gap: 0.5em 1em;
          grid-template-areas: "avatar identity status actions";
          grid-template-columns: max-content 1fr max-content max-content;
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
          /* makes the email address wrap if needed */
          word-break: break-all;
        }
        
        .status {
          grid-area: status;
        }

        .actions {
          display: flex;
          gap: 0.5em;
          grid-area: actions;
          justify-content: space-evenly;
          min-width: 4em;
        }
        
        .status__role-mfa {
          align-items: center;
          display: flex;
          gap: 0.5em 1em;
        }
        
        .error-wrapper {
          display: flex;
          grid-area: unset;
          /* always leave the first column containing only the avatar. */
          grid-column: 2 / -1;
          justify-content: end;
        }

        /* 
        * This is to avoid rendering a gap when there is no error message.
        */
        .error-wrapper.out-of-flow {
          grid-area: avatar / actions;
        }

        /* TODO remove this when we implement cc-notice */
        .error-wrapper p {
          background-color: var(--cc-color-bg-danger-weaker);
          border: 1px solid var(--cc-color-border-danger-weak);
          border-radius: 0.4em;
          padding: 0.5em 1em;
        }
        
        .waiting {
          opacity: 0.6;
        }

        p {
          margin: 0;
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
          flex-direction: column;
          justify-self: stretch;
        }

        :host([w-lt-350]) .status__role-mfa {
          align-items: start;
          flex-direction: column;
          width: 100%;
        }
        /*endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-card', CcOrgaMemberCard);
