/**
 * Synchronizes an animation with `requestAnimationFrame`.
 */
export class AnimationRunner {
  /**
   * Starts the animation.
   *
   * The callback will be executed at each frame tick.
   * The callback must return whether the lastTickTimestamp should be updated.
   *
   * @param {(nowTimestamp: number, startTimestamp: number, lastTickTimestamp: number) => boolean} animationCallback
   */
  start(animationCallback) {
    /** @type {(nowTimestamp: number) => void} */
    this._animation = (nowTimestamp) => {
      const hasTicked = animationCallback(nowTimestamp, this._startTimestamp, this._lastTimestamp);
      if (hasTicked) {
        this._lastTimestamp = nowTimestamp;
      }
      if (this._animation != null) {
        requestAnimationFrame(this._animation);
      }
    };

    this._startTimestamp = performance.now();
    this._lastTimestamp = this._startTimestamp;

    this._animation(this._startTimestamp);
  }

  /**
   * @return {boolean} Whether the animation is stopped
   */
  isStopped() {
    return this._animation == null;
  }

  /**
   * Stops the animation.
   */
  stop() {
    this._animation = null;
  }
}
