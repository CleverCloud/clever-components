import { calibrateCharsPerLineFactor, countLines, estimateLineCount, getLogCharCounts } from './logs-layout.js';

/**
 * @import { Log, MetadataRenderer } from './cc-logs.types.js'
 */

// The fallback height (in pixels) of a single-line log row. It only applies until a row is rendered: from then on the
// height is read from the CSS, see `readLayout()`.
const FALLBACK_ROW_HEIGHT = 21;

// The string whose width is measured to get the width of a single character. Long enough for the rounding of a single
// character's width not to matter.
const CHARACTER_WIDTH_PROBE = '0'.repeat(100);

/**
 * Estimates the height of the logs the virtualizer has not rendered yet.
 *
 * A wrong estimate is not harmless: as soon as the user scrolls, the rows around the new position are rendered and
 * measured, each measured row above the viewport corrects the scroll offset by its own error, and the view slides by
 * the accumulated difference.
 *
 * Without `wrap-lines`, every log is a single-line row. With it, a log takes as many lines as its text needs. Logs are
 * rendered in a monospace font, so we count the characters of a log and divide by how many fit on a line.
 *
 * The estimator only reads the rendered text of a log row. Applying a change to the virtualizer is up to the caller:
 * `readLayout()` and `calibrate()` return whether the estimates changed.
 */
export class LogsSizeEstimator {
  constructor() {
    /** @type {boolean} Whether the log lines are wrapped. */
    this._wrapLines = false;

    /** @type {{[metadataName: string]: MetadataRenderer}|null} How the metadata is rendered. */
    this._metadataRenderers = null;

    /** @type {number} The height in pixels of a single-line log row, padding included. */
    this._rowHeight = FALLBACK_ROW_HEIGHT;

    /** @type {number|null} The height in pixels of one line of log text, or `null` while it is unknown. */
    this._lineHeight = null;

    /** @type {number|null} How many characters fit on one wrapped line, or `null` while it is unknown. */
    this._charsPerLine = null;

    /** @type {number|null} How many characters fit on one wrapped line, going by the width of the text column. */
    this._charsPerLineFromWidth = null;

    /** @type {number} What the width says a line holds, over what the measured logs say it holds. */
    this._charsPerLineFactor = 1;

    /**
     * @type {WeakMap<Log, Array<number>>} The number of characters each log is made of, see `getLogCharCounts()`.
     * The count only depends on the log, so the entry goes away with the log itself once it is trimmed off the list.
     */
    this._logCharCounts = new WeakMap();

    /** @type {CanvasRenderingContext2D|null} Kept to measure the width of a character. */
    this._textMeasureContext = null;
  }

  /**
   * @param {boolean} wrapLines
   */
  set wrapLines(wrapLines) {
    this._wrapLines = wrapLines;
  }

  /**
   * The metadata is rendered on the first line of a log, so it counts towards its characters.
   *
   * @param {{[metadataName: string]: MetadataRenderer}|null} metadataRenderers
   */
  set metadataRenderers(metadataRenderers) {
    if (metadataRenderers !== this._metadataRenderers) {
      this._metadataRenderers = metadataRenderers;
      this._logCharCounts = new WeakMap();
    }
  }

  /**
   * @return {number} The height in pixels of a single-line log row.
   */
  get rowHeight() {
    return this._rowHeight;
  }

