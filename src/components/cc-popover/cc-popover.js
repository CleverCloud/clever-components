import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { EventHandler } from '../../lib/events.js';
import '../cc-button/cc-button.js';
import { CcToggleEvent } from '../common.events.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('./cc-popover.types.js').PopoverPosition} PopoverPosition
 * @typedef {import('../cc-button/cc-button.js').CcButton} CcButton
 * @typedef {import('lit/directives/ref.js').Ref<CcButton>} RefCcButton
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDivElement>} RefDiv
 * @typedef {import('lit').PropertyValues<CcPopover>} CcPopoverPropertyValues
 */

/**
 * A component displaying a floating content next to a button element.
 *
 * ## Details
 *
 * ### Button element
 *
 * The `button` is the element that will trigger the display of the floating content.
 * This element is a `<cc-button>`. The `cc-click` event will trigger the popover toggle.
 *
 * ### Popover content
 *
 * The `content` is the element that will be displayed next to the `button` element.
 * This element must be placed in the default slot.
 * It will be placed according to the `position` property.
 *
 * ## Accessibility
 *
 * The component places necessary aria attribute on the `button` element:
 *
 * * `aria-expanded`: set to `true` when popover is open, `false` when it is closed.
 *
 * When the popover is open, pressing `esc` will close the popover and focus the `button` element.
 *
 * ## Usage
 *
 * ```html
 * <cc-popover>
 *   <span slot="button-content">Click me</span>
 *   <div>This is a content to be displayed when button is clicked.</div>
 * </cc-popover>
 * ```
 *
 * @cssdisplay block
 *
 * @slot - The area containing the content of the popover.
 * @slot button-content - The area containing the button content.
 *
 * @cssprop {Size} --cc-popover-gap - Sets the gap between the button and the floating area (default 0.4em).
 * @cssprop {Size} --cc-popover-padding - Sets the padding of the floating area (default 0.5em).
 * @cssprop {Number} --cc-popover-z-index - Sets the z-index of the floating content (defaults: `999`).
 * @cssprop {Width} --cc-popover-trigger-button-width - Sets the width of the trigger button (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-popover-trigger-button-font-weight - Sets the font-weight CSS property of the trigger button (defaults: `bold`).
 * @cssprop {TextTransform} --cc-popover-trigger-button-text-transform - Sets the text-transform CSS property of the trigger button (defaults: `uppercase`).
 */
export class CcPopover extends LitElement {
  static get properties() {
    return {
      a11yName: { type: String, attribute: 'a11y-name' },
      disabled: { type: Boolean, reflect: true },
      hideText: { type: Boolean, attribute: 'hide-text' },
      icon: { type: Object },
      isOpen: { type: Boolean, attribute: 'is-open', reflect: true },
      position: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Sets the a11yName property of the underlying `cc-button` element. CAUTION: The accessible name should always start with the visible text if there is one. */
    this.a11yName = null;

    /** @type {boolean} Sets `disabled` attribute on the underlying `cc-button` element. */
    this.disabled = false;

    /** @type {boolean} Whether the button text should be hidden. */
    this.hideText = false;

    /** @type {IconModel|null} Sets the button icon. */
    this.icon = null;

    /** @type {boolean} Whether the popover is opened */
    this.isOpen = false;

    /** @type {PopoverPosition} Sets the position of the popover relative to the `button` element. */
    this.position = 'bottom-left';

    /** @type {RefDiv} */
    this._contentRef = createRef();

    /** @type {RefCcButton} */
    this._buttonRef = createRef();

    this._onOutsideClickHandler = new EventHandler(window, 'click', (event) => {
      const contentElement = this._contentRef.value;
      if (contentElement != null && !event.composedPath().includes(contentElement)) {
        this.close();
      }
    });

    this._onEscapeKeyHandler = new EventHandler(
      this,
      'keydown',
      /** @param {KeyboardEvent} event */
      (event) => {
        if (event.key === 'Escape') {
          this.close();
        }
      },
    );

    // Opening a popover must close the last opened popover.
    /** @type {CcPopover} */
    let lastOpenedPopover = null;
    this._onCcPopoverOpenHandler = new EventHandler(
      window,
      'cc-toggle',
      /** @param {CcToggleEvent} event */ (event) => {
        const { isOpen } = event.detail;

        if (isOpen) {
          // We cannot use event.target because of events retargeting when bubbling through shadow DOM.
          const popover = event.composedPath()[0];

          if (popover !== this && popover instanceof CcPopover) {
            lastOpenedPopover = popover;
          } else {
            lastOpenedPopover?.close(false);
            lastOpenedPopover = null;
          }
        }
      },
    );
  }

  // region Public methods

  /**
   * Opens the popover.
   */
  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.dispatchEvent(new CcToggleEvent({ isOpen: true }));
    }
  }

  /**
   * Closes the popover.
   * @param {boolean} [shouldFocus = true] Whereas the button should be focused. This applies only if the popover was opened.
   */
  close(shouldFocus = true) {
    if (this.isOpen) {
      this.isOpen = false;
      if (shouldFocus) {
        this.focus();
      }
      this.dispatchEvent(new CcToggleEvent({ isOpen: false }));
    }
  }

  /**
   * Toggle the popover display.
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Moves the focus on the button.
   */
  focus() {
    this._buttonRef.value?.focus();
  }

  // endregion

  // region Lit lifecycle

  /** @param {CcPopoverPropertyValues} changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this._onOutsideClickHandler.connect();
        this._onEscapeKeyHandler.connect();
      } else {
        this._onOutsideClickHandler.disconnect();
        this._onEscapeKeyHandler.disconnect();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._onCcPopoverOpenHandler.connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._onOutsideClickHandler.disconnect();
    this._onEscapeKeyHandler.disconnect();
    this._onCcPopoverOpenHandler.disconnect();
  }

  // endregion

  render() {
    return html`
      <div class="wrapper">
        <cc-button
          ${ref(this._buttonRef)}
          class="trigger-button"
          .a11yExpanded=${this.isOpen}
          .a11yName=${this.a11yName}
          ?hide-text=${this.hideText}
          ?disabled=${this.disabled}
          .icon=${this.icon}
          @cc-click=${this.toggle}
        >
          <slot name="button-content"></slot>
        </cc-button>

        ${this.isOpen && !this.disabled
          ? html`
              <div class="content ${this.position.replace('-', ' ')}" ${ref(this._contentRef)}>
                <slot></slot>
              </div>
            `
          : null}
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;

          --cc-popover-gap: 0.4em;
        }

        .wrapper {
          position: relative;
        }

        .trigger-button {
          --cc-button-font-weight: var(--cc-popover-trigger-button-font-weight);
          --cc-button-text-transform: var(--cc-popover-trigger-button-text-transform);

          width: var(--cc-popover-trigger-button-width, inherit);
        }

        .content {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow:
            0 2px 4px rgb(38 38 38 / 25%),
            0 5px 15px rgb(38 38 38 / 25%);
          overflow: clip;
          overflow-clip-margin: 3px;
          padding: var(--cc-popover-padding, 0.5em);
          position: absolute;
          z-index: var(--cc-popover-z-index, 999);
        }

        .content.bottom {
          top: calc(100% + var(--cc-popover-gap));
        }

        .content.top {
          bottom: calc(100% + var(--cc-popover-gap));
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

window.customElements.define('cc-popover', CcPopover);
