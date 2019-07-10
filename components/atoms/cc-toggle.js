import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * Single choice toggle (a better looking radio input group)
 *
 * @fires {String} cc-toggle:input - the selected/toggled value
 *
 * @attr {String} value - the selected value
 * @attr {Boolean} disabled - disables the whole radio input group
 * @attr {Array} choices - the list of choices
 */
export class CcToggle extends LitElement {

  static get properties () {
    return {
      value: { type: String },
      disabled: { type: Boolean },
      choices: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    // use this unique name for isolation (Safari seems to have a bug)
    this._uniqueName = Math.random().toString(36).slice(2);
  }

  _onChange (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {
    return html`
      <div class=${classMap({ 'toggle-group': true, disabled: this.disabled, enabled: !this.disabled })}>
        ${repeat(this.choices, ({ value }) => value, ({ label, value }) => html`
          <input
            type="radio"
            name=${this._uniqueName}
            value=${value}
            id=${value}
            ?disabled=${this.disabled}
            ?checked=${this.value === value}
            @change=${this._onChange}>
          <label for=${value}>${label}</label>
          `)}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          --toggle-color: hsl(210, 23%, 26%);
          display: flex;
          margin: 0.2rem;
        }

        .toggle-group {
          border-radius: 0.15rem;
          border: 1px solid var(--toggle-color);
          display: flex;
          overflow: hidden;
        }

        .toggle-group.enabled:focus-within {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        .toggle-group.enabled:hover {
          box-shadow: 0 1px 3px #888;
        }

        .toggle-group.enabled:active {
          box-shadow: none;
          outline: 0;
        }

        .toggle-group.disabled {
          opacity: .5;
        }

        input {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          border: 0;
          display: block;
          height: 0;
          margin: 0;
          outline: none;
          width: 0;
        }

        label {
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 14px;
          color: var(--toggle-color);
          padding: 0.35rem 0.5rem;
        }

        .disabled label {
          cursor: default;
        }

        input:not(:checked):enabled:hover + label {
          background-color: hsl(210, 23%, 95%);
        }

        input:checked + label {
          background-color: var(--toggle-color);
          color: white;
          position: relative;
        }
      `,
    ];
  }
}

window.customElements.define('cc-toggle', CcToggle);
