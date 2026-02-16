import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A tile component that can be used to display a range selection state.
 *
 * This component is specifically designed for cc-range-selector and is not meant to be used standalone.
 * It is a presentational component that displays visual states based on properties set by its parent.
 * All interactive behaviors (click handling, keyboard navigation, etc.) are managed by the parent cc-range-selector component.
 *
 * @cssdisplay inline-flex
 *
 * @slot - Content displayed as the main part of the tile. This slot should contain the option's label or visual content and should not be empty.
 */
export class CcRangeSelectorOption extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      dragging: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true },
      pointer: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      selected: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Whether the component should be disabled (default: 'false') */
    this.disabled = false;

    /** @type {boolean} Whether the option is within a drag selection range (default: 'false') */
    this.dragging = false;

    /** @type {boolean} Whether the component should be in error mode when not disabled nor readonly (default: 'false') */
    this.error = false;

    /** @type {boolean} Whether to show a pointer cursor for interactive states (default: 'false') */
    this.pointer = false;

    /** @type {boolean} Whether the component should be readonly when not disabled (default: 'false') */
    this.readonly = false;

    /** @type {boolean} Whether the option is currently selected when not dragging (default: 'false') */
    this.selected = false;
  }

  /**
   * Renders the option with appropriate visual states based on its properties.
   * Calculates CSS classes for disabled, readonly, error, dragging, selected, and pointer states.
   * @return {import('lit').TemplateResult}
   */
  render() {
    // Calculate CSS classes based on component state
    // State priority: disabled > readonly > error > dragging > selected
    // Note: dragging state takes visual priority over selected state during drag operations
    const classes = {
      disabled: this.disabled,
      readonly: !this.disabled && this.readonly,
      error: !this.disabled && !this.readonly && this.error,
      dragging: this.dragging,
      selected: !this.dragging && this.selected, // Selected styling is hidden during dragging
    };

    return html`
      <div class="wrapper ${classMap(classes)}">
        <slot></slot>
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
          overflow: hidden;
          width: fit-content;
        }

        .wrapper {
          align-items: stretch;
          display: flex;
          flex: 1 1 auto;
          line-height: 1.5;
        }
        /* endregion */

        /* region body section */
        ::slotted(*) {
          background-color: var(--cc-color-bg-default, #fff);
          border: 0.125em solid var(--cc-color-border-neutral, #bfbfbf);
          color: var(--cc-color-text-default, #262626);
          display: inline-block;
          flex: 1 1 auto;
          padding: 0.25em 0.5em;
        }
        /* endregion */

        /* region common states */
        .disabled ::slotted(*) {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border-color: var(--cc-color-bg-neutral, #f5f5f5);
          color: var(--cc-color-text-disabled, #595959);
        }

        .readonly ::slotted(*) {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
          border-color: var(--cc-color-bg-neutral-active, #d9d9d9);
        }

        .selected ::slotted(*) {
          background-color: var(--cc-color-bg-primary, #3569aa);
          border-color: var(--cc-color-bg-primary, #3569aa);
          color: var(--cc-color-text-inverted, #fff);
        }

        .dragging ::slotted(*) {
          background-color: var(--cc-color-bg-primary-weaker, #e6eff8);
          border-color: var(--cc-color-bg-primary, #3569aa);
          border-style: dotted;
          color: var(--cc-color-text-primary-strong, #002c9d);
          user-select: none;
        }

        .error ::slotted(*) {
          background-color: var(--cc-color-bg-danger-weaker, #ffe4e1);
          border-color: var(--cc-color-bg-danger-weaker, #ffe4e1);
          color: var(--cc-color-text-danger, #be242d);
        }
        /* endregion */

        /* region selected & disabled */
        .selected.disabled ::slotted(*) {
          background-color: var(--color-grey-60, #737373);
          border-color: var(--color-grey-60, #737373);
          color: var(--cc-color-text-inverted, #fff);
        }
        /* endregion */

        /* region selected & readonly */
        .selected.readonly ::slotted(*) {
          background-color: var(--cc-color-bg-primary-weak, #cedcff);
          border-color: var(--cc-color-bg-primary-weak, #cedcff);
          color: var(--cc-color-text-primary-strong, #002c9d);
        }
        /* endregion */

        /* region selected & error */
        .selected.error ::slotted(*) {
          background-color: var(--cc-color-bg-danger, #be242d);
          border-color: var(--cc-color-bg-danger, #be242d);
          color: var(--cc-color-text-inverted, #fff);
        }
        /* endregion */

        /* region dragging & error */
        .dragging.error ::slotted(*) {
          border-color: var(--cc-color-bg-danger, #be242d);
        }
        /* endregion */

        /* region hover */
        /* Hover state only applies when option is in its default interactive state
           (not disabled, readonly, error, selected, or dragging) */
        .wrapper:not(.selected, .dragging, .disabled, .readonly, .error) :hover::slotted(*) {
          border-color: var(--cc-color-border-neutral-hovered, #595959);
        }

        .wrapper.error:not(.selected, .dragging) :hover::slotted(*) {
          background-color: var(--cc-color-bg-danger-weak, #fbc8c2);
          border-color: var(--cc-color-bg-danger-weak, #fbc8c2);
        }
        /* endregion */

        /* region pointer */
        :host([pointer]) {
          cursor: pointer;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-range-selector-option', CcRangeSelectorOption);
