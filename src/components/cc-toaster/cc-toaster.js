import { animate, fadeIn, fadeOut, none } from '@lit-labs/motion';
import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../cc-toast/cc-toast.js';

const slideFromTop = [{ transform: 'translateY(-100%)' }];
const slideFromBottom = [{ transform: 'translateY(100%)' }];
const slideToLeft = [{ transform: 'translateX(-100%)' }];
const slideToRight = [{ transform: 'translateX(100%)' }];
const fadeAnimation = {
  in: fadeIn,
  out: fadeOut,
};
const slideAnimationSpecs = {
  top: {
    in: slideFromTop,
    out: none,
  },
  'top-left': {
    in: slideFromTop,
    out: slideToLeft,
  },
  'top-right': {
    in: slideFromTop,
    out: slideToRight,
  },
  bottom: {
    in: slideFromBottom,
    out: none,
  },
  'bottom-left': {
    in: slideFromBottom,
    out: slideToLeft,
  },
  'bottom-right': {
    in: slideFromBottom,
    out: slideToRight,
  },
};

/** @param {typeof slideAnimationSpecs[keyof typeof slideAnimationSpecs]} spec */
const withFade = (spec) => {
  return {
    in: [{ ...spec.in[0], opacity: 0 }],
    out: [{ ...spec.out[0], opacity: 0 }],
  };
};

/**
 * @import { Toast, ToastPosition, ToastAnimation, ToastOptions, Notification } from './cc-toaster.types.js'
 */

/**
 * This component is a container for displaying `cc-toast`s.
 *
 * It contains a public method for showing a `cc-toast`. It listens to `cc-toast:dismiss` event which is fired by the `cc-toast` component, and reacts by hiding `cc-toast`.
 *
 * ## Details
 *
 * ### About placement
 *
 * You can place this component where you want in your application, but you'll need to set the `position` property accordingly.
 * This property doesn't control the position of the toasts on your application, it gives an indication of where it is so that it can display the toasts properly:
 *
 * * the `slide` animation: sliding up when toaster is placed at the bottom, sliding down when toaster is placed at the top.
 * * the toasts order: toasts are ordered up-bottom when toaster is placed at the top, but bottom-up when toaster is placed at the bottom.
 * * the toasts' horizontal alignment: toasts are aligned left when toaster is placed on the left, aligned center when centered and aligned right when placed on the right.
 *
 * ### Controlling maximum number of toasts
 *
 * The `maxToasts` property gives the control on how many toasts can be displayed at a time. If this maximum is reached, the oldest toast is dismissed.
 *
 * Setting this property to 0 will prevent any toast to be displayed.
 *
 * ### Giving default properties to toasts
 *
 * The `toastDefaultOptions` allows to set up some default options to every toast instead of giving them each time you want to show a toast.
 * You can still override those defaults for a specific toast.
 *
 * ### About accessibility
 *
 * * The component respects the `prefers-reduced-motion` flag and disable all animations if it is activated.
 * * The component uses `aria-live="polite"` and `aria-atomic="true"` attributes for the best cross-platform screen reader support.
 *
 * ## Technical details
 *
 * ### Showing toast
 *
 * Showing a toast is done using the `show` public method.
 *
 * ```javascript
 * const toast = {
 *   message: 'This is a notification message',
 *   intent: 'success',
 * }
 * document.querySelector('cc-toaster').show(toast);
 * ```
 *
 * ### Dismissing toast
 *
 * Toasts are dismissed automatically after the timeout expiration (the cc-toast which is responsible for handling the timeout fires a `cc-toast:dismiss` event to do that).
 * The `cc-toaster` listens to these events and reacts by removing the corresponding `cc-toast` element from the DOM.
 *
 * You can also dismiss a toast programmatically: The `show` method returns a function that when called will dismiss the toast.
 *
 * ```javascript
 * const toast = {
 *   message: 'This is a notification message',
 *   intent: 'success',
 * }
 * const dismissToast = document.querySelector('cc-toaster').show(toast);
 *
 * // ...
 *
 * dismissToast();
 * ```
 *
 * #### Internal implementation of the toast dismiss
 *
 * Internally, we do not remove the `cc-toast` node from the DOM directly after receiving the `cc-toast:dismiss` event.
 * Instead, we trigger a CSS animation and listen to the `animationend` event so that we can remove the `cc-toast`
 * element from the DOM after the animation has finished.
 *
 * @cssdisplay block
 */
