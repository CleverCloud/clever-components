import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '@lit-labs/virtualizer';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { join } from 'lit/directives/join.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCheckboxBlankCircleFill as iconSelected,
  iconRemixFileCopy_2Line as iconCopy,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import { ansiStyles, ansiToLit, stripAnsi } from '../../lib/ansi/ansi.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import { copyToClipboard } from '../../lib/clipboard.js';
import { dispatchCustomEvent, EventHandler } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { notifySuccess } from '../../lib/notifications.js';
import { elementsFromPoint } from '../../lib/shadow-dom-utils.js';
import { TimestampFormatter } from '../../lib/timestamp-formatter.js';
import { groupBy, unique } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';

/** @type {MetadataRendering} The default metadata renderer */
const DEFAULT_METADATA_RENDERING = {
  hidden: false,
  intent: 'neutral',
  showName: false,
  size: 'auto',
  strong: false,
};
// This style is the default ansi palette plus the ability to be overridden with the css theme.
const DEFAULT_PALETTE_STYLE = ansiPaletteStyle(Object.fromEntries(Object.entries(defaultPalette)
  .map(([name, color]) => [name, `var(--cc-color-ansi-default-${name}, ${color})`])));

/**
 * Calculate the coordinates of the mouse pointer at the time the event occurred, relatively to the reference element.
 *
 * @param {MouseEvent} event
 * @param {HTMLElement} referenceElement
 * @return {{x: number, y: number}}
 */
function getRelativeCoordinates (event, referenceElement) {

  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  };
}

/**
 * Constructs two versions of the lines of text:
 *
 * * A text version which is the lines joined with a carriage return.
 * * A html version
 *
 * @param {Array<string>} lines
 * @return {{text: string, html: string}}
 */
function copyDataFromLines (lines) {
  const text = lines.join('\n');
  const html = linesToHtml(lines);
  return { text, html };
}

/**
 * Transforms the given lines into html. Useful when putting a html version of a text inside clipboard.
 */
function linesToHtml (lines) {
  if (lines.length === 0) {
    return '';
  }
  if (lines.length === 1) {
    return `<code>${lines[0]}</code>`;
  }
  return `<pre>${lines.join('<br>')}</pre>`;
}

const inRange = (number, min, max) => {
  return Math.min(Math.max(min, number), max);
};

class LogsCtrl {
  constructor (component) {
    /** @type {CcLogsComponent} */
    this._component = component;
  }

  /**
   * @param {Array<Element>} elementsPath
   * @return {{inGutter: boolean, inSelectButton: boolean, log: null|{element: Element, index: number, id: string}}}
   */
  getPosition (elementsPath) {
    const result = {
      inGutter: false,
      inSelectButton: false,
      log: null,
    };
    const hasClass = (n, clazz) => n.classList?.contains(clazz);

    for (const element of elementsPath) {
      result.inGutter = result.inGutter || hasClass(element, 'gutter');
      result.inSelectButton = result.inSelectButton || hasClass(element, 'select_button');
      if (element instanceof HTMLElement && hasClass(element, 'log')) {
        result.log = {
          index: parseInt(element.dataset.index),
          id: element.dataset.id,
          element: element,
        };
        break;
      }
    }

    return result;
  }

  /**
   * @param {Array<Element>} elements
   * @return {string|undefined}
   */
  getId (elements) {
    return this.getPosition(elements).log?.id;
  }

  /**
   * @param {string} startId
   * @param {string} endId
   * @return {Array<string>}
   */
  range (startId, endId) {
    if (startId === endId) {
      return [startId];
    }

    const range = [];
    let lastId = null;
    let inRange = false;
    for (const log of this._component._filteredLogs) {
      if (inRange) {
        range.push(log.id);
        if (log.id === lastId) {
          break;
        }
      }
      else if (log.id === startId) {
        range.push(log.id);
        inRange = true;
        lastId = endId;
      }
      else if (log.id === endId) {
        range.push(log.id);
        inRange = true;
        lastId = startId;
      }
    }
    return range;
  }

  /**
   * @param {number} index
   * @return {Log}
   */
  findLogByIndex (index) {
    return this._component._filteredLogs[index];
  }

  /**
   * @param {string} id
   * @return {number|undefined}
   */
  findIndexById (id) {
    return this._component._filteredLogs.findIndex((log) => log.id === id);
  }
}

/**
 * This class handles the selection
 */
class SelectionCtrl {
  constructor (component) {
    /** @type {CcLogsComponent} */
    this.component = component;
  }

  set selection (selection) {
    this.component._selection = selection.flatMap(unique);
  }

  get selection () {
    return this.component._selection;
  }

  clear () {
    this.selection = [];
  }

  isSelected (item) {
    return this.selection.includes(item);
  }

  size () {
    return this.selection.length;
  }

  isEmpty () {
    return this.size() === 0;
  }

  add (item) {
    this.selection = [...this.selection, item];
  }

  remove (item) {
    this.selection = this.selection.filter((s) => s !== item);
  }

  removeAll (items) {
    this.selection = this.selection.filter((s) => !items.includes(s));
  }
}

/**
 * This class handles the auto scrolling initiated by a drag movement.
 *
 * To perform the auto scrolling, we start a __thread__ (using `setInterval()`) that will repeatedly scroll in the given direction using the given speed.
 *
 * Also, it handles the selection modification automatically, according to the scroll position.
 *
 * @private
 */
class DragAutoScroller {
  /**
   * @param {() => HTMLElement} targetProvider - A function that provides the target element on which the scroll is to be done.
   * @param {(index: number) => void} onScroll - The function to call when the scroll position has changed.
   */
  constructor (targetProvider, onScroll) {
    this._targetProvider = targetProvider;
    this._onScroll = onScroll;
    this._intervalId = null;
  }

