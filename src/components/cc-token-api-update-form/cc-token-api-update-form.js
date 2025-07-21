import { LitElement, css, html } from 'lit';
import {
  iconRemixArrowLeftLine as iconGoBack,
  iconRemixInformationFill as iconInfo,
} from '../../assets/cc-remix.icons.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-code/cc-code.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import { CcTokenChangeEvent } from './cc-token-api-update-form.events.js';

/** @type {FormValues} */
const SKELETON_VALUES = { name: '', description: '' };

/**
 * @typedef {import('./cc-token-api-update-form.types.js').TokenApiUpdateFormState} TokenApiUpdateFormState
 * @typedef {import('./cc-token-api-update-form.types.js').FormValues} FormValues
 */

/**
 * A component providing a form to update an API token's details (name and description).
 *
 * It supports different states:
 * - `loading`: When the component is fetching the current token details. The inputs are set to skeleton mode.
 * - `loaded`: When the token details are loaded. The form is ready to be used.
 * - `updating`: When the form is being submitted. The submit button is in a waiting state.
 * - `error`: When an error occurred while fetching the token details.
 */
export class CcTokenApiUpdateForm extends LitElement {
  static get properties() {
    return {
      apiTokenListHref: { type: String, attribute: 'api-token-list-href' },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Sets the URL to navigate back to the API token list. */
    this.apiTokenListHref = null;

    /** @type {TokenApiUpdateFormState} Sets the state of the component. */
    this.state = { type: 'loading' };
  }

  /**
   * Handles the form submission by dispatching the 'update-token' event.
   *
   * @param {{ name: string, description: string }} formData - The data submitted from the form.
   * @private
   */
  _onFormSubmit({ name, description }) {
    this.dispatchEvent(new CcTokenChangeEvent({ name, description }));
  }

  render() {
    const { name, description } =
      this.state.type === 'loaded' || this.state.type === 'updating' ? this.state.values : SKELETON_VALUES;
    const skeleton = this.state.type === 'loading';
    const isWaiting = this.state.type === 'updating';

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-api-update-form.main-heading')}</div>
        <div slot="content">
          <div class="content-wrapper">
            ${this.state.type === 'error'
              ? html`<cc-notice intent="warning" message="${i18n('cc-token-api-update-form.error')}"></cc-notice>`
              : ''}
            ${this.state.type !== 'error' ? this._renderForm(name, description, skeleton, isWaiting) : ''}
          </div>
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <cc-link
            slot="link"
            href="https://www.clever-cloud.com/developers/api/howto/#request-the-api"
            .icon="${iconInfo}"
          >
            <span>${i18n('cc-token-api-update-form.link.doc')}</span>
          </cc-link>
          <div slot="content">
            <p>
              ${i18n('cc-token-api-update-form.cli.content.intro')}
              ${i18n('cc-token-api-update-form.cli.content.instruction')}
            </p>
            <dl>
              <dt>${i18n('cc-token-api-update-form.cli.content.create-token')}</dt>
              <dd>
                <cc-code>clever tokens create "&lt;your token name&gt;"</cc-code>
              </dd>
              <dt>${i18n('cc-token-api-update-form.cli.content.revoke-token')}</dt>
              <dd>
                <cc-code>clever tokens revoke &lt;API_TOKEN_ID&gt;</cc-code>
              </dd>
              <dt>${i18n('cc-token-api-update-form.cli.content.list-token')}</dt>
              <dd>
                <cc-code>clever tokens list</cc-code>
              </dd>
              <dt>${i18n('cc-token-api-update-form.cli.content.use-token')}</dt>
              <dd>
                <cc-code>
                  curl -H "Authorization: Bearer &lt;TOKEN&gt;" https://api-bridge.clever-cloud.com/v2/self
                </cc-code>
              </dd>
            </dl>
          </div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /**
   *
   * @param {string} name
   * @param {string} description
   * @param {boolean} skeleton
   * @param {boolean} isWaiting
   */
  _renderForm(name, description, skeleton, isWaiting) {
    return html`
      <form class="form" ${formSubmit(this._onFormSubmit.bind(this))}>
        <cc-input-text
          label="${i18n('cc-token-api-update-form.name.label')}"
          name="name"
          required
          .value="${name}"
          ?skeleton="${skeleton}"
          ?readonly="${isWaiting}"
        ></cc-input-text>
        <cc-input-text
          label="${i18n('cc-token-api-update-form.description.label')}"
          name="description"
          .value="${description}"
          ?skeleton="${skeleton}"
          ?readonly="${isWaiting}"
        ></cc-input-text>
        <div class="form__actions">
          <div class="form__actions__link-container">
            <cc-link
              href="${this.apiTokenListHref}"
              class="form__actions__link-container__link"
              .icon="${iconGoBack}"
              mode="subtle"
            >
              <span>${i18n('cc-token-api-update-form.back-to-list')}</span>
            </cc-link>
          </div>
          <cc-button
            class="form__actions__submit-button"
            type="submit"
            primary
            ?disabled="${skeleton}"
            ?waiting="${isWaiting}"
          >
            ${i18n('cc-token-api-update-form.submit-button')}
          </cc-button>
        </div>
      </form>
    `;
  }

  static get styles() {
    return [
      cliCommandsStyles,
      css`
        :host {
          display: block;
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        cc-block {
          padding-top: 2em;
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        cc-block > [slot='content'] {
          padding-bottom: 2em;
          padding-inline: 3em;
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        [slot='header-title'] {
          padding-inline: 1.5em;
        }

        .intro {
          margin: 0;
        }

        .content-wrapper {
          margin-top: 1em;
        }

        .form {
          display: grid;
          gap: 1.5em;
        }

        .form__actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5em;
          justify-content: flex-end;
          margin-top: 1em;
        }

        .form__actions__submit-button {
          flex: 1 0 min(100%, 12.5em);
        }

        .form__actions__link-container {
          display: grid;
          flex: 100 1 auto;
          justify-content: flex-end;
        }

        .form__actions__link-container__link {
          align-items: center;
          color: var(--cc-color-text-weak);
          cursor: pointer;
          display: flex;
          gap: 0.5em;
          padding: 0.25em 0.5em;
          text-decoration: none;
        }

        .form__actions__link-container__link:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .form__actions__link-container__link cc-icon {
          flex: 0 0 auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-token-api-update-form', CcTokenApiUpdateForm);