export class CcToaster extends LitElement {
  static get properties() {
    return {
      animation: { type: String },
      maxToasts: { type: Number, attribute: 'max-toasts' },
      position: { type: String },
      toastDefaultOptions: { type: Object, attribute: 'toast-default-options' },
      _toasts: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {ToastAnimation} Animation to be played when a toast appears.*/
    this.animation = 'fade';

    /** @type {number|null} The maximum number of toasts that can be displayed at the same time. null for no limit.*/
    this.maxToasts = null;

    /** @type {ToastPosition} Indicates where the toaster is placed. This property controls only how the toasts will be displayed (not where).*/
    this.position = 'top-right';

    /** @type {ToastOptions|null} The default options to apply to toasts. Changing this property takes effect on new toasts only. If left to null, some default options will be used as fallback. */
    this.toastDefaultOptions = null;

    /** @type {Array<Toast>} Internal array of toasts currently displayed */
    this._toasts = [];

    this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  /**
   * Shows the given notification as a new toast.
   *
   * If the maxToasts is reached, the oldest toast will be dismissed automatically.
   * If the maxToasts is 0, nothing happens.
   *
   * @param {Notification} notification the notification to show
   * @returns {function()|void} the function that can be used to dismiss the toast or `undefined` if no toast was shown.
   */
  show(notification) {
    if (this.maxToasts === 0) {
      return;
    }

    // dismiss last toast if max is reached
    if (this.maxToasts != null && !Number.isNaN(this.maxToasts)) {
      const activeToasts = this._toasts.filter((toast) => !toast.dismissing);

      if (activeToasts.length >= this.maxToasts) {
        const lastToast = activeToasts[activeToasts.length - 1];
        this._dismiss(lastToast);
      }
    }

    const toast = this._createToast(notification);

    this._toasts = [toast, ...this._toasts];

    return () => {
      this._dismiss(toast);
    };
  }

  /* region PRIVATE METHODS */
  /**
   * Based on the given notification, forges a new toast identified with a unique random key and where the default options are applied.
   *
   * @param {Notification} notification
   * @returns {Toast}
   * @private
   */
  _createToast(notification) {
    return {
      ...notification,
      key: Math.random().toString(36).slice(2),
      options: {
        // Same defaults as cc-toast
        closeable: false,
        showProgress: false,
        timeout: 5000,
        ...this.toastDefaultOptions,
        ...notification.options,
      },
    };
  }

  /** @param {Toast} toastToDismiss */
  _dismiss(toastToDismiss) {
    this._toasts = this._toasts.filter((toast) => toast !== toastToDismiss);
  }

  _getInOutAnimations() {
    switch (this.animation) {
      case 'fade':
        return fadeAnimation;
      case 'slide':
        return slideAnimationSpecs[this.position];
      case 'fade-and-slide':
        return withFade(slideAnimationSpecs[this.position]);
    }
  }

  _getAnimationDirective() {
    const keyframeOptions = {
      duration: 400,
      easing: 'ease',
    };

    if (this._mediaQuery != null && this._mediaQuery.matches) {
      return null;
    } else {
      return animate({
        keyframeOptions,
        ...this._getInOutAnimations(),
      });
    }
  }
  /* endregion */

  render() {
    const positionsClasses = this.position.split('-').join(' ');

    return html`
      <div class="toaster ${positionsClasses}" aria-live="polite" aria-atomic="true">
        ${repeat(
          this._toasts,
          (toast) => toast.key,
          (toast) => this._renderToast(toast),
        )}
      </div>
    `;
  }

  /**
   * @param {Toast} toast
   */
  _renderToast(toast) {
    return html`
      <cc-toast
        intent="${toast.intent}"
        .heading=${toast.title}
        .message=${toast.message}
        .timeout=${toast.options.timeout}
        ?closeable=${toast.options.closeable}
        ?show-progress=${toast.options.showProgress}
        ${this._getAnimationDirective()}
        @cc-toast-dismiss=${() => this._dismiss(toast)}
      ></cc-toast>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .toaster {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 1em;
          pointer-events: none;
        }

        /* region POSITION */

        .toaster.left {
          align-items: start;
        }

        .toaster.right {
          align-items: end;
        }

        .toaster.bottom {
          flex-direction: column-reverse;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-toaster', CcToaster);
