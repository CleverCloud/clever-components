import '../cc-expand/cc-expand.js';
import '../cc-button/cc-button.js';
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
 * ## Usage
 *
 * ```html
 * <cc-popover>
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
 *
 * @cssdisplay block
 */
export class CcPopoverV3Component extends LitElement {
  static get properties () {
    return {
      accessibleName: { type: String, attribute: 'accessible-name' },
      circle: { type: Boolean },
      danger: { type: Boolean },
      delay: { type: Number },
      disabled: { type: Boolean, reflect: true },
      hideText: { type: Boolean, attribute: 'hide-text' },
      icon: { type: Object },
      image: { type: String },
      link: { type: Boolean, reflect: true },
      outlined: { type: Boolean },
      primary: { type: Boolean },
      skeleton: { type: Boolean },
      success: { type: Boolean },
      waiting: { type: Boolean, reflect: true },
      warning: { type: Boolean },

      isOpen: { type: Boolean, attribute: 'is-open' },
      position: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Forces the values of the `aria-label` and `title` attributes on the `button` element. CAUTION: The accessible name should always start with the visible text if there is one. For instance "add to estimation - NodeJS XS" */
    this.accessibleName = null;

    /** @type {boolean} Sets button UI to a circle form when in `hide-text` and `image` mode. */
    this.circle = false;

    /** @type {boolean} Sets button UI _mode_ to danger. */
    this.danger = false;

    /** @type {number|null} If set, enables delay mechanism and defined the number of seconds before the `cc-button:click` event is actually fired. */
    this.delay = null;

    /** @type {boolean} Sets `disabled` attribute on inner native `<button>` element. */
    this.disabled = false;

    /** @type {boolean} If set, the button will look like a link. */
    this.link = false;

    /** @type {boolean} Hides the text and only displays the image specified with `image`. The slotted text will be added as `title` and `aria-label` on the inner `<button>`. */
    this.hideText = false;

    /** @type {IconModel|null} If set, enables icon mode and displays the required icon in the <cc-icon> component. */
    this.icon = null;

    /** @type {string|null} If set, enables icon mode and sets the `src` of the inner native `<img>` element. */
    this.image = null;

    /** @type {boolean} Sets button UI as _outlined_ (no background and colored border). */
    this.outlined = false;

    /** @type {boolean} Sets button UI _mode_ to primary. */
    this.primary = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {boolean} Sets button UI _mode_ to success. */
    this.success = false;

    /** @type {boolean} If set, shows a waiting/busy indicator and sets `disabled` attribute on inner native `<button>` element. */
    this.waiting = false;

    /** @type {boolean} Sets button UI _mode_ to warning. */
    this.warning = false;

    /** @type {boolean} Whether the popover is opened */
    this.isOpen = false;
    /** @type {PopoverPosition} */
    this.position = 'bottom-left';

    /** @type {Ref<HTMLElement>} */
    this._contentRef = createRef();
    /** @type {Ref<CcButton>} */
    this._targetButtonRef = createRef();

    this._onOutsideClickHandler = getEventHandler(window, 'click', (event) => {
      const optionsElement = this._contentRef.value;
      if (optionsElement != null && !event.composedPath().includes(optionsElement)) {
        this.close();
      }
    });
  }

  _onContentKeyDown (event) {
    if (this.isOpen && event.key === 'Escape') {
      this.close();
      this._targetButtonRef.value?.focus();
    }
  }

  _onTargetButtonClick () {
    this.toggle();
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
    }
  }

  render () {
    const _____tRef = this._targetButtonRef;
    const _____cRef = this._contentRef;

    return html`
      <cc-button
        .accessibleName=${this.accessibleName}
        .circle=${this.circle}
        .danger=${this.danger}
        .delay=${this.delay}
        .disabled=${this.disabled}
        .hideText=${this.hideText}
        .icon=${this.icon}
        .image=${this.image}
        .link=${this.link}
        .outlined=${this.outlined}
        .primary=${this.primary}
        .skeleton=${this.skeleton}
        .success=${this.success}
        .waiting=${this.waiting}
        .warning=${this.warning}
        
        @cc-button:click=${this._onTargetButtonClick}
        
        aria-haspopup="true"
        aria-expanded=${this.isOpen ? 'true' : 'false'}
        
        ${ref(_____tRef)}
      >
        <slot name="target"></slot>
      </cc-button>
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

window.customElements.define('cc-popover-v3', CcPopoverV3Component);
