import './env-var-form.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '@i18n';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * A high level view to edit env vars of an app and display all its add-on's env vars
 *
 * @event env-var-form:submit - when the update button is clicked with an array of `{ name: 'the name', value: 'the value' }` as `detail`
 * @event env-var-form:restart-app - when the restart app button is clicked
 * @event env-var-full:dismissed-error - when an error is displayed and the ok button is clicked
 *
 * @attr {Array} variables - the array of variables
 * @attr {Boolean} restartApp - display the restart app button
 * @attr {String} error - display an error message (saving|loading)
 * @attr {Array} addons - array of addons
 */
export class EnvVarFull extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      restartApp: { type: Boolean, attribute: 'restart-app' },
      error: { type: String, reflect: true },
      addons: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    // this.variables is let to undefined by default (this triggers skeleton screen)
    this.restartApp = false;
    this.error = null;
    this.addons = [];
  }

  _onDismissedError (error, id) {
    const detail = { error, id };
    dispatchCustomEvent(this, 'dismissed-error', detail);
  }

  render () {

    const $addons = repeat(
      this.addons,
      ({ id }) => id,
      ({ id, name, variables }) => {
        return html`<env-var-form
          heading="Add-on: ${name}"
          .variables=${variables}
          readonly
          @env-var-form:dismissed-error=${() => this._onDismissedError('loading', id)}
        ></env-var-form>`;
      },
    );

    return html`
      <env-var-form
        heading=${i18n('env-var-full.heading')}
        .variables=${this.variables}
        .error=${this.error}
        ?restart-app=${this.restartApp}
        @env-var-form:dismissed-error=${(e) => this._onDismissedError(e.detail)}
      >
        ${i18n('env-var-full.message')}
        <a href="http://doc.clever-cloud.com/admin-console/environment-variables/" target="_blank">${i18n('env-var-full.link')}</a>
      </env-var-form>
      ${$addons}
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      env-var-form {
        margin-bottom: 1rem;
      }
    `;
  }
}

window.customElements.define('env-var-full', EnvVarFull);
