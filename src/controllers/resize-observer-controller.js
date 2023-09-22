/**
 * For this reactive controller to work, the component it is attached must have at least one of the following:
 *
 * - a public `onResize` method with `{ width: number }` as its parameter. It is called everytime a resize happens, with the current width of the component.
 * - a public `breakpoints` property whose type matches the following @type {{ width: number[] }}.
 *
 * This reactive controller sets up a resize observer to do the following everytime the element is resized:
 *
 * - call the `onResize` with the current `width` of the component.
 * - adds / removes the `w-lt-${breakpoint}` or `w-gte-${breakpoint}` attributes to the component depending its current `width`.
 *
 * @param {LitElement} host - the lit element to be observed
 */
export class ResizeObserverController {
  constructor (host) {
    host.addController(this);

    this.host = host;

    if (!window.ResizeObserver) {
      console.warn(
        `ResizeController error: browser does not support ResizeObserver.`,
      );
      return;
    }

    this._observer = new ResizeObserver(() => this._onResize);
  }

  _onResize () {
    const { width } = this.host.getBoundingClientRect();

    if (this.host.onResize != null) {
      this.host.onResize({ width });
    }

    if (this.host.breakpoints != null) {
      this.host.breakpoints.width.forEach((breakpoint) => {

        const gteAttr = 'w-gte-' + breakpoint;
        (breakpoint <= width)
          ? this.host.setAttribute(gteAttr, '')
          : this.host.removeAttribute(gteAttr);

        const ltAttr = 'w-lt-' + breakpoint;
        (width < breakpoint)
          ? this.host.setAttribute(ltAttr, '')
          : this.host.removeAttribute(ltAttr);
      });
    }
  }

  hostConnected () {
    this._observer?.observe(this.host);
  }

  hostDisconnected () {
    this._observer?.disconnect();
  }
}
