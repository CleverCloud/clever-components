import '../atoms/cc-loader.js';
import '../molecules/cc-error.js';
import './cc-env-var-form.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';

/**
 * @typedef {import('./types.js').EnvType} EnvType
 * @typedef {import('./types.js').Service} Service
 */

/**
 * A component to display groups of readonly `<cc-env-var-form>` for linked apps of add-ons.
 *
 * ## Details
 *
 * * When `services` is nullish, a loading indicator is displayed with a message (corresponding to `type`).
 * * If `variables` on a service is nullish, the `<cc-env-var-form>` will be in skeleton mode.
 *
 * @cssdisplay block
 */
export class CcEnvVarLinkedServices extends LitElement {

  static get properties () {
    return {
      appName: { type: String, attribute: 'app-name' },
      error: { type: Boolean },
      services: { type: Array },
      type: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets name of the main app to which services are linked. */
    this.appName = null;

    /** @type {boolean} Sets error status if list of services could not be fetched. */
    this.error = false;

    /** @type {Service[]|null} List of add-ons or apps with their name and variables. */
    this.services = null;

    /** @type {EnvType} Type of env vars to display linked add-ons or linked apps. */
    this.type = null;
  }

  _getLoadingMessage () {
    const i18nParams = { appName: this.appName };
    switch (this.type) {
      case 'addon':
        return i18n('cc-env-var-linked-services.loading.addon', i18nParams);
      case 'app':
        return i18n('cc-env-var-linked-services.loading.app', i18nParams);
      default:
        return '';
    }
  }

  _getServiceHeading (name) {
    switch (this.type) {
      case 'addon':
        return i18n('cc-env-var-linked-services.heading.addon', { name });
      case 'app':
        return i18n('cc-env-var-linked-services.heading.app', { name });
      default:
        return '';
    }
  }

  _getServiceDescription (serviceName) {
    const i18nParams = { serviceName, appName: this.appName };
    switch (this.type) {
      case 'addon':
        return i18n('cc-env-var-linked-services.description.addon', i18nParams);
      case 'app':
        return i18n('cc-env-var-linked-services.description.app', i18nParams);
      default:
        return '';
    }
  }

  _getEmptyMessage () {
    const i18nParams = { appName: this.appName };
    switch (this.type) {
      case 'addon':
        return i18n('cc-env-var-linked-services.empty.addon', i18nParams);
      case 'app':
        return i18n('cc-env-var-linked-services.empty.app', i18nParams);
      default:
        return '';
    }
  }

  _getErrorMessage () {
    const i18nParams = { appName: this.appName };
    switch (this.type) {
      case 'addon':
        return i18n('cc-env-var-linked-services.error.addon', i18nParams);
      case 'app':
        return i18n('cc-env-var-linked-services.error.app', i18nParams);
      default:
        return '';
    }
  }

  render () {

    return html`

      ${this.services == null && !this.error ? html`
        <div class="loading">
          <cc-loader></cc-loader><span>${this._getLoadingMessage()}</span>
        </div>
      ` : ''}

      ${!this.error && this.services?.length > 0 ? html`
        <div class="service-list">
          ${this.services.map((s) => html`
            <cc-env-var-form readonly .variables=${s.variables} heading=${this._getServiceHeading(s.name)} error="${ifDefined(s.error)}">
              ${this._getServiceDescription(s.name)}
            </cc-env-var-form>
          `)}
        </div>
      ` : ''}

      ${this.services != null && !this.error && this.services.length === 0 ? html`
        <div class="empty-msg">${this._getEmptyMessage()}</div>
      ` : ''}

      ${this.error ? html`
        <div class="error">
          <cc-error>${this._getErrorMessage()}</cc-error>
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .loading,
        .empty-msg,
        .error {
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          box-sizing: border-box;
          padding: 1rem;
        }

        .loading {
          display: flex;
        }

        cc-loader {
          height: 1.5rem;
          margin-right: 1rem;
          width: 1.5rem;
        }

        .service-list {
          display: grid;
          grid-gap: 1rem;
        }

        .empty-msg {
          color: var(--color-text-light);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-linked-services', CcEnvVarLinkedServices);
