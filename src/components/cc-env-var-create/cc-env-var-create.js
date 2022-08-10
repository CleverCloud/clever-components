import '../cc-button/cc-button.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-error/cc-error.js';
import { validateName } from '@clevercloud/client/esm/utils/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/**
 * @typedef {import('./cc-env-var-create.types.js').Variable} Variable
 */

/**
 * A small form to create a new environment variable with validations on the name.
 *
 * ## Details
 *
 * * The validation of the variable name format is handled with [@clevercloud/client](https://github.com/CleverCloud/clever-client.js/blob/master/esm/utils/env-vars.js)
 * * The validation of existing names is handled with the `variablesNames` property which is a list of already existing names.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Variable>} cc-env-var-create:create - Fires the variable whenever the add button is clicked.
 */
export class CcEnvVarCreate extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      mode: { type: String },
      variablesNames: { type: Array, attribute: 'variables-names' },
      _variableName: { type: String, attribute: false },
      _variableValue: { type: String, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inputs and button. */
    this.disabled = false;

    /** @type {string} Sets the mode of the variables name validation. */
    this.mode = '';

    /** @type {string[]} Sets list of existing variables names (so we can display an error if it already exists). */
    this.variablesNames = [];

    /** @type {string} */
    this._variableName = '';

    /** @type {string} */
    this._variableValue = '';
  }

  /** Resets the form to its original state. */
  reset () {
    this._variableName = '';
    this._variableValue = '';
  }

  _onNameInput ({ detail: value }) {
    this._variableName = value;
  }

  _onValueInput ({ detail: value }) {
    this._variableValue = value;
  }

  _onSubmit () {
    dispatchCustomEvent(this, 'create', {
      name: this._variableName,
      value: this._variableValue,
    });
    this.reset();
    // Put focus back on name input so we can add something else directly
    this.shadowRoot.querySelector('cc-input-text.name').focus();
  }

  _onRequestSubmit (e, hasErrors) {
    e.stopPropagation();
    if (!hasErrors) {
      this._onSubmit();
    }
  }

  render () {

    const isNameInvalidSimple = !validateName(this._variableName, 'simple');
    const isNameInvalidStrict = !validateName(this._variableName, 'strict');
    const isNameAlreadyDefined = this.variablesNames.includes(this._variableName);
    const hasErrors = (this.mode === 'strict')
      ? isNameInvalidStrict || isNameAlreadyDefined
      : isNameInvalidSimple || isNameAlreadyDefined;

    return html`
      <cc-flex-gap>

        <cc-input-text
          class="name"
          name="name"
          value=${this._variableName}
          ?disabled=${this.disabled}
          placeholder=${i18n('cc-env-var-create.name.placeholder')}
          @cc-input-text:input=${this._onNameInput}
          @cc-input-text:requestimplicitsubmit=${(e) => this._onRequestSubmit(e, hasErrors)}
        ></cc-input-text>

        <cc-flex-gap class="input-btn">

          <cc-input-text
            class="value"
            name="value"
            value=${this._variableValue}
            multi
            ?disabled=${this.disabled}
            placeholder=${i18n('cc-env-var-create.value.placeholder')}
            @cc-input-text:input=${this._onValueInput}
            @cc-input-text:requestimplicitsubmit=${(e) => this._onRequestSubmit(e, hasErrors)}
          ></cc-input-text>

          <cc-button
            primary
            ?disabled=${hasErrors || this.disabled}
            @cc-button:click=${this._onSubmit}
          >${i18n('cc-env-var-create.create-button')}
          </cc-button>
        </cc-flex-gap>
      </cc-flex-gap>

      ${(isNameInvalidStrict && this.mode === 'strict' && this._variableName !== '') ? html`
        <cc-error>${i18n(`cc-env-var-create.errors.invalid-name`, { name: this._variableName })}</cc-error>
      ` : ''}
      ${(isNameInvalidStrict && isNameInvalidSimple && this.mode !== 'strict' && this._variableName !== '') ? html`
        <cc-error>${i18n(`cc-env-var-create.errors.invalid-name`, { name: this._variableName })}</cc-error>
      ` : ''}
      ${(isNameInvalidStrict && !isNameInvalidSimple && this.mode !== 'strict' && this._variableName !== '') ? html`
        <cc-error notice>${i18n(`cc-env-var-create.info.java-prop`, { name: this._variableName })}</cc-error>
      ` : ''}

      ${isNameAlreadyDefined ? html`
        <cc-error>${i18n(`cc-env-var-create.errors.already-defined-name`, { name: this._variableName })}</cc-error>
      ` : ''}

    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 0.5em;
          display: block;
        }

        .name {
          flex: 1 1 15em;
        }

        .input-btn {
          flex: 2 1 27em;
        }

        .value {
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }

        cc-button {
          align-self: flex-start;
          flex: 1 1 6em;
          white-space: nowrap;
        }

        cc-error {
          margin: 0.5em 0;
        }

        /* i18n error message may contain <code> tags */
        cc-error code {
          background-color: var(--cc-color-bg-neutral, #eeeeee);
          border-radius: 0.25em;
          font-family: var(--cc-ff-monospace, monospace);
          padding: 0.15em 0.3em;
        }
      `,
    ];
  }

}

window.customElements.define('cc-env-var-create', CcEnvVarCreate);
