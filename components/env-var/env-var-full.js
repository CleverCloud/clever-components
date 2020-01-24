import './env-var-form.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * A high level view to edit environment variables of an app and display environment variables of all its add-ons.
 *
 * ## Type definitions
 *
 * ```js
 * interface Variable {
 *   name: string,
 *   value: string,
 *   isDeleted: boolean,
 * }
 * ```
 *
 * @prop {Array} addons - Sets list of addons.
 * @prop {"saving"|"loading"|null} error - Displays an error message (saving or loading).
 * @prop {Boolean} restartApp - Displays the restart app button.
 * @prop {Variable[]} variables - Sets the list of variables.
 *
 * @event {CustomEvent<"saving"|"loading">} env-var-form:dismissed-error - Fires the type of error that was dismissed when the error button of an error message is clicked.
 * @event {CustomEvent} env-var-form:restart-app - Fires whenever the restart app button is clicked.
 * @event {CustomEvent<Variable[]>} env-var-form:submit - Fires the new list of variables whenever the submit button is clicked.
 */
export class EnvVarFull extends LitElement {

  static get properties () {
    return {
      addons: { type: Array, attribute: false },
      error: { type: String, reflect: true },
      restartApp: { type: Boolean, attribute: 'restart-app' },
      variables: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    this.addons = [];
    this.error = null;
    this.restartApp = false;
    // this.variables is let to undefined by default (this triggers skeleton screen)
  }

  _onDismissedError (error, id) {
    const detail = { error, id };
    dispatchCustomEvent(this, 'dismissed-error', detail);
  }

  render () {

    return html`
      <env-var-form
        heading=${i18n('env-var-full.heading')}
        .variables=${this.variables}
        .error=${this.error}
        ?restart-app=${this.restartApp}
        @env-var-form:dismissed-error=${(e) => this._onDismissedError(e.detail)}
      >
        ${i18n('env-var-full.message')}
        ${ccLink('http://doc.clever-cloud.com/admin-console/environment-variables/', i18n('env-var-full.link'))}
      </env-var-form>
      
      ${repeat(this.addons, ({ id }) => id, ({ id, name, variables }) => html`
        <env-var-form
          heading="Add-on: ${name}"
          .variables=${variables}
          readonly
          @env-var-form:dismissed-error=${() => this._onDismissedError('loading', id)}
        ></env-var-form>
      `)}
    `;
  }

  static get styles () {
    // language=CSS
    return [
      linkStyles,
      css`
        env-var-form {
          margin-bottom: 1rem;
        }
      `,
    ];
  }
}

window.customElements.define('env-var-full', EnvVarFull);
