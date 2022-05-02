import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';
import '../atoms/cc-loader.js';
import '../atoms/cc-flex-gap.js';
import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import '../molecules/cc-block.js';
import '../molecules/cc-block-section.js';
import '../atoms/cc-input-text.js';

const mailSvg = new URL('../assets/mail.svg', import.meta.url).href;
const trashSvg = new URL('../assets/trash-red.svg', import.meta.url).href;
const tickSvg = new URL('../assets/tick.svg', import.meta.url).href;
const warningSvg = new URL('../assets/warning.svg', import.meta.url).href;

/**
 * @param {string} address
 * @return {'empty'|'invalid'|null} Returns null when validation passes.
 */
function validateEmailAddress (address) {
  if (address === '') {
    return 'empty';
  }

  // todo : validate with regex
  if (!address.includes('@')) {
    return 'invalid';
  }

  return null;
}

/**
 * @typedef {import('./types.js').EmailModel} EmailModel
 */

/**
 * A component displaying the email addresses associated with a user account.
 *
 * @cssdisplay block
 *
 */
export class CcEmail extends LitElement {

  constructor () {
    super();

    /** @type {EmailModel} model. */
    this.model = null;

    /** @type {string} The value currently set on the add address input. */
    this._addAddressInputValue = '';

    /** @type {'empty'|'invalid'|null} The error displayed bellow the address text input. */
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
    return !this.model?.primaryModel || !this.model?.secondaryModel;
  }

  _getVerifiedTagLabel () {
    const verifiedLabel = i18n('cc-email.primary.email.verified');

    if (this._isSkeleton()) {
      return fakeString(verifiedLabel.length);
    }
    return this.model?.primaryModel?.address?.verified ? verifiedLabel : i18n('cc-email.primary.email.unverified');
  }

  _renderPrimarySection () {
    const skeleton = this._isSkeleton();
    const address = skeleton ? fakeString(35) : this.model?.primaryModel?.address?.value;
    const verified = this.model?.primaryModel?.address?.verified;
    const shouldDisplayResendConfirmationEmail = !skeleton && !verified;

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.primary.title')}</div>
        <div slot="info">${i18n('cc-email.primary.description')}</div>

        ${this.model?.primaryModel === 'loadingError' ? html`
          <cc-error>${i18n('cc-email.primary.errors.loading')}</cc-error>
        ` : ''}
        
        ${this.model?.primaryModel !== 'loadingError' ? html`
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
                  ?waiting=${this.model?.primaryModel?.state === 'sendingConfirmationEmail'}
                  link
              >
                ${i18n('cc-email.primary.resend-confirmation-email')}
              </cc-button>
            ` : ''}
            ${this.model?.primaryModel?.error === 'sendingConfirmationEmail' ? html`
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
    const disabled = this.model?.secondaryModel?.addresses
      ?.find((item) => item.state === 'markingAsPrimary');

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.secondary.title')}</div>
        <div slot="info">${i18n('cc-email.secondary.description')}</div>

        ${this.model?.secondaryModel === 'loadingError' ? html`
          <cc-error>${i18n('cc-email.secondary.errors.loading')}</cc-error>
        ` : ''}
        
        ${this.model?.secondaryModel !== 'loadingError' && !skeleton ? html`
          ${this.model?.secondaryModel?.addresses?.map((item) => html`
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
        ${this.model?.secondaryModel !== 'loadingError' ? html`
          <div>
            <cc-flex-gap class="form">
              <cc-input-text
                  label="${i18n('cc-email.secondary.address-input.label')}"
                  required
                  value="${this._addAddressInputValue}"
                  ?skeleton=${skeleton}
                  ?disabled=${disabled || this.model?.secondaryModel?.state === 'adding'}
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
                  ?waiting=${this.model?.secondaryModel?.state === 'adding'}
                  ?disabled=${disabled}
                  @cc-button:click=${this._onAdd}
              >
                ${i18n('cc-email.secondary.action.add')}
              </cc-button>
            </cc-flex-gap>
          </div>
        ` : ''}

        ${this.model?.secondaryModel?.error === 'adding' ? html`
          <cc-error>${i18n('cc-email.secondary.errors.adding')}</cc-error>
        ` : ''}
      </cc-block-section>
    `;
  }

  _onDelete (address) {
    dispatchCustomEvent(this, 'delete', address);
  }

  _onMarkAsPrimary (address) {
    dispatchCustomEvent(this, 'markAsPrimary', address);
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

  render () {
    return html`
      <cc-block>
        <div slot="title">Email Addresses</div>

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
