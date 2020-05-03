import '../atoms/cc-button.js';
import '../atoms/cc-flex-gap.js';
import '../atoms/cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

/**
 * A small input to manipulate an environement variable.
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
 * ```js
 * interface VariableName {
 *   name: string,
 * }
 * ```
 *
 * @prop {Boolean} deleted - Declares the variable as "should be deleted".
 * @prop {Boolean} disabled - Sets `disabled` attribute on input and button.
 * @prop {Boolean} edited - Declares the variable as "edited" (compared to server side state).
 * @prop {String} name - Sets the name of the environment variable.
 * @prop {Boolean} new - Declares the variable as "new" (compared to server side state).
 * @prop {Boolean} readonly - Sets `readonly` attribute on input and hides button.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {String} value - Sets the value of the environment variable (can be empty).
 *
 * @event {CustomEvent<VariableName>} cc-env-var-input:delete - Fires a variable name whenever the delete button is clicked.
 * @event {CustomEvent<Variable>} cc-env-var-input:input - Fires a variable whenever its value changes.
 * @event {CustomEvent<VariableName>} cc-env-var-input:keep - Fires a variable name whenever the keep button is clicked.
 */
export class CcEnvVarInput extends LitElement {

  static get properties () {
    return {
      deleted: { type: Boolean },
      disabled: { type: Boolean },
      // NOT USED FOR NOW
      edited: { type: Boolean },
      /** @required */
      name: { type: String },
      // NOT USED FOR NOW
      new: { type: Boolean },
      readonly: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: String },
    };
  }

  constructor () {
    super();
    this.deleted = false;
    this.disabled = false;
    this.edited = false;
    this.new = false;
    this.readonly = false;
    this.skeleton = false;
    this.value = '';
  }

  _onInput ({ detail: value }) {
    this.value = value;
    dispatchCustomEvent(this, 'input', { name: this.name, value: this.value });
  }

  _onDelete () {
    dispatchCustomEvent(this, 'delete', { name: this.name });
  }

  _onKeep () {
    dispatchCustomEvent(this, 'keep', { name: this.name });
  }

  render () {
    // the no-whitespace comment trick helps users who triple click on the text to be sure to copy the text without any whitespaces
    return html`
      <cc-flex-gap>
        
        <span class="name ${classMap({ deleted: this.deleted })}"><!-- no-whitespace
          --><span class=${classMap({ skeleton: this.skeleton })}>${this.name}</span><!-- no-whitespace
        --></span>
        
        <cc-flex-gap class="input-btn">
          
          <cc-input-text
            class="value"
            name=${this.name}
            value=${this.value}
            multi
            clipboard
            ?disabled=${this.deleted || this.disabled}
            ?skeleton=${this.skeleton}
            ?readonly=${this.readonly}
            placeholder=${i18n('cc-env-var-input.value-placeholder')}
            @cc-input-text:input=${this._onInput}
          ></cc-input-text>
          
          ${!this.readonly ? html`
            <cc-button
              ?skeleton=${this.skeleton}
              ?disabled=${this.disabled}
              ?danger=${!this.deleted}
              ?outlined=${!this.deleted}
              @cc-button:click=${this.deleted ? this._onKeep : this._onDelete}
            >
              ${this.deleted ? i18n('cc-env-var-input.keep-button') : i18n('cc-env-var-input.delete-button')}
            </cc-button>
          ` : ''}
          
        </cc-flex-gap>
      </cc-flex-gap>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 0.5rem;
          display: block;
        }

        .name {
          background-color: #fff;
          box-sizing: border-box;
          display: inline-block;
          flex: 1 1 15rem;
          font-family: "SourceCodePro", "monaco", monospace;
          /* I have a bug on Linux between Chrome and FF with rem on inputs */
          font-size: 14px;
          line-height: 1.4rem;
          padding-top: 0.3rem;
          word-break: break-all;
        }

        .name.deleted {
          text-decoration: line-through;
        }

        .skeleton {
          background-color: #bbb;
        }

        .input-btn {
          flex: 2 1 27rem;
        }

        .value {
          align-self: self-start;
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20rem;
        }

        cc-button {
          align-self: flex-start;
          flex: 1 1 6rem;
          white-space: nowrap;
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-input', CcEnvVarInput);
