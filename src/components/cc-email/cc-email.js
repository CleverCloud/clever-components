import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { validateEmailAddress } from '../../lib/email.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-error/cc-error.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';

const mailSvg = new URL('../../assets/mail-line.svg', import.meta.url).href;
const mailStarSvg = new URL('../../assets/mail-star-line.svg', import.meta.url).href;
const trashSvg = new URL('../../assets/trash-red.svg', import.meta.url).href;
const verifiedSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const unverifiedSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;
const blankSvg = new URL('../../assets/blank.svg', import.meta.url).href;

/** @type{PrimaryEmailAddressState} */
const SKELETON_PRIMARY_EMAIL = {
  state: 'idle',
  address: fakeString(35),
  verified: true,
};

/**
 * @typedef {import('./cc-email.types.js').EmailsState} EmailsState
 * @typedef {import('./cc-email.types.js').PrimaryEmailAddressState} PrimaryEmailAddressState
 * @typedef {import('./cc-email.types.js').SecondaryEmailAddressState} SecondaryEmailAddressState
 * @typedef {import('./cc-email.types.js').NewEmailFormState} NewEmailFormState
 */

/**
 * A component displaying the e-mail addresses associated with a user account.
 *
 * ## Details
 *
 * The component gives the ability to:
 *
 * * Resend the confirmation e-mail on the primary address (if it has not been verified yet)
 * * Add a secondary e-mail address
 * * Delete a secondary e-mail address
 * * Promote a secondary e-mail address to primary.
 *
 * ## secondary e-mail address input validation
 *
 * * The component is responsible for validating the secondary e-mail address entered by the user.
 * * This validation is triggered whenever the add button is clicked.
 * * If the validation doesn't succeed, an error message is displayed bellow the text input. Otherwise, the custom event `cc-email:add` is fired.
 * * The validation handles only two cases:
 *   - the input is empty
 *   - the input is not a valid e-mail address.
 * * For the other error cases, you'll need to use the `_addAddressInputError` property manually.
 *
 * ## Marking as primary
 *
 * * Unlike secondary email address deletion, marking as primary is exclusive: Only one email address can be marked as primary at a time.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-email:add - Fires whenever the add button is clicked. If the validation doesn't succeed, the event is not fired.
 * @event {CustomEvent} cc-email:send-confirmation-email - Fires whenever the send confirmation email link is clicked.
 * @event {CustomEvent} cc-email:delete - Fires whenever the delete button is clicked.
 * @event {CustomEvent} cc-email:mark-as-primary - Fires whenever the 'mark as primary' button is clicked.
 */
export class CcEmail extends LitElement {

