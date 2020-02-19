import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * A better looking radio input group component acting like a toggle between many options.
 *
 * ## Technical details
 *
 * * Uses native `input[type=radio]` under the hood to keep native behaviour (a11y, keyboards...).
 * * We decided to use a JavaScript array of objects for the choices because it's way simpler to implement and not that dirtier to use.
 *
 * ## Type definitions
 *
 * ```js
 * interface Choice {
 *   label: string,
 *   value: string,
 * }
 * ```
 *
 * @prop {Choice[]} choices - Sets the list of choices.
 * @prop {Boolean} disabled - Sets the `disabled` attribute on all `input[type=radio]` of whole group.
 * @prop {String} value - Sets the selected value.
 *
 * @event {CustomEvent<String>} cc-toggle:input - Fires the selected `value` whenever the selected `value` changes.
 *
 * @cssprop {Color} --cc-toggle-color - The main color of the toggle (defaults: `#334252`). It must be defined directly on the element.
 */
export class CcToggle extends LitElement {

  static get properties () {
    return {
      /** @required */
      choices: { type: Array, attribute: false },
      disabled: { type: Boolean },
      value: { type: String },
    };
  }

  constructor () {
    super();
    this.disabled = false;
    // use this unique name for isolation (Safari seems to have a bug)
    this._uniqueName = Math.random().toString(36).slice(2);
  }

  _onChange (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {

    return html`
      <div class="toggle-group ${classMap({ disabled: this.disabled, enabled: !this.disabled })}">
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
          --cc-toggle-color: #334252;
          display: flex;
          margin: 0.2rem;
        }

        .toggle-group {
          border-radius: 0.15rem;
          border: 1px solid var(--cc-toggle-color);
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
          background-color: white;
          color: var(--cc-toggle-color);
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          padding: 0.35rem 0.5rem;
          text-transform: uppercase;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .disabled label {
          cursor: default;
        }

        input:not(:checked):enabled:hover + label {
          background-color: hsl(210, 23%, 95%);
        }

        input:checked + label {
          background-color: var(--cc-toggle-color);
          color: white;
          position: relative;
        }
      `,
    ];
  }
}

window.customElements.define('cc-toggle', CcToggle);
