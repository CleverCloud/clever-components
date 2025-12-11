import { css, html, LitElement } from 'lit';

/**
 * @import { PropertyValues } from 'lit'
 */

/**
 * A layout component used to switch visibility between several elements while preventing layout shifts.
 *
 * Use `visibleElementId` prop to provide the `id` value corresponding to the element you want to make visible.
 * Other elements are hidden with `visibility: hidden`.
 *
 * More information about the issues this component solves and the technique it uses can be found in [Hubert Sablonnière's blog Post - "Prevent layout shifts with CSS grid stacks"](https://www.hsablonniere.com/prevent-layout-shifts-with-css-grid-stacks--qcj5jo/).
 *
 * **Caution**:
 *
 * This component relies on a class named `cc-stretch--visible` applied to the relevant slotted element. Make sure you never override this class.
 *
 * @cssdisplay inline-grid
 *
 * @slot - The containers you want to switch between. The container you want to be displayed must have an `id` attribute matching the value of the `visibleElementId` prop.
 *
 * @cssprop {AlignItems} --cc-stretch-align-items - Specify how the items should be distributed / positioned vertically within the grid (Default: `center`. Possible values: https://developer.mozilla.org/en-US/docs/Web/CSS/align-items).
 * @cssprop {JustifyItems} --cc-stretch-justify-items - Specify how the items should be distributed / positioned horizontally within the grid (Default: `center`. Possible values: https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items).
 */

export class CcStretch extends LitElement {
  static get properties() {
    return {
      disableStretching: { type: Boolean, attribute: 'disable-stretching', reflect: true },
      visibleElementId: { type: String, attribute: 'visible-element-id', reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Disables stretching by setting hidden elements to `display: none`.
     * May be useful if you need stretching only under specific conditions (the size of the parent component for instance).
     */
    this.disableStretching = false;

    /** @type {string|null} Sets the slotted element(s) matching this `id` to `visibility: inherit`.
     * This makes the element visible unless one of its parents is set to `visibility: hidden` (in case you nest several `cc-stretch` for instance).
     */
    this.visibleElementId = null;
  }

  /*
   * Triggered when the `visibleElementId` value changes or the slot content changes.
   * Hides the currently visible element if there is one.
   * Makes the element matching `visibleElementId` visible.
   */
  _makeElementVisible() {
    // Since several `cc-stretch` may be nested, and we are working with light DOM, it is very important to only target the direct children with the `:scope >` selector
    const elementToHide = this.querySelector(':scope > .cc-stretch--visible');
    const elementToMakeVisible = this.querySelector(`:scope > #${this.visibleElementId}`);

    elementToHide?.classList.remove('cc-stretch--visible');
    elementToMakeVisible?.classList.add('cc-stretch--visible');
  }

  /** @param {PropertyValues<CcStretch>} changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('visibleElementId')) {
      this._makeElementVisible();
    }
  }

  render() {
    return html` <slot @slotchange=${this._makeElementVisible}></slot> `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          align-items: var(--cc-stretch-align-items, center);
          display: inline-grid;
          justify-items: var(--cc-stretch-justify-items, center);
          width: max-content;
        }

        :host([disable-stretching]) slot::slotted(:not(.cc-stretch--visible)) {
          display: none;
        }

        slot::slotted(*) {
          grid-area: 1 / 1 / 2 / 2;
          visibility: hidden;
        }

        /*
   * Very important: do not set to visible as this would break nested cc-stretch components.
   * In a parent with "visibility: hidden", a child with "visibility: visible" is visible.
   * With inherit, the visibility of the child depends on the visibility of the parents, which is what we want.
   */

        slot::slotted(.cc-stretch--visible) {
          visibility: inherit;
        }
      `,
    ];
  }
}

window.customElements.define('cc-stretch', CcStretch);
