import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { validateEmailAddress } from '../lib/email.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';
import '../atoms/cc-loader.js';
import '../atoms/cc-flex-gap.js';
import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-error.js';
import '../molecules/cc-block.js';
import '../molecules/cc-block-section.js';

const mailSvg = new URL('../assets/mail.svg', import.meta.url).href;
const trashSvg = new URL('../assets/trash-red.svg', import.meta.url).href;
const tickSvg = new URL('../assets/tick.svg', import.meta.url).href;
const warningSvg = new URL('../assets/warning.svg', import.meta.url).href;

/**
 * @typedef {import('./types.js').EmailModel} EmailModel
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
 * The component is in skeleton mode if one of the given primary or secondary model is nullish.
 *
 * ## secondary e-mail address input validation
 *
 * * The component is responsible for validating the secondary e-mail address entered by the user.
 * * This validation is triggered whenever the add button is clicked.
 * * The validation is minimalist: it verifies if the input text is not empty and contains a `@` character.
 * * If the validation doesn't succeed, an error message is displayed bellow the text input. Otherwise, the custom event `cc-email:add` is fired.
 * * The validation handles only two cases:
 *   - the input is empty
 *   - the input is not an e-mail address valid.
 * * For the other error cases, you'll need to use the `_addAddressInputError` property manually.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-email:add - Fires whenever the add button is clicked. If the validation doesn't succeed, the event is not fired.
 * @event {CustomEvent} cc-email:delete - Fires whenever the delete button is clicked.
 * @event {CustomEvent} cc-email:mark-as-primary - Fires whenever the 'mark as primary' button is clicked.
 */
export class CcEmail extends LitElement {

  constructor () {
    super();

    /** @type {EmailModel} model. */
    this.model = null;

    /** @type {string} The value currently set on the add address text input. */
    this._addAddressInputValue = '';

    /**
     * @type {'empty'|'invalid'|'already-defined'|'used'|null}
     * The code of the error message displayed bellow the address text input.
     *  | code |  |
     *  | --- | --- |
     *  | `empty` | the text input is empty |
     *  | `invalid` | the text input is not a valid e-mail address |
     *  | `already-defined` | the e-mail address is already defined as primary or secondary |
     *  | `used` | the e-mail address is already owned by another user account |
     */
    this._addAddressInputError = null;
  }

  static get properties () {
    return {
      model: { type: Object },
      _addAddressInputValue: { type: String },
      _addAddressInputError: { type: String },
    };
  }

  _isSkeleton () {
    return !this.model?.primary || !this.model?.secondary;
  }

  _getVerifiedTagLabel () {
    const verifiedLabel = i18n('cc-email.primary.email.verified');

    if (this._isSkeleton()) {
      return fakeString(verifiedLabel.length);
    }
    return this.model?.primary?.address?.verified ? verifiedLabel : i18n('cc-email.primary.email.unverified');
  }

