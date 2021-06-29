import '../atoms/cc-input-text.js';
import '../molecules/cc-error.js';
import { ERROR_TYPES, parseRaw, toNameEqualsValueString } from '@clevercloud/client/esm/utils/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';

const SKELETON_VARIABLES = [
  { name: 'VARIABLE_ONE', value: '' },
  { name: 'VARIABLE_FOOBAR', value: '' },
  { name: 'VARIABLE_PORT', value: '' },
];

/**
 * A high level environment variable editor to create/edit/delete all variables at once as a big string (properly parsed with validation and error messages).
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
 * @cssdisplay block / none (with `[hidden]`)
 *
 * @prop {Boolean} readonly - Sets `readonly` attribute on main input and hides buttons.
 * @prop {Boolean} disabled - Sets `disabled` attribute on inputs and buttons.
 * @prop {Variable[]} variables - Sets the list of variables.
 *
 * @event {CustomEvent<Variable[]>} cc-env-var-editor-expert:change - Fires the new list of variables whenever something changes in the list.
 */
export class CcEnvVarEditorExpert extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      variables: { type: Array },
      _variablesAsText: { type: Array, attribute: false },
      _errors: { type: Array, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    // lit-analyzer needs this
    this._skeleton = false;
    // Triggers setter (init _skeleton, _variablesAsText and _errors)
    this.variables = null;
    this.disabled = false;
    this.readonly = false;
  }

  _setErrors (rawErrors) {
    this._errors = rawErrors.map(({ type, name, pos }) => {
      if (type === ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-name', { name }),
        };
      }
      if (type === ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.duplicated-name', { name }),
        };
      }
      if (type === ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-line'),
        };
      }
      if (type === ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-value'),
        };
      }
      return { line: '?', msg: i18n('cc-env-var-editor-expert.errors.unknown') };
    });
  }

  _onInput ({ detail: value }) {
    const { variables, errors } = parseRaw(value);
    this._setErrors(errors);
    if (errors.length === 0) {
      dispatchCustomEvent(this, 'change', variables);
    }
  }

  update (changedProperties) {
    if (changedProperties.has('variables')) {
      this._skeleton = (this.variables == null);
      const vars = this._skeleton ? SKELETON_VARIABLES : this.variables;
      const filteredVariables = vars
        .filter(({ isDeleted }) => !isDeleted);
      this._variablesAsText = toNameEqualsValueString(filteredVariables);
      this._setErrors([]);
    }
    super.update(changedProperties);
  }

  render () {

    const placeholder = this.readonly
      ? i18n('cc-env-var-editor-expert.placeholder-readonly')
      : i18n('cc-env-var-editor-expert.placeholder');

    return html`
      <cc-input-text
        multi
        clipboard
        value=${this._variablesAsText}
        placeholder=${placeholder}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length > 0 ? html`
        <div class="error-list">
          ${this._errors.map(({ line, msg }) => html`
            <cc-error><strong>${i18n('cc-env-var-editor-expert.errors.line')} ${line}:</strong> ${msg}</cc-error>
          `)}
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

        :host([hidden]) {
          display: none;
        }

        .error-list {
          display: grid;
          grid-gap: 0.75rem;
          margin-top: 1rem;
        }

        /* i18n error message may contain <code> tags */
        cc-error code {
          background-color: #f3f3f3;
          border-radius: 0.25rem;
          font-family: var(--cc-ff-monospace);
          padding: 0.15rem 0.3rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-editor-expert', CcEnvVarEditorExpert);
