import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconCleverMailLine as iconMail,
  iconCleverMailStarLine as iconMailPrimary,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixDeleteBinFill as iconDelete,
  iconRemixSpam_2Fill as iconUnverified,
  iconRemixCheckboxCircleFill as iconVerified,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { fakeString } from '../../lib/fake-strings.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { sortBy } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import {
  CcEmailAddEvent,
  CcEmailDeleteEvent,
  CcEmailMarkAsPrimaryEvent,
  CcEmailSendConfirmationEvent,
} from './cc-email-list.events.js';

/** @type {PrimaryAddressState} */
const SKELETON_PRIMARY_EMAIL = {
  type: 'idle',
  address: fakeString(35),
  verified: false,
};

/** @type {SecondaryAddressState[]} */
const SKELETON_SECONDARY_EMAILS = [];

/**
 * @import { EmailListState, PrimaryAddressState, SecondaryAddressState, AddEmailFormState, AddEmailError } from './cc-email-list.types.js'
 * @import { CcInputText } from '../cc-input-text/cc-input-text.js'
 * @import { FormDataMap } from '../../lib/form/form.types.js'
 * @import { ErrorMessage } from '../../lib/form/validation.types.js'
 * @import { TemplateResult } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component displaying the email addresses associated with a user account.
 *
 * ## Details
 *
 * The component gives the ability to:
 *
 * * Resend the confirmation email to the primary address (if it has not been verified yet)
 * * Add a secondary email address
 * * Delete a secondary email address
 * * Promote a secondary email address to primary.
 *
 * ## secondary email address input validation
 *
 * * The component is responsible for validating the secondary email address entered by the user.
 * * This validation is triggered whenever the add button is clicked.
 * * If the validation doesn't succeed, an error message is displayed below the text input. Otherwise, the event `cc-email-add` is fired.
 * * The validation handles only two cases:
 *   - the input is empty
 *   - the input is not a valid email address.
 * * For the other error cases, you'll need to pass the right `addEmailForm` property manually.
 *
 * ## Marking as primary
 *
 * * Unlike secondary email address deletion, marking as primary is exclusive: Only one email address can be marked as primary at a time.
 *
 * @cssdisplay block
 */
export class CcEmailList extends LitElement {
  static get properties() {
    return {
      addEmailFormState: { type: Object, attribute: false },
      emailListState: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();

    /** @type {AddEmailFormState} */
    this.addEmailFormState = { type: 'idle' };

    /** @type {EmailListState} State of the component. */
    this.emailListState = { type: 'loading' };

    /** @type {Ref<CcInputText>} */
    this._addressInputRef = createRef();

    /** @type {Ref<HTMLFormElement>} */
    this._formRef = createRef();

    new LostFocusController(this, '.secondary', ({ suggestedElement }) => {
      focusBySelector(suggestedElement, '.delete-button', () => {
        this._addressInputRef.value.focus();
      });
    });

    new FormErrorFocusController(this, this._formRef, () => this.addEmailFormState.errors);
  }

  resetAddEmailForm() {
    this._formRef.value?.reset();
  }

  /**
   * @param {boolean} verified
   * @return {TemplateResult}
   */
  _getVerifiedTagLabel(verified) {
    const label = verified
      ? i18n('cc-email-list.primary.email.verified')
      : i18n('cc-email-list.primary.email.unverified');
    // Label wrapping into a <span> is because of a Safari Bug: https://github.com/CleverCloud/clever-components/pull/473#issuecomment-1323895088
    return html`<span>${label}</span>`;
  }

  _onSendConfirmationEmail() {
    if (this.emailListState.type === 'loaded') {
      this.dispatchEvent(new CcEmailSendConfirmationEvent(this.emailListState.emailList.primaryAddress.address));
    }
  }

  /**
   * @param {string} address
   */
  _onDelete(address) {
    this.dispatchEvent(new CcEmailDeleteEvent(address));
  }

  /**
   * @param {string} address
   */
  _onMarkAsPrimary(address) {
    this.dispatchEvent(new CcEmailMarkAsPrimaryEvent(address));
  }

  /**
   * @param {FormDataMap} formData
   */
  _onAddFormSubmit(formData) {
    this.addEmailFormState = { ...this.addEmailFormState, errors: null };
    const address = String(formData.address);
    this.dispatchEvent(new CcEmailAddEvent(address));
  }

  /**
   *
   * @param {AddEmailError} errorCode
   * @return {ErrorMessage}
   */
  _getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'invalid':
        return i18n('cc-input-text.error.bad-email');
      case 'already-defined':
        return i18n('cc-email-list.secondary.address-input.error.already-defined');
      case 'used':
        return i18n('cc-email-list.secondary.address-input.error.used');
    }
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-email-list.title')}</div>

