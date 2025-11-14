import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixCheckboxBlankCircleLine as iconOff,
  iconRemixRadioButtonLine as iconOn,
  iconRemixCheckboxCircleFill as iconSelected,
} from '../../assets/cc-remix.icons.js';
import '../cc-icon/cc-icon.js';

/**
 * @import { PickerOptionSelectionStyle } from './cc-picker-option.types.js'
 */

/**
 * A tile component that can be used to display a selectable state.
 *
 * Also has a disabled state and an error state, with the former having priority over the latter.
 *
 * @cssdisplay inline-flex
 *
 * @slot body - Content displayed as the main part of the tile: should never be empty.
 * @slot footer - Content displayed below the body: is optional.
 */
class CcPickerOption extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      selected: { type: Boolean, reflect: true },
      selectionStyle: { type: String, reflect: true, attribute: 'selection-style' },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Whether the component should be disabled (default: 'false') */
    this.disabled = false;

    /** @type {boolean} Whether the component should be in error mode when not disabled (default: 'false') */
    this.error = false;

    /** @type {boolean} Whether the component should be readonly when not disabled nor selected (default: 'false') */
    this.readonly = false;

    /** @type {boolean} Whether the component should be selected (default: 'false') */
    this.selected = false;

    /** @type {PickerOptionSelectionStyle} How the component selected state is rendered (default: 'check') */
    this.selectionStyle = 'check';
  }

  render() {
    const selected = this.selected;
    const disabled = this.disabled;
    const readonly = !this.disabled && !this.selected && this.readonly;
    const error = !this.disabled && this.error;

    return html`
      <div class="wrapper ${classMap({ selected, disabled, readonly, error })}">
        <div class="body">
          ${this.selectionStyle === 'radio'
            ? html`<div class="icon-selection-style icon-selection-style--radio">
                <cc-icon .icon="${this.selected ? iconOn : iconOff}" size="lg"></cc-icon>
              </div>`
            : ''}
          <slot name="body"></slot>
          ${this.selectionStyle === 'check'
            ? html`<div class="icon-selection-style icon-selection-style--check">
                <cc-icon .icon="${iconSelected}" size="lg"></cc-icon>
              </div>`
            : ''}
        </div>
        <slot name="footer"></slot>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* region global */
        :host {
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: inline-flex;
        }

        .wrapper {
          border: 2px solid var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          line-height: 1.5;
          overflow: hidden;
          /* this rule is needed for when this component is inside of a grid in order to take full width */
          width: 100%;
        }

        .wrapper .body {
          flex: 1 1 auto;
        }

        .wrapper ::slotted([slot='footer']) {
          flex: 0 0 auto;
        }
        /* endregion */

        /* region body section */
        ::slotted([slot='body']) {
          padding: 1em 1.25em;
        }

        .body {
          display: inline-flex;
        }

        .body ::slotted([slot='body']) {
          flex: 1 1 auto;
        }

        .body .icon-selection-style {
          flex: 0 0 auto;
        }
        /* endregion */

        /* region footer section */
        ::slotted([slot='footer']) {
          background-color: var(--cc-color-bg-neutral-alt, #e7e7e7);
          font-size: 0.875em;
          padding: 0.5em 1.25em;
        }
        /* endregion */

        /* region icon */
        .icon-selection-style--check {
          --cc-icon-color: var(--cc-color-bg-primary, #3569aa);

          align-self: start;
          padding: 0.5em;
        }

        .icon-selection-style--radio {
          --cc-icon-color: var(--cc-color-text-weak, #404040);

          /* if text is multiline, allows the icon staying centered with the first line */
          align-items: center;
          display: flex;
          height: 1lh;
          justify-content: center;
          padding-block: 1em;
          padding-inline-start: 1em;
        }
        /* endregion */

        /* region selection style radio */
        :host([selection-style='radio']) ::slotted([slot='body']) {
          padding-inline-start: 0.5em;
        }
        /* endregion */

        /* region selection style check */
        :host([selection-style='check']) ::slotted([slot='body']) {
          padding-inline-end: 0;
        }
        /* endregion */

        /* region is selected */
        .selected {
          border-color: var(--cc-color-border-primary, #3569aa);
          color: var(--cc-color-text-primary-strongest, #012a51);
        }

        .selected ::slotted([slot='footer']) {
          background-color: var(--cc-color-bg-primary-weak, #cedcff);
        }

        .selected .icon-selection-style--radio {
          --cc-icon-color: var(--cc-color-bg-primary, #3569aa);
        }

        .wrapper:not(.selected) .icon-selection-style--check {
          visibility: hidden;
        }
        /* endregion */

        /* region is disabled */
        .disabled {
          border-color: var(--cc-color-border-neutral-disabled, #e7e7e7);
          color: var(--cc-color-text-disabled, #595959);
        }

        .disabled .body {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
        }

        .disabled ::slotted([slot='footer']) {
          background-color: var(--cc-color-bg-neutral-alt, #e7e7e7);
          color: var(--color-grey-80, #404040);
        }

        .disabled:not(.selected) .icon-selection-style--radio {
          --cc-icon-color: var(--cc-color-border-neutral, #bfbfbf);
        }

        .disabled .icon-selection-style {
          --cc-icon-color: var(--cc-color-text-disabled, #595959);

          opacity: var(--cc-opacity-when-disabled, 0.65);
        }
        /* endregion */

        /* region is readonly */
        .readonly .body {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
        }

        .readonly ::slotted([slot='footer']) {
          background-color: var(--cc-color-bg-neutral-alt, #e7e7e7);
        }

        .readonly .icon-selection-style--radio {
          --cc-icon-color: var(--cc-color-border-neutral, #bfbfbf);
        }
        /* endregion */

        /* region is error */
        .error {
          border-color: var(--cc-color-border-danger-weaker, #facbc9);
          color: var(--cc-color-text-danger, #be242d);
        }

        .error ::slotted([slot='footer']) {
          background-color: var(--cc-color-bg-danger-weaker, #ffe4e1);
        }
        /* endregion */

        /* region is selected & error */
        .selected.error {
          border-color: var(--cc-color-border-danger, #be242d);
        }

        .error .icon-selection-style {
          --cc-icon-color: var(--cc-color-text-danger, #be242d);
        }
        /* endregion */

        /* region hover */
        .wrapper:hover:not(.disabled, .readonly, .error) {
          border-color: var(--cc-color-border-neutral-hovered, #595959);
        }

        .wrapper.selected:hover:not(.disabled, .error) {
          border-color: var(--cc-color-border-primary-hovered, #595959);
        }

        .wrapper.error:hover:not(.disabled, .selected) {
          border-color: var(--cc-color-border-danger-weak, var(--color-red-70));
        }
        /* endregion */

        /* region misc */
        .wrapper:not(.selected, .readonly, .disabled) {
          cursor: pointer;
        }
        /* endregion */
      `,
    ];
  }
}

customElements.define('cc-picker-option', CcPickerOption);
