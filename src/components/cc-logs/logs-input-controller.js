import { hasClass } from '../../lib/dom.js';
import { EventHandler } from '../../lib/events.js';
import { elementsFromPoint } from '../../lib/shadow-dom-utils.js';
import { clampNumber } from '../../lib/utils.js';
import { AnimationRunner } from './animation-runner.js';

// After first arrow up/down, how much time (in ms) do we wait before starting the animation?
const ARROW_KEYS_ANIMATION_DELAY_MS = 100;
// How much time (in ms) do we wait between each key animation tick?
const ARROW_KEYS_ANIMATION_PERIOD_MS = 25;

// Drag animation constants which is played when drag movement is above or below the logs container
const DRAG_VERTICAL_DISTANCE_PX_MIN = 1;
const DRAG_VERTICAL_DISTANCE_PX_MAX = 50;
const DRAG_ANIMATION_PERIOD_MS_MIN = 20;
const DRAG_ANIMATION_PERIOD_MS_MAX = 300;
const DRAG_ANIMATION_LOG_OFFSET_MIN = 1;
const DRAG_ANIMATION_LOG_OFFSET_MAX = 10;
const DRAG_VERTICAL_DISTANCE_INTERVAL = DRAG_VERTICAL_DISTANCE_PX_MAX - DRAG_VERTICAL_DISTANCE_PX_MIN;
const DRAG_ANIMATION_PERIOD_INTERVAL = DRAG_ANIMATION_PERIOD_MS_MAX - DRAG_ANIMATION_PERIOD_MS_MIN;
const DRAG_ANIMATION_LOG_OFFSET_INTERVAL = DRAG_ANIMATION_LOG_OFFSET_MAX - DRAG_ANIMATION_LOG_OFFSET_MIN;

/**
 * Controls some of the user interactions that can be done on the cc-logs component.
 */
export class LogsInputController {
  /**
   * @param {CcLogs} host
   */
  constructor(host) {
    /** @type {CcLogs} */
    this._host = host;

    // This helps users of this input controller to use those listeners directly without creating arrow functions
    this.onClick = this.onClick.bind(this);
    this.onClickLog = this.onClickLog.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseDownGutter = this.onMouseDownGutter.bind(this);

    this._windowMouseMoveHandler = new EventHandler(window, 'mousemove', (e) => this._onDrag(e));
    this._windowMouseUpHandler = new EventHandler(window, 'mouseup', (e) => this._onDragStop(e));

    this._arrowKeysAnimationRunner = new AnimationRunner();
    this._dragAnimationRunner = new AnimationRunner();

    this._keyModifiers = {
      ctrl: false,
      shift: false,
    };
  }

  // region Keyboard navigation

  onKeyDown(e) {
    if (e.key === 'Escape') {
      this._host._onEscape();
    }
    // we keep track of the ctrl modifier key to handle it in keyboard selection on every browser
    if (e.key === 'Control' || e.key === 'Meta') {
      this._keyModifiers.ctrl = true;
    }
    // we keep track of the shift modifier key to handle it in keyboard selection on every browser
    else if (e.key === 'Shift') {
      this._keyModifiers.shift = true;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // we don't want to use the native behavior: scroll up/down
      // Note that user will still have PageUp and PageDown keys to scroll up and down
      e.preventDefault();

      const direction = e.key === 'ArrowDown' ? 'down' : 'up';

      if (this._arrowKeysAnimationRunner.isStopped()) {
        let hasAnimationStarted = false;

        this._arrowKeysAnimationRunner.start((nowTimestamp, startTimestamp, lastTimestamp) => {
          const isFirstFrame = nowTimestamp === startTimestamp;
          hasAnimationStarted ||= nowTimestamp - startTimestamp > ARROW_KEYS_ANIMATION_DELAY_MS;

          // Browsers will run `requestAnimationFrame()` as many times as they can per second (depending on the system and what it can handle).
          // We want to run our `this._host._onArrow()` at a slower speed, that's why we use timestamps diffs.
          const shouldTickAnimation = nowTimestamp - lastTimestamp > ARROW_KEYS_ANIMATION_PERIOD_MS;

          if (isFirstFrame || (hasAnimationStarted && shouldTickAnimation)) {
            this._host._onArrow(direction);
            return true;
          }

          return false;
        });
      }
    } else if (e.key === 'c' && this._keyModifiers.ctrl) {
      this._host._onCopySelectionToClipboard();
    } else if (e.key === 'Enter' || e.key === ' ') {
      // we prevent default because we don't want the native keyboard click simulation to be fired
      e.preventDefault();
      const logIndex = Number(e.target.closest(`.log`).dataset.index);
      this._host._onClickLog(logIndex, this._keyModifiers);
    } else if (e.key === 'a' && this._keyModifiers.ctrl) {
      // we prevent default because we don't want the native keyboard "ctrl + a" to be fired
      e.preventDefault();
      this._host._onSelectAll();
    } else if (e.key === 'Home') {
      this._host._onHome(this._keyModifiers.ctrl && this._keyModifiers.shift);
    } else if (e.key === 'End') {
      this._host._onEnd(this._keyModifiers.ctrl && this._keyModifiers.shift);
    }
  }

  onKeyUp(e) {
    if (e.key === 'Control' || e.key === 'Meta') {
      this._keyModifiers.ctrl = false;
    } else if (e.key === 'Shift') {
      this._keyModifiers.shift = false;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this._arrowKeysAnimationRunner.stop();
    }
  }

  onClick(e) {
    // When a drag stop happens, the mouse is released and Chrome & Safari consider that a click event happened on the container.
    // Firefox doesn't! And we think that a drag movement ending should not be a click.
    // Therefore, if a drag stop just happened (_dragState = stopping) we should not trigger the onClick on the host.
    if (this._dragState !== 'stopping') {
      this._host._onClick(e);
    }
  }

