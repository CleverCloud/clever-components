import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '@i18n';
import { pulse } from '../styles/animations.js';

/**
 * A small input to manipulate an environement variable
 *
 * @event env-var-input:input - mirrors native cc-input-text events with `{ name: 'the name', value: 'the value' }` as `detail`
 * @event env-var-input:delete - when the inner delete button is clicked with `{ name: 'the name' }` as `detail`
 * @event env-var-input:keep - when the inner keep button is clicked with `{ name: 'the name' }` as `detail`
 *
 * @attr {String} name - name of the environment variable
 * @attr {String} value - value of the environment variable (can be empty)
 * @attr {Boolean} new - if the environment variable is new (compared to server side state)
 * @attr {Boolean} edited - if the environment variable is edited (compared to server side state)
 * @attr {Boolean} deleted - if the environment variable should be deleted
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} readonly - if we want to only display variables (the button is hidden)
 * @attr {Boolean} disabled - set disabled attribute on input and button
 */
export class EnvVarInput extends LitElement {

  static get properties () {
    return {
      name: { type: String },
      value: { type: String },
      // new and edited are NOT USED FOR NOW
      new: { type: Boolean },
      edited: { type: Boolean },
      deleted: { type: Boolean },
      skeleton: { type: Boolean },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.value = '';
    // new and edited are NOT USED FOR NOW
    this.new = false;
    this.edited = false;
    this.deleted = false;
    this.skeleton = false;
    this.disabled = false;
    this.readonly = false;
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

    const button = !this.readonly
      ? html`
          <cc-button
            ?skeleton=${this.skeleton}
            ?disabled=${this.disabled}
            ?danger=${!this.deleted}
            ?outlined=${!this.deleted}
            @click=${this.deleted ? this._onKeep : this._onDelete}
          >
            ${this.deleted ? i18n('env-var-input.keep-button') : i18n('env-var-input.delete-button')}
          </cc-button>
        `
      : '';

    return html`
      <span class=${classMap({ name: true, skeleton: this.skeleton, deleted: this.deleted })}>
        <span class="text">${this.name}</span>
      </span>
      <span class="input-btn">
        <cc-input-text
          class="value"
          name=${this.name}
          value=${this.value}
          multi
          ?disabled=${this.deleted || this.disabled}
          ?skeleton=${this.skeleton}
          ?readonly=${this.readonly}
          placeholder=${i18n('env-var-input.value-placeholder')}
          @cc-input-text:input=${this._onInput}
        ></cc-input-text>
        ${button}
      </span>
    `;
  }

  static get styles () {
    return [
      pulse,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-wrap: wrap;
        }

        :host([hidden]) {
          display: none;
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
          padding: 0.2rem;
          word-break: break-all;
        }

        .name.deleted {
          text-decoration: line-through;
        }

        .name.skeleton .text {
          animation-direction: alternate;
          animation-duration: 500ms;
          animation-iteration-count: infinite;
          animation-name: pulse;
          background-color: #bbb;
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
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
      `,
    ];
  }
}

window.customElements.define('env-var-input', EnvVarInput);
