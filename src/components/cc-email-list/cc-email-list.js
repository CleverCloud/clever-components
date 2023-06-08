import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { validateEmailAddress } from '../../lib/email.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { sortBy } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-button/cc-button.js';
import '../cc-error/cc-error.js';
import '../cc-input-text/cc-input-text.js';

const mailSvg = new URL('../../assets/mail-line.svg', import.meta.url).href;
const mailStarSvg = new URL('../../assets/mail-star-line.svg', import.meta.url).href;
const trashSvg = new URL('../../assets/trash-red.svg', import.meta.url).href;
const verifiedSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const unverifiedSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;

/** @type {PrimaryAddressState} */
const SKELETON_PRIMARY_EMAIL = {
  state: 'idle',
  address: fakeString(35),
  verified: false,
};

/** @type {SecondaryAddressState[]} */
const SKELETON_SECONDARY_EMAILS = [];

/**
 * @typedef {import('./cc-email-list.types.js').EmailListState} EmailListState
 * @typedef {import('./cc-email-list.types.js').AddEmailFormState} AddEmailFormState
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
 * * If the validation doesn't succeed, an error message is displayed below the text input. Otherwise, the custom event `cc-email-list:add` is fired.
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
 *
 * @event {CustomEvent<string>} cc-email-list:add - Fires whenever the add button is clicked. If the validation doesn't succeed, the event is not fired.
 * @event {CustomEvent<string>} cc-email-list:send-confirmation-email - Fires whenever the send confirmation email link is clicked.
 * @event {CustomEvent<string>} cc-email-list:delete - Fires whenever the delete button is clicked.
 * @event {CustomEvent<string>} cc-email-list:mark-as-primary - Fires whenever the 'mark as primary' button is clicked.
 */
export class CcEmailList extends LitElement {

  static get properties () {
    return {
      addEmailForm: { type: Object },
      emails: { type: Object },
    };
  }

  /**
   * @return {AddEmailFormState}
   * @static
   */
  static get ADD_FORM_INIT_STATE () {
    return {
      state: 'idle',
      address: {
        value: '',
      },
    };
  }

  constructor () {
    super();

    /** @type {AddEmailFormState} The form state. */
    this.addEmailForm = CcEmailList.ADD_FORM_INIT_STATE;

    /** @type {EmailListState} State of the component. */
    this.emails = { state: 'loading' };

    /** @type {Ref<CcInputText>} */
    this._addressInputRef = createRef();

    new LostFocusController(this, '.secondary', ({ suggestedElement }) => {
      if (suggestedElement != null) {
        suggestedElement.querySelector('.delete-button').focus();
      }
      else {
        this._focusAddressInput();
      }
    });
  }

  _getVerifiedTagLabel (verified) {
    const label = verified ? i18n('cc-email-list.primary.email.verified') : i18n('cc-email-list.primary.email.unverified');
    // Label wrapping into a <span> is because of a Safari Bug: https://github.com/CleverCloud/clever-components/pull/473#issuecomment-1323895088
    return html`<span>${label}</span>`;
  }

  _focusAddressInput () {
    this._addressInputRef.value.focus();
  }

  _onSendConfirmationEmail () {
    dispatchCustomEvent(this, 'send-confirmation-email', this.emails.value.primaryAddress.address);
  }

  _onDelete (address) {
    dispatchCustomEvent(this, 'delete', address);
  }

  _onMarkAsPrimary (address) {
    dispatchCustomEvent(this, 'mark-as-primary', address);
  }

  _onAddressInput ({ detail: value }) {
    this.addEmailForm = {
      state: 'idle',
      address: {
        value: value,
        error: this.addEmailForm.address.error,
      },
    };
  }

  _onAdd () {
    const address = this.addEmailForm.address.value.trim();

    this.addEmailForm = {
      state: 'idle',
      address: {
        value: address,
        error: validateEmailAddress(address),
      },
    };

    if (this.addEmailForm.address.error == null) {
      dispatchCustomEvent(this, 'add', address);
    }

    // If there's an error, a focus will be triggered on the input field through the updated callback
  }

  updated (changedProperties) {
    // Focus input when error is set (from local validation or remote validation)
    if (changedProperties.has('addEmailForm')) {
      if (this.addEmailForm?.address?.error != null) {
        // We need this for the story
        setTimeout(() => this._focusAddressInput(), 0);
      }
    }
  }