  /**
   * @return {boolean} Whether the auto scrolling is running.
   */
  isRunning () {
    return this._intervalId != null;
  }

  /**
   * Starts or updates the auto scrolling.
   *
   * If the auto scrolling is already running, it just updates its direction and speed using the given parameters.
   *
   * If the auto scrolling is not running, it creates the __scrolling thread__ (using `setInterval()`).
   * It also, add an event handler on the `target` element, listening to the 'visibilityChanged' event, that will automatically change the selection according to the scroll position.
   *
   * @param {'up' | 'down'} direction - The direction of the scroll
   * @param {number} speed - The amount of pixel to scroll at each tick.
   */
  startOrUpdate (direction, speed) {
    if (this.isRunning()) {
      this._direction = direction;
      this._speed = speed;
      return;
    }

    this._intervalId = setInterval(() => {
      const target = this._targetProvider();
      const scrollDirection = this._direction === 'up' ? -1 : +1;
      target.scrollTop = target.scrollTop + (scrollDirection * this._speed);
    }, 50);

    this._onVisibilityChangedHandler = new EventHandler(this._targetProvider(), 'visibilityChanged', (e) => {
      if (this._direction === 'up') {
        this._onScroll(e.first);
      }
      else if (this._direction === 'down') {
        this._onScroll(e.last);
      }
    });
    this._onVisibilityChangedHandler.connect();
  }

  /**
   * Stops the auto scrolling.
   */
  stop () {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._onVisibilityChangedHandler?.disconnect();
  }
}

/**
 * This class handles the selection done with dragging movement.
 */
class DragSelectionCtrl {
  /**
   *
   * @param {() => HTMLElement} targetProvider - A function that provides the target element on which the selection is to be done
   * @param {SelectionCtrl} selectionCtrl - The selection controller
   * @param {LogsCtrl} logsCtrl -
   */
  constructor (targetProvider, selectionCtrl, logsCtrl) {
    this._targetProvider = targetProvider;
    this._selectionCtrl = selectionCtrl;
    this._logsCtrl = logsCtrl;
    this._autoScroller = new DragAutoScroller(targetProvider, (index) => {
      const log = this._logsCtrl.findLogByIndex(index);
      this._select(log.id);
    });

    this._dragStarted = false;
    this._dragging = false;
    this._justEnded = false;

    this._windowMouseMoveHandler = new EventHandler(window, 'mousemove', (e) => this.drag(e));
    this._windowMouseUpHandler = new EventHandler(window, 'mouseup', () => this.end());
  }

  /**
   * Initiates the drag selection movement.
   *
   * It defines a `this._select` function that is to be called when selection is to be changed.
   * This function will select a range from the given `startIndex`.
   * This function handles the `keepCurrentSelection` flag.
   *
   * It connects the window mousemove and mouseup event handlers in order to handle the movement.
   *
   * @param {string} startId - The drag start log id
   * @param {boolean} keepCurrentSelection - Whether to add the current selection to the drag selection
   */
  start (startId, keepCurrentSelection) {
    if (this._dragStarted) {
      return;
    }

    const initialSelection = keepCurrentSelection ? [...this._selectionCtrl.selection] : null;

    this._select = (id) => {
      const dragSelection = this._logsCtrl.range(startId, id);
      this._selectionCtrl.selection = initialSelection == null ? dragSelection : [...initialSelection, ...dragSelection];
    };

    this._windowMouseMoveHandler.connect();
    this._windowMouseUpHandler.connect();

    this._dragStarted = true;
  }

  /**
   * This event handler is called when the mouse move on the window.
   *
   * It does nothing if the drag movement has not been initiated.
   *
   * First it finds the cursor position relatively to the target. The cursor position can be
   * * `inside`
   * * `left` or `right`
   * * `above` or `below`
   *
   * If the position is `inside`, it detects the log element under the cursor and makes a selection to the index of the element.
   *
   * If the position is `left` or `right`, it detects the log element that is at the same ordinate and makes a selection to the index of the element.
   *
   * If the position is `above` or `below` it starts an auto-scrolling thread that will run until the position of the cursor comes back to `inside` or `left` or `right`.
   * We calculate the direction of the scroll according to the position.
   * We calculate the speed of the scroll according to the distance of the cursor from the edge.
   * The auto-scrolling logic is delegated to the `DragAutoScroller` class.
   *
   * @param e
   */
  drag (e) {
    if (!this._dragStarted) {
      return;
    }
    this._dragging = true;

    const target = this._targetProvider();
    const cursorPosition = this._getCursorPosition(e, target);

    if (cursorPosition.position === 'above' || cursorPosition.position === 'below') {
      const direction = cursorPosition.position === 'above' ? 'up' : 'down';
      const speed = inRange(cursorPosition.distance, 1, 100);

      this._autoScroller.startOrUpdate(direction, speed);
    }
    else {
      this._autoScroller.stop();

      let id;

      if (cursorPosition.position === 'left' || cursorPosition.position === 'right') {
        const x = e.clientX + (cursorPosition.position === 'left' ? +1 : -1) * (cursorPosition.distance + 10);
        const y = e.clientY;

        id = this._logsCtrl.getId(elementsFromPoint(x, y));
      }
      else {
        id = this._logsCtrl.getId(e.composedPath());
      }

      if (id != null) {
        this._select(id);
      }
    }
  }

  /**
   * This event handler is called when the mouse button is released.
   *
   * It does nothing if the dragging movement has not been initiated.
   *
   * It ends the drag movement.
   */
  end () {
    this._dragging = false;
    this._dragStarted = false;
    this._autoScroller.stop();
    this._windowMouseMoveHandler?.disconnect();
    this._windowMouseUpHandler?.disconnect();
    this._justEnded = true;
    setTimeout(() => {
      this._justEnded = false;
    }, 0);
  }

