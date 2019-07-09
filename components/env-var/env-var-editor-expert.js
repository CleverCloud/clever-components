import '../atoms/cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import envVarUtils from '../lib/env-vars.js';
import { i18n } from '@i18n';

/**
 * A high level env var editor, edit all vars at once with a big string that is parsed and provides error messages
 *
 * @event env-var-editor-expert:change - when any of the values changes with an array of `{ name: 'the name', value: 'the value', isDeleted: true/false }` as `detail`
 *
 * @attr {Array} variables - the array of variables
 * @attr {Boolean} disabled - set disabled attribute on inputs and button
 * @attr {Boolean} readonly - if we want to only display variables (the button is hidden)
 */
export class EnvVarEditorExpert extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      _variablesAsText: { type: Array, attribute: false },
      _formattedErrors: { type: Array, attribute: false },
      _isLoading: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.variables = null;
    this.disabled = false;
    this.readonly = false;
  }

  static get skeletonVariables () {
    return [
      { name: 'VARIABLE_ONE', value: '' },
      { name: 'VARIABLE_FOOBAR', value: '' },
      { name: 'VARIABLE_PORT', value: '' },
    ];
  }

  set variables (variables) {

    this._isLoading = (variables == null);

    const vars = this._isLoading
      ? EnvVarEditorExpert.skeletonVariables
      : variables;

    const filteredVariables = vars
      .filter(({ isDeleted }) => !isDeleted);
    this._variablesAsText = envVarUtils.toNameEqualsValueString(filteredVariables);
    this._errors = [];
  }

  set _errors (rawErrors) {
    this._formattedErrors = rawErrors.map(({ type, name, pos }) => {
      if (type === envVarUtils.ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-name', { name }),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.duplicated-name', { name }),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-line'),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-value'),
        };
      }
      return { line: '?', msg: i18n('env-var-editor-expert.errors.unknown') };
    });
  }

  _onInput ({ detail: value }) {
    const { variables, errors } = envVarUtils.parseRaw(value);
    this._errors = errors;
    if (errors.length === 0) {
      dispatchCustomEvent(this, 'change', variables);
    }
  }

  render () {

    const placeholder = this.readonly
      ? i18n('env-var-editor-expert.placeholder-readonly')
      : i18n('env-var-editor-expert.placeholder');

    return html`
      <cc-input-text
        multi
        value=${this._variablesAsText}
        placeholder=${placeholder}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._isLoading}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>
      
      <ul class="error-list" ?hidden=${this._formattedErrors.length === 0}>
        ${this._formattedErrors.map(({ line, msg }) => html`
          <li class="error-item">⚠️ <strong>${i18n('env-var-editor-expert.errors.line')} ${line}:</strong> ${msg}</li>
        `)}
      </ul>
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      .error-list {
        margin: 0.5rem 0.2rem 0.2rem;
        padding: 0;
        list-style: none;
      }

      .error-item {
        margin: 0;
        padding: 0.25rem 0;
        line-height: 1.75;
      }
    `;
  }
}

window.customElements.define('env-var-editor-expert', EnvVarEditorExpert);
