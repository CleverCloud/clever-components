const createElement = (tagName) => document.createElement(tagName);
const appendChild = (parent, child) => parent.appendChild(child);

/**
 * An invisible wrapper that changes its size (with an animation) according to the size of its children.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-expand.js)
 *
 * ## Technical details
 *
 * * The animation only works in browsers supporting [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) and [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
 * * This component does not use lit* deps on purpose (keep small and not useful).
 * * The source code is written in a way so it can be the smallest possible, while keeping a reasonable readability level.
 *
 * @slot - The content that may expand/shrink.
 */
export class CcExpand extends HTMLElement {

  constructor () {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = createElement('style');
    // language=CSS
    style.textContent = `:host {
      display: block;
      overflow: hidden
    }`;
    this._wrapper = createElement('div');
    const slot = createElement('slot');

    appendChild(shadow, style);
    appendChild(shadow, this._wrapper);
    appendChild(this._wrapper, slot);
  }

  connectedCallback () {
    if (window.ResizeObserver == null) {
      return;
    }
    this._ro = new ResizeObserver(() => {

      // The animation API is not supported in some versions of Safari but it's purely decorative so it's OK if it does not work
      if (this.animate == null) {
        return;
      }

      let fromHeight = this._oldHeight;

      // If there's already an animation (not finished),
      // we stop it and use the current height as the "from" base for the next animation.
      if (this._animation != null && this._animation.playState !== 'finished') {
        // Pause so we can properly get the current height
        this._animation.pause();
        fromHeight = getComputedStyle(this).height;
        // Finish will instantly apply the animation end state (and stop the animation)
        this._animation.finish();
      }

      const toHeight = getComputedStyle(this).height;
      if (fromHeight === toHeight) {
        return;
      }
      if (fromHeight != null) {
        this._animation = this.animate(
          [
            { height: fromHeight },
            { height: toHeight },
          ],
          {
            duration: 300,
            easing: 'ease-in-out',
          },
        );
      }

      this._oldHeight = toHeight;
    });
    // TODO: Should we debounce this?
    this._ro.observe(this._wrapper);
  }

  disconnectedCallback () {
    if (window.ResizeObserver == null) {
      return;
    }
    this._ro.unobserve(this._wrapper);
  }
}

window.customElements.define('cc-expand', CcExpand);