  isDragging () {
    return this._dragging || this._justEnded;
  }

  /**
   * Finds the cursor position relatively to the given `target` element.
   *
   * @param {Event} e - Mouse event
   * @param {HTMLElement} target
   * @return {{position: 'above' | 'below' | 'left' | 'right' | 'inside', distance?: number}}
   */
  _getCursorPosition (e, target) {
    const width = target.clientWidth;
    const height = target.offsetHeight;
    const coordinates = getRelativeCoordinates(e, target);

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
}

/**
 * @typedef {import('./cc-logs.types.js').Log} Log
 * @typedef {import('./cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('../../lib/timestamp-formatter.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('../../lib/timestamp-formatter.types.js').Timezone} Timezone
 */

/**
 * A component displaying lines of log.
 *
 * A line of log is made of:
 *
 * * an id
 * * a timestamp
 * * a message
 * * some metadata
 *
 * ## Details
 *
 * The component gives the ability to:
 *
 * * Display a huge amount of logs by using a <a href="https://github.com/lit/lit/tree/main/packages/labs/virtualizer">scroll virtualizer</a>.
 * * Limit the amount of logs to be displayed.
 * * Filter the logs by metadata.
 * * Wrap the long lines.
 * * Customize the format of the timestamp (by default, it is displayed using <a href="https://www.w3.org/TR/NOTE-datetime">ISO-8601</a> as UTC).
 * * Hide the timestamp.
 * * Customize the way the metadata are displayed.
 * * Follow the logs (force scroll to bottom) while some new logs are added.
 * * Select line of logs in order to copy them into clipboard.
 * * Navigate using keyboard.
 * * Colorize the log message using ANSI format specification.
 * * Customize the ANSI color palette.
 *
 * ## Follow
 *
 * The follow property gives the ability to force the scroll to bottom while logs are added to the component.
 * This property still allow users to scroll up to stop following logs.
 * The follow behavior is automatically reactivated everytime users scroll to the bottom (or near the bottom).
 * The `cc-logs:followChanged` event is fired whenever the follow property changes because of a user interaction.
 *
 * ## Selection
 *
 * A gutter on the left allows users to select logs.
 * Selecting logs allows user to copy (using a button or the `Ctrl+C` keystroke).
 * There are two ways to select logs:
 *
 * The first one is by clicking on the select button in the gutter next to a line of log.
 * Users can then use `Ctrl` and `Shift` modifier keys to select multiple lines.
 *
 * Another way is by dragging with the mouse.
 * The drag movement is initiated when user press the mouse button inside the gutter.
 * It ends when user releases the button.
 *
 * ## Keyboard navigation
 *
 * Users can navigate with keyboard through the list of logs:
 *
 * * `ArrowUp` and `ArrowDow` to move the focus from select button to another.
 * * `Space` or `Enter` to activate the focused select button.
 * * `Escape` to clear the selection.
 * * `Ctrl+C` to copy the selection to clipboard.
 *
 * Note that the default behavior of the `ArrowUp` and `ArrowDown` keys has been overridden (by default these keys scrolls).
 * But users still have the `PageUp` and `PageDown` keys to scroll.
 *
 * ## ANSI support
 *
 * The component supports ANSI format for log message. It supports:
 *
 * * Effects
 *   * `ESC[0m`: reset
 *   * `ESC[1m`: bold
 *   * `ESC[2m`: dim
 *   * `ESC[3m`: italic
 *   * `ESC[4m`: underline
 *   * `ESC[7m`: inverse
 *   * `ESC[8m`: hidden
 *   * `ESC[9m`: strikethrough
 * * 16 foreground and background Colors
 *   * `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
 *   * `bright-black`, `bright-red`, `bright-green`, `bright-yellow`, `bright-blue`, `bright-magenta`, `bright-cyan`, `bright-white`
 *
 * ## Public API
 *
 * ### scrolling to bottom
 *
 * The component provides a method to scroll down to the bottom:
 * ```javascript
 * document.querySelector('cc-logs').scrollToBottom();
 * ```
 *
 * ### Appending logs
 *
 * The component provides methods to append logs:
 * ```javascript
 * const log = {id: 'abcd1234', timestamp: new Date().getTime(), message: 'log message'};
 * document.querySelector('cc-logs').appendLog(log);
 * ```
 *
 * ```javascript
 * const logs = [log1, log2, log3];
 * document.querySelector('cc-logs').appendLogs(logs);
 * ```
 *
 * @cssdisplay flex
 *
 * @event {CustomEvent} cc-logs:followChanged - Fires whenever the follow changed because of user interaction
 *
 * @cssprop {Color} --ansi-foreground - The foreground color
 * @cssprop {Color} --ansi-background - The background color
 * @cssprop {Color} --ansi-background-hover - The background color when mouse is hover a log
 * @cssprop {Color} --ansi-background-selected - The background color when log is selected
 * @cssprop {Color} --ansi-black - The black color
 * @cssprop {Color} --ansi-red - The red color
 * @cssprop {Color} --ansi-green - The green color
 * @cssprop {Color} --ansi-yellow - The yellow color
 * @cssprop {Color} --ansi-blue - The blue color
 * @cssprop {Color} --ansi-magenta - The magenta color
 * @cssprop {Color} --ansi-cyan - The cyan color
 * @cssprop {Color} --ansi-white - The white color
 * @cssprop {Color} --ansi-bright-black - The bright black color
 * @cssprop {Color} --ansi-bright-red - The bright red color
 * @cssprop {Color} --ansi-bright-green - The bright green color
 * @cssprop {Color} --ansi-bright-yellow - The bright yellow color
 * @cssprop {Color} --ansi-bright-blue - The bright blue color
 * @cssprop {Color} --ansi-bright-magenta - The bright magenta color
 * @cssprop {Color} --ansi-bright-cyan - The bright cyan color
 * @cssprop {Color} --ansi-bright-white - The bright white color
 */
export class CcLogsComponent extends LitElement {
  static get properties () {
    return {
      follow: { type: Boolean },
      limit: { type: Number },
      logs: { type: Array },
      metadataRenderers: { type: Object },
      filter: { type: Array },
      stripAnsi: { type: Boolean, attribute: 'strip-ansi' },
      timestampDisplay: { type: String, attribute: 'timestamp-display' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
      _filteredLogs: { type: Array, state: true },
      _focusedId: { type: String, state: true },
      _selection: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Whether the component should scroll to the bottom everytime a new log line is added. */
    this.follow = false;

    /** @type {number|null} The maximum number of logs to display. `null` for no limit. */
    this.limit = null;

    /** @type {Array<Log>} The initial logs. */
    this.logs = [];

    /** @type {{[key: string], MetadataRenderer}} The custom renderers to use for displaying metadata. */
    this.metadataRenderers = {};

    /** @type {Array<MetadataFilter>} The filter to apply onto the logs. */
    this.filter = [];

    /** @type {boolean} Whether to strip ANSI from log message. */
    this.stripAnsi = false;

    /** @type {TimestampDisplay} The timestamp display. */
    this.timestampDisplay = 'datetime-iso';

    /** @type {Timezone} The timezone to use when displaying timestamp. */
    this.timezone = 'UTC';

    /** @type {boolean} Whether to wrap long lines. */
    this.wrapLines = false;

    /** @type {Array<Log>} The internal logs collection to be displayed. */
    this._filteredLogs = [];

    /** @type {Array<Log>} The internal full collection of logs. */
    this._logs = [];

    /** @type {Ref<Virtualizer>} A reference to the logs container. */
    this._logsRef = createRef();

    /** @type {Array<string>} The internal selection. */
    this._selection = [];

    /** @type {string|null} The id of the first selected log. Useful to implement selection with Shift modifier keys. */
    this._lastSingleSelection = null;

    /**
     * @type {TimestampFormatter} The formatter to use to format timestamp.
     * It is maintained in sync with the `timestampDisplay` and `timezone` properties.
     */
    this._timestampFormatter = this._resolveTimestampFormatter();

    /** @type {LogsCtrl} Controls the logs collection. */
    this._logsCtrl = new LogsCtrl(this);

    /** @type {SelectionCtrl} Controls the selection. */
    this._selectionCtrl = new SelectionCtrl(this);

    /** @type {DragSelectionCtrl} Controls the selection done with mouse dragging movement. */
    this._dragSelectionCtrl = new DragSelectionCtrl(
      () => this._logsRef.value,
      this._selectionCtrl,
      this._logsCtrl,
    );

    /**
     * @type {function(log: Log): boolean|null} The function to use to filter the visible logs.
     * It is maintained in sync with the `timestampDisplay` and `timezone` properties.
     */
    this._filterPredicate = null;

    /** @type {string|null} The id of the log for which the select button is focused. */
    this._focusedId = null;

    /** @type {string|null} The id of the log for which the select button focus was lost. */
    this._focusLostId = null;

    /** @type {{first: number, last: number}} The range of the visible logs in the virtualizer viewport. */
    this._visibleRange = { first: -1, last: -1 };

    /** @type {{ctrl: boolean, shift: boolean}} The modifiers key currently pressed. */
    this._modifierKeys = {
      ctrl: false,
      shift: false,
    };
  }

  // region Private methods

  _resolveTimestampFormatter () {
    return new TimestampFormatter(this.timestampDisplay, this.timezone);
  }

  _getElementAtIndex (index) {
    return this.shadowRoot.querySelector(`.log[data-index="${index}"]`);
  }

  /**
   * @param {Event} e
   * @return {{inSelectButton: boolean, log: null|{element: Element, index: number, id: string}, inGutter: boolean}}
   */
  _getMouseEventPosition (e) {
    return this._logsCtrl.getPosition(e.composedPath().filter((n) => n instanceof HTMLElement));
  }

  /**
   * @param {Metadata} metadata
   * @return {MetadataRendering}
   */
  _getMetadataRendering (metadata) {
    const renderer = this.metadataRenderers[metadata.name];

    if (renderer == null) {
      return DEFAULT_METADATA_RENDERING;
    }

    const metadataRendering = typeof renderer === 'function' ? renderer(metadata) : renderer;

    /** @type {MetadataRendering} */
    return {
      ...DEFAULT_METADATA_RENDERING,
      ...metadataRendering,
    };
  }

  /**
   * @param {Metadata} metadata
   * @param {MetadataRendering} metadataRendering
   * @return {string}
   */
  _getMetadataText (metadata, metadataRendering) {
    return metadataRendering.text != null
      ? metadataRendering.text
      : `${metadataRendering.showName ? `${metadata.name}: ` : ''}${metadata.value}`;
  }

  _resetSelection () {
    this._selectionCtrl.clear();
    this._lastSingleSelection = null;
    this._focusLostId = null;
    this._focusedId = null;
    this._dragSelectionCtrl.end();
  }

  _applyLimit () {
    if (this.limit == null || this.limit === -1) {
      return false;
    }
    const offset = this._logs.length - this.limit;
    if (offset <= 0) {
      return false;
    }

    if (!this._selectionCtrl.isEmpty()) {
      const removed = this._logs.slice(0, offset);
      this._selectionCtrl.removeAll(removed.map((l) => l.id));
    }

    this._logs = this._logs.slice(offset);

    return true;
  }

  _hasFilter () {
    return this._filterPredicate != null;
  }

  _createFilterPredicate (filter) {
    if (filter == null || filter.length === 0) {
      return null;
    }

    /**
     * @param {Array<function(log: Log): boolean>} predicates
     * @return {function(log: Log): boolean}
     */
    const and = (predicates) => {
      return (log) => {
        for (const predicate of predicates) {
          if (!predicate(log)) {
            return false;
          }
        }
        return true;
      };
    };

    /**
     * @param {Array<function(log: Log): boolean>} predicates
     * @return {function(log: Log): boolean}
     */
    const or = (predicates) => {
      return (log) => {
        for (const predicate of predicates) {
          if (predicate(log)) {
            return true;
          }
        }
        return false;
      };
    };

    /**
     *
     * @param filter
     * @return {function(log: Log): boolean}
     */
    const predicate = (filter) => (log) => {
      const logMetadata = log.metadata.find((m) => m.name === filter.metadata);
      return logMetadata?.value === filter.value;
    };

    const filtersGroups = Object.values(groupBy(filter, 'metadata'));

    return and(filtersGroups.map((filters) => or(filters.map((filter) => predicate(filter)))));
  }

  _filter (filter, logs) {
    if (!this._hasFilter()) {
      return logs;
    }

    return logs.filter(this._filterPredicate);
  }

  _applyFilter () {
    this._filteredLogs = this._filter(this.filter, this._logs);
  }

  // endregion

  // region Follow logic

  /**
   * When logs are appended very fast, the scroll event is fired very often.
   * We sometimes need to inhibit the follow binding to let the user action go through.
   */
  _inhibitFollowBindingTemporarily () {
    this._followBindingInhibited = true;
    setTimeout(() => {
      this._followBindingInhibited = false;
    }, 100);
  }

  /**
   * Sets the `follow` property.
   * If the `follow` property has changed, a `followChanged` event is dispatched.
   */
  _setFollow (follow) {
    if (this.follow === follow) {
      return;
    }

    this.follow = follow;
    // We don't want the follow binding to interfere with this instruction
    this._inhibitFollowBindingTemporarily();
    if (this.follow) {
      this._logsRef.value.scrollTop = this._logsRef.value.scrollHeight;
    }
    dispatchCustomEvent(this, 'followChanged', this.follow);
  }

  /**
   * This event handler is called whenever the visible items in the logs container viewport change.
   *
   * It implements the follow binding which is about adjusting the `follow` property according to the scroll position from the end.
   * If the second to last element is visible, we set the `follow` property to `true`, otherwise we set it to `false`.
   *
   * We also keep track of the first and last visible elements because we need them during keyboard navigation.
   */
  _onVisibilityChanged (e) {
    this._visibleRange = { first: e.first, last: e.last };

    if (this._followBindingInhibited || this._focusedId != null || this._dragSelectionCtrl.isDragging()) {
      return;
    }

    const shouldFollow = e.last >= this._filteredLogs.length - 2;
    this._setFollow(shouldFollow);
  }

  /**
   * When logs are appended very fast, the visibilityChanged event is fired very often.
   * We need to listen to the wheel event to force unpinning.
   */
  _onMouseWheel (e) {
    if (e.deltaY < 0) {
      this._setFollow(false);
    }
  }

  // endregion

  // region Copy to clipboard logic

  _copySelectionToClipboard () {
    if (this._selectionCtrl.isEmpty()) {
      return;
    }

    const lines = this._selectionCtrl.selection
      .map((id) => this._logsCtrl.findIndexById(id))
      .sort((i, j) => i - j)
      .map((i) => this._logsCtrl.findLogByIndex(i))
      .map((log) => {
        const ts = this._timestampFormatter.format(log.timestamp);
        const meta = log.metadata
          ?.map((m) => this._getMetadataText(m, this._getMetadataRendering(m)))
          .filter((t) => t?.length > 0)
          .join(' ');
        return [ts, meta, log.message].filter((t) => t?.length > 0).join(' ');
      });

    const data = copyDataFromLines(lines);

    copyToClipboard(data.text, data.html).then(() => {
      const notification = lines.length === 1
        ? i18n('cc-logs.copied.single')
        : i18n('cc-logs.copied.multi', { count: lines.length });
      notifySuccess(notification);
    });
  }

  /**
   * This event handler captures the Ctrl+C native shortcut for copy to clipboard.
   * It takes the browser text selection as input.
   * Both plain text and html version of this text selection are put in the clipboard.
   */
  _onCopy (e) {
    const lines = document.getSelection().toString().split(/[\r\n]+/gm);
    const data = copyDataFromLines(lines);
    e.clipboardData.setData('text/plain', data.text);
    e.clipboardData.setData('text/html', data.html);
    e.preventDefault();
  }

  /**
   * This event handler is called when the copy button is clicked.
   * It takes the logic selection (done with the gutter) as input.
   * Both plain text and html version of this text selection are put in the clipboard.
   */
  _onCopyButtonClick () {
    this._copySelectionToClipboard();
  }

  // endregion

  // region Mouse click selection logic

  /**
   * This event handler is called when users click on the logs container.
   *
   * It does nothing if the drag selection is still running.
   *
   * If click is outside gutter, the selection is discarded.
   *
   * If a triple click is detected, we select the whole log line.
   *
   * Is the click is on the select button, we handle the selection.
   */
  _onMouseUp (e) {
    if (this._dragSelectionCtrl.isDragging()) {
      return;
    }

    const position = this._getMouseEventPosition(e);

    if (!position.inGutter) {
      this._selectionCtrl.clear();
      this._lastSingleSelection = null;

      if (e.detail === 3 && position.log != null) {
        this._handleTripleClick(position.log.element);
      }
    }
    else if (position.log != null) {
      this._handleSelection(position.log.id);
      this._focusedId = position.log.id;
    }
  }

  /**
   * Handles the selection with support of Ctrl and Shift modifiers key
   */
  _handleSelection (id) {
    if (this._modifierKeys.ctrl) {
      if (this._selectionCtrl.isSelected(id)) {
        this._selectionCtrl.remove(id);
      }
      else {
        this._selectionCtrl.add(id);
      }
    }
    else if (this._modifierKeys.shift) {
      if (this._selectionCtrl.isEmpty() || this._lastSingleSelection == null) {
        this._selectionCtrl.selection = [id];
      }
      else {
        this._selectionCtrl.selection = this._logsCtrl.range(this._lastSingleSelection, id);
      }
    }
    else {
      if (!this._selectionCtrl.isSelected(id) || this._selectionCtrl.size() > 1) {
        this._selectionCtrl.selection = [id];
      }
      else {
        this._selectionCtrl.clear();
      }
    }

    if (this._selectionCtrl.size() === 1) {
      this._lastSingleSelection = id;
    }

    this._setFollow(false);
  }

  /**
   * We force the triple click to select the whole line of logs
   */
  _handleTripleClick (logElement) {
    window.getSelection().empty();
    const range = document.createRange();
    range.selectNode(logElement);
    window.getSelection().addRange(range);
  }

  // endregion

  // region Mouse drag selection logic

  /**
   * This event handler is called when users click in the gutter.
   * It initiates the selection drag movement using `this._dragSelectionCtrl.start()`.
   */
  _onMouseDown (e) {
    const position = this._getMouseEventPosition(e);
    if (!position.inGutter || position.log == null) {
      return;
    }

    this._dragSelectionCtrl.start(position.log.id, e.ctrlKey);
    this._setFollow(false);

    if (!position.inSelectButton) {
      // here we avoid starting a text selection
      e.preventDefault();
    }
  }

  // endregion

  // region Keyboard navigation logic

  /**
   * This event handler is called when user press a key.
   * It implements keyboard navigation.
   *
   * `Escape` key clears the selection
   *
   * `Control` and `Shift` key are tracked because there is a strange implementation in Firefox (we can call this a bug):
   * * ctrl + click with the mouse => e.ctrlKey = true
   * * ctrl + click with the keyboard => e.ctrlKey = false
   *
   * `ArrowDown` and `ArrowKey` overrides the default behavior:
   * Instead of scrolling up and down, it moves the focus from select button to another.
   */
  _onKeyPress (e) {
    // Esc to clear selection
    if (e.key === 'Escape') {
      this._selectionCtrl.clear();
    }
    // we keep track of the ctrl modifier key to handle it in keyboard selection on every browser
    else if (e.key === 'Control') {
      this._modifierKeys.ctrl = true;
    }
    // we keep track of the shift modifier key to handle it in keyboard selection on every browser
    else if (e.key === 'Shift') {
      this._modifierKeys.shift = true;
    }
    // CTRL+C to copy selection
    else if (e.key === 'c' && this._modifierKeys.ctrl) {
      this._copySelectionToClipboard();
    }
    // Space bar or Enter key to select
    else if (e.key === ' ' || e.key === 'Enter') {
      const position = this._getMouseEventPosition(e);
      if (position.inSelectButton && position.log != null) {
        this._handleSelection(position.log.id);
      }
    }
    // Arrow up and Arrow down key to handle focus navigation
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // we don't want to use the native behavior: scroll up/down
      // Note that user will still have PageUp and PageDown keys to scroll up and down
      e.preventDefault();

      // instead we want to navigate through the select buttons
      const inLogsRange = (number) => {
        return inRange(number, 0, this._filteredLogs.length - 1);
      };

      const getNextIndex = (idx) => {
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        return inLogsRange(idx + direction);
      };

      if (this._focusLostId != null) {
        // when the focused item was removed from the DOM because user scrolled too far from it,
        // we scroll to make the element at the center of the viewport
        const focusLostIndex = this._logsCtrl.findIndexById(this._focusLostId);
        const nextIndex = getNextIndex(focusLostIndex);
        this._focusedId = this._logsCtrl.findLogByIndex(nextIndex)?.id;
        this._focusLostId = null;
        this._logsRef.value.element(nextIndex).scrollIntoView({ block: 'center' });

        return;
      }
      else if (this._focusedId != null) {
        // when an element is already focused we move the focus to the next element (according to the direction)
        const focusedIndex = this._logsCtrl.findIndexById(this._focusedId);
        const nextIndex = getNextIndex(focusedIndex);
        this._focusedId = this._logsCtrl.findLogByIndex(nextIndex)?.id;

        // when user navigates to an element outside the viewport:
        // the element after the last visible, or the element before the first visible,
        // we force scrolling to make this element fully visible in scroll viewport.
        const isOutsideViewport = focusedIndex <= this._visibleRange.first || focusedIndex >= this._visibleRange.last;
        if (isOutsideViewport) {
          this._getElementAtIndex(focusedIndex)?.scrollIntoView(focusedIndex <= this._visibleRange.first);
        }
      }
      else {
        // when no element was previously focused,
        // we focus the first visible element if user hits the arrow down key,
        // we focus the last visible element if user hits the arrow up key.
        const focusedIndex = inLogsRange(e.key === 'ArrowDown' ? this._visibleRange.first : this._visibleRange.last);
        this._focusedId = this._logsCtrl.findLogByIndex(focusedIndex)?.id;
      }

      // force stop follow when navigating
      this._setFollow(false);
    }
    // This is the same reason as for mouse wheel up: we need to force stop follow
    else if (e.key === 'PageUp') {
      this._setFollow(false);
    }
  }

  /**
   * we keep track of the ctrl and shift modifier keys to handle them in keyboard selection on every browser
   */
  _onKeyUp (e) {
    if (e.key === 'Control') {
      this._modifierKeys.ctrl = false;
    }
    else if (e.key === 'Shift') {
      this._modifierKeys.shift = false;
    }
  }

  _onFocus () {
    this._focusedId = null;
  }

  /**
   * This event handler is called whenever the logs container virtualizer adds child elements to the DOM, or removes child elements from the DOM.
   * It helps in detecting when the focused button is removed from the DOM, which is when user scrolls far from the focused button.
   * When the focused button is removed from the DOM, the focus is lost which is something we want to avoid.
   * Instead, we move to focus on the logs container, and we store the id of the lost button (so that we know where we were when user plays with arrow keys).
   */
  _onRangeChanged (e) {
    if (this._focusedId == null || this._focusLostId != null) {
      return;
    }
    const focusedIndex = this._logsCtrl.findIndexById(this._focusedId);
    if (focusedIndex < e.first || focusedIndex > e.last) {
      this._focusLostId = this._focusedId;
      this._logsRef.value.focus();
    }
  }

  // endregion

  // region Public API

  /**
   * Force scroll to bottom.
   */
  scrollToBottom () {
    this._setFollow(true);
  }

  /**
   * @param {Log} log
   */
  appendLog (log) {
    this.appendLogs([log]);
  }

  /**
   * @param {Array<Log>} logs
   */
  appendLogs (logs) {
    this._logs = [...this._logs, ...logs];
    if (this._applyLimit()) {
      this._applyFilter();
    }
    else {
      this._filteredLogs = [...this._filteredLogs, ...this._filter(this.filter, logs)];
    }
  }

  clear () {
    this._resetSelection();
    this._logs = [];
    this._filteredLogs = [];
  }

  // endregion

  // region Lit lifecycle

  willUpdate (_changedProperties) {
    if (_changedProperties.has('timestampDisplay') || _changedProperties.has('timezone')) {
      this._timestampFormatter = this._resolveTimestampFormatter();
    }

    if (_changedProperties.has('follow')) {
      if (this._logsRef.value != null && this.follow) {
        this._logsRef.value.scrollTop = this._logsRef.value.scrollHeight;
      }
    }

    // When logs property has changed, we reset the internal selection and focus state.
    if (_changedProperties.has('logs')) {
      this.clear();
      this._logs = [...this.logs];
    }

    // When internal _filteredLogs collection has changed and follow is active, we inhibite the follow binding until the element is really added to the DOM.
    // With lit-virtualizer, we need to wait for `layoutComplete` to make sure the DOM is updated (hooking on the `updated()` function won't be enough).
    // We do that because we are sure that after adding element we want to continue follow.
    if (_changedProperties.has('_filteredLogs')) {
      if (this._logsRef.value != null && this.follow && !this._followBindingInhibited) {
        this._followBindingInhibited = true;
        this._logsRef.value.layoutComplete.then(() => {
          this._followBindingInhibited = false;
        });
      }
    }

    if (_changedProperties.has('limit')) {
      this._applyLimit();
    }

    if (_changedProperties.has('filter')) {
      this._filterPredicate = this._createFilterPredicate(this.filter);
      this._applyFilter();
    }

    if (_changedProperties.has('_selection')) {
      if (!this._selectionCtrl.isEmpty()) {
        document.getSelection().empty();
      }
    }
  }

  firstUpdated (_changedProperties) {
    super.firstUpdated(_changedProperties);
    const observer = new MutationObserver(() => {
      if (this.follow) {
        this._logsRef.value.scrollTop = this._logsRef.value.scrollHeight;
      }
    });
    observer.observe(this._logsRef.value, { childList: true });
    this._disconnectFollowBinding = () => {
      observer.disconnect();
    };
  }

  updated (_changedProperties) {
    if (_changedProperties.has('_focusedId')) {
      if (this._focusedId == null) {
        this._logsRef.value.focus();
      }
      else {
        const tryToFocus = () => {
          const element = this.shadowRoot.querySelector(`.log[data-id="${this._focusedId}"] .select_button`);
          if (element) {
            element.focus();
            return true;
          }
          return false;
        };
        if (!tryToFocus()) {
          this._logsRef.value.layoutComplete.then(() => {
            tryToFocus();
          });
        }
      }
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this._dragSelectionCtrl.end();
    this._disconnectFollowBinding?.();
  }

  // endregion

  // region Rendering

  render () {
    const __refName = this._logsRef;

    return html`
      <lit-virtualizer
        id="logs"
        tabindex="0"
        ${ref(__refName)}
        .items=${this._filteredLogs}
        ?scroller=${true}
        .keyFunction=${(it) => it.id}
        .renderItem=${(item, index) => this._renderLog(
          item,
          index,
          this.wrapLines,
          this._timestampFormatter,
        )}
        @copy=${this._onCopy}
        @focus=${this._onFocus}
        @keydown=${this._onKeyPress}
        @keyup=${this._onKeyUp}
        @mousedown=${this._onMouseDown}
        @mouseup=${this._onMouseUp}
        @rangeChanged=${this._onRangeChanged}
        @visibilityChanged=${this._onVisibilityChanged}
        @wheel=${this._onMouseWheel}
      ></lit-virtualizer>
      ${!this._selectionCtrl.isEmpty()
        ? html`
          <cc-button
            class="copy_button"
            .icon=${iconCopy}
            @cc-button:click=${this._onCopyButtonClick}
            ?hide-text="${true}">${i18n('cc-logs.copy')}
          </cc-button>`
        : null
      }
    `;
  }

  /**
   * Renders a single line of log.
   *
   * @param {Log} log
   * @param {number} index
   * @param {boolean} wrap
   * @param {TimestampFormatter} timestampFormatter
   * @param {Object<string, MetadataRenderer>} metadataRenderers
   * @param {Object<string, (event: Event) => void>} listeners
   */
  _renderLog (log, index, wrap, timestampFormatter) {
    const selected = this._selectionCtrl.isSelected(log.id);
    const selectButtonLabel = selected
      ? i18n('cc-logs.unselect-button.label', { index })
      : i18n('cc-logs.select-button.label', { index });

    return html`
      <p
        class="log ${classMap({ selected })}"
        data-index="${index}"
        data-id="${log.id}"
      >
        <span class="gutter">
          <button
            class="select_button visually-hidden-focusable"
            title="${selectButtonLabel}"
            aria-label="${selectButtonLabel}"
            aria-pressed=${selected}
            tabindex="-1"
          >
            <cc-icon .icon=${iconSelected} size="xs"></cc-icon>
          </button>
        </span>
        ${this._renderLogTimestamp(log, timestampFormatter)}
        <span class="log--right ${classMap({ wrap: wrap })}">
          ${this._renderLogMetadata(log)}
          ${this._renderLogMessage(log)}
        </span>
      </p>
    `;
  }

  /**
   * @param {Log} log
   * @param {TimestampFormatter} timestampFormatter
   */
  _renderLogTimestamp (log, timestampFormatter) {
    if (timestampFormatter.display === 'none') {
      return null;
    }

    return html`<span class="timestamp">
      ${timestampFormatter.formatAndMapParts(log.timestamp, (k, v) => html`<span class="${k}">${v}</span>`)}
    </span>`;
  }

  /**
   * @param {Log} log
   * @param {Object<string, MetadataRenderer>} metadataRenderers
   */
  _renderLogMetadata (log) {
    if (log.metadata == null) {
      return null;
    }

    return html`
      <span class="metadata--wrapper">
        ${
          join(
            log.metadata
              .map((metadata) => this._renderMetadata(metadata))
              .filter((t) => t != null),
            html`&nbsp;`,
          )
        }
      </span>
    `;
  }

  /**
   * @param {Metadata} metadata
   */
  _renderMetadata (metadata) {
    const metadataRendering = this._getMetadataRendering(metadata);
    if (metadataRendering.hidden) {
      return null;
    }

    const text = this._getMetadataText(metadata, metadataRendering);
    const paddingSize = (metadataRendering.size ?? 0) - text.length;
    const padding = paddingSize > 0
      ? html`<span class="pad" style="width: ${paddingSize}ch"></span>`
      : '';
    const classInfo = { strong: metadataRendering.strong, [metadataRendering.intent]: true };

    // Keep this in one line to avoid any extra whitespace.
    return html`<span class="${classMap(classInfo)}">${text}${padding}</span>`;
  }

  /**
   * @param {Log} log
   */
  _renderLogMessage (log) {
    return html`
      <span class="message">
        ${this.stripAnsi ? stripAnsi(log.message) : ansiToLit(log.message)}
      </span>
    `;
  }

  // endregion

  static get styles () {
    return [
      accessibilityStyles,
      ...ansiStyles,
      unsafeCSS(`:host {${DEFAULT_PALETTE_STYLE}}`),
      // language=CSS
      css`
        :host {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        :focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        #logs {
          overflow: auto;
          flex: 1;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.9em;
        }

        .log {
          display: flex;
          width: 100%;
          align-items: center;
          margin: 0;
          gap: 0.5em;
        }

        .log:hover {
          background-color: var(--ansi-background-hover);
        }

        .log.selected {
          background-color: var(--ansi-background-selected);
        }

        .log:hover .select_button,
        .log.selected .select_button {
          position: unset;
          overflow: visible;
          width: auto;
          height: auto;
          margin: auto;
          clip: auto;
          clip-path: none;
          white-space: normal;
        }

        .log--right {
          line-height: 1.7em;
          white-space: nowrap;
        }

        .log--right.wrap {
          white-space: normal;
        }

        .gutter {
          display: flex;
          width: 1.6em;
          flex-shrink: 0;
          align-self: stretch;
          padding-top: 0.2em;
          padding-right: 2px;
          padding-left: 2px;
          border-right: 1px solid var(--ansi-foreground);
          cursor: pointer;
        }

        .select_button {
          display: flex;
          height: 1.3em !important;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          margin: 0 !important;
          background: none;
          color: var(--ansi-foreground);
          cursor: pointer;
        }

        .select_button:focus {
          outline-offset: 0;
        }

        .select_button cc-icon {
          color: #737373;
        }

        .select_button[aria-pressed='true'] cc-icon {
          color: var(--cc-color-text-primary, #000);
        }

        .copy_button {
          position: absolute;
          top: 0.5em;
          right: 1em;
        }

        .pad {
          display: inline-block;
        }

        .strong {
          font-weight: bold;
        }

        .neutral {
          color: var(--ansi-foreground);
        }

        .info {
          color: var(--ansi-blue);
        }

        .success {
          color: var(--ansi-green);
        }

        .warning {
          color: var(--ansi-yellow);
        }

        .danger {
          color: var(--ansi-red);
        }

        .timestamp {
          align-self: start;
          padding-top: 0.2em;
          white-space: nowrap;
        }

        .milliseconds,
        .separator,
        .timezone {
          opacity: 0.7;
        }
      `];
  }
}

window.customElements.define('cc-logs', CcLogsComponent);
