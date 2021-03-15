import '../atoms/cc-button.js';
import '../atoms/cc-expand.js';
import '../atoms/cc-loader.js';
import '../atoms/cc-toggle.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import './cc-env-var-editor-expert.js';
import './cc-env-var-editor-simple.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { linkStyles } from '../templates/cc-link.js';

/**
 * A high level environment variable form (wrapping simple editor and expert editor into one interface).
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/env-var/cc-env-var-form.js)
 *
 * ## Details
 *
 * * You can set a custom `heading` and description with the default <slot>.
 * * You can also set a context to get the appropriate heading and description (with translations).
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
 * @prop {String} appName - Defines application name used in some heading/description (depending on context).
 * @prop {"env-var"|"env-var-simple"|"env-var-addon"|"exposed-config"} context - Defines where the form will be used so it can display the appropriate heading and description.
 * @prop {"saving"|"loading"} error - Displays an error message (saving or loading).
 * @prop {String} heading - Sets a text to be used as a header title.
 * @prop {Boolean} readonly - Sets `readonly` attribute input and hides buttons.
 * @prop {Boolean} restartApp - Displays the restart app button.
 * @prop {Boolean} saving - Enables saving sate (form is disabled and loader is displayed).
 * @prop {Variable[]} variables - Sets the list of variables.
 *
 * @event {CustomEvent} cc-env-var-form:dismissed-error - Fires the type of error that was dismissed when the error button of an error message is clicked.
 * @event {CustomEvent} cc-env-var-form:restart-app - Fires whenever the restart app button is clicked.
 * @event {CustomEvent<Variable[]>} cc-env-var-form:submit - Fires the new list of variables whenever the submit button is clicked.
 *
 * @slot - Sets custom HTML description.
 */
export class CcEnvVarForm extends LitElement {

