/**
 * @import { CcRangeSelector } from './cc-range-selector.js'
 * @import { RangeSelectorSelection } from './cc-range-selector.types.js'
 */

/**
 * Controller for managing drag selection state in cc-range-selector component.
 *
 * This controller handles the drag-to-select interaction in range mode, tracking:
 * - Start and end indices of the current drag operation
 * - Whether a drag is currently in progress
 * - Previous selection boundary values for cancellation/rollback
 *
 * The controller maintains drag state and notifies the host component via requestUpdate()
 * when state changes require re-rendering.
 */
export class RangeSelectorDraggingController {
  /**
   * Creates a new dragging controller instance.
   * @param {CcRangeSelector} host - The host cc-range-selector component
   */
  constructor(host) {
    /** @type {CcRangeSelector} */
    this._host = host;

    /** @type {boolean} */
    this._dragging = false;

    /** @type {number | null} */
    this._startIndex = null;

    /** @type {number | null} */
    this._endIndex = null;

    /** @type {RangeSelectorSelection | null} */
    this._previousSelection = null;
  }

  /**
   * Starts a new drag selection at the specified index.
   * Sets both start and end indices to the same value and marks dragging as active.
   * @param {number} value - The index where the drag starts
   */
  start(value) {
    this._dragging = true;
    this._startIndex = this._endIndex = value;
    this._host.requestUpdate();
  }

  /**
   * Updates the end index of the current drag selection.
   * Called as the user drags across options to expand the selection range.
   * @param {number} index - The new end index for the drag range
   */
  update(index) {
    if (index == null) {
      return;
    }
    this._endIndex = index;
    this._host.requestUpdate();
  }

  /**
   * Stops the current drag operation and resets drag state.
   * Clears the start and end indices and marks dragging as inactive.
   */
  stop() {
    this._dragging = false;
    this._startIndex = this._endIndex = null;
    this._host.requestUpdate();
  }

  /**
   * Checks if a drag operation is currently in progress.
   * @returns {boolean} True if dragging, false otherwise
   */
  isDragging() {
    return this._dragging;
  }

  /**
   * Returns the normalized range with start <= end regardless of drag direction.
   * @private
   * @returns {{ start: number, end: number } | null} The normalized range, or null if not set
   */
  _normalizeRange() {
    if (this._startIndex == null || this._endIndex == null) {
      return null;
    }
    const start = Math.min(this._startIndex, this._endIndex);
    const end = Math.max(this._startIndex, this._endIndex);
    return { start, end };
  }

  /**
   * Checks if a given index falls within the current drag range.
   * Handles both forward (left-to-right) and backward (right-to-left) drags.
   * @param {number} index - The index to check
   * @returns {boolean} True if index is within the drag range, false otherwise
   */
  isInRange(index) {
    const range = this._normalizeRange();
    if (range == null) {
      return false;
    }
    return range.start <= index && index <= range.end;
  }

  /**
   * Gets the normalized drag range with start and end in correct order.
   * Always returns start <= end regardless of drag direction.
   * @returns {{ start: number, end: number }} The normalized range indices
   */
  getRanges() {
    const range = this._normalizeRange();
    return range ?? { start: this._startIndex, end: this._endIndex };
  }

  /**
   * Gets the size of the current drag selection (number of positions between start and end).
   * Returns 0 if clicking a single option without dragging, or if no drag is active.
   * @returns {number} The absolute distance between start and end indices
   */
  getSize() {
    if (this._startIndex == null || this._endIndex == null) {
      return 0;
    }

    return Math.abs(this._endIndex - this._startIndex);
  }

  /**
   * Stores the previous selection boundary values for potential rollback.
   * Used when canceling a drag operation (e.g., clicking outside).
   * @param {RangeSelectorSelection | null} selection - The boundary values to store
   */
  setPreviousSelection(selection) {
    this._previousSelection = selection != null ? { ...selection } : null;
  }

  /**
   * Retrieves the previously stored selection boundary values.
   * @returns {RangeSelectorSelection | null} The stored previous boundary values, or null if none stored
   */
  getPreviousSelection() {
    return this._previousSelection;
  }
}
