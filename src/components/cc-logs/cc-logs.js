import { VirtualizerController } from '@tanstack/lit-virtual';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { join } from 'lit/directives/join.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixFileCopyLine as iconCopy,
  iconRemixFocus_2Line as iconInspect,
  iconRemixCheckboxBlankCircleFill as iconSelected,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import { ansiStyles, ansiToLit, stripAnsi } from '../../lib/ansi/ansi.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import { copyToClipboard, prepareLinesOfCodeForClipboard } from '../../lib/clipboard.js';
import { hasClass } from '../../lib/dom.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { notifySuccess } from '../../lib/notifications.js';
import { isStringEmpty, truncateString } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcLogInspectEvent, CcLogsFollowChangeEvent } from './cc-logs.events.js';
import { DateDisplayer } from './date-displayer.js';
import { LogsController } from './logs-controller.js';
import { LogsInputController } from './logs-input-controller.js';

// The estimated height (in pixels) of a single log line.
// This is only used by the virtualizer for logs that are not in the DOM yet (their real size is measured once rendered).
const ESTIMATED_LOG_LINE_HEIGHT = 21;

// How many extra logs the virtualizer renders above and below the viewport to smooth out scrolling.
const VIRTUALIZER_OVERSCAN = 10;

// The maximum distance (in pixels) from the bottom of the scroll container under which we consider the user is at the
// bottom of the logs and the follow should be (re)activated. It absorbs sub-pixel rounding from dynamic measurement.
const FOLLOW_SCROLL_THRESHOLD = 8;

// How long (in milliseconds) auto-follow stays suppressed after a user interaction that must not be interrupted by a
// fresh append re-pinning the view (selecting or dragging logs).
const FOLLOW_SUPPRESS_MS = 150;

// The `@tanstack/virtual-core` internals cc-logs reaches into that are NOT part of the public API: they are declared
// `private` in the library's types, which is why they are accessed by string key. Every access is funnelled through
// `_isVirtualizerScrolling()` / `_forceVirtualizerRemeasure()` so a library upgrade has a single audit point, and
// `cc-logs.virtualizer-contract.test.js` asserts these fields still exist so an incompatible upgrade fails in CI
// instead of silently breaking follow detection and overlap realignment. Verified against @tanstack/virtual-core 3.x.
export const VIRTUALIZER_PRIVATE_FIELDS = ['scrollState', 'pendingMin', 'itemSizeCacheVersion'];

/** @type {MetadataRendering} The default metadata renderer */
const DEFAULT_METADATA_RENDERING = {
  hidden: false,
  intent: 'neutral',
  showName: false,
  size: 'auto',
  strong: false,
};

// This style is the default ansi palette plus the ability to be overridden with the css theme.
const DEFAULT_PALETTE_STYLE = ansiPaletteStyle(
  // @ts-ignore
  /** @type {AnsiPalette} */
  (
    Object.fromEntries(
      Object.entries(defaultPalette).map(([name, color]) => [name, `var(--cc-color-ansi-default-${name}, ${color})`]),
    )
  ),
);

/**
 * @import { Log, Metadata, MetadataFilter, MetadataRenderer, MetadataRendering, LogMessageFilterMode } from './cc-logs.types.js'
 * @import { DateDisplay } from './date-display.types.js'
 * @import { AnsiPalette } from '../../lib/ansi/ansi.types.js'
 * @import { Timezone } from '../../lib/date/date.types.js'
 * @import { Virtualizer } from '@tanstack/virtual-core'
 * @import { PropertyValues } from 'lit'
 * @import { EventWithTarget, GenericEventWithTarget } from '../../lib/events.types.js'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component displaying lines of log.
 *
 * A line of log is made of:
 *
 * * an id
 * * a date
 * * a message
 * * some metadata
 *
 * ## Details
 *
 * The component gives the ability to:
 *
 * * Display a huge amount of logs by using a <a href="https://tanstack.com/virtual">scroll virtualizer</a>.
 * * Limit the amount of logs to be displayed.
 * * Filter the logs by metadata.
 * * Wrap the long lines.
 * * Customize the format of the date (by default, it is displayed using <a href="https://www.w3.org/TR/NOTE-datetime">ISO-8601</a> as UTC).
 * * Hide the date.
 * * Customize the way the metadata are displayed.
 * * Follow the logs (force scroll to bottom) while some new logs are added.
 * * Select lines of logs in order to copy them into clipboard.
 * * Navigate using keyboard.
 * * Colorize the log message using ANSI format specification.
 * * Customize the ANSI color palette.
 *
 * ## Follow
 *
 * The follow property gives the ability to force the scroll to bottom while logs are added to the component.
 * This property still allows users to scroll up to stop following logs.
 * The follow behavior is automatically reactivated everytime users scroll to the bottom.
 * The `cc-logs-follow-change` event is fired whenever the follow property changes because of a user interaction.
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
 * The drag movement is initiated when the user presses the mouse button inside the gutter.
 * It ends when the user releases the button.
 *
 * ## Keyboard navigation
 *
 * Users can navigate with keyboard through the list of logs:
 *
 * * `ArrowUp` and `ArrowDow` to move the focus from a select button to another.
 * * `Space` or `Enter` to activate the focused select button.
 * * `Escape` to clear the selection.
 * * `Ctrl+C` to copy the selection to clipboard.
 *
 * Note that the default behavior of the `ArrowUp` and `ArrowDown` keys has been overridden (by default these keys scrolls).
 * But users still have the `PageUp` and `PageDown` keys to scroll.
 *
 * ## ANSI support
 *
 * The component supports ANSI format for log messages. It supports:
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
 * ## Limiting
 *
 * Setting a limit is encouraged in order to cap the memory usage.
 * The limit is applied directly on the appended logs.
 * So if you have a limit of 50000, when appending the 50001st log, the first log will be discarded.
 * Note that the limit is applied before the filter.
 *
 * ## Public API
 *
 * ### Scrolling to bottom
 *
 * The component provides a method to scroll down to the bottom:
 * ```javascript
 * document.querySelector('cc-logs').scrollToBottom();
 * ```
 *
 * ### Appending logs
 *
 * The component provides a method to append logs:
 *
 * ```javascript
 * const logs = [log1, log2, log3];
 * document.querySelector('cc-logs').appendLogs(logs);
 * ```
 *
 * ## Accessibility
 *
 * This component is **not compatible with screen readers** because it relies on a virtualizer.
 * This virtualizer allows the component to display a huge amount of logs without slowing or even crashing the browser.
 *
 * Only the visible lines of logs and a few more are actually present within the DOM.
 * The rest of the logs lives in memory and is added dynamically with JavaScript.
 *
 * The component is still usable with screen readers but when it comes to scrolling back to older logs, the experience won't be very good.
 * This is why **developers implementing this component must make sure that logs can be downloaded from the same page**.
 * This is a decent solution to mitigate the issue as it allows users to view their logs with tools they are used to (their IDE for instance).
 *
 * On the contrary, the component is fully compatible with keyboard only navigation. For more information see the `Keyboard navigation` section.
 *
 * @cssdisplay block
 *
 * @cssprop {Color} --cc-color-ansi-foreground - The foreground color
 * @cssprop {Color} --cc-color-ansi-background - The background color
 * @cssprop {Color} --cc-color-ansi-background-hover - The background color when mouse is hover a log
 * @cssprop {Color} --cc-color-ansi-background-selected - The background color when log is selected
 * @cssprop {Color} --cc-color-ansi-black - The black color
 * @cssprop {Color} --cc-color-ansi-red - The red color
 * @cssprop {Color} --cc-color-ansi-green - The green color
 * @cssprop {Color} --cc-color-ansi-yellow - The yellow color
 * @cssprop {Color} --cc-color-ansi-blue - The blue color
 * @cssprop {Color} --cc-color-ansi-magenta - The magenta color
 * @cssprop {Color} --cc-color-ansi-cyan - The cyan color
 * @cssprop {Color} --cc-color-ansi-white - The white color
 * @cssprop {Color} --cc-color-ansi-bright-black - The bright black color
 * @cssprop {Color} --cc-color-ansi-bright-red - The bright red color
 * @cssprop {Color} --cc-color-ansi-bright-green - The bright green color
 * @cssprop {Color} --cc-color-ansi-bright-yellow - The bright yellow color
 * @cssprop {Color} --cc-color-ansi-bright-blue - The bright blue color
 * @cssprop {Color} --cc-color-ansi-bright-magenta - The bright magenta color
 * @cssprop {Color} --cc-color-ansi-bright-cyan - The bright cyan color
 * @cssprop {Color} --cc-color-ansi-bright-white - The bright white color
 */
