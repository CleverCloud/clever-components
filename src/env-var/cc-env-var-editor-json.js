import { ERROR_TYPES, parseRawJson, toJson } from '@clevercloud/client/esm/utils/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-error.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { linkStyles } from '../templates/cc-link.js';

const SKELETON_VARIABLES = [
  { name: 'VARIABLE_ONE', value: '' },
  { name: 'VARIABLE_FOOBAR', value: '' },
  { name: 'VARIABLE_PORT', value: '' },
];

/**
 * @typedef {import('./types.js').ParseError} ParseError
 * @typedef {import('./types.js').ParserOptions} ParserOptions
 * @typedef {import('./types.js').Variable} Variable
 */

/**
 * A high level environment variable editor to create/edit/delete all variables at once as a JSON text (properly parsed with validation and error messages).
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Variable[]>} cc-env-var-editor-json:change - Fires the new list of variables whenever something changes in the list.
 */
export class CcEnvVarEditorJson extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      parserOptions: { type: Object },
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

    /** @type {boolean} Sets `disabled` attribute on inputs and buttons. */
    this.disabled = false;

    /** @type {ParserOptions} Sets the options for the variables parser. */
    this.parserOptions = { mode: null };

    /** @type {boolean} Sets `readonly` attribute on main input and hides buttons. */
    this.readonly = false;

    /** @type {Variable[]|null} Sets the list of variables. */
    this.variables = null;

    /** @type {ParseError[]} */
    this._errors = [];

    /** @type {boolean} */
    this._skeleton = false;
  }

  _setErrors (rawErrors) {
    this._errors = rawErrors.map(({ type, name }) => {
      if (type === ERROR_TYPES.INVALID_NAME) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-name', { name }),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.DUPLICATED_NAME) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.duplicated-name', { name }),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json'),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON_FORMAT) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json-format'),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_JSON_ENTRY) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-json-entry'),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_NAME_STRICT) {
        return {
          msg: i18n('cc-env-var-editor-json.errors.invalid-name-strict', { name }),
          isNotice: false,
        };
      }
      if (type === ERROR_TYPES.JAVA_INFO) {
        return {
          msg: i18n('cc-env-var-editor-json.info.java-prop', { name }),
          isNotice: true,
        };
      }
      return { line: '?', msg: i18n('cc-env-var-editor-json.errors.unknown') };
    });
  }

  _onInput ({ detail: value }) {
    const { variables, errors } = parseRawJson(value, this.parserOptions);
    this._setErrors(errors);
    dispatchCustomEvent(this, 'change', variables);
  }

  update (changedProperties) {
    if (changedProperties.has('variables')) {
      this._skeleton = (this.variables == null);
      const vars = this._skeleton ? SKELETON_VARIABLES : this.variables;
      const filteredVariables = vars
        .filter(({ isDeleted }) => !isDeleted);
      this._variablesAsJson = toJson(filteredVariables);
      this._setErrors([]);
    }
    super.update(changedProperties);
  }

  render () {

    return html`
      ${!this.readonly
        ? html`
          <div class="example">
            ${i18n('cc-env-var-editor-json.example')}
          </div>
        ` : ''}
      <cc-input-text
        multi
        clipboard
        value=${this._variablesAsJson}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length > 0 ? html`
        <div class="error-list">
          ${this._errors.map(({ msg, isNotice }) => html`
            ${!isNotice ? html`
              <cc-error> ${msg}</cc-error>
            ` : ''}
            ${isNotice ? html`
              <cc-error notice>${msg}</cc-error>
            ` : ''}
          `)}
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      linkStyles,
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

        .example {
          line-height: 1.5;
          padding-bottom: 1em;
        }

        /* i18n error message may contain <code> tags */
        cc-error code,
        .example code {
          background-color: var(--color-bg-neutral);
          border-radius: 0.25rem;
          font-family: var(--cc-ff-monospace);
          padding: 0.15rem 0.3rem;
        }
      `,
    ];
  }

}

window.customElements.define('cc-env-var-editor-json', CcEnvVarEditorJson);
