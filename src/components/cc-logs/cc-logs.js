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
import { copyToClipboard, prepareLinesOfCodeForClipboard } from '../../lib/clipboard.js';
import { hasClass } from '../../lib/dom.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { notifySuccess } from '../../lib/notifications.js';
import { TimestampFormatter } from '../../lib/timestamp-formatter.js';
import { LogsController } from './logs-controller.js';
import { LogsInputController } from './logs-input-controller.js';

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
  Object.fromEntries(
    Object
      .entries(defaultPalette)
      .map(([name, color]) => [name, `var(--cc-color-ansi-default-${name}, ${color})`]),
  ),
);

/**
 * A function that can be disabled during an amount of time.
 */
class TemporaryFunctionDisabler {
  constructor (callback, timeout) {
    this._callback = callback;
    this._timeout = timeout;
    this._timestamp = 0;
  }

  disable () {
    this._timestamp = new Date().getTime();
  }

  call () {
    const timeSinceDisabled = new Date().getTime() - this._timestamp;

    if (timeSinceDisabled > this._timeout) {
      return this._callback();
    }
  }
}

/**
 * @typedef {import('./cc-logs.types.js').Log} Log
 * @typedef {import('./cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('./cc-logs.types.js').MetadataRenderer} MetadataRenderer
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
 * The follow behavior is automatically reactivated everytime users scroll to the bottom.
 * The `cc-logs:followChange` event is fired whenever the follow property changes because of a user interaction.
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
 * ## Limiting
 *
 * Setting a limit is encouraged in order to cap the memory usage.
 * The limit is applied directly on the appended logs.
 * So if you have a limit of 50000, when appending the 50001st log, the first log will be discarded.
 * Note that the limit is applied before the filter.
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
 * @event {CustomEvent} cc-logs:followChange - Fires whenever the follow changed because of user interaction
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
  static get properties () {
    return {
      filter: { type: Array },
      follow: { type: Boolean },
      limit: { type: Number },
      logs: { type: Array },
      metadataRenderers: { type: Object },
      stripAnsi: { type: Boolean, attribute: 'strip-ansi' },
      timestampDisplay: { type: String, attribute: 'timestamp-display' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
    };
  }

  constructor () {
    super();

    /** @type {Array<MetadataFilter>} The filter to apply onto the logs. */
    this.filter = [];

    /** @type {boolean} Whereas the component should scroll to the bottom everytime a new log line is added. */
    this.follow = false;

    /** @type {number|null} The maximum number of logs to display. `null` for no limit. */
    this.limit = null;

    /** @type {Array<Log>} The initial logs. */
    this.logs = [];

    /** @type {{[key: string], MetadataRenderer}|null} The custom renderers to use for displaying metadata. */
    this.metadataRenderers = null;

    /** @type {boolean} Whereas to strip ANSI from log message. */
    this.stripAnsi = false;

    /** @type {TimestampDisplay} The timestamp display. */
    this.timestampDisplay = 'datetime-iso';

    /** @type {Timezone} The timezone to use when displaying timestamp. */
    this.timezone = 'UTC';

    /** @type {boolean} Whereas to wrap long lines. */
    this.wrapLines = false;

    /** @type {number|null} The currently dragged log index. */
    this._draggedLogIndex = null;

    /** @type {boolean} Whereas the focused index is in the DOM. */
    this._focusedIndexIsInDom = false;

    // This function synchronizes the follow property according to the actual scroll position.
    // This function can also be disabled during a small amount of time.
    this._followSynchronizer = new TemporaryFunctionDisabler(() => this._synchronizeFollow(), 150);

    /** @type {LogsInputController} */
    this._inputCtrl = new LogsInputController(this);

    /** @type {LogsController} */
    this._logsCtrl = new LogsController(this);

    /** @type {Ref<Virtualizer>} A reference to the logs' container. */
    this._logsRef = createRef();

    /** @type {TimestampFormatter} */
    this._timestampFormatter = this._resolveTimestampFormatter();

    /** @type {{last: number, first: number}} The range of visible logs in the virtualizer. */
    this._visibleRange = { first: -1, last: -1 };

    // workaround for https://github.com/lit/lit/issues/3619
    this._onClickLog = this._onClickLog.bind(this);
    this._onMouseDownGutter = this._onMouseDownGutter.bind(this);
    this._onFocusLog = this._onFocusLog.bind(this);
  }

  _resolveTimestampFormatter () {
    return new TimestampFormatter(this.timestampDisplay, this.timezone);
  }

  // region Focus logic

  /**
   * This event handler is called whenever the logs' container receives the focus.
   *
   * If it was not because we lost the focus after the focused log was removed from DOM (this can happen when user scrolls far from the focused log),
   * then we clear the focus.
   */
  _onFocusLogsContainer () {
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
   * @param e
   */
  _onFocusLog (e) {
    const button = e.target;
    const logIndex = Number(button.closest(`.log`).dataset.index);
    this._logsCtrl.focus(logIndex, false);
  }

  /**
   * This function is wired through `this._logsCtrl`.
   *
   * It is called when the focused log needs to be changed
   *
   * @param {number|null} logIndex the log index to focus or `null` if the focus it ot be reset to the logs' container.
   */
  _onFocusedLogChange (logIndex) {
    if (logIndex == null) {
      this._logsRef.value.focus();
    }
    else {
      // Scroll to the element to focus.
      this._logsRef.value.element(logIndex)?.scrollIntoView({ block: 'nearest' });

      // The element we want to focus may not be in the DOM yet.
      // We may need to wait for the virtualizer to redo its layout before being able to focus the element.
      const tryToFocus = () => {
        const element = this._logsRef.value.querySelector(`.log[data-index="${logIndex}"] .select_button`);
        if (element != null) {
          element.focus();
          return true;
        }
        return false;
      };
      if (!tryToFocus()) {
        this._logsRef.value.layoutComplete.then(tryToFocus);
      }
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
  _onArrow (direction) {
    this._logsCtrl.moveFocus(direction, this._visibleRange);
  }

  /**
   * This event handler is called whenever the virtualizer adds child elements to the DOM, or removes child elements from the DOM.
   *
   * It helps in detecting when the focused button is removed from the DOM, which is when user scrolls far from the focused button.
   * When the focused button is removed from the DOM, the focus is lost which is something we want to avoid.
   * Instead, we move to focus on the logs container, and we store the index of the lost button (so that we know where we were when user plays with arrow keys).
   */
  _onRangeChanged (e) {
    this._focusedIndexIsInDom = this._logsCtrl.isFocusedIndexInRange({ first: e.first, last: e.last });
    if (!this._focusedIndexIsInDom && this.shadowRoot.activeElement != null) {
      this._logsRef.value.focus();
    }
  }

  // endregion

  // region Drag logic

  /**
   * This function is called whenever users press mouse button on the gutter.
   *
   * It initiates the drag movement.
   *
   * @param e
   */
  _onMouseDownGutter (e) {

    // If the mouse down event doesn't come from the button, a text selection can happen.
    // We don't want this!
    const isInButton = e.composedPath().some((element) => hasClass(element, 'select_button'));
    if (!isInButton) {
      e.preventDefault();
    }

    this._inputCtrl.onMouseDownGutter(e);
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
   * @param {number} [logIndex] The index to drag to. If present, `direction` and `offset` are useless.
   * @param {'up'|'down'} [direction] The direction of the drag movement.
   * @param {number} [offset] The number of logs to drag.
   * @param {boolean} isFirstDrag Whereas this is the drag movement initiator.
   */
  _onDrag ({ logIndex, direction, offset }, isFirstDrag) {

    // On first drag, we should clear the text selection because we're about to trigger a log selection
    if (isFirstDrag) {
      document.getSelection().empty();
    }

    const newIndex = logIndex != null
      ? logIndex
      : this._getNewDraggedLogIndex(direction, offset ?? 1);

    if (newIndex === this._draggedLogIndex) {
      return;
    }

    if (isFirstDrag) {
      this._logsCtrl.select(newIndex);
    }
    else {
      this._logsCtrl.extendSelection(newIndex, 'replace');
    }

    if (direction === 'up' || direction === 'down') {
      this._logsRef.value.element(newIndex)?.scrollIntoView({ block: 'nearest' });
    }

    this._draggedLogIndex = newIndex;
  }

  /**
   * Calculates the new drag index according to the given direction and given offset.
   *
   * @param {'up'|'down'} direction The drag direction.
   * @param {number} offset The amount of log to drag.
   * @return {number}
   */
  _getNewDraggedLogIndex (direction, offset) {
    if (direction === 'up') {
      return Math.max(0, this._draggedLogIndex - offset);
    }
    if (direction === 'down') {
      return Math.min(this._draggedLogIndex + offset, this._logsCtrl.listLength - 1);
    }
    throw new Error(`Illegal argument. direction ${direction} is not valid`);
  }

  // endregion

  // region Select logic

  /**
   * Handles the logic selection with support of Ctrl and Shift modifiers key
   */
  _onClickLog (e) {

    // We don't want to pollute the parent click listener
    e.stopPropagation();

    // Handle selection
    const { ctrlKey, shiftKey } = e;
    const logIndex = Number(e.target.closest(`.log`).dataset.index);

    if (ctrlKey && !shiftKey) {
      this._logsCtrl.toggleSelection(logIndex);
    }
    else if (shiftKey) {
      this._logsCtrl.extendSelection(logIndex, ctrlKey ? 'append' : 'replace');
    }
    else {
      if (!this._logsCtrl.isSelected(logIndex) || this._logsCtrl.selectionLength > 1) {
        this._logsCtrl.select(logIndex);
      }
      else {
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
  _onEscape () {
    this._logsCtrl.clearSelection();
  }

  /**
   * This function is wired through `this._inputCtrl`.
   *
   * It clears the selection when users click on the logs container but not in the gutter area.
   */
  _onClick () {
    this._logsCtrl.clearSelection();
  }

  /**
   * This function is called by `this._logsCtrl` whenever the selection has changed.
   *
   * It forces follow to stop.
   */
  _onSelectionChanged () {
    this._followSynchronizer.disable();
    this._setFollow(false);
  }

  // endregion

  // region Copy logic

  /**
   * This event handler captures the Ctrl+C native shortcut for copy to clipboard.
   * It takes the browser text selection as input.
   * Both plain text and html version of this text selection are put in the clipboard.
   */
  _onCopy (e) {
    const lines = document.getSelection().toString().split(/[\r\n]+/gm);
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
  _onCopySelectionToClipboard () {
    if (this._logsCtrl.isSelectionEmpty()) {
      return;
    }

    const lines = this._logsCtrl.getSelectedLogs()
      .map((log) => {
        const ts = this._timestampFormatter.format(log.timestamp);
        const meta = log.metadata?.map((m) => this._getMetadataText(m, this._getMetadataRendering(m))) ?? [];
        const msg = stripAnsi(log.message);
        return [ts, ...meta, msg]
          .filter((t) => t?.length > 0)
          .join(' ');
      });

    const data = prepareLinesOfCodeForClipboard(lines);

    copyToClipboard(data.text, data.html).then(() => {
      const notification = (lines.length === 1)
        ? i18n('cc-logs.copied.single')
        : i18n('cc-logs.copied.multi', { count: lines.length });
      notifySuccess(notification);
    });
  }

  // endregion

  // region Follow logic

  /**
   * When logs are appended very fast, the visibilityChanged event is fired very often.
   * We need to listen to the wheel event to force unfollowing.
   */
  _onWheel (e) {
    if (e.deltaY < 0) {
      // When wheel up is detected, this means that the user wants to unfollow.
      // We disable the follow modifier to prevent next visibilityChanged events to go against the user decision.
      this._followSynchronizer.disable();
      this._setFollow(false);
    }
  }

  /**
   * This event handler is called whenever the visible items in the logs container viewport change.
   *
   * It synchronizes the `follow` property according to the scroll position.
   * It also keeps track of the first and last visible elements needed for keyboard navigation.
   */
  _onVisibilityChanged (e) {
    this._visibleRange = { first: e.first, last: e.last };
    this._followSynchronizer.call();
  }

  /**
   * Synchronizes the `follow` property according to the actual scroll position.
   *
   * If the scroll position shows the last line of log, the follow is activated.
   * Otherwise, the follow is deactivated.
   * An event is dispatched when the follow state changes.
   */
  _synchronizeFollow () {
    this._setFollow(this._visibleRange.last === Math.max(0, this._logsCtrl.listLength - 1));
  }

  _setFollow (follow) {
    const oldFollow = this.follow;
    this.follow = follow;
    if (oldFollow !== this.follow) {
      dispatchCustomEvent(this, 'followChange', this.follow);
    }
  }

  // endregion

  // region Metadata logic

  /**
   * @param {Metadata} metadata
   * @return {MetadataRendering}
   */
  _getMetadataRendering (metadata) {
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
  _getMetadataText (metadata, metadataRendering) {
    return metadataRendering.text != null
      ? metadataRendering.text
      : `${metadataRendering.showName ? `${metadata.name}: ` : ''}${metadata.value}`;
  }

  // endregion

  // region Public methods

  /**
   * Appends some logs.
   *
   * @param {Array<Log>} logs The logs to append
   */
  appendLogs (logs) {
    // We disable the follow modifier to prevent next visibilityChanged events to change the actual follow property.
    this._followSynchronizer.disable();
    this._logsCtrl.append(logs);
  }

  /**
   * Clears the logs
   */
  clear () {
    this._logsCtrl.clear();
  }

  /**
   * Forces scroll to the bottom
   */
  scrollToBottom () {
    this._setFollow(true);
  }

  // endregion

  willUpdate (changedProperties) {

    if (changedProperties.has('timestampDisplay') || changedProperties.has('timezone')) {
      this._timestampFormatter = this._resolveTimestampFormatter();
    }

    if (changedProperties.has('logs')) {
      this.clear();
      this.appendLogs(this.logs);
    }

    if (changedProperties.has('limit')) {
      this._logsCtrl.limit = this.limit;
    }

    if (changedProperties.has('filter')) {
      this._logsCtrl.filter = this.filter;
    }
  }

  render () {
    const layout = this.follow
      ? {
          pin: {
            index: this._logsCtrl.listLength - 1,
            block: 'end',
          },
        }
      : null;

    return html`
      <lit-virtualizer
        ${ref(this._logsRef)}
        id="logs"
        tabindex="0"
        .items=${this._logsCtrl.getList().slice()}
        ?scroller=${true}
        .keyFunction=${(it) => it.id}
        .renderItem=${(item, index) => this._renderLog(item, index)}
        .layout=${layout}
        @click=${this._inputCtrl.onClick}
        @keydown=${this._inputCtrl.onKeyDown}
        @keyup=${this._inputCtrl.onKeyUp}
        @copy=${this._onCopy}
        @focus=${this._onFocusLogsContainer}
        @visibilityChanged=${this._onVisibilityChanged}
        @rangeChanged=${this._onRangeChanged}
        @wheel=${this._onWheel}
      ></lit-virtualizer>
      ${!this._logsCtrl.isSelectionEmpty()
        ? html`
          <cc-button
            class="copy_button"
            .icon=${iconCopy}
            @cc-button:click=${this._onCopySelectionToClipboard}
            hide-text>${i18n('cc-logs.copy')}
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
   */
  _renderLog (log, index) {

    const wrap = this.wrapLines;
    const timestampFormatter = this._timestampFormatter;

    const selected = this._logsCtrl.isSelected(index);
    const selectButtonLabel = selected
      ? i18n('cc-logs.unselect-button.label', { index })
      : i18n('cc-logs.select-button.label', { index });

    /* eslint-disable lit-a11y/click-events-have-key-events */
    return html`
      <p
        class="log ${classMap({ selected })}"
        data-index="${index}"
      >
        <span
          class="gutter"
          @mousedown=${this._onMouseDownGutter}
          @click=${this._onClickLog}>
          <button
            class="select_button"
            title="${selectButtonLabel}"
            aria-label="${selectButtonLabel}"
            aria-pressed=${selected}
            tabindex="-1"
            @click=${this._onClickLog}
            @focus=${this._onFocusLog}
          >
            <cc-icon .icon=${iconSelected} size="xs"></cc-icon>
          </button>
        </span>
        ${this._renderLogTimestamp(log, timestampFormatter)}
        <span class="log--right ${classMap({ wrap })}">
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
   */
  _renderLogMetadata (log) {
    if (log.metadata == null || log.metadata.length === 0) {
      return null;
    }

    const metadata = log.metadata
      .map((metadata) => this._renderMetadata(metadata))
      .filter((t) => t != null);

    return html`
      <span class="metadata--wrapper">
        ${join(metadata, html`&nbsp;`)}
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

  static get styles () {
    return [
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
          font-size: 0.875em;
        }

        .log {
          display: flex;
          width: 100%;
          align-items: center;
          margin: 0;
          gap: 0.5em;

          /* We don't need em here. At least with px we avoid strange blinking effect. */
          --spacing: 2px;
          --gutter-size: 1.5em;
        }

        .log:hover {
          background-color: var(--cc-color-ansi-background-hover);
        }

        .log.selected {
          background-color: var(--cc-color-ansi-background-selected);
        }

        .timestamp,
        .log--right {
          padding: var(--spacing) 0;
          line-height: var(--gutter-size);
        }

        .log--right {
          white-space: nowrap;
        }

        .log--right.wrap {
          white-space: normal;
        }

        .gutter {
          flex: 0 0 auto;
          align-self: stretch;
          border-right: 1px solid var(--ansi-foreground);
          cursor: pointer;
        }

        .select_button {
          display: flex;
          width: var(--gutter-size);
          height: var(--gutter-size);
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          margin: var(--spacing);
          background: none;
          color: var(--ansi-foreground);
          cursor: pointer;
          outline-offset: 0;
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
        
        .timestamp {
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

window.customElements.define('cc-logs', CcLogs);
