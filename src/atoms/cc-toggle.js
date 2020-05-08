import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { dispatchCustomEvent } from '../lib/events.js';

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
 *   image?: string,   // Optional URL of an image
 *   value: string,
 * }
 * ```
 *
 * @prop {Choice[]} choices - Sets the list of choices.
 * @prop {Boolean} disabled - Sets the `disabled` attribute on all `input[type=radio]` of whole group.
 * @prop {Boolean} hideText - Hides the text and only displays the image specified with `choices[i].image`. The text will be added as `title` on the inner `<label>` and a `aria-label` on the inner `<inpu>`.
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
      choices: { type: Array },
      disabled: { type: Boolean },
      hideText: { type: Boolean, attribute: 'hide-text' },
      value: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
    this.disabled = false;
    this.hideText = false;
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
        ${repeat(this.choices, ({ value }) => value, ({ label, image, value }) => html`
          <input
            type="radio"
            name=${this._uniqueName}
            .value=${value}
            id=${value}
            ?disabled=${this.disabled}
            .checked=${this.value === value}
            @change=${this._onChange}
            aria-label=${ifDefined((image != null && this.hideText) ? label : undefined)}>
          <label for=${value} title=${ifDefined((image != null && this.hideText) ? label : undefined)}>
            ${image != null ? html`
              <img src=${image} alt="">
            ` : ''}
            ${(image == null) || !this.hideText ? html`
              <span>${label}</span>
            ` : ''}
          </label>
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
        }

        .toggle-group {
          border-radius: 0.15rem;
          box-sizing: border-box;
          display: flex;
          height: 2rem;
          line-height: 1.25;
          overflow: visible;
        }

        /* We hide the <input> and only display the related <label> */
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
          align-items: center;
          background-color: var(--color-bg);
          border-color: var(--cc-toggle-color);
          border-style: solid;
          color: var(--color-txt);
          cursor: pointer;
          display: grid;
          font-size: 14px;
          font-weight: bold;
          grid-auto-flow: column;
          grid-gap: 0.5rem;
          padding: 0 0.5rem;
          text-transform: uppercase;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        label {
          border-width: 1px 0;
        }

        label:first-of-type {
          border-left-width: 1px;
          border-radius: 0.15rem 0 0 0.15rem;
        }

        label:last-of-type {
          border-radius: 0 0.15rem 0.15rem 0;
          border-right-width: 1px;
        }

        img {
          display: block;
          height: 1.25rem;
          width: 1.25rem;
        }

        /* NOT SELECTED */
        label {
          --color-bg: #fff;
          --color-txt: var(--cc-toggle-color);
        }

        /* DISABLED */
        .toggle-group.disabled {
          opacity: .5;
        }

        .disabled label {
          cursor: default;
        }

        /* HOVERED */
        input:not(:checked):enabled:hover + label {
          --color-bg: #ededed;
        }

        /* FOCUS */
        .toggle-group.enabled:not(:hover):focus-within {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        /* SELECTED */
        input:checked + label {
          --color-bg: var(--cc-toggle-color);
          --color-txt: #fff;
        }
      `,
    ];
  }
}

window.customElements.define('cc-toggle', CcToggle);
