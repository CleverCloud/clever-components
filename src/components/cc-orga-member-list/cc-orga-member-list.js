import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcOrgaMemberLeaveEvent } from '../cc-orga-member-card/cc-orga-member-card.events.js';
import { CcOrgaMemberCard } from '../cc-orga-member-card/cc-orga-member-card.js';
import '../cc-select/cc-select.js';
import { CcOrgaMemberInviteEvent } from './cc-orga-member-list.events.js';

const ORGA_MEMBER_DOCUMENTATION = generateDocsHref('/account/administrate-organization/');

/**
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberListState} OrgaMemberListState
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberListStateLoaded} OrgaMemberListStateLoaded
 * @typedef {import('./cc-orga-member-list.types.js').ListAuthorisations} ListAuthorisations
 * @typedef {import('./cc-orga-member-list.types.js').InviteMemberFormState} InviteMemberFormState
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.events.js').CcOrgaMemberUpdateEvent} CcOrgaMemberUpdateEvent
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.events.js').CcOrgaMemberEditToggleEvent} CcOrgaMemberEditToggleEvent
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.types.js').OrgaMemberCardState} OrgaMemberCardState
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.types.js').OrgaMember} OrgaMember
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.types.js').OrgaMemberRole} OrgaMemberRole
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../lib/form/validation.types.js').Validity} Validity
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcOrgaMemberList>} CcOrgaMemberListPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 */

/**
 * A component showing the list of members belonging to a given organisation.
 *
 * The list can be filtered by name or email.
 * One can also choose to only show users with Two-Factor Auth (2FA) disabled.
 *
 * Depending on the current user authorisations:
 *
 *  - The current user may remove members,
 *  - The current user may edit the role of members.
 *
 * @cssdisplay block
 */
export class CcOrgaMemberList extends LitElement {
  static get properties() {
    return {
      authorisations: { type: Object },
      inviteMemberFormState: { type: Object, attribute: false },
      memberListState: { type: Object, attribute: false },
    };
  }

  /** @returns {ListAuthorisations} */
  static get INIT_AUTHORISATIONS() {
    return {
      invite: false,
      edit: false,
      delete: false,
    };
  }

  constructor() {
    super();

    /** @type {ListAuthorisations} Sets the authorisations that control the display of the invite form and the edit / delete buttons. */
    this.authorisations = CcOrgaMemberList.INIT_AUTHORISATIONS;

    /** @type {InviteMemberFormState} Invite member form state. */
    this.inviteMemberFormState = { type: 'idle' };

    /** @type {OrgaMemberListState} Sets the state of the member list. */
    this.memberListState = { type: 'loading' };

    /** @type {HTMLFormElementRef} */
    this._inviteMemberFormRef = createRef();
    /** @type {HTMLElementRef} */
    this._memberListHeadingRef = createRef();
    /** @type {HTMLElementRef} */
    this._noResultMessageRef = createRef();

    new LostFocusController(this, 'cc-orga-member-card', ({ suggestedElement }) => {
      if (suggestedElement == null && this._noResultMessageRef.value != null) {
        this._noResultMessageRef.value.focus();
      } else if (suggestedElement == null) {
        this._memberListHeadingRef.value.focus();
      } else if (suggestedElement instanceof CcOrgaMemberCard) {
        suggestedElement.focusDeleteBtn();
      }
    });

    /** @type {Validator} */
    this._memberEmailValidator = {
      /**
       * @param {string} value
       * @param {Object} _formData
       * @return {Validity}
       */
      validate: (value, _formData) => {
        const existingEmails =
          this.memberListState.type === 'loaded' ? this.memberListState.memberList.map((member) => member.email) : [];

        return existingEmails.includes(value) ? Validation.invalid('duplicate') : Validation.VALID;
      },
    };
    this._memberEmailErrorMessages = {
      duplicate: i18n('cc-orga-member-list.invite.email.error-duplicate'),
    };
  }

  resetInviteMemberForm() {
    this._inviteMemberFormRef.value?.reset();
  }

  /**
   * Check if the given member is the last admin of the organisation.
   *
   * @param {OrgaMember} member - the member to check
   * @return {boolean} - true if the given member is an admin and there is only one admin left in the organisation
   */
  isLastAdmin(member) {
    const isMemberAdmin = member.role === 'ADMIN';
    const adminList = this._getAdminList();
    const orgContainsOnlyOneAdmin = adminList.length === 1;

    return orgContainsOnlyOneAdmin && isMemberAdmin;
  }