  onClickLog(e) {
    // We don't want to pollute the parent click listener
    e.stopPropagation();
    const logIndex = Number(e.target.closest(`.log`).dataset.index);
    this._host._onClickLog(logIndex, this._keyModifiers);
  }

  /**
   * Initiates the drag movement.
   */
  onMouseDownGutter(e) {
    this._windowMouseMoveHandler.connect();
    this._windowMouseUpHandler.connect();
    this._dragState = 'init';
  }

  /**
   * Handles the drag movement.
   */
  _onDrag(e) {
    // We do not support drag with ctrl and shift key modifiers.
    if (e.ctrlKey || e.shiftKey) {
      return;
    }

    const isFirstDrag = this._dragState === 'init';
    this._dragState = 'dragging';

    const { position, distance } = this._getCursorPosition(e, this._host);

    if (position === 'inside' || position === 'left' || position === 'right') {
      // Stop the animation
      this._dragAnimationRunner.stop();

      // Find the log right under the mouse if 'inside',
      // or on the same y position if 'left' or 'right'.
      const elementsPath = this._getElementsFromPoint(e, position, distance);
      const log = elementsPath.find((element) => hasClass(element, 'log'));

      const logIndex = Number(log.dataset.index);
      // No need to trigger this._host.onDrag if it's the same index
      if (this.dragIndex !== logIndex) {
        this._host._onDrag({ logIndex }, isFirstDrag);
        this.dragIndex = logIndex;
      }
    }

    if (position === 'above' || position === 'below') {
      const direction = position === 'above' ? 'up' : 'down';

      const speed = clampNumber(distance, DRAG_VERTICAL_DISTANCE_PX_MIN, DRAG_VERTICAL_DISTANCE_PX_MAX);
      this._dragAnimationPeriodMs = Math.ceil(
        DRAG_ANIMATION_PERIOD_MS_MAX - (speed * DRAG_ANIMATION_PERIOD_INTERVAL) / DRAG_VERTICAL_DISTANCE_INTERVAL,
      );
      this._dragAnimationLogOffset = Math.ceil(
        (speed * DRAG_ANIMATION_LOG_OFFSET_INTERVAL) / DRAG_VERTICAL_DISTANCE_INTERVAL,
      );

      if (this._dragAnimationRunner.isStopped()) {
        this._dragAnimationRunner.start((nowTimestamp, startTimestamp, lastTimestamp) => {
          // Browsers will run `requestAnimationFrame()` as many times as they can per second (depending on the system and what it can handle).
          // We want to run our `this._host._onDrag()` at a slower speed, that's why we use timestamps diffs.
          const shouldTickAnimation = nowTimestamp - lastTimestamp > this._dragAnimationPeriodMs;

          if (shouldTickAnimation) {
            this._host._onDrag({ direction, offset: this._dragAnimationLogOffset }, isFirstDrag);
            return true;
          }

          return false;
        });
      }
    }
  }

  /**
   * Terminate the drag movement.
   */
  _onDragStop(e) {
    this._windowMouseMoveHandler.disconnect();
    this._windowMouseUpHandler.disconnect();
    this._dragAnimationRunner.stop();

    // We set this in case a click event happens just after (DOM event listeners are executed synchronously).
    // @see onClick method above
    this._dragState = 'stopping';
    // We need to reset the _dragState once all DOM event listeners have been executed.
    setTimeout(() => {
      this._dragState = 'stopped';
    }, 0);
  }

  // endregion

  // region Private methods

  /**
   * @param {MouseEvent} event
   * @param {'above' | 'below' | 'left' | 'right' | 'inside'} position
   * @param {number} distance
   * @return {EventTarget[]}
   */
  _getElementsFromPoint(event, position, distance) {
    if (position === 'inside') {
      return event.composedPath();
    } else if (position === 'left' || position === 'right') {
      const x = event.clientX + (position === 'left' ? +1 : -1) * (distance + this._host.offsetWidth / 2);
      const y = event.clientY;
      return elementsFromPoint(x, y);
    }
    return [];
  }

  /**
   * Finds the cursor position relatively to the given `target` element.
   *
   * @param {MouseEvent} e - Mouse event
   * @param {HTMLElement} target
   * @return {{position: 'above' | 'below' | 'left' | 'right' | 'inside', distance?: number}}
   */
  _getCursorPosition(e, target) {
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const coordinates = this._getRelativeCoordinates(e, target);

    if (coordinates.y < 0) {
      return { position: 'above', distance: -coordinates.y };
    }
    if (coordinates.y > height) {
      return { position: 'below', distance: coordinates.y - height };
    }

    if (coordinates.x < 0) {
      return { position: 'left', distance: -coordinates.x };
    }
    if (coordinates.x > width) {
      return { position: 'right', distance: coordinates.x - width };
    }

    return { position: 'inside' };
  }

  /**
   * Calculate the coordinates of the mouse pointer at the time the event occurred, relatively to the reference element.
   *
   * @param {MouseEvent} event
   * @param {HTMLElement} referenceElement
   * @return {{x: number, y: number}}
   */
  _getRelativeCoordinates(event, referenceElement) {
    const position = {
      x: event.pageX,
      y: event.pageY,
    };

    const offset = {
      left: referenceElement.offsetLeft,
      top: referenceElement.offsetTop,
    };

    let reference = referenceElement.offsetParent;

    while (reference != null) {
      offset.left += reference.offsetLeft;
      offset.top += reference.offsetTop;
      reference = reference.offsetParent;
    }

    return {
      x: position.x - offset.left,
      y: position.y - offset.top,
    };
  }

  // endregion
}