export class CcLogs extends LitElement {
  static get properties() {
    return {
      dateDisplay: { type: String, attribute: 'date-display' },
      follow: { type: Boolean },
      limit: { type: Number },
      logs: { type: Array },
      messageFilter: { type: String, attribute: 'message-filter' },
      messageFilterMode: { type: String, attribute: 'message-filter-mode' },
      metadataFilter: { type: Array, attribute: 'metadata-filter' },
      metadataRenderers: { type: Object, attribute: 'metadata-renderers' },
      stripAnsi: { type: Boolean, attribute: 'strip-ansi' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
      _horizontalScrollbarHeight: { type: Number, state: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Whereas the component should scroll to the bottom everytime a new log line is added. */
    this.follow = false;

    /** @type {number|null} The maximum number of logs the component can handle in memory. `null` for no limit. */
    this.limit = null;

    /** @type {Array<Log>} The initial logs. */
    this.logs = [];

    /** @type {string|null} The filter to apply onto the logs' message. */
    this.messageFilter = null;

    /** @type {LogMessageFilterMode} The mode used to filter by message. */
    this.messageFilterMode = 'loose';

    /** @type {Array<MetadataFilter>} The filter to apply onto the logs' metadata. */
    this.metadataFilter = [];

    /** @type {{[key: string]: MetadataRenderer}|null} The custom renderers to use for displaying metadata. */
    this.metadataRenderers = null;

    /** @type {boolean} Whereas to strip ANSI from log messages. */
    this.stripAnsi = false;

    /** @type {DateDisplay} The date display. */
    this.dateDisplay = 'datetime-iso';

    /** @type {Timezone} The timezone to use when displaying date. */
    this.timezone = 'UTC';

    /** @type {boolean} Whereas to wrap long lines. */
    this.wrapLines = false;

    /** @type {number|null} The currently dragged log index. */
    this._draggedLogIndex = null;

    /** @type {boolean} Whereas the focused index is in the DOM. */
    this._focusedIndexIsInDom = false;

    /**
     * @type {number} Timestamp (ms) until which auto-follow derivation is suppressed. Set while the user is selecting
     * or dragging so a fresh append cannot silently re-pin the view to the bottom under them.
     */
    this._followSuppressedAt = 0;

    /** @type {LogsInputController} */
    this._inputCtrl = new LogsInputController(this);

    /** @type {LogsController} */
    this._logsCtrl = new LogsController(this);

    /** @type {Ref<HTMLDivElement>} A reference to the scrollable logs' container. */
    this._logsRef = createRef();

    // workaround for https://github.com/lit/lit/issues/3619
    this._measureElement = this._measureElement.bind(this);

    /** @type {number} The height in pixel of the horizontal scroll bar. */
    this._horizontalScrollbarHeight = 0;

    /**
     * @type {VirtualizerController<HTMLDivElement, HTMLElement>} The virtualizer rendering only the visible logs.
     * Its `count` and `paddingEnd` options are kept in sync within `willUpdate()`.
     */
    this._virtualizerController = new VirtualizerController(this, this._buildVirtualizerOptions());

    // A trailing controller that keeps the view pinned to the bottom while following. It is registered AFTER the
    // virtualizer controller on purpose: the virtualizer restores/anchors the scroll position in its own `hostUpdated`,
    // so we must re-pin to the end after that, otherwise our scroll would be undone. `anchorTo: 'end'` then holds the
    // pin through the asynchronous re-measurement of the freshly appended logs.
    this.addController({ hostUpdated: () => this._pinToBottomIfFollowing() });

    /** @type {DateDisplayer} */
    this._dateDisplayer = this._resolveDateDisplayer();

    /** @type {{last: number, first: number}} The range of visible logs in the virtualizer. */
    this._visibleRange = { first: -1, last: -1 };

    /** @type {Log|null} A log we must scroll into view (and center) on the next update, set by the inspect action. */
    this._logToScrollIntoView = null;

    /**
     * @type {string|null} Signature (rendered log ids + wrap mode) of the rows measured during the last `updated()`.
     * Used to skip the re-measure loop when the rendered content did not change.
     */
    this._lastMeasureSignature = null;

    // workaround for https://github.com/lit/lit/issues/3619
    this._onMouseDownGutter = this._onMouseDownGutter.bind(this);
    this._onFocusLog = this._onFocusLog.bind(this);
  }

  // region Public methods

  /**
   * Appends some logs.
   *
   * @param {Array<Log>} logs The logs to append
   */
  appendLogs(logs) {
    this._logsCtrl.append(logs);
  }

  /**
   * Clears the logs
   */
  clear() {
    this._logsCtrl.clear();
  }

  /**
   * Forces scroll to the bottom
   */
  scrollToBottom() {
    // Explicit user/host intent: clear any follow suppression and re-pin to the end. `followOnAppend` then keeps the
    // view glued to the bottom for the subsequent appends (kept in sync with `follow` in `willUpdate()`).
    this._followSuppressedAt = 0;
    this._setFollow(true);
    this._getVirtualizer().scrollToEnd({ behavior: 'auto' });
  }

  // endregion

  _resolveDateDisplayer() {
    return new DateDisplayer(this.dateDisplay, this.timezone);
  }

  // region Virtualizer

  /**
   * Builds the options for the TanStack virtualizer.
   *
   * This is only used to create the virtualizer. The dynamic options (`count` and `paddingEnd`) are then kept in sync
   * through `setOptions()` on each update (see `willUpdate()`).
   *
   * @return {import('@tanstack/virtual-core').PartialKeys<import('@tanstack/virtual-core').VirtualizerOptions<HTMLDivElement, HTMLElement>, 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'>}
   */
  _buildVirtualizerOptions() {
    return {
      getScrollElement: () => this._logsRef.value,
      count: this._logsCtrl.listLength,
      estimateSize: () => ESTIMATED_LOG_LINE_HEIGHT,
      // We deliberately key the virtualizer's caches by index (the default) and NOT by log id.
      // Keying by id makes the `itemSizeCache` and `elementsCache` grow by one entry for every log that ever scrolls
      // into view (they are only pruned for disconnected elements, but our line elements are reused and stay
      // connected). With an endless stream of logs this is an unbounded memory leak that eventually crashes the tab.
      // Keying by index bounds both caches to the number of logs (the `limit`). The visible lines are kept measured
      // correctly by the re-measure loop in `updated()`.
      overscan: VIRTUALIZER_OVERSCAN,
      // `anchorTo: 'end'` makes the virtualizer keep the view pinned to the bottom while logs are (re)measured: when a
      // line settles to a height different from the estimate, it adjusts the scroll offset to absorb the change instead
      // of letting the bottom drift. This is what makes following stable through the measurement churn of a big append —
      // we only have to scroll to the end once (see `_pinToBottomIfFollowing()`) and the virtualizer holds it there.
      anchorTo: 'end',
      // Tolerance for considering the view "at the end" (must match the follow detection threshold).
      scrollEndThreshold: FOLLOW_SCROLL_THRESHOLD,
      // Adds some space at the bottom so the last log is not hidden behind the horizontal scrollbar.
      paddingEnd: this._horizontalScrollbarHeight,
      measureElement: (element, _entry, instance) => {
        // Measure the real rendered height of a log line.
        // We guard against a 0 height: a `ResizeObserver` notification can report a 0 height transiently when an
        // element is being detached or reused (which happens a lot when logs are appended by buckets). Caching a 0
        // would make several lines share the same vertical offset and overlap. We keep the row's last measured
        // height when we have one (so an already-measured row does not shrink to the estimate for a frame), and
        // fall back to the estimate only for a row that has never been measured.
        const height = Math.round(element.getBoundingClientRect().height);
        if (height > 0) {
          return height;
        }
        const index = Number(element.dataset.index);
        return instance.itemSizeCache.get(index) ?? ESTIMATED_LOG_LINE_HEIGHT;
      },
      onChange: (virtualizer) => this._onVirtualizerChange(virtualizer),
    };
  }

  /**
   * @return {Virtualizer<HTMLDivElement, HTMLElement>}
   */
  _getVirtualizer() {
    return this._virtualizerController.getVirtualizer();
  }

  /**
   * @param {Virtualizer<HTMLDivElement, HTMLElement>} virtualizer
   * @return {boolean} Whether the virtualizer is currently driving (or reconciling) a programmatic scroll. Reads the
   * private `scrollState` internal — see `VIRTUALIZER_PRIVATE_FIELDS`.
   */
  _isVirtualizerScrolling(virtualizer) {
    return virtualizer['scrollState'] != null;
  }

  /**
   * Forces the virtualizer to recompute its memoized measurements from index 0, after we mutated its `itemSizeCache`
   * directly (clear or shift). Without this it would keep its stale, now-misaligned measurements.
   *
   * Reaches into the private `pendingMin` and `itemSizeCacheVersion` internals (and resets the public
   * `measurementsCache`) — see `VIRTUALIZER_PRIVATE_FIELDS`.
   *
   * @param {Virtualizer<HTMLDivElement, HTMLElement>} virtualizer
   */
  _forceVirtualizerRemeasure(virtualizer) {
    virtualizer.measurementsCache = [];
    virtualizer['pendingMin'] = 0;
    virtualizer['itemSizeCacheVersion']++;
  }

  /**
   * Wired as the `ref` callback of every rendered log line.
   *
   * It registers the element with the virtualizer so it can measure its real height (logs have variable heights,
   * especially when wrapping lines). The virtualizer reads the line index from the `data-index` attribute.
   *
   * @param {Element} [element]
   */
  _measureElement(element) {
    this._getVirtualizer().measureElement(element == null ? null : /** @type {HTMLElement} */ (element));
  }

  /**
   * Focuses the select button of the log at the given index.
   *
   * The element may not be in the DOM yet: after asking the virtualizer to scroll to it, we may need to wait for the
   * next render(s) before being able to focus it.
   *
   * @param {number} logIndex
   * @param {number} [remainingAttempts]
   */
  _focusLogButton(logIndex, remainingAttempts = 10) {
    focusBySelector(this._logsRef.value, `.log[data-index="${logIndex}"] .select_button`, () => {
      if (remainingAttempts > 0) {
        requestAnimationFrame(() => this._focusLogButton(logIndex, remainingAttempts - 1));
      }
    });
  }

  // endregion

  /**
   * Calculates the new drag index according to the given direction and given offset.
   *
   * @param {'up'|'down'} direction The drag direction.
   * @param {number} offset The amount of log to drag.
   * @return {number}
   */
  _getNewDraggedLogIndex(direction, offset) {
    if (direction === 'up') {
      return Math.max(0, this._draggedLogIndex - offset);
    }
    if (direction === 'down') {
      return Math.min(this._draggedLogIndex + offset, this._logsCtrl.listLength - 1);
    }
    throw new Error(`Illegal argument. direction ${direction} is not valid`);
  }

  /** Suppresses auto-follow derivation for a short window (see `FOLLOW_SUPPRESS_MS`). */
  _suppressFollow() {
    this._followSuppressedAt = Date.now();
  }

  /** @return {boolean} Whether auto-follow derivation is currently suppressed. */
  _isFollowSuppressed() {
    return Date.now() - this._followSuppressedAt < FOLLOW_SUPPRESS_MS;
  }

  /**
   * @param {HTMLDivElement} container The scrollable logs container.
   * @param {Virtualizer<HTMLDivElement, HTMLElement>} virtualizer
   * @return {boolean} Whether the view is scrolled to the bottom, within `FOLLOW_SCROLL_THRESHOLD`.
   *
   * We measure against the virtualizer's `getTotalSize()` rather than the DOM `container.scrollHeight` because the DOM
   * height (`.logs_inner`) is only refreshed on the next lit render, so it can lag behind a programmatic scroll and
   * report a stale, larger value. `getTotalSize()` stays consistent with `scrollTop`.
   */
  _isAtBottom(container, virtualizer) {
    const distanceToBottom = virtualizer.getTotalSize() - container.clientHeight - container.scrollTop;
    return distanceToBottom <= FOLLOW_SCROLL_THRESHOLD;
  }

  /**
   * Derives the `follow` property from the actual scroll position: the component follows when the view is at the bottom.
   *
   * With `anchorTo: 'end'`, the virtualizer keeps the view glued to the bottom across measurement churn and its own
   * programmatic scrolls, so the only thing that moves the view away from the end is a genuine user scroll-up. That
   * makes "at the end" a reliable proxy for "following": we no longer need to guess whether a scroll was the user's.
   */
  _syncFollow() {
    const container = this._logsRef.value;
    if (container == null || this._isFollowSuppressed() || this._logsCtrl.listLength === 0) {
      return;
    }
    const virtualizer = this._getVirtualizer();
    // Ignore scrolls that the virtualizer itself is driving: it is non-null while a programmatic scroll or its reconcile
    // loop is in flight (e.g. `_pinToBottomIfFollowing()` pinning to a growing bottom). During that window the scroll
    // event can fire with a `scrollTop` that momentarily lags the just-grown `getTotalSize()`, which would read as "not
    // at the bottom" and wrongly unfollow. Only a user scroll happens with no programmatic scroll pending.
    if (this._isVirtualizerScrolling(virtualizer)) {
      return;
    }
    this._setFollow(this._isAtBottom(container, virtualizer));
  }

  /**
   * @param {boolean} follow
   */
  _setFollow(follow) {
    const oldFollow = this.follow;
    this.follow = follow;
    if (oldFollow !== this.follow) {
      this.dispatchEvent(new CcLogsFollowChangeEvent(this.follow));
    }
  }

  // endregion

  // region Metadata logic

  /**
   * @param {Metadata} metadata
   * @return {MetadataRendering}
   */
  _getMetadataRendering(metadata) {
    const renderer = this.metadataRenderers?.[metadata.name];

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
  _getMetadataText(metadata, metadataRendering) {
    return metadataRendering.text != null
      ? metadataRendering.text
      : `${metadataRendering.showName ? `${metadata.name}: ` : ''}${metadata.value}`;
  }

  /**
   * Keeps the virtualizer's index-keyed size cache aligned with the logs list.
   *
   * The virtualizer caches each rendered log's measured height in a `Map` keyed by index (we deliberately key by index
   * and not by log id to bound memory — see `_buildVirtualizerOptions()`). When logs are trimmed off the front (FIFO
   * once `limit` is reached), every surviving log's index decreases, but this cache does not follow on its own: the
   * trim+append at the limit keeps `count` constant and the index edge keys unchanged, so the virtualizer's built-in
   * edge-key-change detection never fires. The stale cached heights then apply to the wrong logs, which positions lines
   * with the wrong height and makes them overlap (most visible with `wrap-lines` and multi-line logs, when scrolling up
   * into a trimmed region).
   *
   * We therefore reach into the virtualizer internals (same defensive pattern as the `measureElement` 0-height guard)
   * and either drop the cache (on a full rebuild: filter change / clear) or shift every cached index down by the
   * front-trim count. We then force the memoized measurements to be recomputed from the start.
   */
  _realignVirtualizerSizeCache() {
    const { rebuilt, frontTrim } = this._logsCtrl.consumeIndexSpaceChange();

    const virtualizer = this._getVirtualizer();

    if (rebuilt) {
      // Full rebuild (filter change / clear): indices map to entirely different logs, drop the whole cache.
      virtualizer.itemSizeCache.clear();
    } else if (frontTrim > 0 && !this.follow) {
      // FIFO front-trim shifted every surviving log's index down by `frontTrim`. Shift each measured height down by the
      // same amount so it stays attached to the same log; cached indices that fall below 0 belonged to trimmed logs and
      // are dropped. We only need this while the user is scrolled up reading history: the region they can scroll into
      // must stay correctly positioned.
      //
      // While following the tail we deliberately SKIP this (see the `else` below). It is the dominant per-append cost at
      // a large `limit` — both this O(cache size) shift and the O(count) recompute it forces — and it is unnecessary:
      // only the bottom window is rendered while following, and it is re-measured at its (constant) indices on every
      // update (see the loop in `updated()`), so its heights are always correct and the cache never accumulates the
      // off-screen history that the shift exists to keep aligned. Skipping the shift is also what keeps the cache
      // bounded to the visible window instead of letting it grow towards `limit`.
      /** @type {Map<number, number>} */
      const shiftedCache = new Map();
      for (const [index, size] of virtualizer.itemSizeCache) {
        const shiftedIndex = Number(index) - frontTrim;
        if (shiftedIndex >= 0) {
          shiftedCache.set(shiftedIndex, size);
        }
      }
      virtualizer.itemSizeCache = shiftedCache;
    } else {
      // Nothing changed, or we are following the tail and the bottom window is kept correct by the per-update
      // re-measure: nothing to realign.
      return;
    }

    // Force the virtualizer to recompute its positions from the realigned cache.
    this._forceVirtualizerRemeasure(virtualizer);
  }

  /**
   * Keeps the view pinned to the bottom while `follow` is on.
   *
   * Runs in a trailing `ReactiveController.hostUpdated()` (registered after the virtualizer controller) so the scroll
   * to the end is applied after the virtualizer's own post-update scroll anchoring, not before it (which would undo it).
   * A single scroll to the end per update is enough: `anchorTo: 'end'` then keeps the view glued to the bottom while the
   * freshly appended logs are measured. We skip it when already at the bottom to avoid redundant scrolls.
   */
  _pinToBottomIfFollowing() {
    const container = this._logsRef.value;
    if (!this.follow || container == null || this._logsCtrl.listLength === 0) {
      return;
    }
    const virtualizer = this._getVirtualizer();
    if (!this._isAtBottom(container, virtualizer)) {
      virtualizer.scrollToEnd({ behavior: 'auto' });
    }
  }

  /**
   * This is called by the virtualizer whenever its state changes (scroll, resize, measurement).
   *
   * It replaces the `visibilityChanged` and `rangeChanged` events of the previous virtualizer:
   *
   * * It keeps track of the first and last visible logs (used for keyboard navigation).
   * * It detects when the focused log leaves the DOM (when user scrolls far from it) so we don't lose the focus.
   *
   * @param {Virtualizer<HTMLDivElement, HTMLElement>} virtualizer
   */
  _onVirtualizerChange(virtualizer) {
    // We deliberately do NOT re-derive `follow` here. `onChange` fires mid-append — after the total size has grown but
    // before `followOnAppend` has pinned to the new bottom (that happens in the virtualizer's post-update step) — so the
    // view is transiently "not at the bottom" and we would wrongly unfollow. `follow` is derived from real scroll events
    // only (see `_onScroll`); `anchorTo: 'end'` guarantees every programmatic scroll settles at the bottom, so those
    // scroll events only ever confirm following.

    // `range` is the visible range (without overscan): this is the equivalent of the old `visibilityChanged` event.
    const range = virtualizer.range;
    this._visibleRange = range == null ? { first: -1, last: -1 } : { first: range.startIndex, last: range.endIndex };

    // The virtual items are the rendered ones (visible range + overscan): this is the equivalent of the old
    // `rangeChanged` event. We use it to detect when the focused log is removed from the DOM.
    const renderedItems = virtualizer.getVirtualItems();
    const renderedRange =
      renderedItems.length > 0
        ? { first: renderedItems[0].index, last: renderedItems[renderedItems.length - 1].index }
        : { first: -1, last: -1 };
    this._focusedIndexIsInDom = this._logsCtrl.isFocusedIndexInRange(renderedRange);
    if (!this._focusedIndexIsInDom && this.shadowRoot?.activeElement != null) {
      this._logsRef.value?.focus();
    }
  }

  /**
   * This event handler is called whenever the logs' container is scrolled (by the user or programmatically).
   *
   * It re-derives the `follow` property from the new scroll position. Because `anchorTo: 'end'` keeps the view pinned
   * to the bottom for every programmatic scroll, a scroll that ends away from the bottom is necessarily the user's, so
   * we can safely read the position synchronously here (no debounce, no scroll-direction guessing).
   */
  _onScroll() {
    this._syncFollow();
  }

  /**
   * This event handler is called whenever the user scrolls the logs' container with the wheel.
   *
   * It forces unfollowing on a scroll-up. We cannot rely on `_onScroll`/`_syncFollow` alone for this: during fast
   * streaming `_pinToBottomIfFollowing()` re-pins to the bottom on almost every append, so the virtualizer's
   * `scrollState` is almost always non-null and `_syncFollow()` bails out (to avoid unfollowing on the virtualizer's
   * own programmatic scrolls). That would make it impossible to scroll away from the bottom while logs pour in. The
   * `wheel` event is an unambiguous signal of user intent that does not go through the virtualizer, so we use it to
   * break out of follow regardless of any programmatic scroll in flight. We also suppress auto-follow derivation for a
   * short window so the next append cannot immediately re-pin the view under the user.
   *
   * @param {WheelEvent} e
   */
  _onWheel(e) {
    if (e.deltaY < 0 && this.follow) {
      this._suppressFollow();
      this._setFollow(false);
    }
  }

  // region Focus logic

  /**
   * This event handler is called whenever the logs' container receives the focus.
   *
   * If it was not because we lost the focus after the focused log was removed from DOM (this can happen when user scrolls far from the focused log),
   * then we clear the focus.
   */
  _onFocusLogsContainer() {
    if (this._focusedIndexIsInDom) {
      this._logsCtrl.clearFocus(false);
    }
  }

  /**
   * This event handler is called whenever a log select button receives the focus.
   *
   * In cases handled programmatically (when moving focus with arrow keys), the focus is already set.
   * But, this is needed when users click on the select button.
   *
   * @param {EventWithTarget<HTMLButtonElement>} e
   */
  _onFocusLog(e) {
    const button = e.target;
    const logIndex = Number(/** @type {HTMLElement} */ (button.closest(`.log`)).dataset.index);
    this._logsCtrl.focus(logIndex, false);
  }

  /**
   * This function is wired through `this._logsCtrl`.
   *
   * It is called when the focused log needs to be changed
   *
   * @param {number|null} logIndex the log index to focus or `null` if the focus is to be reset to the logs' container.
   */
  _onFocusedLogChange(logIndex) {
    if (logIndex == null) {
      this._logsRef.value.focus();
    } else {
      // Scroll to the element to focus.
      this._getVirtualizer().scrollToIndex(logIndex, { align: 'auto' });

      // The element we want to focus may not be in the DOM yet.
      // We may need to wait for the virtualizer to redo its layout before being able to focus the element.
      this._focusLogButton(logIndex);
    }
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It is called when up or down arrow key is pressed.
   * It asks the logs controller to move the focus on the given direction.
   *
   * @param {'up'|'down'} direction
   */
  _onArrow(direction) {
    this._logsCtrl.moveFocus(direction, this._visibleRange);
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It is called when `Home` key is pressed
   * It asks the logs controller to move the focus on the first log.
   * If `withCtrlShift` is enabled, it asks the logs controller to expand the selection to the first log.
   *
   * @param {boolean} withCtrlShift
   */
  _onHome(withCtrlShift) {
    if (withCtrlShift) {
      this._logsCtrl.extendSelection(0, 'replace');
    } else {
      this._logsCtrl.focus(0);
    }
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It is called when `End` key is pressed
   * It asks the logs controller to move the focus on the last log.
   * If `withCtrlShift` is enabled, it asks the logs controller to expand the selection to the last log.
   *
   * @param {boolean} withCtrlShift
   */
  _onEnd(withCtrlShift) {
    if (withCtrlShift) {
      this._logsCtrl.extendSelection(this._logsCtrl.listLength - 1, 'replace');
    } else {
      this._logsCtrl.focus(this._logsCtrl.listLength - 1);
    }
  }

  // endregion

  // region Drag logic

  /**
   * This function is called whenever users press mouse button on the gutter.
   *
   * It initiates the drag movement.
   *
   * @param {MouseEvent} e
   */
  _onMouseDownGutter(e) {
    // If the mouse down event doesn't come from the button, a text selection can happen.
    // We don't want this!
    const isInButton = e
      .composedPath()
      .some((element) => element instanceof HTMLElement && hasClass(element, 'select_button'));
    if (!isInButton) {
      e.preventDefault();
    }

    this._inputCtrl.onMouseDownGutter();
    this._draggedLogIndex = null;
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * This function is called with a logIndex OR with a direction and offset.
   *
   * If a logIndex is provided, we extend the selection to this index.
   *
   * If a direction and offset is provided, we calculate the right new index and extend the selection to it.
   * We also make sure that this index is visible in the viewport by scrolling the right amount in the right direction.
   *
   * @param {Object} movement The drag movement.
   * @param {number} [movement.logIndex] The index to drag to. If present, `direction` and `offset` are useless.
   * @param {'up'|'down'} [movement.direction] The direction of the drag movement.
   * @param {number} [movement.offset] The number of logs to drag.
   * @param {boolean} isFirstDrag Whereas this is the drag movement initiator.
   */
  _onDrag({ logIndex, direction, offset }, isFirstDrag) {
    // On first drag, we should clear the text selection because we're about to trigger a log selection
    if (isFirstDrag) {
      document.getSelection().empty();
    }

    const newIndex = logIndex != null ? logIndex : this._getNewDraggedLogIndex(direction, offset ?? 1);

    if (newIndex === this._draggedLogIndex) {
      return;
    }

    if (isFirstDrag) {
      this._logsCtrl.select(newIndex);
    } else {
      this._logsCtrl.extendSelection(newIndex, 'replace');
    }

    if (direction === 'up' || direction === 'down') {
      this._getVirtualizer().scrollToIndex(newIndex, { align: 'auto' });
    }

    this._draggedLogIndex = newIndex;
  }

  // endregion

  // region Select logic

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * Handles the logic selection with support of Ctrl and Shift modifiers key
   * @param {number} logIndex
   * @param {Object} modifiers
   * @param {boolean} modifiers.ctrl
   * @param {boolean} modifiers.shift
   */
  _onClickLog(logIndex, { ctrl, shift }) {
    if (ctrl && !shift) {
      this._logsCtrl.toggleSelection(logIndex);
    } else if (shift) {
      this._logsCtrl.extendSelection(logIndex, ctrl ? 'append' : 'replace');
    } else {
      if (!this._logsCtrl.isSelected(logIndex) || this._logsCtrl.selectionLength > 1) {
        this._logsCtrl.select(logIndex);
      } else {
        this._logsCtrl.clearSelection();
      }
    }

    // Clear regular text selection if logs selection is active
    if (!this._logsCtrl.isSelectionEmpty()) {
      document.getSelection().empty();
    }
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It clears the selection when users type the Escape key.
   */
  _onEscape() {
    this._logsCtrl.clearSelection();
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It clears the selection when users click on the logs container but not in the gutter area.
   * It also handles triple click: selects the whole log line (including timestamp and metadata)
   *
   * @param {GenericEventWithTarget<MouseEvent>} e
   */
  _onClick(e) {
    if (e.detail === 3) {
      const logElement = e.target.closest(`.log`);
      if (logElement != null) {
        window.getSelection().empty();
        const range = document.createRange();
        range.selectNode(logElement);
        window.getSelection().addRange(range);
      }
    } else {
      this._logsCtrl.clearSelection();
    }
  }

  /**
   * This function is called by `this._logsCtrl` whenever the selection changes.
   *
   * It forces follow to stop.
   */
  _onSelectionChanged() {
    this._suppressFollow();
    this._setFollow(false);
  }

  _onSelectAll() {
    this._logsCtrl.selectAll();
  }

  // endregion

  // region Copy logic

  /**
   * This event handler captures the Ctrl+C native shortcut for copy to clipboard.
   * It takes the browser text selection as input.
   * Both plain text and html version of this text selection are put in the clipboard.
   *
   * @param {ClipboardEvent} e
   */
  _onCopy(e) {
    const lines = document
      .getSelection()
      .toString()
      .split(/[\r\n]+/gm);
    const data = prepareLinesOfCodeForClipboard(lines);
    e.clipboardData.setData('text/plain', data.text);
    e.clipboardData.setData('text/html', data.html);
    e.preventDefault();
  }

  /**
   * This event handler is called when the copy button is clicked.
   * It takes the logic selection (done with the gutter) as input.
   * Both plain text and html version of this text selection are put in the clipboard.
   */
  _onCopySelectionToClipboard() {
    if (this._logsCtrl.isSelectionEmpty()) {
      return;
    }

    const lines = this._logsCtrl.getSelectedLogs().map((log) => {
      const ts = this._dateDisplayer.format(log.date);
      const meta =
        log.metadata
          ?.map((metadata) => ({ metadata, metadataRendering: this._getMetadataRendering(metadata) }))
          .filter(({ metadataRendering }) => !metadataRendering.hidden)
          .map(({ metadata, metadataRendering }) => this._getMetadataText(metadata, metadataRendering)) ?? [];
      const msg = stripAnsi(log.message);
      return [ts, ...meta, msg].filter((t) => t?.length > 0).join(' ');
    });

    const data = prepareLinesOfCodeForClipboard(lines);

    copyToClipboard(data.text, data.html).then(() => {
      notifySuccess(i18n('cc-logs.copied', { count: lines.length }));
    });
  }

  // endregion

  // region Inspect logic

  _onInspectLogButtonClick() {
    if (this._logsCtrl.isSelectionEmpty()) {
      return;
    }

    const selectedLog = this._logsCtrl.getSelectedLogs()[0];
    this.dispatchEvent(new CcLogInspectEvent(selectedLog));

    // Inspecting makes the host clear the message filter, which rebuilds the displayed list asynchronously (the new
    // `message-filter` only reaches us on a later update). We therefore cannot scroll now: we remember the inspected
    // log and scroll to it once that filter-clearing update has landed (see `updated()`), reading its index from the
    // list that is actually displayed at that point.
    this._logToScrollIntoView = selectedLog;
  }

  // endregion

  /**
   * @param {PropertyValues<CcLogs>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('dateDisplay') || changedProperties.has('timezone')) {
      this._dateDisplayer = this._resolveDateDisplayer();
    }

    if (changedProperties.has('logs')) {
      this.clear();
      this.appendLogs(this.logs);
    }

    if (changedProperties.has('limit')) {
      this._logsCtrl.limit = this.limit;
    }

    if (
      changedProperties.has('messageFilter') ||
      changedProperties.has('messageFilterMode') ||
      changedProperties.has('metadataFilter')
    ) {
      this._logsCtrl.filter = {
        message: isStringEmpty(this.messageFilter) ? null : { value: this.messageFilter, type: this.messageFilterMode },
        metadata: this.metadataFilter,
      };
    }

    // Keep the dynamic virtualizer options in sync with the current state.
    // We spread the existing options to preserve the ones set by the controller (observers, scroll function, the
    // `onChange` wrapper that triggers re-renders…).
    const virtualizer = this._getVirtualizer();
    virtualizer.setOptions({
      ...virtualizer.options,
      count: this._logsCtrl.listLength,
      paddingEnd: this._horizontalScrollbarHeight,
    });

    // Realign the index-keyed size cache with the (possibly trimmed) list before `render()` reads the measurements.
    this._realignVirtualizerSizeCache();
  }

  /**
   * @param {PropertyValues<CcLogs>} changedProperties
   */
  updated(changedProperties) {
    const virtualizer = this._getVirtualizer();

    // Deferred scroll requested by the inspect action: now that the message filter has been cleared (by the host) and
    // the displayed list rebuilt, scroll the inspected log into the center. We read its index from the list that is
    // actually displayed now, so it is correct whether or not a filter was active when inspect was clicked.
    if (this._logToScrollIntoView != null && changedProperties.has('messageFilter')) {
      const logIndex = this._logsCtrl.getList().indexOf(this._logToScrollIntoView);
      this._logToScrollIntoView = null;
      if (logIndex >= 0) {
        virtualizer.scrollToIndex(logIndex, { align: 'center' });
      }
    }

    if (this._logsRef.value != null) {
      this._horizontalScrollbarHeight = this.wrapLines
        ? 0
        : this._logsRef.value.offsetHeight - this._logsRef.value.clientHeight;

      // Re-measure the rendered log lines, but only when the rendered content changed since the last measure.
      // We render the lines with a positional `map()` (and not a keyed `repeat()`, which is corrupted by the
      // virtualizer's re-entrant updates while scrolling). With positional rendering, a line element is reused for a
      // different log when the visible window moves, so the `ref` measuring callback is not called again, and we must
      // (re)measure here. But `updated()` also fires for changes that leave the rendered rows untouched (follow toggles,
      // selection, scrollbar-height state, measurement-settle re-renders); re-measuring every row then is pure wasted
      // layout (a forced reflow per row). We therefore skip the loop unless the rendered logs or the wrap mode changed.
      // Height changes we skip this way (e.g. a viewport resize) are still caught by the `ResizeObserver` the
      // virtualizer keeps on each rendered element (registered by the `ref` measuring callback on mount).
      const renderedLogs = this._logsCtrl.getList();
      const measureSignature = `${this.wrapLines}|${virtualizer
        .getVirtualItems()
        .map((virtualItem) => renderedLogs[virtualItem.index]?.id)
        .join(',')}`;
      if (measureSignature !== this._lastMeasureSignature) {
        this._lastMeasureSignature = measureSignature;
        for (const logElement of this._logsRef.value.querySelectorAll('.log')) {
          virtualizer.measureElement(/** @type {HTMLElement} */ (logElement));
        }
      }
    }

    // The actual pin-to-bottom while following is done in `_pinToBottomIfFollowing()`, registered as a trailing
    // controller so it runs after the virtualizer has restored/anchored its own scroll position.
  }

  render() {
    const virtualizer = this._getVirtualizer();
    const virtualItems = virtualizer.getVirtualItems();
    const logs = this._logsCtrl.getList();

    return html`
      <div class="wrapper">
        <div
          ${ref(this._logsRef)}
          class="logs_container"
          tabindex="0"
          @click=${this._inputCtrl.onClick}
          @keydown=${this._inputCtrl.onKeyDown}
          @keyup=${this._inputCtrl.onKeyUp}
          @copy=${this._onCopy}
          @focus=${this._onFocusLogsContainer}
          @scroll=${this._onScroll}
          @wheel=${this._onWheel}
        >
          <div class="logs_inner" style="height: ${virtualizer.getTotalSize()}px;">
            <div class="logs_window" style="transform: translateY(${virtualItems[0]?.start ?? 0}px);">
              ${virtualItems.map((virtualItem) => this._renderLog(logs[virtualItem.index], virtualItem))}
            </div>
          </div>
        </div>
        ${!this._logsCtrl.isSelectionEmpty()
          ? html` <div class="floating_buttons">
              <cc-button .icon=${iconCopy} @cc-click=${this._onCopySelectionToClipboard}>
                ${i18n('cc-logs.copy')}
              </cc-button>
              ${!isStringEmpty(this.messageFilter)
                ? html`
                    <cc-button .icon=${iconInspect} @cc-click=${this._onInspectLogButtonClick}>
                      ${i18n('cc-logs.inspect')}
                    </cc-button>
                  `
                : ''}
            </div>`
          : null}
      </div>
    `;
  }

  /**
   * Renders a single line of log.
   *
   * @param {Log} log
   * @param {import('@tanstack/virtual-core').VirtualItem} virtualItem
   */
  _renderLog(log, virtualItem) {
    if (log == null) {
      return null;
    }

    const index = virtualItem.index;
    const wrap = this.wrapLines;
    const dateDisplayer = this._dateDisplayer;

    const selected = this._logsCtrl.isSelected(index);
    const selectButtonLabel = selected
      ? i18n('cc-logs.unselect-button.label', { index: index + 1 })
      : i18n('cc-logs.select-button.label', { index: index + 1 });

    /* eslint-disable lit-a11y/click-events-have-key-events */
    // The row is rendered in normal flow inside `.logs_window` (which is translated to the first rendered row's
    // offset). We deliberately do NOT position each row with its own `translateY`: stacking the rows in flow makes it
    // impossible for two rows to overlap, even when a row's height has not been measured yet (it falls back to the
    // estimate). The virtualizer still measures each row (via `data-index`) to keep the scroll size accurate.
    return html`
      <p class="log ${classMap({ selected, wrap })}" data-index="${index}" ${ref(this._measureElement)}>
        <span class="gutter" @mousedown=${this._onMouseDownGutter} @click=${this._inputCtrl.onClickLog}>
          <button
            class="select_button"
            title="${selectButtonLabel}"
            aria-label="${selectButtonLabel}"
            aria-pressed=${selected}
            tabindex="-1"
            @click=${this._inputCtrl.onClickLog}
            @focus=${this._onFocusLog}
          >
            <cc-icon .icon=${iconSelected} size="xs"></cc-icon>
          </button>
        </span>
        ${this._renderLogTimestamp(log, dateDisplayer)}
        <span class="log--right ${classMap({ wrap })}"
          >${this._renderLogMetadata(log)}${this._renderLogMessage(log)}</span
        >
      </p>
    `;
  }

  /**
   * @param {Log} log
   * @param {DateDisplayer} dateDisplayer
   */
  _renderLogTimestamp(log, dateDisplayer) {
    if (dateDisplayer.display === 'none') {
      return null;
    }

    return html`<span class="date">
      ${dateDisplayer.formatAndMapParts(log.date, (k, v) => html`<span class="${k}">${v}</span>`)}
    </span>`;
  }

  /**
   * @param {Log} log
   */
  _renderLogMetadata(log) {
    if (log.metadata == null || log.metadata.length === 0) {
      return null;
    }

    const metadata = log.metadata.map((metadata) => this._renderMetadata(metadata)).filter((t) => t != null);

    if (metadata.length === 0) {
      return null;
    }

    // keep this on one line to make sure we do not break the white-space css rule
    return html`<span class="metadata--wrapper">${join(metadata, html`&nbsp;`)}</span>`;
  }

  /**
   * @param {Metadata} metadata
   */
  _renderMetadata(metadata) {
    const metadataRendering = this._getMetadataRendering(metadata);
    if (metadataRendering.hidden) {
      return null;
    }

    const text = this._getMetadataText(metadata, metadataRendering);
    const size = metadataRendering.size ?? 0;
    const truncatedText = typeof size === 'number' && size > 0 ? truncateString(text, size) : text;
    const classInfo = {
      metadata: true,
      strong: metadataRendering.strong,
      [metadataRendering.intent]: true,
    };

    // Keep this in one line to avoid any extra whitespace.
    return html`<span class="${classMap(classInfo)}" style="min-width: ${size}ch;">${truncatedText}</span>`;
  }

  /**
   * @param {Log} log
   */
  _renderLogMessage(log) {
    // keep this on one line to make sure we do not break the white-space css rule
    return html`<span class="message">${this.stripAnsi ? stripAnsi(log.message) : ansiToLit(log.message)}</span>`;
  }

  static get styles() {
    return [
      ...ansiStyles,
      unsafeCSS(`:host {${DEFAULT_PALETTE_STYLE}}`),
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: block;
          overflow: hidden;

          --font-size: 0.875em;
        }

        :focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .logs_container {
          flex: 1;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: var(--font-size);
          overflow: auto;
        }

        .logs_inner {
          position: relative;
          width: 100%;
        }

        /* The window holds the currently rendered rows. It is translated to the first rendered row's offset; the rows
           themselves are laid out in normal flow inside it so they can never overlap (see _renderLog). */
        .logs_window {
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .log {
          align-items: center;
          display: flex;
          gap: 0.5em;
          margin: 0;
          /* When lines are not wrapped, the line grows to fit its content so it can be scrolled horizontally,
             while still being at least as wide as the viewport (so hover/selection backgrounds span the full width). */
          min-width: 100%;
          width: max-content;

          /* We don't need em here. At least with px we avoid strange blinking effect. */
          --spacing: 2px;
          --gutter-size: 1.5em;
        }

        /* When lines are wrapped, the line is constrained to the viewport width so its content wraps. */
        .log.wrap {
          width: 100%;
        }

        .log:hover {
          background-color: var(--cc-color-ansi-background-hover);
        }

        .log.selected {
          background-color: var(--cc-color-ansi-background-selected);
        }

        .date,
        .log--right {
          line-height: var(--gutter-size);
          padding: var(--spacing) 0;
        }

        .log--right {
          white-space: pre;
        }

        .log--right.wrap {
          white-space: pre-wrap;
        }

        .gutter {
          align-self: stretch;
          border-right: 1px solid var(--cc-color-ansi-foreground);
          cursor: pointer;
          flex: 0 0 auto;
        }

        .select_button {
          align-items: center;
          background: none;
          border: 0;
          color: var(--cc-color-ansi-foreground);
          cursor: pointer;
          display: flex;
          height: var(--gutter-size);
          justify-content: center;
          margin: var(--spacing);
          outline-offset: 0;
          padding: 0;
          width: var(--gutter-size);
        }

        .select_button cc-icon {
          color: #737373;
          opacity: 0;
        }

        .log:hover cc-icon,
        .select_button:focus cc-icon {
          opacity: 1;
        }

        .select_button[aria-pressed='true'] cc-icon {
          color: var(--cc-color-text-primary, #000);
          opacity: 1;
        }

        .floating_buttons {
          position: absolute;
          right: 1em;
          top: 0.5em;
        }

        .metadata {
          display: inline-block;
        }

        .metadata--wrapper {
          margin-right: var(--font-size);
        }

        .strong {
          font-weight: bold;
        }

        .neutral {
          color: var(--cc-color-ansi-foreground);
        }

        .info {
          color: var(--cc-color-ansi-blue);
        }

        .success {
          color: var(--cc-color-ansi-green);
        }

        .warning {
          color: var(--cc-color-ansi-yellow);
        }

        .danger {
          color: var(--cc-color-ansi-red);
        }

        .date {
          align-self: start;
          white-space: nowrap;
        }

        .milliseconds,
        .separator,
        .timezone {
          opacity: 0.7;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-beta', CcLogs);