  /**
   * @return {OrgaMemberCardState[]} - The list of admins in the organisation. Used to ensure we don't allow deletion of the last admin.
   */
  _getAdminList() {
    if (this.memberListState.type === 'loaded') {
      return this.memberListState.memberList.filter((member) => member.role === 'ADMIN');
    }
    return [];
  }

  _getRoleOptions() {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-list.invite.role.admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-list.invite.role.developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-list.invite.role.accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-list.invite.role.manager') },
    ];
  }

  /**
   * Everytime a new list is rendered, this method is called to:
   * - sort the list (current user first, then by member email in alphabetical order),
   * - filter the list based on what the user has entered inside the identity and mfa filters.
   *
   * @param {OrgaMemberCardState[]} members
   * @param {string} identityFilter
   * @param {boolean} mfaDisabledOnlyFilter
   * @return {OrgaMemberCardState[]}
   * @private
   */
  _getSortedFilteredMemberList(members, identityFilter, mfaDisabledOnlyFilter) {
    const cleanedIdentityFilter = identityFilter?.trim().toLowerCase();

    const filteredMemberList = members.filter((member) => {
      const matchIdentity =
        cleanedIdentityFilter === '' ||
        member.name?.toLowerCase().includes(cleanedIdentityFilter) ||
        member.email.toLowerCase().includes(cleanedIdentityFilter);

      const matchMfaDisabled = !mfaDisabledOnlyFilter || !member.isMfaEnabled;

      return matchIdentity && matchMfaDisabled;
    });

    return filteredMemberList.sort((a, b) => {
      // currentUser first, then alphabetical order - case-insensitive
      if (a.isCurrentUser) {
        return -1;
      }
      if (b.isCurrentUser) {
        return 1;
      }
      return a.email.localeCompare(b.email, [], { sensitivity: 'base' });
    });
  }

  /**
   * This modifies the `members` prop, triggering a new render.
   * Everytime there is a new render, the list is filtered based on the filter values from the `member` prop.
   *
   * @param {CcInputEvent} e
   */
  _onFilterIdentity({ detail: value }) {
    if (this.memberListState.type === 'loaded') {
      this.memberListState = {
        ...this.memberListState,
        identityFilter: value,
      };
    }
  }

  /**
   * This modifies the `members` prop, triggering a new render.
   * Everytime there is a new render, the list is filtered based on the filter values from the `member` prop.
   *
   * @private
   */
  _onFilterMfaDisabledOnly() {
    if (this.memberListState.type === 'loaded') {
      this.memberListState = {
        ...this.memberListState,
        mfaDisabledOnlyFilter: !this.memberListState.mfaDisabledOnlyFilter,
      };
    }
  }

  /**
   * @param {{email: string, role: OrgaMemberRole}} formData
   */
  _onInviteMember(formData) {
    this.dispatchEvent(
      new CcOrgaMemberInviteEvent({
        email: formData.email,
        role: formData.role,
      }),
    );
  }

  /**
   * @param {CcOrgaMemberLeaveEvent} e
   */
  _onLeaveFromCard(e) {
    const { detail: currentUser } = e;
    if (this.memberListState.type === 'loaded' && this.isLastAdmin(currentUser)) {
      this.memberListState = {
        ...this.memberListState,
        memberList: this.memberListState.memberList.map((member) => {
          return member.id === currentUser.id ? { ...member, error: true } : { ...member };
        }),
      };
      e.stopPropagation();
    }
  }

  _onLeaveFromDangerZone() {
    if (this.memberListState.type === 'loaded') {
      const currentUser = this.memberListState.memberList.find((member) => member.isCurrentUser);
      const isLastAdminLeaving = this.isLastAdmin(currentUser);

      if (isLastAdminLeaving) {
        this.memberListState = {
          ...this.memberListState,
          dangerZoneState: 'error',
        };
      } else {
        this.dispatchEvent(
          new CcOrgaMemberLeaveEvent({
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            name: currentUser.name,
            avatar: currentUser.avatar,
            jobTitle: currentUser.jobTitle,
            isMfaEnabled: currentUser.isMfaEnabled,
            isCurrentUser: currentUser.isCurrentUser,
          }),
        );
      }
    }
  }

  /**
   * @param {CcOrgaMemberUpdateEvent} e
   */
  _onUpdateFromCard(e) {
    const { detail: memberToUpdate } = e;
    const isLastAdmin = memberToUpdate.isCurrentUser && this.isLastAdmin(memberToUpdate);

    if (this.memberListState.type === 'loaded' && isLastAdmin) {
      this.memberListState = {
        ...this.memberListState,
        memberList: this.memberListState.memberList.map((member) => {
          return member.id === memberToUpdate.id ? { ...member, error: true } : { ...member };
        }),
      };
      e.stopPropagation();
    }
  }

  /**
   * Close all cards and leave the one that fired the event
   *
   * @param {CcOrgaMemberEditToggleEvent} e
   */
  _onToggleCardEditing({ detail: { memberId, newState } }) {
    if (this.memberListState.type === 'loaded') {
      this.memberListState = {
        ...this.memberListState,
        memberList: this.memberListState.memberList.map((member) => {
          return member.id === memberId ? { ...member, type: newState } : { ...member, type: 'loaded' };
        }),
      };
    }
  }

  /**
   * Everytime we render a new list, remove the "last-admin" error if the list contains more than 1 admin.
   *
   * @param {CcOrgaMemberListPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    const updateNotRelatedToMembers = !changedProperties.has('memberListState');

    if (updateNotRelatedToMembers || this.memberListState.type !== 'loaded') {
      return;
    }

    const adminList = this._getAdminList();
    const dangerZoneHasError = this.memberListState.dangerZoneState === 'error';

    if (adminList.length > 1) {
      this.memberListState = {
        ...this.memberListState,
        memberList: this.memberListState.memberList.map((member) => ({
          ...member,
          error: false,
        })),
      };
    }

    if (adminList.length > 1 && dangerZoneHasError) {
      this.memberListState = {
        ...this.memberListState,
        dangerZoneState: 'idle',
      };
    }
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-orga-member-list.main-heading')}</div>

        ${this.authorisations.invite ? this._renderInviteForm() : ''}

        <cc-block-section slot="content-body">
          <div slot="title" ${ref(this._memberListHeadingRef)} tabindex="-1">
            ${i18n('cc-orga-member-list.list.heading')}
            ${this.memberListState.type === 'loaded'
              ? html`
                  <cc-badge class="member-count" weight="dimmed" intent="neutral" circle
                    >${this.memberListState.memberList.length}</cc-badge
                  >
                `
              : ''}
          </div>

          ${this.memberListState.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
          ${this.memberListState.type === 'loaded'
            ? this._renderMemberList(
                this.memberListState.memberList,
                this.memberListState.identityFilter,
                this.memberListState.mfaDisabledOnlyFilter,
              )
            : ''}
          ${this.memberListState.type === 'error'
            ? html` <cc-notice intent="warning" message="${i18n('cc-orga-member-list.error')}"></cc-notice> `
            : ''}
        </cc-block-section>

        ${this.memberListState.type === 'loaded' ? this._renderDangerZone(this.memberListState) : ''}

        <div slot="footer-right">
          <cc-link href="${ORGA_MEMBER_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-orga-member-list.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  _renderInviteForm() {
    const isInviting = this.inviteMemberFormState.type === 'inviting';

    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-orga-member-list.invite.heading')}</div>
        <p class="info">${i18n('cc-orga-member-list.invite.info')}</p>

        <form class="invite-form" ${ref(this._inviteMemberFormRef)} ${formSubmit(this._onInviteMember.bind(this))}>
          <cc-input-text
            name="email"
            label=${i18n('cc-orga-member-list.invite.email.label')}
            required
            type="email"
            .customValidator=${this._memberEmailValidator}
            .customErrorMessages=${this._memberEmailErrorMessages}
            ?readonly=${isInviting}
          >
            <p slot="help">${i18n('cc-orga-member-list.invite.email.format')}</p>
          </cc-input-text>

          <cc-select
            name="role"
            label=${i18n('cc-orga-member-list.invite.role.label')}
            .options=${this._getRoleOptions()}
            reset-value="DEVELOPER"
            value="DEVELOPER"
            required
            ?disabled=${isInviting}
          >
          </cc-select>

          <div class="submit">
            <cc-button primary ?waiting=${isInviting} type="submit">
              ${i18n('cc-orga-member-list.invite.submit')}
            </cc-button>
          </div>
        </form>
      </cc-block-section>
    `;
  }

  /**
   * @param {OrgaMemberCardState[]} memberList
   * @param {string} identityFilter
   * @param {boolean} mfaDisabledOnlyFilter
   * @return {TemplateResult}
   */
  _renderMemberList(memberList, identityFilter, mfaDisabledOnlyFilter) {
    const filteredMemberList = this._getSortedFilteredMemberList(memberList, identityFilter, mfaDisabledOnlyFilter);
    const isFilteredMemberListEmpty = filteredMemberList.length === 0;

    return html`
      <div class="filters">
        <cc-input-text
          label=${i18n('cc-orga-member-list.filter.name')}
          .value=${identityFilter}
          @cc-input=${this._onFilterIdentity}
        ></cc-input-text>
        <label class="filters__mfa" for="filter-mfa">
          <input
            id="filter-mfa"
            type="checkbox"
            @change=${this._onFilterMfaDisabledOnly}
            .checked=${mfaDisabledOnlyFilter}
          />
          ${i18n('cc-orga-member-list.filter.mfa')}
        </label>
      </div>

      <div class="member-list">
        ${repeat(
          filteredMemberList,
          (memberState) => memberState.id,
          (memberState) => html`
            <cc-orga-member-card
              class=${classMap({ editing: memberState.type === 'editing' })}
              .authorisations=${{
                edit: this.authorisations.edit,
                delete: this.authorisations.delete,
              }}
              .state=${memberState}
              @cc-orga-member-leave=${this._onLeaveFromCard}
              @cc-orga-member-edit-toggle=${this._onToggleCardEditing}
              @cc-orga-member-update=${this._onUpdateFromCard}
            ></cc-orga-member-card>
          `,
        )}
        ${isFilteredMemberListEmpty
          ? html`
              <p class="no-result-error" ${ref(this._noResultMessageRef)} tabindex="-1">
                ${i18n('cc-orga-member-list.no-result')}
              </p>
            `
          : ''}
      </div>
    `;
  }

  /**
   *  @param {OrgaMemberListStateLoaded} members
   */
  _renderDangerZone(members) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title" class="danger">${i18n('cc-orga-member-list.leave.heading')}</div>
        <div class="leave">
          <p class="leave__text">${i18n('cc-orga-member-list.leave.text')}</p>
          <cc-button
            danger
            outlined
            @cc-click=${this._onLeaveFromDangerZone}
            ?disabled="${members.dangerZoneState === 'error'}"
            ?waiting="${members.dangerZoneState === 'leaving'}"
            >${i18n('cc-orga-member-list.leave.btn')}</cc-button
          >
        </div>
        <!-- a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it. -->
        <div class="wrapper-leave-error" aria-live="polite" aria-atomic="true">
          ${members.dangerZoneState === 'error'
            ? html`
                <div>
                  <cc-notice
                    intent="danger"
                    heading="${i18n('cc-orga-member-list.leave.error-last-admin.heading')}"
                    message="${i18n('cc-orga-member-list.leave.error-last-admin.text')}"
                    no-icon
                  ></cc-notice>
                </div>
              `
            : ''}
        </div>
      </cc-block-section>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region invite form */

        .invite-form {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
          gap: 1em 1.5em;
        }

        .info {
          font-style: italic;
          margin: 0.5em 0;
        }

        /* 100 is a weird value but this makes the input grow as much as possible
  without pushing the select to a new line until the input width reaches 18em */

        .invite-form cc-input-text {
          flex: 100 1 18em;
        }

        .invite-form cc-select {
          flex: 1 1 max-content;
        }

        .submit {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        /* endregion */

        /* region member list  */

        .member-count {
          font-size: 0.9em;
          margin-left: 0.2em;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .filters {
          align-items: flex-end;
          display: flex;
          flex-wrap: wrap;
          gap: 1em 2.5em;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .filters cc-input-text {
          flex: 0 1 25em;
        }

        .filters__mfa {
          align-items: center;
          display: flex;
          gap: 0.35em;
        }

        .filters__mfa input {
          height: 1.1em;
          margin: 0;
          width: 1.1em;
        }

        .no-result-error {
          font-style: italic;
        }

        cc-orga-member-card.editing {
          background-color: var(--cc-color-bg-neutral);
          /* box-shadow is used to make the background spread full width (cancel the parent padding) */
          box-shadow: 0 0 0 1em var(--cc-color-bg-neutral);
        }
        /* endregion */

        /* region leave section */

        .leave {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5em;
          justify-content: space-between;
        }

        .leave p {
          margin: 0;
        }

        .leave__text {
          display: flex;
          flex: 1 1 21em;
          flex-direction: column;
          gap: 0.5em;
        }

        .leave cc-button {
          margin-left: auto;
        }

        .wrapper-leave-error {
          display: flex;
          justify-content: end;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-list', CcOrgaMemberList);
