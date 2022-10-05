export function withResizeObserver (ParentClass) {

  return class extends ParentClass {

    _onResize ({ width }) {

      if (this.onResize != null) {
        this.onResize({ width });
      }

      if (this.breakpoints != null) {
        this.breakpoints.width.forEach((breakpoint) => {

          const gteAttr = 'w-gte-' + breakpoint;
          (breakpoint <= width)
            ? this.setAttribute(gteAttr, '')
            : this.removeAttribute(gteAttr);

          const ltAttr = 'w-lt-' + breakpoint;
          (width < breakpoint)
            ? this.setAttribute(ltAttr, '')
            : this.removeAttribute(ltAttr);
        });
      }
    }

    connectedCallback () {
      if (super.connectedCallback != null) {
        super.connectedCallback();
      }
      if (window.ResizeObserver == null) {
        return;
      }
      const ro = new window.ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          // NOTE: We could use entries[0].borderBoxSize.inlineSize but not supported in Chrome, Safari or polyfill
          const { width } = this.getBoundingClientRect();
          this._onResize({ width });
        });
      });
      ro.observe(this);
      this._unobserveResize = () => ro.unobserve(this);
    }

    disconnectedCallback () {
      if (super.connectedCallback != null) {
        super.disconnectedCallback();
      }
      if (this._unobserveResize) {
        this._unobserveResize();
      }
    }
  };
}