        ${this.emailListState.type === 'loading'
          ? html`
              ${this._renderPrimarySection(SKELETON_PRIMARY_EMAIL, true)}
              ${this._renderSecondarySection(SKELETON_SECONDARY_EMAILS)}
            `
          : ''}
        ${this.emailListState.type === 'loaded'
          ? html`
              ${this._renderPrimarySection(this.emailListState.emailList.primaryAddress)}
              ${this._renderSecondarySection(this.emailListState.emailList.secondaryAddresses)}
            `
          : ''}
        ${this.emailListState.type === 'error'
          ? html`
              <cc-notice slot="content" intent="warning" message="${i18n('cc-email-list.loading.error')}"></cc-notice>
            `
          : ''}
      </cc-block>
    `;
  }

  /**
   * @param {PrimaryAddressState} primaryAddressState
   * @param {boolean} [skeleton]
   * @return {TemplateResult}
   */
  _renderPrimarySection(primaryAddressState, skeleton = false) {
    const address = primaryAddressState.address;
    const verified = primaryAddressState.verified;
    const shouldDisplayResendConfirmationEmail = !skeleton && !verified;

    const badgeIntent = verified ? 'success' : 'danger';
    const badgeIcon = verified ? iconVerified : iconUnverified;

    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-email-list.primary.title')}</div>
        <div slot="info">${i18n('cc-email-list.primary.description')}</div>

        <div class="address-line primary">
          <div class="address">
            <cc-icon class="icon--auto" .icon=${iconMailPrimary} size="lg"></cc-icon>
            <span class="${classMap({ skeleton })}">${address}</span>
          </div>
          <cc-badge intent="${badgeIntent}" weight="outlined" ?skeleton="${skeleton}" .icon="${badgeIcon}"
            >${this._getVerifiedTagLabel(primaryAddressState.verified)}
          </cc-badge>
        </div>
        ${shouldDisplayResendConfirmationEmail
          ? html`
              <cc-button
                @cc-click=${this._onSendConfirmationEmail}
                ?waiting=${primaryAddressState.type === 'sending-confirmation-email'}
                link
              >
                ${i18n('cc-email-list.primary.action.resend-confirmation-email')}
              </cc-button>
            `
          : ''}
      </cc-block-section>
    `;
  }

  /**
   * @param {Array<SecondaryAddressState>} secondaryAddressStates
   * @return {TemplateResult}
   */
  _renderSecondarySection(secondaryAddressStates) {
    const addresses = [...secondaryAddressStates].sort(sortBy('address'));
    const isOneRowMarkingPrimary = addresses.some((item) => item.type === 'marking-as-primary');

    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-email-list.secondary.title')}</div>
        <div slot="info">${i18n('cc-email-list.secondary.description')}</div>

        <ul class="secondary-addresses">
          ${addresses.map((secondaryAddress) => {
            const isBusy = secondaryAddress.type === 'marking-as-primary' || secondaryAddress.type === 'deleting';
            const isDisabled = (isOneRowMarkingPrimary || isBusy) && secondaryAddress.type !== 'marking-as-primary';

            return html`
              <li class="address-line secondary">
                <div class="address ${classMap({ loading: isBusy })}">
                  <cc-icon class="icon--auto" .icon=${iconMail} size="lg"></cc-icon>
                  <span>${secondaryAddress.address}</span>
                </div>
                <div class="buttons">
                  <cc-button
                    @cc-click=${() => this._onMarkAsPrimary(secondaryAddress.address)}
                    ?waiting="${secondaryAddress.type === 'marking-as-primary'}"
                    ?disabled="${isDisabled}"
                    a11y-name="${i18n('cc-email-list.secondary.action.mark-as-primary.accessible-name', {
                      address: secondaryAddress.address,
                    })}"
                  >
                    ${i18n('cc-email-list.secondary.action.mark-as-primary.name')}
                  </cc-button>
                  <cc-button
                    class="delete-button"
                    danger
                    outlined
                    .icon=${iconDelete}
                    @cc-click=${() => this._onDelete(secondaryAddress.address)}
                    ?waiting="${secondaryAddress.type === 'deleting'}"
                    ?disabled="${isBusy && secondaryAddress.type !== 'deleting'}"
                    a11y-name="${i18n('cc-email-list.secondary.action.delete.accessible-name', {
                      address: secondaryAddress.address,
                    })}"
                  >
                    ${i18n('cc-email-list.secondary.action.delete.name')}
                  </cc-button>
                </div>
              </li>
            `;
          })}
        </ul>

        ${this._renderAddEmailForm()}
      </cc-block-section>
    `;
  }

  _renderAddEmailForm() {
    const isAdding = this.addEmailFormState.type === 'adding';

    return html`
      <form ${ref(this._formRef)} ${formSubmit(this._onAddFormSubmit.bind(this))}>
        <cc-input-text
          label="${i18n('cc-email-list.secondary.address-input.label')}"
          name="address"
          type="email"
          required
          ?readonly=${isAdding}
          .errorMessage=${this._getErrorMessage(this.addEmailFormState.errors?.email)}
          ${ref(this._addressInputRef)}
        >
          <p slot="help">${i18n('cc-email-list.secondary.address-input.format')}</p>
        </cc-input-text>
        <cc-button primary ?waiting=${isAdding} type="submit">
          ${i18n('cc-email-list.secondary.action.add')}
        </cc-button>
      </form>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .secondary-addresses {
          margin: 0;
          padding: 0;
        }

        /* region address-line */

        .address-line {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .address-line.secondary {
          margin-bottom: 0.8em;
        }

        .address {
          align-items: center;
          display: flex;
          gap: 1em;
        }

        .address.loading {
          opacity: var(--cc-opacity-when-disabled);
        }

        .address-line.secondary .address {
          flex: 1 1 0;
        }

        .address span {
          word-break: break-all;
        }

        .address-line.secondary .address span {
          min-width: 15em;
        }

        /* endregion */

        .buttons {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        /* region FORM */

        form {
          align-items: start;
          display: flex;
          flex-wrap: wrap;
          gap: 0 1em;
          justify-content: flex-end;
        }

        form > cc-input-text {
          flex: 1 1 19em;
        }

        form > cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        /* endregion */

        .skeleton {
          background-color: #bbb;
          color: transparent !important;
        }

        .icon--auto {
          flex: auto 0 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-email-list', CcEmailList);