  render () {
    const state = this.emails.state;
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-email-list.title')}</div>

        ${state === 'loading' ? html`
          ${this._renderPrimarySection(SKELETON_PRIMARY_EMAIL, true)}
          ${this._renderSecondarySection(SKELETON_SECONDARY_EMAILS)}
        ` : ''}

        ${state === 'loaded' ? html`
          ${this._renderPrimarySection(this.emails.value.primaryAddress)}
          ${this._renderSecondarySection(this.emails.value.secondaryAddresses)}
        ` : ''}

        ${state === 'error' ? html`
          <cc-error>${i18n('cc-email-list.loading.error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  _renderPrimarySection (primaryAddress, skeleton = false) {
    const address = primaryAddress.address;
    const verified = primaryAddress.verified;
    const shouldDisplayResendConfirmationEmail = !skeleton && !verified;

    const badgeIntent = verified ? 'success' : 'danger';
    const badgeIcon = verified ? verifiedSvg : unverifiedSvg;

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email-list.primary.title')}</div>
        <div slot="info">${i18n('cc-email-list.primary.description')}</div>

        <div class="address-line primary">
          <div class="address">
            <img src="${mailStarSvg}" alt=""/>
            <span class="${classMap({ skeleton })}">${address}</span>
          </div>
          <cc-badge
              intent="${badgeIntent}"
              weight="outlined"
              ?skeleton="${skeleton}"
              icon-src="${badgeIcon}"
          >${this._getVerifiedTagLabel(primaryAddress.verified)}
          </cc-badge>
        </div>
        ${shouldDisplayResendConfirmationEmail ? html`
          <cc-button
            @cc-button:click=${this._onSendConfirmationEmail}
            ?waiting=${primaryAddress.state === 'sending-confirmation-email'}
            link
          >
            ${i18n('cc-email-list.primary.action.resend-confirmation-email')}
          </cc-button>
        ` : ''}
      </cc-block-section>
    `;
  }

  _renderSecondarySection (rawAddresses) {

    const addresses = [...rawAddresses].sort(sortBy('address'));
    const markingAsPrimary = addresses.some((item) => item.state === 'marking-as-primary');

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email-list.secondary.title')}</div>
        <div slot="info">${i18n('cc-email-list.secondary.description')}</div>

        <ul class="secondary-addresses">
          ${addresses.map((secondaryAddress) => {
            const isBusy = secondaryAddress.state === 'marking-as-primary' || secondaryAddress.state === 'deleting';

            return html`
              <li class="address-line secondary">
                <div class="address ${classMap({ loading: isBusy })}">
                  <img src="${mailSvg}" alt=""/>
                  <span>${secondaryAddress.address}</span>
                </div>
                <div class="buttons">
                  <cc-button
                      @cc-button:click=${() => this._onMarkAsPrimary(secondaryAddress.address)}
                      ?waiting="${secondaryAddress.state === 'marking-as-primary'}"
                      ?disabled="${markingAsPrimary || isBusy}"
                      accessible-name="${i18n('cc-email-list.secondary.action.mark-as-primary.accessible-name', { address: secondaryAddress.address })}"
                  >
                    ${i18n('cc-email-list.secondary.action.mark-as-primary.name')}
                  </cc-button>
                  <cc-button
                      class="delete-button"
                      danger
                      outlined
                      image=${trashSvg}
                      @cc-button:click=${() => this._onDelete(secondaryAddress.address)}
                      ?waiting="${secondaryAddress.state === 'deleting'}"
                      ?disabled="${isBusy}"
                      accessible-name="${i18n('cc-email-list.secondary.action.delete.accessible-name', { address: secondaryAddress.address })}"
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

  _renderAddEmailForm () {
    const isAdding = this.addEmailForm.state === 'adding';

    return html`
      <form>
        <cc-input-text
            label="${i18n('cc-email-list.secondary.address-input.label')}"
            required
            .value=${this.addEmailForm.address.value}
            ?disabled=${isAdding}
            @cc-input-text:requestimplicitsubmit=${this._onAdd}
            @cc-input-text:input=${this._onAddressInput}
            ${ref(this._addressInputRef)}
        >
          ${this._renderAddressError()}
          <p slot="help">
            ${i18n('cc-email-list.secondary.address-input.format')}
          </p>
        </cc-input-text>
        <cc-button
            primary
            ?waiting=${isAdding}
            @cc-button:click=${this._onAdd}
        >
          ${i18n('cc-email-list.secondary.action.add')}
        </cc-button>
      </form>
    `;
  }

  _renderAddressError () {
    if (this.addEmailForm.address.error === 'empty') {
      return html`<p slot="error">${i18n('cc-email-list.secondary.address-input.error.empty')}</p>`;
    }
    if (this.addEmailForm.address.error === 'used') {
      return html`<p slot="error">${i18n('cc-email-list.secondary.address-input.error.used')}</p>`;
    }
    if (this.addEmailForm.address.error === 'invalid') {
      return html`<p slot="error">${i18n('cc-email-list.secondary.address-input.error.invalid')}</p>`;
    }
    if (this.addEmailForm.address.error === 'already-defined') {
      return html`<p slot="error">${i18n('cc-email-list.secondary.address-input.error.already-defined')}</p>`;
    }

    return html``;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .secondary-addresses {
          padding: 0;
          margin: 0;
        }

        /* region address-line */

        .address-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        .address-line.secondary {
          margin-bottom: 0.8em;
        }

        .address {
          display: flex;
          align-items: center;
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
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        /* region FORM */

        form {
          display: flex;
          flex-wrap: wrap;
          align-items: start;
          justify-content: flex-end;
          gap: 0 1em;
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
      `,
    ];
  }
}

window.customElements.define('cc-email-list', CcEmailList);
