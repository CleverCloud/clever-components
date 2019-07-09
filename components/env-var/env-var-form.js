import '../atoms/cc-button.js';
import '../atoms/cc-expand.js';
import '../atoms/cc-loader.js';
import '../atoms/cc-toggle.js';
import './env-var-editor-expert.js';
import './env-var-editor-simple.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '@i18n';

/**
 * A high level env var editor form, wraps simple editor and expert editor
 *
 * @event env-var-form:submit - when the update button is clicked with an array of `{ name: 'the name', value: 'the value' }` as `detail`
 * @event env-var-form:restart-app - when the restart app button is clicked
 * @event env-var-form:dismissed-error - when an error is displayed and the ok button is clicked
 *
 * @attr {Array} variables - the array of variables
 * @attr {String} heading - a text to be used as a header title
 * @attr {Boolean} saving - enable saving sate (disabled form with loader)
 * @attr {Boolean} readonly - if we want to only display variables (the button is hidden)
 * @attr {Boolean} restartApp - display the restart app button
 * @attr {String} error - display an error message (saving|loading)
 *
 * `{ name: 'the name', value: 'the value', isDeleted: true|false }`
 */
export class EnvVarForm extends LitElement {

  static get properties () {
    return {
      heading: { type: String, reflect: true },
      variables: { type: Array, attribute: false },
      saving: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      restartApp: { type: Boolean, attribute: 'restart-app' },
      error: { type: String, reflect: true },
      _currentVariables: { type: Array, attribute: false },
      _expertVariables: { type: Array, attribute: false },
      _mode: { type: String, attribute: false },
      _isPristine: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.heading = null;
    // this.variables is let to undefined by default (this triggers skeleton screen)
    this.saving = false;
    this.readonly = false;
    this.restartApp = false;
    this.error = null;
    this._mode = 'SIMPLE';
  }

  static get modes () {
    return [
      { label: i18n('env-var-form.mode.simple'), value: 'SIMPLE' },
      { label: i18n('env-var-form.mode.expert'), value: 'EXPERT' },
    ];
  }

  set variables (variablesPromise) {
    if (variablesPromise == null) {
      return this._setVariables(null);
    }
    // TODO: handle race conditions
    if (this._initVariables != null) {
      this.saving = true;
    }
    this.error = null;
    variablesPromise
      .then((vars) => {
        this._setVariables(vars);
        this.error = null;
        this.saving = false;
      })
      .catch(() => {
        if (this._initVariables == null) {
          this.error = 'loading';
        }
        else {
          this.error = 'saving';
        }
        this.saving = false;
      });
  }

  _setVariables (variables) {
    this._initVariables = variables;
    this._isPristine = true;
    if (variables == null) {
      this._currentVariables = null;
      this._expertVariables = null;
    }
    else {
      this._currentVariables = variables.sort((a, b) => a.name.localeCompare(b.name));
      this._expertVariables = variables.sort((a, b) => a.name.localeCompare(b.name));
    }
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
    this._setVariables(this._initVariables);
  }

  _onUpdateForm () {
    const cleanVariables = this._currentVariables
      .filter(({ isDeleted }) => !isDeleted)
      .map(({ name, value }) => ({ name, value }));
    dispatchCustomEvent(this, 'submit', cleanVariables);
  }

  _onRestartApp () {
    dispatchCustomEvent(this, 'restart-app');
  }

  _onClickDismissError (errorType) {
    dispatchCustomEvent(this, 'dismissed-error', errorType);
  }

  get _errorMessage () {
    if (this.error === 'loading') {
      return i18n('env-var-form.error.loading');
    }
    if (this.error === 'saving') {
      return i18n('env-var-form.error.saving');
    }
    return i18n('env-var-form.error.unknown');
  }

  render () {

    const $heading = (this.heading != null)
      ? html`<div class="heading">${this.heading}</div>`
      : '';

    const $errorMessageContainer = (this.error != null)
      ? html`<div class="error-container">
        <div class="error-panel">
          <div class="error-message">⚠️ ${this._errorMessage}</div>
          <cc-button @click=${() => this._onClickDismissError(this.error)}>OK</cc-button>
        </div>
      </div>`
      : '';

    const $savingLoader = (this.saving)
      ? html`<cc-loader class="saving-loader"></cc-loader>`
      : '';

    const $restartButton = (this.restartApp)
      ? html`<cc-button @click=${this._onRestartApp}>${i18n('env-var-form.restart-app')}</cc-button>`
      : '';

    const $buttonsBar = (!this.readonly)
      ? html`<div class="button-bar">
          <cc-button
            ?disabled=${this._currentVariables == null || this.saving || this.error != null || this._isPristine}
            @click=${this._onResetForm}
          >${i18n('env-var-form.reset')}</cc-button>
          <div class="spacer"></div>
          ${$restartButton}
          <cc-button
            success
            ?disabled=${this._currentVariables == null || this.saving || this._isPristine || this.error != null}
            @click=${this._onUpdateForm}
          >${i18n('env-var-form.update')}</cc-button>
        </div>`
      : '';

    return html`
      <div class="header">
        ${$heading}
        <cc-toggle
          class=${classMap({ 'mode-switcher': true, saving: this.saving || this.error != null })}
          value=${this._mode}
          .choices=${EnvVarForm.modes}
          ?disabled=${this.saving || this.error != null}
          @cc-toggle:input=${this._onToggleMode}
        ></cc-toggle>
      </div>
      
      <slot class="description"></slot>
      
      <cc-expand class=${classMap({ saving: this.saving || this.error != null })}>
        <env-var-editor-simple
          ?hidden=${this._mode !== 'SIMPLE'}
          .variables=${this._currentVariables}
          ?disabled=${this.saving || this.error != null}
          ?readonly=${this.readonly}
          @env-var-editor-simple:change=${this._onChange}
        ></env-var-editor-simple>
        
        <env-var-editor-expert
          ?hidden=${this._mode !== 'EXPERT'}
          .variables=${this._expertVariables}
          ?disabled=${this.saving || this.error != null}
          ?readonly=${this.readonly}
          @env-var-editor-expert:change=${this._onChange}
        ></env-var-editor-expert>
      </cc-expand>
      
      ${$buttonsBar}
      
      ${$savingLoader}
      
      ${$errorMessageContainer}
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
        background: #fff;
        border-radius: 0.25rem;
        border: 1px solid #bcc2d1;
        padding: 1rem;
        /* to position .saving-loader */
        position: relative;
      }

      .header {
        align-items: flex-start;
        display: flex;
        justify-content: center;
        margin-bottom: 0.5rem;
      }

      .heading {
        flex: 1 1 0;
        font-size: 1.25rem;
        font-weight: 400;
        margin: 0.2rem;
      }

      .description {
        display: block;
        color: #555;
        font-style: italic;
        margin: 0.2rem 0.2rem 1rem;
      }

      .saving {
        filter: blur(0.3rem);
      }

      .button-bar {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .spacer {
        flex: 1 1 0;
      }

      .saving-loader {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
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

      .error-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        padding: 1rem;
        border-radius: 0.25rem;
        border: 1px solid #ccc;
        max-width: 80%;
      }

      .error-message {
        margin-bottom: 1rem;
      }
    `;
  }
}

window.customElements.define('env-var-form', EnvVarForm);
