import '../cc-button/cc-button.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-input-text/cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/**
 * @typedef {import('./cc-env-var-input.types.js').Variable} Variable
 * @typedef {import('./cc-env-var-input.types.js').VariableName} VariableName
 */

/**
 * A small input to manipulate an environement variable.
 *
 * @cssdisplay block
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

    /** @type {boolean} Declares the variable as "should be deleted". */
    this.deleted = false;

    /** @type {boolean} Sets `disabled` attribute on input and button. */
    this.disabled = false;

    /** @type {boolean} Declares the variable as "edited" (compared to server side state). */
    this.edited = false;

    /** @type {string|null} Sets the name of the environment variable. */
    this.name = null;

    /** @type {boolean}  Declares the variable as "new" (compared to server side state). */
    this.new = false;

    /** @type {boolean} Sets `readonly` attribute on input and hides button. */
    this.readonly = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {string} Sets the value of the environment variable (can be empty). */
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
            name="value"
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
          --cc-gap: 0.5em;
          display: block;
        }

        .name {
          box-sizing: border-box;
          display: inline-block;
          flex: 1 1 17em;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.875em;
          line-height: 1.6em;
          padding-top: 0.35em;
          word-break: break-all;
        }

        .name.deleted {
          text-decoration: line-through;
        }

        .skeleton {
          background-color: #bbb;
        }

        .input-btn {
          flex: 2 1 27em;
        }

        .value {
          align-self: self-start;
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20em;
        }

        cc-button {
          align-self: flex-start;
          flex: 1 1 6em;
          white-space: nowrap;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `,
    ];
  }
}

window.customElements.define('cc-env-var-input', CcEnvVarInput);
