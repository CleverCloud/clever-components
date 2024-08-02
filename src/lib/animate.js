/**
 * @param {ShadowRoot} shadowRoot
 * @param {string} selector
 * @param {Keyframe[]} keyframes
 * @param {Object} options
 */
export function animate(shadowRoot, selector, keyframes, options) {
  Array.from(shadowRoot.querySelectorAll(selector)).forEach((element) => element.animate(keyframes, options));
}

/** @type {[Array<Keyframe>, Keyframe]} */
export const QUICK_SHRINK = [
  [{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1)' }],
  {
    duration: 200,
    easing: 'ease-in-out',
  },
];
