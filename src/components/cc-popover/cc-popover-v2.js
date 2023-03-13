import '../cc-expand/cc-expand.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../lib/events.js';

// todo: move this to some utility class
/**
 * This a utility handler that will help adding and removing an event listener from a DOM Element.
 *
 * @param {Window | Document | HTMLElement} element The element where to attach the event listener.
 * @param {string} event The event to listen.
 * @param {(event: Event) => void} listener The function to execute when event occurs.
 * @return {{disconnect(): void, connect(): void}}
 */
function getEventHandler (element, event, listener) {
  return {
    /**
     * Adds the event listener
     */
    connect () {
      element.addEventListener(event, listener);
      this.connected = true;
    },
    /**
     * Removes the event listener
     */
    disconnect () {
      if (this.connected) {
        element.removeEventListener(event, listener);
      }
    },
  };
}

/**
 * @typedef {import('./cc-popover.types.js').PopoverPosition} PopoverPosition
 */

/**
 * A component displaying a floating content next to a target element.
 *
 * ## Details
 *
 * ### Target element
 *
 * The `target` is the element that will trigger the display of the floating content.
 * This element must be placed into the `target` slot.
 *
 * ### Popover content
 *
 * The `content` is the element that will be displayed next to the `target` element.
 * This element must be placed in the default slot.
 * It will be placed according to the `position` property.
 *
 * ## Accessibility
 *
 * The component places automatically some aria attribute on the `target` element:
 *
 * * `aria-haspopup=true`
 * * `aria-expanded`: set to `true` when popover is open, `false` when it is closed.
 *
 * When the popover is open, pressing `esc` will close the popover and focus the `target` element.
 * It is preferable that the `target` element provided in the `target` slot is focusable.
 *
 * ### Guidelines
 *
 * You are very encouraged to place a `<button>` (or a component that wraps a `<button>`) in the `target` slot.
 *
 * ## Usage
 *
 * ```html
 * <cc-popover>
 *   <cc-button slot="target">Open</cc-button>
 *   <div>
 *     This is a content to be displayed when target button is clicked.
 *   </div>
 * </cc-popover>
 * ```
 *
 * @event {CustomEvent} cc-popover:open - Fires whenever the popover is opened.
 * @event {CustomEvent} cc-popover:close - Fires whenever the popover is closed.
 *
 * @slot - The area containing the content of the popover.
 * @slot target - The area containing the element that will trigger the popover display.
 *
 * @cssdisplay block
 */
export class CcPopoverV2Component extends LitElement {
  static get properties () {
    return {
      isOpen: { type: Boolean, attribute: 'is-open' },
      position: { type: String },
      _target: { type: Object, state: true },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Whether the popover is opened */
    this.isOpen = false;
    /** @type {PopoverPosition} */
    this.position = 'bottom-left';

    /** @type {HTMLElement|null} */
    this._target = null;
    /** @type {Ref<HTMLElement>} */
    this._contentRef = createRef();
    /** @type {Ref<HTMLSlotElement>} */
    this._targetSlotRef = createRef();

    this._onOutsideClickHandler = getEventHandler(window, 'click', (event) => {
      const optionsElement = this._contentRef.value;
      if (optionsElement != null && !event.composedPath().includes(optionsElement)) {
        this.close();
      }
    });
  }

  /**
   * Lookup inside the `target` slot and return the first element found in it.
   *
   * @return {HTMLElement|null} The target element
   */
  _findTarget () {
    const slot = this._targetSlotRef.value;
    if (slot == null) {
      return null;
    }

    const elements = slot.assignedElements();

    if (elements.length === 0) {
      console.warn('No target element found in the target slot.');
      return null;
    }
    if (elements.length > 1) {
      console.warn('Multiple elements in target slot. Only the first one will trigger popover display.');
    }

    return elements[0];
  }

  _onTargetSlotChanged () {
    this._target = this._findTarget();
  }

  _onContentKeyDown (event) {
    if (this.isOpen && event.key === 'Escape') {
      this.close();
      this._target?.focus();
    }
  }

  /**
   * Opens the popover.
   */
  open () {
    this.isOpen = true;
    dispatchCustomEvent(this, 'open');
  }

  /**
   * Closes the popover.
   */
  close () {
    this.isOpen = false;
    dispatchCustomEvent(this, 'close');
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
      }
      else {
        this._onOutsideClickHandler.disconnect();
      }

      if (this._target) {
        this._target.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
      }
    }

    if (_changedProperties.has('_target')) {
      if (this._target != null) {
        this._target.setAttribute('aria-haspopup', 'true');
        this._target.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
      }
    }
  }

  connectedCallback () {
    this._toggleHandler = getEventHandler(this, 'cc-popover:toggle', () => {
      this.toggle();
    });
    this._toggleHandler.connect();

    super.connectedCallback();
  }

  disconnectedCallback () {
    this._toggleHandler?.disconnect();

    super.disconnectedCallback();
  }

  render () {
    const _____tRef = this._targetSlotRef;
    const _____cRef = this._contentRef;

    return html`
      <slot name="target" @slotchange="${this._onTargetSlotChanged}" ${ref(_____tRef)}></slot>
      <cc-expand>
        ${this.isOpen ? html`
          <div class="content ${this.position.replace('-', ' ')}" @keydown=${this._onContentKeyDown} ${ref(_____cRef)}>
            <slot></slot>
          </div>
        ` : null}
      </cc-expand>
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
          z-index: 999;
          padding: 0.5em;
          border: 1px solid #bcc2d1;
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

window.customElements.define('cc-popover-v2', CcPopoverV2Component);
