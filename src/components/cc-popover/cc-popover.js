import '../cc-button/cc-button.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent, EventHandler } from '../../lib/events.js';

/**
 * @typedef {import('../cc-icon/cc-icon.types.js').IconModel} IconModel
 * @typedef {import('./cc-popover.types.js').PopoverPosition} PopoverPosition
 */

/**
 * A component displaying a floating content next to a button element.
 *
 * ## Details
 *
 * ### Button element
 *
 * The `button` is the element that will trigger the display of the floating content.
 * This element is a `cc-button`. The `cc-button:click` event will trigger the popover toggle.
 *
 * ### Popover content
 *
 * The `content` is the element that will be displayed next to the `button` element.
 * This element must be placed in the default slot.
 * It will be placed according to the `position` property.
 *
 * ## Accessibility
 *
 * The component places automatically aria attribute on the `button` element:
 *
 * * `aria-expanded`: set to `true` when popover is open, `false` when it is closed.
 *
 * When the popover is open, pressing `esc` will close the popover and focus the `button` element.
 *
 * ## Usage
 *
 * ```html
 * <cc-popover event="cc-button:click">
 *   <p slot="button-text">Click me</p>
 *   <div>
 *     This is a content to be displayed when button is clicked.
 *   </div>
 * </cc-popover>
 * ```
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-popover:open - Fires whenever the popover is opened.
 * @event {CustomEvent} cc-popover:close - Fires whenever the popover is closed.
 *
 * @slot - The area containing the content of the popover.
 * @slot button-text - The area containing the button text.
 *
 * @cssprop {Number} --cc-popover-z-index - Sets the z-index of the floating content (defaults: `999`).
 */
export class CcPopoverComponent extends LitElement {
  static get properties () {
    return {
      accessibleName: { type: String, attribute: 'accessible-name' },
      hideText: { type: Boolean, attribute: 'hide-text' },
      icon: { type: Object },
      isOpen: { type: Boolean, attribute: 'is-open', reflect: true },
      position: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets the accessibleName property of the underlying `cc-button` element. CAUTION: The accessible name should always start with the visible text if there is one. For instance "add to estimation - NodeJS XS" */
    this.accessibleName = null;

    /** @type {boolean} Whether the button text should be hidden. */
    this.hideText = false;

    /** @type {IconModel|null} Sets the button icon. */
    this.icon = null;

    /** @type {boolean} Whether the popover is opened */
    this.isOpen = false;

    /** @type {PopoverPosition} Sets the position of the popover relative to the `button` element. */
    this.position = 'bottom-left';

    /** @type {Ref<HTMLElement>} */
    this._contentRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._buttonRef = createRef();

    this._onOutsideClickHandler = new EventHandler(window, 'click', (event) => {
      const contentElement = this._contentRef.value;
      if (contentElement != null && !event.composedPath().includes(contentElement)) {
        this.close();
      }
    });
    this._onEscapeKeyHandler = new EventHandler(this, 'keydown', (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  /**
   * Opens the popover.
   */
  open () {
    if (!this.isOpen) {
      this.isOpen = true;
      dispatchCustomEvent(this, 'open');
    }
  }

  /**
   * Closes the popover.
   */
  close () {
    if (this.isOpen) {
      this.isOpen = false;
      this._buttonRef.value?.focus();
      dispatchCustomEvent(this, 'close');
    }
  }

  /**
   * Toggle the popover display.
   */
  toggle () {
    if (this.isOpen) {
      this.close();
    }
    else {
      this.open();
    }
  }

  updated (_changedProperties) {
    if (_changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this._onOutsideClickHandler.connect();
        this._onEscapeKeyHandler.connect();
      }
      else {
        this._onOutsideClickHandler.disconnect();
        this._onEscapeKeyHandler.disconnect();
      }
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this._onOutsideClickHandler.disconnect();
    this._onEscapeKeyHandler.disconnect();
  }

  render () {
    const _____tRef = this._buttonRef;
    const _____cRef = this._contentRef;

    return html`
      <cc-button
        ${ref(_____tRef)}
        aria-expanded=${this.isOpen ? 'true' : 'false'}
        @cc-button:click=${this.toggle}
        .accessibleName=${this.accessibleName}
        ?hide-text=${this.hideText} 
        .icon=${this.icon}
      >
        <slot name="button-text"></slot>
      </cc-button>

      ${this.isOpen ? html`
        <div class="content ${this.position.replace('-', ' ')}" ${ref(_____cRef)}>
          <slot></slot>
        </div>
      ` : null}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          position: relative;
          display: block;

          --gap: 0.4em;
        }
        
        .content {
          position: absolute;
          z-index: var(--cc-popover-z-index, 999);
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: 0.25em;
          box-shadow: 0 2px 4px rgb(38 38 38 / 25%),
            0 5px 15px rgb(38 38 38 / 25%);
        }

        .content.bottom {
          top: calc(100% + var(--gap));
        }
        
        .content.top {
          bottom: calc(100% + var(--gap));
        }

        .content.right {
          right: 0;
        }

        .content.left {
          left: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-popover', CcPopoverComponent);