  /**
   * Reads the row height, the line height and the characters per line from the rendered text of a log row.
   *
   * A row is a flex line whose height is driven by its text: the line height of the text plus its vertical padding.
   * A hardcoded height cannot be right, because it is expressed in `em` and follows the host's font size.
   *
   * The width of a character is measured on a canvas, from the font the rendered text resolved to. The width of a
   * line runs from the start of the text to the end of the row. We do not read the width of the text itself: it
   * shrinks to fit a message shorter than a line, so it would depend on which log is rendered first. That log changes
   * as soon as the count changes, and the count then flips between two values on every update.
   *
   * @param {HTMLElement|null} textElement The `.log--right` element of a rendered log row.
   * @return {boolean} Whether the estimates changed.
   */
  readLayout(textElement) {
    if (textElement == null) {
      return false;
    }

    const style = window.getComputedStyle(textElement);
    const lineHeight = Number.parseFloat(style.lineHeight);
    const paddingTop = Number.parseFloat(style.paddingTop);
    const paddingBottom = Number.parseFloat(style.paddingBottom);
    if (!Number.isFinite(lineHeight) || !Number.isFinite(paddingTop) || !Number.isFinite(paddingBottom)) {
      return false;
    }

    let changed = false;

    this._lineHeight = lineHeight;
    const rowHeight = Math.round(lineHeight + paddingTop + paddingBottom);
    if (rowHeight > 0 && rowHeight !== this._rowHeight) {
      this._rowHeight = rowHeight;
      changed = true;
    }

    if (this._wrapLines) {
      this._textMeasureContext = this._textMeasureContext ?? document.createElement('canvas').getContext('2d');
      this._textMeasureContext.font = `${style.fontSize} ${style.fontFamily}`;
      const characterWidth =
        this._textMeasureContext.measureText(CHARACTER_WIDTH_PROBE).width / CHARACTER_WIDTH_PROBE.length;
      const lineWidth =
        textElement.parentElement.getBoundingClientRect().right - textElement.getBoundingClientRect().left;
      if (characterWidth > 0 && lineWidth > 0) {
        this._charsPerLineFromWidth = Math.max(1, Math.floor(lineWidth / characterWidth));
        changed = this._applyCharsPerLine() || changed;
      }
    }

    return changed;
  }

  /**
   * Corrects how many characters a line holds, from logs that have just been measured.
   *
   * The width of the text column only gives an upper bound: a message wraps on its spaces, so a line stops short of
   * the edge by up to a word. That gap depends on what the logs are made of, but we can watch the result: this
   * compares the number of lines we predicted for the measured logs with the number of lines they really take, and
   * moves the count towards what would have been right (see `calibrateCharsPerLineFactor()`).
   *
   * @param {Array<{ log: Log, height: number }>} measuredLogs The rendered logs and their measured height.
   * @return {boolean} Whether the estimates changed.
   */
  calibrate(measuredLogs) {
    if (!this._wrapLines || this._charsPerLine == null || this._lineHeight == null) {
      return false;
    }

    let estimatedLineCount = 0;
    let measuredLineCount = 0;
    for (const { log, height } of measuredLogs) {
      estimatedLineCount += this._estimateLineCount(log);
      measuredLineCount += countLines(height, this._rowHeight, this._lineHeight);
    }

    const factor = calibrateCharsPerLineFactor(this._charsPerLineFactor, estimatedLineCount, measuredLineCount);
    if (factor === this._charsPerLineFactor) {
      return false;
    }

    this._charsPerLineFactor = factor;
    return this._applyCharsPerLine();
  }

  /**
   * @param {Log} [log]
   * @return {number} The height in pixels the log is expected to take.
   */
  estimateHeight(log) {
    if (log == null || !this._wrapLines || this._charsPerLine == null || this._lineHeight == null) {
      return this._rowHeight;
    }

    return Math.round(this._rowHeight + (this._estimateLineCount(log) - 1) * this._lineHeight);
  }

  /**
   * Applies the characters per line the width and the measured logs agree on.
   *
   * @return {boolean} Whether it changed.
   */
  _applyCharsPerLine() {
    const charsPerLine = Math.max(1, Math.round(this._charsPerLineFromWidth * this._charsPerLineFactor));
    if (charsPerLine === this._charsPerLine) {
      return false;
    }

    this._charsPerLine = charsPerLine;
    return true;
  }

  /**
   * @param {Log} log
   * @return {number} How many lines the log is expected to take once wrapped.
   */
  _estimateLineCount(log) {
    let charCounts = this._logCharCounts.get(log);
    if (charCounts == null) {
      charCounts = getLogCharCounts(log, this._metadataRenderers);
      this._logCharCounts.set(log, charCounts);
    }
    return estimateLineCount(charCounts, this._charsPerLine);
  }
}
