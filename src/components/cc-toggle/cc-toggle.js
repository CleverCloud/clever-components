import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { CcMultiSelectEvent, CcSelectEvent } from '../common.events.js';

/**
 * @typedef {import('./cc-toggle.types.js').Choice} Choice
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement>} HTMLInputElementEvent
 */

/**
 * A radio/checkbox input group component acting like a toggle between many options.
 *
 * ## When to use?
 *
 * * This component does not replace regular usage of radio/checkbox inputs in forms.
 * * It works well in toolbars or filter panels.
 * * The single mode (default) works well to toggle a component between two (or more) modes.
 *
 * ## Details
 *
 * * Single mode (default) is one selected choice.
 * * Multiple mode is zero to many selected choices and is enabled by setting \`multipleValues\`.
 *
 * ## Technical details
 *
 * * Single mode (default) uses native `input[type=radio]` under the hood to keep native behaviour (a11y, keyboards...).
 * * Multiple mode uses native `input[type=checkbox]` under the hood to keep native behaviour (a11y, keyboards...).
 * * We decided to use a JavaScript array of objects for the choices because it's way simpler to implement and not that dirtier to use.
 *
 * @cssdisplay inline-flex
 *
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em` or `1em` when inline).
 * @cssprop {BorderRadius} --cc-toggle-border-radius - Sets the value of the border radius CSS property (defaults: `0.15em`).
 * @cssprop {Color} --cc-toggle-color - The main color of the toggle (defaults: `#334252`). It must be defined directly on the element.
 * @cssprop {FontWeight} --cc-toggle-font-weight - Sets the value of the font weight CSS property (defaults: `bold`).
 * @cssprop {Filter} --cc-toggle-img-filter - A CSS filter to apply on images of all choices (defaults: `none`). It must be defined directly on the element.
 * @cssprop {Filter} --cc-toggle-img-filter-selected - A CSS filter to apply on images of selected choices (defaults: `none`). It must be defined directly on the element.
 * @cssprop {Color} --cc-toggle-legend-color - The color for the group's legend (defaults: `inherit`).
 * @cssprop {FontSize} --cc-toggle-legend-font-size - The font-size for the group's legend (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-toggle-legend-font-weight - The font-weight for the group's legend (defaults: `normal`).
 * @cssprop {TextTransform} --cc-toggle-text-transform - Sets the value of the text transform CSS property (defaults: `uppercase`).
 */