  static get properties () {
    return {
      appName: { type: String, attribute: 'app-name' },
      context: { type: String },
      error: { type: String, reflect: true },
      heading: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      restartApp: { type: Boolean, attribute: 'restart-app' },
      saving: { type: Boolean, reflect: true },
      variables: { type: Array },
      _currentVariables: { type: Array, attribute: false },
      _description: { type: String, attribute: false },
      _expertVariables: { type: Array, attribute: false },
      _mode: { type: String, attribute: false },
      _isPristine: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.appName = '?';
    this.readonly = false;
    this.restartApp = false;
    this.saving = false;
    // this.variables is let to undefined by default (this triggers skeleton screen)
    this._mode = 'SIMPLE';
    this._description = '';
  }

  _getModes () {
    return [
      { label: i18n('cc-env-var-form.mode.simple'), value: 'SIMPLE' },
      { label: i18n('cc-env-var-form.mode.expert'), value: 'EXPERT' },
    ];
  }

  _getErrorMessage () {
    if (this.error === 'loading') {
      return i18n('cc-env-var-form.error.loading');
    }
    if (this.error === 'saving') {
      return i18n('cc-env-var-form.error.saving');
    }
    return i18n('cc-env-var-form.error.unknown');
  }

  _onChange ({ detail: changedVariables }) {

    const deletedVariables = this._initVariables
      .filter((initVar) => {
        const changedVar = changedVariables.find((v) => v.name === initVar.name);
        return (changedVar == null || changedVar.isDeleted) && !initVar.isNew;
      })
      .map((v) => ({ ...v, isDeleted: true }));

    const newVariables = changedVariables
      .filter((changedVar) => {
        const initVar = this._initVariables.find((v) => v.name === changedVar.name);
        return initVar == null;
      })
      .map((v) => ({ ...v, isNew: true }));

    const otherVariables = changedVariables
      .filter((changedVar) => {
        const isDeleted = deletedVariables.find((v) => v.name === changedVar.name);
        const isNew = newVariables.find((v) => v.name === changedVar.name);
        return !isDeleted && !isNew;
      })
      .map((changedVar) => {
        const initVar = this._initVariables.find((v) => v.name === changedVar.name);
        const isEdited = initVar.value !== changedVar.value;
        return ({ ...changedVar, isEdited });
      });

    const allVariables = [...deletedVariables, ...newVariables, ...otherVariables];

    this._isPristine = !allVariables
      .some(({ isDeleted, isNew, isEdited }) => isDeleted || isNew || isEdited);

    this._currentVariables = allVariables.sort((a, b) => a.name.localeCompare(b.name));
  }

  _onToggleMode ({ detail: mode }) {
    if (mode === 'EXPERT') {
      this._expertVariables = this._currentVariables;
    }
    this._mode = mode;
  }

  _onResetForm () {
    this.variables = this._initVariables;
  }

  _onUpdateForm () {
    const cleanVariables = this._currentVariables
      .filter(({ isDeleted }) => !isDeleted)
      .map(({ name, value }) => ({ name, value }));
    dispatchCustomEvent(this, 'submit', cleanVariables);
  }

  _onRequestSubmit (e, isFormDisabled) {
    e.stopPropagation();
    if (!isFormDisabled) {
      this._onUpdateForm();
    }
  }

  update (changedProperties) {

    if (changedProperties.has('context') || changedProperties.has('appName')) {
      if (this.context === 'env-var') {
        this.heading = i18n('cc-env-var-form.heading.env-var');
        this._description = i18n('cc-env-var-form.description.env-var', { appName: this.appName });
      }
      if (this.context === 'env-var-simple') {
        this.heading = i18n('cc-env-var-form.heading.env-var');
      }
      if (this.context === 'env-var-addon') {
        this.heading = i18n('cc-env-var-form.heading.env-var');
        this.readonly = true;
      }
      if (this.context === 'exposed-config') {
        this.heading = i18n('cc-env-var-form.heading.exposed-config');
        this._description = i18n('cc-env-var-form.description.exposed-config', { appName: this.appName });
      }
    }

    if (changedProperties.has('variables')) {
      this._initVariables = this.variables;
      this._isPristine = true;
      if (this.variables == null) {
        this._currentVariables = null;
        this._expertVariables = null;
      }
      else {
        this._currentVariables = this.variables.sort((a, b) => a.name.localeCompare(b.name));
        this._expertVariables = this.variables.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    super.update(changedProperties);
  }

  render () {

    const isEditorDisabled = (this.saving || this.error != null);
    const isFormDisabled = (this._currentVariables == null || this._isPristine || isEditorDisabled);
    const hasOverlay = this.saving || this.error != null;

    return html`
      <div class="header">
        
        ${this.heading != null ? html`
          <div class="heading">${this.heading}</div>
        ` : ''}
        
        <cc-toggle
          class="mode-switcher ${classMap({ hasOverlay })}"
          value=${this._mode}
          .choices=${this._getModes()}
          ?disabled=${isEditorDisabled}
          @cc-toggle:input=${this._onToggleMode}
        ></cc-toggle>
      </div>
      
      <slot class="description">${this._description}</slot>
      
      <div class="overlay-container">
        <cc-expand class=${classMap({ hasOverlay })}>
          <cc-env-var-editor-simple
            ?hidden=${this._mode !== 'SIMPLE'}
            .variables=${this._currentVariables}
            ?disabled=${isEditorDisabled}
            ?readonly=${this.readonly}
            @cc-env-var-editor-simple:change=${this._onChange}
            @cc-input-text:requestimplicitsubmit=${(e) => this._onRequestSubmit(e, isFormDisabled)}
          ></cc-env-var-editor-simple>
          
          <cc-env-var-editor-expert
            ?hidden=${this._mode !== 'EXPERT'}
            .variables=${this._expertVariables}
            ?disabled=${isEditorDisabled}
            ?readonly=${this.readonly}
            @cc-env-var-editor-expert:change=${this._onChange}
            @cc-input-text:requestimplicitsubmit=${(e) => this._onRequestSubmit(e, isFormDisabled)}
          ></cc-env-var-editor-expert>
        </cc-expand>
        
        ${this.error === 'loading' ? html`
          <div class="error-container">
            <cc-error mode="info">${this._getErrorMessage()}</cc-error>
          </div>
        ` : ''}
        
        ${this.error === 'saving' ? html`
          <div class="error-container">
            <cc-error mode="confirm" @cc-error:ok=${() => dispatchCustomEvent(this, 'dismissed-error')}>${this._getErrorMessage()}</cc-error>
          </div>
        ` : ''}
        
        ${this.saving ? html`
      <cc-loader class="saving-loader"></cc-loader>
    ` : ''}
      </div>
        
      ${!this.readonly ? html`
        <cc-flex-gap class="button-bar">
          
          <cc-button ?disabled=${isFormDisabled} @cc-button:click=${this._onResetForm}>${i18n('cc-env-var-form.reset')}</cc-button>
          
          <div class="spacer"></div>
          
          ${this.restartApp ? html`
            <cc-button @cc-button:click=${() => dispatchCustomEvent(this, 'restart-app')}>${i18n('cc-env-var-form.restart-app')}</cc-button>
          ` : ''}
          
          <cc-button success ?disabled=${isFormDisabled} @cc-button:click=${this._onUpdateForm}>${i18n('cc-env-var-form.update')}</cc-button>
        </cc-flex-gap>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      linkStyles,
      css`
        :host {
          background: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: block;
          padding: 1rem;
        }

        .header {
          align-items: flex-start;
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .heading {
          color: #3A3871;
          flex: 1 1 0;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .description {
          color: #555;
          display: block;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .hasOverlay {
          --cc-skeleton-state: paused;
          filter: blur(0.3rem);
        }

        .overlay-container {
          position: relative;
        }
        
        cc-expand {
          /* We need to spread so the focus rings can be visible even with cc-expand default overflow:hidden */
          margin: -0.25rem;
          padding: 0.25rem;
        }

        .error-container {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .saving-loader {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .button-bar {
          --cc-gap: 1rem;
          margin-top: 1.5rem;
        }

        .spacer {
          flex: 1 1 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-form', CcEnvVarForm);
