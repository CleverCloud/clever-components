// @ts-expect-error FIXME: remove when clever-client exports types
import { ERROR_TYPES, parseRaw, toNameEqualsValueString } from '@clevercloud/client/esm/utils/env-vars.js';
import { LitElement, css, html } from 'lit';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { i18n } from '../../translations/translation.js';
import { CcEnvChangeEvent } from '../cc-env-var-form/cc-env-var-form.events.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/** @type {EnvVar[]} */
const SKELETON_VARIABLES = [
  { name: 'VARIABLE_ONE', value: '' },
  { name: 'VARIABLE_FOOBAR', value: '' },
  { name: 'VARIABLE_PORT', value: '' },
];

/**
 * @typedef {import('../common.types.js').EnvVarEditorState} EnvVarEditorState
 * @typedef {import('../common.types.js').EnvVarParseError} EnvVarParseError
 * @typedef {import('../common.types.js').EnvVarRawError} EnvVarRawError
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 * @typedef {import('lit').PropertyValues<CcEnvVarEditorExpert>} CcEnvVarEditorExpertPropertyValues
 */

/**
 * A high level environment variable editor to create/edit/delete all variables at once as a big string (properly parsed with validation and error messages).
 *
 * @cssdisplay block / none (with `[hidden]`)
 */
export class CcEnvVarEditorExpert extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      state: { type: Object },
      _errors: { type: Array, state: true },
      _skeleton: { type: Boolean, state: true },
      _variablesAsText: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Sets `readonly` attribute on inputs and `disabled` on buttons. */
    this.disabled = false;

    /** @type {boolean} Sets `readonly` attribute on main input and hides buttons. */
    this.readonly = false;

    /** @type {EnvVarEditorState} Sets the variables editor state.*/
    this.state = { type: 'loading' };

    /** @type {EnvVarParseError[]} */
    this._errors = [];

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string} */
    this._variablesAsText = '';
  }

  /** @param {EnvVarRawError[]} rawErrors */
  _setErrors(rawErrors) {
    this._errors = rawErrors.map(({ type, name, pos }) => {
      if (type === ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-name', { name }),
          isWarning: false,
        };
      }
      if (type === ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.duplicated-name', { name }),
          isWarning: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-line'),
          isWarning: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-value'),
          isWarning: false,
        };
      }
      if (type === ERROR_TYPES.INVALID_NAME_STRICT) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.errors.invalid-name-strict', { name }),
          isWarning: false,
        };
      }
      if (type === ERROR_TYPES.JAVA_INFO) {
        return {
          line: pos.line,
          msg: i18n('cc-env-var-editor-expert.info.java-prop', { name }),
          isWarning: true,
        };
      }

      return { line: '?', msg: i18n('cc-env-var-editor-expert.errors.unknown'), isWarning: false };
    });
  }

  /** @param {CustomEvent<string>} event */
  _onInput({ detail: value }) {
    if (this.state.type === 'loading') {
      return;
    }

    this._variablesAsText = value;
    const { variables, errors } = parseRaw(value, { mode: this.state.validationMode });
    this._setErrors(errors);
    this.dispatchEvent(new CcEnvChangeEvent(variables));
  }

  /** @param {CcEnvVarEditorExpertPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state')) {
      this._skeleton = this.state.type === 'loading';
      const vars = this.state.type === 'loaded' ? this.state.variables : SKELETON_VARIABLES;
      const filteredVariables = vars.filter(({ isDeleted }) => !isDeleted);
      this._variablesAsText = toNameEqualsValueString(filteredVariables);
      this._setErrors([]);
    }
  }

  render() {
    return html`
      ${!this.readonly ? html` <div class="example">${i18n('cc-env-var-editor-expert.example')}</div> ` : ''}
      <cc-input-text
        label=${i18n('cc-env-var-editor-expert.label')}
        hidden-label
        multi
        clipboard
        value=${this._variablesAsText}
        ?readonly=${this.readonly || this.disabled}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length > 0
        ? html`
            <div class="error-list">
              ${this._errors.map(
                ({ line, msg, isWarning }) => html`
                  <cc-notice intent="${!isWarning ? 'warning' : 'info'}">
                    <div slot="message">
                      <strong>${i18n('cc-env-var-editor-expert.errors.line')} ${line}:</strong> ${msg}
                    </div>
                  </cc-notice>
                `,
              )}
            </div>
          `
        : ''}
    `;
  }

  static get styles() {
    return [
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
          grid-gap: 0.75em;
          margin-top: 1em;
        }

        .example {
          line-height: 1.5;
          padding-bottom: 1em;
        }

        /* i18n error message may contain <code> tags */

        cc-notice code,
        .example code {
          background-color: var(--cc-color-bg-neutral, #eee);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace, monospace);
          padding: 0.15em 0.3em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-editor-expert', CcEnvVarEditorExpert);