export class CcToggle extends LitElement {
  static get properties() {
    return {
      /** @required */
      choices: { type: Array },
      disabled: { type: Boolean },
      hideText: { type: Boolean, attribute: 'hide-text' },
      inline: { type: Boolean, reflect: true },
      legend: { type: String },
      multipleValues: { type: Array, attribute: 'multiple-values', reflect: true },
      name: { type: String, reflect: true },
      subtle: { type: Boolean },
      value: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {Choice[]|null} Sets the list of choices. */
    this.choices = null;

    /** @type {boolean} Sets the `disabled` attribute on all inner `<input>` of whole group. */
    this.disabled = false;

    /** @type {boolean} Hides the text and only displays the image specified with `choices[i].image`. The text will be added as `title` on the inner `<label>` and an `aria-label` on the inner `<input>`. */
    this.hideText = false;

    /** @type {boolean} Sets the legend on the left of the `<select>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets a legend to describe the whole component (input group). */
    this.legend = null;

    /** @type {string[]} Enables multiple mode and sets the selected values. */
    this.multipleValues = null;

    /** @type {string|null} Sets `name` attribute on native `<input>` element.
     * If left `null`, the name of the native `<input>` will be 'toggle'. In order to navigate through a group of inputs using the arrow keys, each `<input>` must have the same `name` value.
     */
    this.name = null;

    /** @type {boolean} Uses a more subtle display mode, less attractive to the user's attention. */
    this.subtle = false;

    /** @type {string|null} Sets the selected value (single mode only). */
    this.value = null;
  }

  /** @param {HTMLInputElementEvent} e */
  _onChange(e) {
    if (this.multipleValues == null) {
      this.value = e.target.value;
      this.dispatchEvent(new CcSelectEvent(this.value));
    } else {
      // Same order as the choices
      const multipleValues = this.choices
        .filter(({ value }) => {
          return value === e.target.value ? e.target.checked : this.multipleValues.includes(value);
        })
        .map(({ value }) => value);
      this.multipleValues = multipleValues;
      this.dispatchEvent(new CcMultiSelectEvent(multipleValues));
    }
  }

  render() {
    const classes = {
      disabled: this.disabled,
      enabled: !this.disabled,
      'display-normal': !this.subtle,
      'display-subtle': this.subtle,
      'mode-single': this.multipleValues == null,
      'mode-multiple': this.multipleValues != null,
    };
    const type = this.multipleValues == null ? 'radio' : 'checkbox';

    /** @type {(value: string) => boolean} */
    const isChecked = (value) => {
      return this.multipleValues != null ? this.multipleValues.includes(value) : this.value === value;
    };

    const hasLegend = this.legend != null && this.legend.length > 0;

    return html`
      <div role="group" aria-labelledby=${ifDefined(hasLegend ? 'legend' : undefined)} class="group">
        ${hasLegend ? html`<div id="legend">${this.legend}</div>` : ''}
        <div class="toggle-group ${classMap(classes)}">
          ${repeat(
            this.choices,
            ({ value }) => value,
            ({ label, image, value }) => html`
              <!--
              If the name=null, the name of the native <input> will be 'toggle'. In order to navigate through a group of inputs using the arrow keys, each <input> must have the same name value.
            -->
              <input
                type=${type}
                name=${this.name ?? 'toggle'}
                .value=${value}
                id=${value}
                ?disabled=${this.disabled}
                .checked=${isChecked(value)}
                @change=${this._onChange}
                aria-label=${ifDefined(image != null && this.hideText ? label : undefined)}
              />
              <label for=${value} title=${ifDefined(image != null && this.hideText ? label : undefined)}>
                ${image != null ? html` <img src=${image} alt="" /> ` : ''}
                ${image == null || !this.hideText ? html` <span>${label}</span> ` : ''}
              </label>
            `,
          )}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */
        :host {
          --cc-toggle-color: var(--cc-color-bg-primary, #000);
          --cc-toggle-img-filter: none;
          --cc-toggle-img-filter-selected: none;
          --height: 2em;

          display: inline-flex;
        }

        .group {
          display: flex;
          flex-direction: column;
          row-gap: var(--cc-form-label-gap, 0.35em);
        }

        :host([inline]) .group {
          align-items: center;
          column-gap: var(--cc-form-label-gap, 1em);
          flex-direction: row;
        }

        #legend {
          color: var(--cc-toggle-legend-color, inherit);
          font-size: var(--cc-toggle-legend-font-size, inherit);
          font-weight: var(--cc-toggle-legend-font-weight, normal);
          line-height: 1.25em;
        }

        .toggle-group {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-sizing: border-box;
          display: flex;
          height: var(--height);
          line-height: 1.25;
          overflow: visible;
          width: max-content;
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
          /* used around the background */
          --space: 2px;
          --border-radius: var(--cc-toggle-border-radius, 0.15em);

          align-items: center;
          border-color: var(--cc-toggle-color);
          border-style: solid;
          color: var(--color-txt);
          cursor: pointer;
          display: grid;
          font-size: 0.85em;
          font-weight: var(--cc-toggle-font-weight, bold);
          gap: 0.6em;
          grid-auto-flow: column;
          padding: 0 0.6em;
          position: relative;
          text-transform: var(--cc-toggle-text-transform, uppercase);
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
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }

        label:last-of-type {
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
          border-right-width: 1px;
        }

        label:not(:first-of-type) {
          margin-left: calc(var(--space) * -1);
        }

        /* Used to display a background behind the text */

        label::before {
          background-color: var(--cc-color-bg);
          border-radius: var(--cc-border-radius-small, 0.15em);
          bottom: var(--space);
          content: '';
          display: block;
          left: var(--space);
          position: absolute;
          right: var(--space);
          top: var(--space);
          z-index: 0;
        }

        /* Used to display a bottom line in display subtle */

        .display-subtle label::after {
          background-color: var(--color-subtle-border);
          bottom: 0;
          content: '';
          display: block;
          height: var(--space);
          left: 0.25em;
          position: absolute;
          right: 0.25em;
          z-index: 0;
        }

        label span,
        label img {
          z-index: 0;
        }

        img {
          display: block;
          height: 1.45em;
          width: 1.45em;
        }

        /* NOT SELECTED */

        label {
          --cc-color-bg: var(--cc-color-bg-default, #fff);
          --color-txt: var(--cc-color-text-default);
        }

        img {
          filter: var(--cc-toggle-img-filter);
        }

        /* DISABLED */

        .toggle-group.disabled {
          opacity: var(--cc-opacity-when-disabled);
        }

        .disabled label {
          cursor: default;
        }

        /* HOVERED */

        .display-normal input:not(:checked):enabled:hover + label,
        .display-subtle input:enabled:hover + label {
          --cc-color-bg: var(--cc-color-bg-neutral-hovered);
        }

        /* FOCUS */

        .toggle-group.mode-single.enabled:not(:hover):focus-within,
        .toggle-group.mode-multiple.enabled:not(:hover) input:enabled:focus + label {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .toggle-group.mode-multiple.enabled:not(:hover) input:enabled:focus + label {
          z-index: 1;
        }

        /* ACTIVE */

        input:enabled:active + label::before {
          transform: scale(0.95);
        }

        /* SELECTED */

        input:checked + label img {
          filter: var(--cc-toggle-img-filter-selected);
        }

        .display-normal input:checked + label {
          --cc-color-bg: var(--cc-toggle-color);
          --color-txt: var(--cc-color-text-inverted, #fff);
        }

        .display-subtle input:checked + label {
          --color-txt: var(--cc-toggle-color);
          --color-subtle-border: var(--cc-toggle-color);
        }
      `,
    ];
  }
}

customElements.define('cc-toggle', CcToggle);
