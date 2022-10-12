import { css, html, LitElement } from 'lit';

/**
 * A layout component used to switch visibility between several elements while preventing layout shifts.
 *
 * Use `visibleElementId` prop to provide the `id` value corresponding to the element you want to make visible.
 * Other elements are hidden with `visibility: hidden`.
 *
 * You may center the content with the `centerContentHorizontally` & `centerContentVertically` props.
 * You may conditionally disable the stretching with the `disableStretching` prop.
 *
 * More information about the issues this component solves and the technique it uses can be found in [Hubert Sablonnière's blog Post - "Prevent layout shifts with CSS grid stacks"](https://www.hsablonniere.com/prevent-layout-shifts-with-css-grid-stacks--qcj5jo/).
 *
 * @cssdisplay inline-grid
 *
 * @slot - The containers you want to switch between. The container you want to be displayed must have an `id` attribute matching the value of the `visibleElementId` prop.
 */

export class CcStretchToMaxContent extends LitElement {

  static get properties () {
    return {
      centerContentHorizontally: { type: Boolean, attribute: 'center-content-horizontally', reflect: true },
      centerContentVertically: { type: Boolean, attribute: 'center-content-vertically', reflect: true },
      disableStretching: { type: Boolean, attribute: 'disable-stretching', reflect: true },
      visibleElementId: { type: String, attribute: 'visible-element-id' },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Centers the content horizontally. */
    this.centerContentHorizontally = false;

    /** @type {boolean} Centers the content vertically. */
    this.centerContentVertically = false;

    /** @type {boolean} Disables stretching by setting hidden elements to `display: none;`. May be useful if you need stretching only under specific conditions (the size of the parent component for instance). */
    this.disableStretching = false;

    /** @type {string|null} Sets the slotted element(s) matching this `id` to `visibility: inherit;`. This makes the element visible unless one of its parents is set to `visibility: hidden;` (in case you nest several `cc-stretch-to-max-content` for instance. */
    this.visibleElementId = null;
  }

  /*
  * Triggered when the `visibleElementId` value changes or the slot content changes.
  * Hides the currently visible element if there is one.
  * Makes the element matching `visibleElementId` visible.
  */
  _makeElementVisible () {
    // Since several `cc-stretch-to-max-content` may be nested, and we are working with light DOM, it is very important to only target the direct children with the `:scope >` selector
    const elementToHide = this.querySelector(':scope > .cc-stretch-to-max-content--visible');
    const elementToMakeVisible = this.querySelector(`:scope > #${this.visibleElementId}`);

    elementToHide?.classList.remove('cc-stretch-to-max-content--visible');
    elementToMakeVisible?.classList.add('cc-stretch-to-max-content--visible');
  }

  update (changedProperties) {

    if (changedProperties.has('visibleElementId')) {
      this._makeElementVisible();
    }

    super.update(changedProperties);
  }

  render () {
    return html`
        <slot @slotchange=${this._makeElementVisible}></slot>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: inline-grid;
          justify-items: start;
          width: max-content;
        }
        
        :host([center-content-horizontally]) {
          justify-items: center;
        }

        :host([center-content-vertically]) {
          align-items: center;
        }

        :host([disable-stretching]) slot::slotted(:not(.cc-stretch-to-max-content--visible)) {
          display: none;
        }

        slot::slotted(*) {
          grid-area: 1 / 1 / 2 / 2;
          visibility: hidden;
        }

        slot::slotted(.cc-stretch-to-max-content--visible) {
          visibility: inherit;
        }
      `,
    ];
  }
}

window.customElements.define('cc-stretch-to-max-content', CcStretchToMaxContent);
