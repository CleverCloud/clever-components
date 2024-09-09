/**
 *
 * @param {ShadowRoot} shadowRoot
 * @param {string} selector
 * @param {Array<Keyframe> | PropertyIndexedKeyframes} keyframes
 * @param {number | KeyframeAnimationOptions} options
 */
export function animate(shadowRoot, selector, keyframes, options) {
  Array.from(shadowRoot.querySelectorAll(selector)).forEach((element) => element.animate(keyframes, options));
}

export const QUICK_SHRINK = {
  keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1)' }],
  options: {
    duration: 200,
    easing: 'ease-in-out',
  },
};