  static get properties () {
    return {
      emails: { type: Object },
      newEmailForm: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {EmailsState}  */
    this.emails = { state: 'loading' };

    /** @type {NewEmailFormState} The form state. */
    this.newEmailForm = {
      state: 'idle',
      address: {
        value: '',
      },
    };

    this._inputRef = createRef();
  }

  _getVerifiedTagLabel (isVerififed) {
    return isVerififed
      ? i18n('cc-email.primary.email.verified')
      : i18n('cc-email.primary.email.unverified');
  }

  _getInputError (error) {
    if (error === 'empty') {
      return i18n(`cc-email.secondary.address-input.error.empty`);
    }
    if (error === 'used') {
      return i18n(`cc-email.secondary.address-input.error.used`);
    }
    if (error === 'invalid') {
      return i18n(`cc-email.secondary.address-input.error.invalid`);
    }
    if (error === 'already-defined') {
      return i18n(`cc-email.secondary.address-input.error.already-defined`);
    }
  }

  _onSendConfirmationEmail () {
    dispatchCustomEvent(this, 'send-confirmation-email', this.emails.primary.address);
  }

  _onMarkAsPrimary (address) {
    dispatchCustomEvent(this, 'mark-as-primary', address);
  }

  _onDelete (address) {
    dispatchCustomEvent(this, 'delete', address);
  }

  _onAddNewEmail () {

    const newEmailAddress = this._inputRef.value.value;
    const error = validateEmailAddress(newEmailAddress);

    this.newEmailForm = {
      state: 'idle',
      address: {
        value: newEmailAddress,
        error,
      },
    };

    if (error == null) {
      dispatchCustomEvent(this, 'add', newEmailAddress);
    }
  }

  render () {
    const state = this.emails.state;
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-email.title')}</div>

        ${state === 'loading' ? html`
          ${this._renderPrimarySection(state, SKELETON_PRIMARY_EMAIL)}
          ${this._renderSecondarySection([])}
        ` : ''}

        ${state === 'loaded' ? html`
          ${this._renderPrimarySection(state, this.emails.primary)}
          ${this._renderSecondarySection(this.emails.secondary)}
        ` : ''}

        ${state === 'error-loading' ? html`
          <cc-error>${i18n('cc-email.loading.error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  /**
   * @param {string} state
   * @param {PrimaryEmailAddressState} primaryEmail
   * @returns {TemplateResult<1>}
   */
  _renderPrimarySection (state, primaryEmail) {

    const skeleton = state === 'loading';
    const badgeIntent = primaryEmail.verified ? 'success' : 'danger';
    const badgeIcon = primaryEmail.verified ? verifiedSvg : unverifiedSvg;
    const shouldDisplayResendConfirmationEmail = state === 'loaded' && !primaryEmail.verified;

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.primary.title')}</div>
        <div slot="info">${i18n('cc-email.primary.description')}</div>

        <cc-flex-gap class="address-line primary">
          <div class="address">
            <div class="icon"><img src="${mailStarSvg}" alt=""/></div>
            <span class="${classMap({ skeleton })}">${primaryEmail.address}</span>
          </div>
          <cc-badge
            class="${classMap({ skeleton })}"
            intent="${badgeIntent}"
            weight="dimmed"
            icon-src="${badgeIcon}"
            icon-alt=""
          >${this._getVerifiedTagLabel(primaryEmail.verified)}
          </cc-badge>
        </cc-flex-gap>

        ${shouldDisplayResendConfirmationEmail ? html`
          <cc-button
            @cc-button:click=${this._onSendConfirmationEmail}
            ?waiting=${primaryEmail.state === 'sending-confirmation'}
            link
          >
            ${i18n('cc-email.primary.action.resend-confirmation-email')}
          </cc-button>
        ` : ''}

      </cc-block-section>
    `;
  }

  /**
   * @param {SecondaryEmailAddressState[]} emailList
   * @returns {TemplateResult<1>}
   */
  _renderSecondarySection (emailList) {

    const isMarkingAsPrimary = emailList.some((email) => email.state === 'marking-as-primary');

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.secondary.title')}</div>
        <div slot="info">${i18n('cc-email.secondary.description')}</div>

        ${emailList.map((email) => {

          const busy = email.state === 'marking-as-primary' || email.state === 'deleting';
          const primaryEmailUnverified = !this.emails.primary.verified;

          return html`
            <cc-flex-gap class="address-line secondary">
              <div class="address ${classMap({ loading: busy })}">
                <div class="icon"><img src="${mailSvg}" alt=""></div>
                <span>${email.address}</span>
              </div>
              <cc-flex-gap class="buttons">
                <cc-button
                  @cc-button:click=${() => this._onMarkAsPrimary(email.address)}
                  ?waiting="${email.state === 'marking-as-primary'}"
                  ?disabled=${busy || isMarkingAsPrimary || primaryEmailUnverified}
                >
                  ${i18n('cc-email.secondary.action.mark-as-primary')}
                </cc-button>
                <cc-button
                  danger
                  outlined
                  image=${trashSvg}
                  @cc-button:click=${() => this._onDelete(email.address)}
                  ?waiting="${email.state === 'deleting'}"
                  ?disabled=${busy}
                >
                  ${i18n('cc-email.secondary.action.delete')}
                </cc-button>
              </cc-flex-gap>
            </cc-flex-gap>
          `;
        })}

        <form>
          <cc-input-text
            ${ref(this._inputRef)}
            label="${i18n('cc-email.secondary.address-input.label')}"
            required
            value="${this.newEmailForm.address.value}"
            ?disabled=${this.newEmailForm.state === 'adding'}
            @cc-input-text:requestimplicitsubmit=${this._onAddNewEmail}
          >
            ${this.newEmailForm.address.error != null ? html`
              <p slot="error">
                ${this._getInputError(this.newEmailForm.address.error)}
              </p>
            ` : ''}
            <p slot="help">
              ${i18n('cc-email.secondary.address-input.format')}
            </p>
          </cc-input-text>
          <cc-button
            primary
            ?waiting=${this.newEmailForm.state === 'adding'}
            @cc-button:click=${this._onAddNewEmail}
          >
            ${i18n('cc-email.secondary.action.add')}
          </cc-button>
        </form>

      </cc-block-section>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-flex-gap {
          --cc-gap: 1em;
          --cc-align-items: center;
        }

        /*region ADDRESS*/

        .address-line .address.loading {
          opacity: 0.5;
        }

        .address-line .address .icon {
          display: flex;
        }

        .address-line .address span {
          min-width: 150px;
          word-break: break-all;
        }

        .address-line .address {
          align-items: center;
          display: flex;
          flex-wrap: nowrap;
          gap: 1em;
        }

        .address-line.secondary {
          margin-bottom: 0.8em;
        }

        .address-line.secondary .address {
          flex: 1 1 0;
        }

        /*endregion*/

        /*region FORM*/
        form {
          align-items: start;
          display: flex;
          gap: 1em;
        }

        form > cc-input-text {
          flex: 1 1 0;
        }

        form > cc-button {
          align-self: start;
          grid-area: button;
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        form > cc-error {
          align-self: stretch;
          grid-area: error;
        }

        /*endregion*/

        .skeleton {
          background-color: #bbb;
          color: transparent !important;
        }

        .skeleton > img {
          visibility: hidden;
        }
      `,
    ];
  }
}

window.customElements.define('cc-email', CcEmail);
