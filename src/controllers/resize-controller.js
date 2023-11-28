/**
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * Sets a `ResizeObserver` on the given `LitElement`.
 * The `ResizeController` exposes a public `width` property that contains the latest observed `width` value.
 *
 * If `widthBreakpoints` are provided, for each given breakpoint, this controller sets the following attributes:
 *
 * - `w-gte-${breakpoint}` if the host `width` >= the `breakpoint`
 * - `w-lt-${breakpoint}` if the host `width` is < the `breakpoint`
 *
 * The controller also triggers the `requestUpdate` method on the `host` for every resize event.
 * If a callback a provided, it also runs the callback. Make sure to use `this.updateComplete` if you need the callback to be executed after the Lit update.
 */
export class ResizeController {
  /**
   * @param {LitElement} host - the custom element to observe
   * @param {Object} [options]
   * @param {number[]} [options.widthBreakpoints] - the breakpoints used to add or remove the `w-gte-${breakpoint}` / `w-lt-${breakpoint}` attributes
   * @param {(width: number) => {}} [options.callback] - a function to execute everytime a resize happens. The `width` of the host is passed as an argument of this callback.
   */
  constructor (host, options) {

    if (!window.ResizeObserver) {
      console.warn(
        `ResizeController error: browser does not support ResizeObserver.`,
      );
      return;
    }

    host.addController(this);

    /** @type {number|null} the latest observed `width` of the host */
    this._width = null;

    this._host = host;

    this._callback = options?.callback;

    this._widthBreakpoints = options?.widthBreakpoints;

    this._observer = new ResizeObserver(() => this._onResize());
  }

  /**
   * @readonly
   */
  get width () {
    return this._width;
  }

  _onResize () {
    // NOTE: We could use entries[0].borderBoxSize.inlineSize but not supported in Chrome, Safari or polyfill
    this._width = this._host.getBoundingClientRect().width;

    if (this._widthBreakpoints != null) {
      this._widthBreakpoints.forEach((breakpoint) => {

        const gteAttr = 'w-gte-' + breakpoint;
        (breakpoint <= this._width)
          ? this._host.setAttribute(gteAttr, '')
          : this._host.removeAttribute(gteAttr);

        const ltAttr = 'w-lt-' + breakpoint;
        (this._width < breakpoint)
          ? this._host.setAttribute(ltAttr, '')
          : this._host.removeAttribute(ltAttr);
      });
    }

    this._host.requestUpdate();

    this._callback?.(this._width);
  }

  hostConnected () {
    this._observer.observe(this._host);
  }

  hostDisconnected () {
    this._observer.disconnect();
  }
}
