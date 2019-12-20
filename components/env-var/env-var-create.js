import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { validateName } from '@clevercloud/client/esm/utils/env-vars.js';

/**
 * A small form to create a new environment variable with validations on the name.
 *
 * ## Details
 *
 * * The validation of the variable name format is handled with [@clevercloud/client](https://github.com/CleverCloud/clever-client.js/blob/master/esm/utils/env-vars.js)
 * * The validation of existing names is handled with the `variablesNames` property which is a list of already existing names.
 *
 * ## Type definitions
 *
 * ```js
 * interface Variable {
 *   name: string,
 *   value: string,
 * }
 * ```
 *
 * @prop {Boolean} disabled - Sets `disabled` attribute on inputs and button.
 * @prop {String[]} variablesNames - Sets list of existing variables names (so we can display an error if it already exists).
 *
 * @event {CustomEvent<Variable>} env-var-create:create - Fires the variable whenever the add button is clicked.
 */
export class EnvVarCreate extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      variablesNames: { type: Array, attribute: false },
      _variableName: { type: String, attribute: false },
      _variableValue: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.disabled = false;
    this.variablesNames = [];
    this.reset();
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

  render () {

    const isNameInvalid = !validateName(this._variableName);
    const isNameAlreadyDefined = this.variablesNames.includes(this._variableName);
    const hasErrors = isNameInvalid || isNameAlreadyDefined;

    return html`
      <div class="wrapper">
        <cc-input-text
          class="name"
          name="name"
          value=${this._variableName}
          ?disabled=${this.disabled}
          placeholder=${i18n(`env-var-create.name.placeholder`)}
          @cc-input-text:input=${this._onNameInput}
        ></cc-input-text>
        <span class="input-btn">
          <cc-input-text
            class="value"
            name="value"
            value=${this._variableValue}
            multi
            ?disabled=${this.disabled}
            placeholder=${i18n(`env-var-create.value.placeholder`)}
            @cc-input-text:input=${this._onValueInput}
          ></cc-input-text>
          <cc-button
            primary
            ?disabled=${hasErrors || this.disabled}
            @cc-button:click=${this._onSubmit}
          >${i18n(`env-var-create.create-button`)}</cc-button>
        </span>
      </div>
      <div class="errors" ?hidden=${!isNameInvalid || this._variableName === ''}>
        <img class="icon-img" src=${warningSvg} alt="">${i18n(`env-var-create.errors.invalid-name`, { name: this._variableName })}
      </div>
      <div class="errors" ?hidden=${!isNameAlreadyDefined}>
        <img class="icon-img" src=${warningSvg} alt="">️${i18n(`env-var-create.errors.already-defined-name`, { name: this._variableName })}
      </div>
    `;
  }

  static get styles () {
    return [
      iconStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-wrap: wrap;
        }

        .name {
          flex: 1 1 15rem;
        }

        .input-btn {
          display: flex;
          flex: 2 1 27rem;
          flex-wrap: wrap;
        }

        .value {
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20rem;
        }

        cc-button {
          align-self: flex-start;
          flex: 1 1 6rem;
          white-space: nowrap;
        }

        .errors {
          margin: 0.5rem 0.2rem 0.2rem;
        }
      `,
    ];
  }
}

window.customElements.define('env-var-create', EnvVarCreate);
