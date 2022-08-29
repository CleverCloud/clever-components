import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import '../cc-toast/cc-toast.js';

/**
 * @typedef {import('./cc-toaster.types.js').ToastPosition} ToastPosition
 * @typedef {import('./cc-toaster.types.js').ToastAnimation} ToastAnimation
 * @typedef {import('./cc-toaster.types.js').Notification} Notification
 * @typedef {import('./cc-toaster.types.js').ToastOptions} ToastOptions
 * @typedef {import('./cc-toaster.types.js').Toast} Toast
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
 *
 * @event {CustomEvent<ToastDismissEventDetail>} cc-toast:dismiss - Fires whenever a toast is dismissed.
 */
export class CcToaster extends LitElement {

  static get properties () {
    return {
      animation: { type: String },
      maxToasts: { type: Number, attribute: 'max-toasts' },
      position: { type: String },
      toastDefaultOptions: { type: Object, attribute: 'toast-default-options' },
      _toasts: { type: Array, state: true },
    };
  }

  constructor () {
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
  }

  /**
   * Shows the given notification as a new toast.
   *
   * If the maxToasts is reached, the oldest toast will be dismissed automatically.
   * If the maxToasts is 0, nothing happens.
   *
   * @param {Notification} notification the notification to show
   * @returns {function()|undefined} the function that can be used to dismiss the toast or `undefined` if no toast was shown.
   */
  show (notification) {
    if (this.maxToasts === 0) {
      return;
    }

    // dismiss last toast if max is reached
    if (this.maxToasts != null && !Number.isNaN(this.maxToasts)) {
      const activeToasts = this._toasts.filter((toast) => !toast.dismissing);

      if (activeToasts.length >= this.maxToasts) {
        const lastToast = activeToasts[activeToasts.length - 1];
        this._startDismissing(lastToast);
      }
    }

    const toast = this._createToast(notification);

    this._toasts = [toast, ...this._toasts];

    return () => {
      this._startDismissing(toast);
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
  _createToast (notification) {
    return {
      ...notification,
      key: Math.random().toString(36).slice(2),
      dismissing: false,
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

  _startDismissing (toastToDismiss) {
    toastToDismiss.dismissing = true;
    this.requestUpdate();
  }

  // TODO: in the future (when we have Lit2) we may want to implement that with https://github.com/lit/lit/tree/main/packages/labs/motion
  _finishDismissing (toastToRemove) {
    this._toasts = this._toasts.filter((toast) => (toast !== toastToRemove));
  }

  /* endregion */

  render () {
    const positions = this.position.split('-');
    if (positions.length === 1) {
      positions.push('center');
    }
    return html`
      <div class="toaster ${positions.join(' ')} ${this.animation}" aria-live="polite" aria-atomic="true">
        ${repeat(this._toasts, (toast) => toast.key, (toast) => this._renderToast(toast))}
      </div>
    `;
  }

  /**
   * @param {Toast} toast
   */
  _renderToast (toast) {
    const dismissing = toast.dismissing;

    // We're only interested in the "dismiss" animation (not the "show" animation)
    const onAnimationEnd = dismissing
      ? () => this._finishDismissing(toast)
      : () => null;

    return html`
      <cc-toast
        class="${classMap({ dismissing })}"
        intent="${toast.intent}"
        .heading=${toast.title}
        .message=${toast.message}
        .timeout=${toast.options.timeout}
        ?closeable=${toast.options.closeable}
        ?show-progress=${toast.options.showProgress}
        @animationend=${onAnimationEnd}
        @cc-toast:dismiss=${() => this._startDismissing(toast)}
      ></cc-toast>
    `;
  }

  static get styles () {
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

        /*region POSITION*/
        .toaster.left {
          align-items: start;
        }

        .toaster.right {
          align-items: end;
        }

        .toaster.bottom {
          flex-direction: column-reverse;
        }

        /*endregion*/

        /*region ANIMATION*/
        @media (prefers-reduced-motion) {
          cc-toast {
            animation-duration: 0s !important;
          }
        }

        cc-toast {
          animation-duration: 0.4s;
          animation-fill-mode: forwards;
          animation-timing-function: ease;
        }

        .toaster.fade cc-toast {
          animation-name: fade;
        }

        .toaster.slide.top cc-toast {
          animation-name: slide-down;
        }

        .toaster.slide.bottom cc-toast {
          animation-name: slide-up;
        }

        .toaster.fade-and-slide.top cc-toast {
          animation-name: fade, slide-down;
        }

        .toaster.fade-and-slide.bottom cc-toast {
          animation-name: fade, slide-up;
        }

        .toaster.fade cc-toast.dismissing {
          animation-duration: 0.4s;
          animation-name: fade-out;
        }

        /* use a 0s fake animation so that an animationend event is still fired */
        .toaster.slide.center cc-toast.dismissing {
          animation-duration: 0s;
          animation-name: no-animation;
        }

        .toaster.slide.left cc-toast.dismissing {
          animation-name: slide-left-out;
        }

        .toaster.slide.right cc-toast.dismissing {
          animation-name: slide-right-out;
        }

        .toaster.fade-and-slide.center cc-toast.dismissing {
          animation-name: fade-out;
        }

        .toaster.fade-and-slide.left cc-toast.dismissing {
          animation-name: fade-out, slide-left-out;
        }

        .toaster.fade-and-slide.right cc-toast.dismissing {
          animation-name: fade-out, slide-right-out;
        }


        @keyframes fade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes slide-left-out {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes slide-right-out {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes no-animation {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(0);
          }
        }

        /*endregion*/
      `,
    ];
  }
}

window.customElements.define('cc-toaster', CcToaster);