  _renderPrimarySection () {
    const skeleton = this._isSkeleton();
    const address = skeleton ? fakeString(35) : this.model?.primary?.address?.value;
    const verified = this.model?.primary?.address?.verified;
    const shouldDisplayResendConfirmationEmail = !skeleton && !verified;

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.primary.title')}</div>
        <div slot="info">${i18n('cc-email.primary.description')}</div>

        ${this.model?.primary === 'loadingError' ? html`
          <cc-error>${i18n('cc-email.primary.errors.loading')}</cc-error>
        ` : ''}
        
        ${this.model?.primary !== 'loadingError' ? html`
          <cc-flex-gap class="address-line primary">
            <div class="address">
              <div class="icon"><img src="${mailSvg}" alt=""/></div>
              <span class="${classMap({ skeleton: skeleton })}">${address}</span>  
            </div>
            <div class="tag ${classMap({ skeleton: skeleton, verified: verified, unverified: !verified })}">
              <img src="${verified ? tickSvg : warningSvg}" alt=""/>${this._getVerifiedTagLabel()}
            </div>
          </cc-flex-gap>
          <cc-flex-gap>
            ${shouldDisplayResendConfirmationEmail ? html`
              <cc-button
                  @cc-button:click=${this._onResend}
                  ?waiting=${this.model?.primary?.state === 'sendingConfirmationEmail'}
                  link
              >
                ${i18n('cc-email.primary.resend-confirmation-email')}
              </cc-button>
            ` : ''}
            ${this.model?.primary?.error === 'sendingConfirmationEmail' ? html`
              <div>
                <cc-error>${i18n('cc-email.primary.errors.resending-confirmation-email')}</cc-error>
              </div>
            ` : ''}
          </cc-flex-gap>
        ` : ''}
      </cc-block-section>
    `;
  }

  _renderSecondarySection () {
    const skeleton = this._isSkeleton();
    const disabled = this.model?.secondary?.addresses
      ?.find((item) => item.state === 'markingAsPrimary');

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.secondary.title')}</div>
        <div slot="info">${i18n('cc-email.secondary.description')}</div>

        ${this.model?.secondary === 'loadingError' ? html`
          <cc-error>${i18n('cc-email.secondary.errors.loading')}</cc-error>
        ` : ''}
        
        ${this.model?.secondary !== 'loadingError' && !skeleton ? html`
          ${this.model?.secondary?.addresses?.map((item) => html`
            <cc-flex-gap class="address-line secondary">
              <div class="address">
                ${item.state ? html`
                <cc-loader></cc-loader>
              ` : ''}
                ${!item.state ? html`
                <div class="icon"><img src="${mailSvg}" alt=""/></div>
              ` : ''}
                <span>${item.address.value}</span>
              </div>
              <cc-flex-gap class="buttons">
                <cc-button
                    @cc-button:click=${() => this._onMarkAsPrimary(item.address.value)}
                    ?waiting="${item.state === 'markingAsPrimary'}"
                    ?disabled="${disabled || item.state === 'deleting'}"
                >
                  ${i18n('cc-email.secondary.action.mark-as-primary')}
                </cc-button>
                <cc-button
                    danger
                    outlined
                    image=${trashSvg}
                    @cc-button:click=${() => this._onDelete(item.address.value)}
                    ?waiting="${item.state === 'deleting'}"
                    ?disabled="${disabled || item.state === 'markingAsPrimary'}"
                >
                  ${i18n('cc-email.secondary.action.delete')}
                </cc-button>
              </cc-flex-gap>
            </cc-flex-gap>
            ${item.error === 'deleting' ? html`
              <cc-error>${i18n('cc-email.secondary.errors.deleting')}</cc-error>
            ` : ''}
            ${item.error === 'markingAsPrimary' ? html`
              <cc-error>${i18n('cc-email.secondary.errors.marking-as-primary')}</cc-error>
            ` : ''}
            <hr>
          `)}
        ` : ''}
        ${this.model?.secondary !== 'loadingError' ? html`
          <div>
            <cc-flex-gap class="form">
              <cc-input-text
                  label="${i18n('cc-email.secondary.address-input.label')}"
                  required
                  value="${this._addAddressInputValue}"
                  ?skeleton=${skeleton}
                  ?disabled=${disabled || this.model?.secondary?.state === 'adding'}
                  @cc-input-text:input=${this._onInput}
              >
                ${this._addAddressInputError ? html`
                  <p slot="error">
                    ${i18n(`cc-email.secondary.address-input.error.${this._addAddressInputError}`)}</p>
                ` : ''}
              </cc-input-text>
              <cc-button
                  success
                  ?skeleton=${skeleton}
                  ?waiting=${this.model?.secondary?.state === 'adding'}
                  ?disabled=${disabled}
                  @cc-button:click=${this._onAdd}
              >
                ${i18n('cc-email.secondary.action.add')}
              </cc-button>
            </cc-flex-gap>
          </div>
        ` : ''}

        ${this.model?.secondary?.error === 'adding' ? html`
          <cc-error>${i18n('cc-email.secondary.errors.adding')}</cc-error>
        ` : ''}
      </cc-block-section>
    `;
  }

  _onDelete (address) {
    dispatchCustomEvent(this, 'delete', address);
  }

  _onMarkAsPrimary (address) {
    dispatchCustomEvent(this, 'mark-as-primary', address);
  }

  _onInput ({ detail: value }) {
    this._addAddressInputValue = value;
  }

  _onAdd () {
    this._addAddressInputError = validateEmailAddress(this._addAddressInputValue);

    if (!this._addAddressInputError) {
      dispatchCustomEvent(this, 'add', this._addAddressInputValue);
    }
  }

  reset () {
    this._addAddressInputError = null;
    this._addAddressInputValue = '';
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-email.title')}</div>

        ${this._renderPrimarySection()}
        ${this._renderSecondarySection()}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-flex-gap {
          --cc-gap: 1rem;
          --cc-align-items: center;
        }

        /*region ADDRESS*/
        
        .address-line .address cc-loader {
          /* cc-loader must have the same width as the mail icon: icon size + 2*padding + 2*border width */
          width: calc(16px + 2 * 0.5em + 2 * 1px);
        }

        .address-line .address .icon {
          background-color: var(--color-bg-primary-light);
          border: 1px solid var(--color-bg-strong);
          border-radius: 50%;
          display: flex;
          padding: 0.5em;
        }

        .address-line .address span {
          min-width: 150px;
          word-break: break-all;
        }

        .address-line .address {
          align-items: center;
          display: flex;
          flex-wrap: nowrap;
          gap: 1rem;
        }

        .address-line.secondary .address {
          flex: 1 1 0;
        }

        /*endregion*/

        /*region TAG*/
        .tag {
          align-items: center;
          border: 1px solid var(--cc-email-primary-tag-color);
          border-radius: 0.25rem;

          color: var(--cc-email-primary-tag-color);
          display: flex;
          flex-wrap: nowrap;

          font-size: 0.85em;
          padding: 0.1em 0.3em;

          white-space: nowrap;
        }

        .tag.verified {
          --cc-email-primary-tag-color: var(--color-text-success);
        }

        .tag.unverified {
          --cc-email-primary-tag-color: var(--color-text-danger);
        }

        .tag.skeleton {
          border: none;
        }

        .tag > img {
          margin-right: 0.5em;
          min-height: 0;
          padding: 0;
          width: 1.2em;
        }

        /*endregion*/

        /*region FORM*/
        .form > cc-input-text {
          flex: 1 1 0;
        }

        .form > cc-button {
          align-self: start;
          grid-area: button;
          /*todo: use --margin-top-btn-horizontal-form when available (see #448)*/
          margin-top: 2.0em;
        }

        .form > cc-error {
          align-self: stretch;
          grid-area: error;
        }

        /*endregion*/

        hr {
          border-color: #e5e5e5;
          border-style: solid;
          border-width: 1px 0 0 0;
          margin: 0;
        }

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
