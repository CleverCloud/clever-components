import { ERROR_TYPES, parseRawJson, toJSONString } from '@clevercloud/client/esm/utils/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-error.js';

const SKELETON_VARIABLES = [
  { name: 'VARIABLE_ONE', value: '' },
  { name: 'VARIABLE_FOOBAR', value: '' },
  { name: 'VARIABLE_PORT', value: '' },
];

/**
 * A high level environment variable editor to create/edit/delete all variables at once as a JSON text (properly parsed with validation and error messages).
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
 * @cssdisplay block
 *
 * @prop {Boolean} disabled - Sets `disabled` attribute on inputs and buttons.
 * @prop {Boolean} readonly - Sets `readonly` attribute on main input and hides buttons.
 * @prop {Variable[]} variables - Sets the list of variables.
 *
 * @event {CustomEvent<Variable[]>} cc-env-var-editor-json:change - Fires the new list of variables whenever something changes in the list.
 *
 */
export class CcEnvVarEditorJson extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      variables: { type: Array },
      _errors: { type: Array },
      _formattedErrors: { type: Array, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _variablesAsJson: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.disabled = false;
    this.readonly = false;
    this.variables = null;
    this._errors = [];
    this._skeleton = false;
  }

  _setErrors (rawErrors) {
    this._errors = rawErrors.map(({ type, name }) => {
      if (type === ERROR_TYPES.INVALID_NAME) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-name', { name }),
        };
      }
      if (type === ERROR_TYPES.DUPLICATED_NAME) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.duplicated-name', { name }),
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json'),
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON_FORMAT) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json-format'),
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON_ENTRY) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json-entry'),
        };
      }
      return { line: '?', msg: i18n('cc-env-var-editor-json.errors.unknown') };
    });
  }

  _onInput ({ detail: value }) {
    const { variables, errors } = parseRawJson(value);
    this._setErrors(errors);
    dispatchCustomEvent(this, 'change', variables);
  }

  update (changeProperties) {
    if (changeProperties.has('variables')) {
      this._skeleton = (this.variables == null);
      const vars = this._skeleton ? SKELETON_VARIABLES : this.variables;
      const filteredVariables = vars
        .filter(({ isDeleted }) => !isDeleted);
      this._variablesAsJson = toJSONString(filteredVariables);
      this._setErrors([]);
    }
    super.update(changeProperties);
  }

  render () {
    const placeholder = this.readonly
      ? i18n('cc-env-var-editor-json.placeholder-readonly')
      : i18n('cc-env-var-editor-json.placeholder');

    return html`
      <cc-input-text
        multi
        clipboard
        placeholder=${placeholder}
        value=${this._variablesAsJson}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length > 0 ? html`
        <div class="error-list">
          ${this._errors.map(({ msg }) => html`
            <cc-error>${msg}</cc-error>
          `)}
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
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

window.customElements.define('cc-env-var-editor-json', CcEnvVarEditorJson);
