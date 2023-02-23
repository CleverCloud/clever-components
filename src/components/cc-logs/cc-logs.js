import '../cc-badge/cc-badge.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '@lit-labs/virtualizer';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { i18n } from '../../lib/i18n.js';

/** @type {MetadataRenderer} The default metadata renderer */
const DEFAULT_METADATA_RENDERER = (metadata) => html`
  <cc-badge>${metadata.name}: ${metadata.value}</cc-badge>
`;

/** @type {MessageRenderer} The default message renderer */
const DEFAULT_MESSAGE_RENDERER = (message) => html`${message}`;

/**
 * @typedef {import('./cc-logs.types.js').LogsState} LogsState
 * @typedef {import('./cc-logs.types.js').Log} Log
 * @typedef {import('./cc-logs.types.js').Metadata} Metadata
 * @typedef {import('./cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('./cc-logs.types.js').MessageRenderer} MessageRenderer
 * @typedef {import('./cc-logs.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('./cc-logs.types.js').TimestampFormat} TimestampFormat
 */

const localTimeFieldGetter = {
  years (date) {
    return date.getFullYear();
  },
  month (date) {
    return date.getMonth();
  },
  day (date) {
    return date.getDay();
  },
  hours (date) {
    return date.getHours();
  },
  minutes (date) {
    return date.getMinutes();
  },
  secondes (date) {
    return date.getSeconds();
  },
  milliseconds (date) {
    return date.getMilliseconds();
  },
};
const utcTimeFieldGetter = {
  years (date) {
    return date.getUTCFullYear();
  },
  month (date) {
    return date.getUTCMonth();
  },
  day (date) {
    return date.getUTCDay();
  },
  hours (date) {
    return date.getUTCHours();
  },
  minutes (date) {
    return date.getUTCMinutes();
  },
  secondes (date) {
    return date.getUTCSeconds();
  },
  milliseconds (date) {
    return date.getUTCMilliseconds();
  },
};

class TimestampFormatter {
  /**
   * @param {TimestampFormat} timestampFormat
   */
  constructor (timestampFormat) {
    this.pattern = timestampFormat.pattern ?? 'datetime';
    this.precision = timestampFormat.precision ?? 'milliseconds';
    this.utc = timestampFormat.utc ?? true;
    this.showZoneOffset = timestampFormat.showZoneOffset ?? false;
  }

  _pad (value) {
    return `${value}`.padStart(2, '0');
  }

  _getFormattedDatePart (date, timeFieldGetter) {
    return `${timeFieldGetter.years(date)}-${this._pad(timeFieldGetter.month(date) + 1)}-${this._pad(timeFieldGetter.day(date))}`;
  }

  _getFormattedTimePart (date, timeFieldGetter) {
    let timePart = `${this._pad(timeFieldGetter.hours(date))}:${this._pad(timeFieldGetter.minutes(date))}:${this._pad(timeFieldGetter.secondes(date))}`;

    if (this.precision === 'milliseconds') {
      timePart += `.${timeFieldGetter.milliseconds(date)}`;
    }

    if (this.showZoneOffset) {
      timePart += `${this._getFormattedZoneOffset(date)}`;
    }

    return timePart;
  }

  _getFormattedZoneOffset (date) {
    if (this.utc) {
      return 'Z';
    }
    const tzOffset = -date.getTimezoneOffset();
    return `${tzOffset >= 0 ? '+' : '-'}${this._pad(Math.floor(tzOffset / 60))}:${this._pad(tzOffset % 60)}`;
  }

  /**
   * @param {number} timestamp
   * @return {string} the timestamp formatted according to the format specified in constructor.
   */
  format (timestamp) {
    const date = new Date(timestamp);
    const timeFieldGetter = this.utc ? utcTimeFieldGetter : localTimeFieldGetter;

    const timePart = this._getFormattedTimePart(date, timeFieldGetter, this.precision, this.showZoneOffset);

    if (this.pattern === 'time') {
      return timePart;

    }
    return `${this._getFormattedDatePart(date, timeFieldGetter)}T${timePart}`;
  }
}

/**
 * A component displaying lines of log.
 *
 * A line of log is made of:
 * * a timestamp
 * * a message
 * * some metadata
 *
 * ## Details
 *
 * The component gives the ability to:
 * * display a huge amount of lines by using a <a href="https://github.com/lit/lit/tree/main/packages/labs/virtualizer">scroll virtualizer</a>.
 * * wrap the long lines
 * * customize the format of the timestamp (by default, it is displayed using <a href="https://www.w3.org/TR/NOTE-datetime">ISO-8601</a> as UTC)
 * * hide the timestamp
 * * customize the way the metadata are displayed
 * * customize the way the message is displayed
 * * follow the logs (force scroll to bottom) while some new logs are added
 *
 * ## Follow
 *
 * The follow property gives the ability to force the scroll to bottom while logs are added to the component.
 * This property still allow the users to scroll up to stop following logs.
 * Then, the follow behavior comes back as soon as the user scroll to bottom (or near the bottom).
 *
 * ## Public API
 *
 * The component provides a method to scroll down to the bottom:
 * ```javascript
 * document.querySelector('cc-logs').scrollToBottom();
 * ```
 *
 * @cssdisplay block
 */
export class CcLogsComponent extends LitElement {
  static get properties () {
    return {
      follow: { type: Boolean },
      logs: { type: Object },
      messageRenderer: { type: Function, attribute: 'message-renderer' },
      metadataRenderers: { type: Object, attribute: 'metadata-renderers' },
      timestampDisplay: { type: Object, attribute: 'timestamp-display' },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
      _shouldFollow: { type: Boolean, state: true },
    };
  }

  /** @type {TimestampFormat} */
  static get DEFAULT_TIMESTAMP_DISPLAY () {
    return {
      pattern: 'datetime',
      precision: 'milliseconds',
      utc: true,
      showZoneOffset: true,
    };
  };

  constructor () {
    super();

    /** @type {boolean} Whether to force scroll to the bottom after adding logs */
    this.follow = false;
    /** @type {LogsState} The component state */
    this.logs = { state: 'loading' };
    /** @type {MessageRenderer} The custom message renderer */
    this.messageRenderer = DEFAULT_MESSAGE_RENDERER;
    /** @type {Object.<string, MetadataRenderer>} The custom renderers to use for displaying metadata */
    this.metadataRenderers = {};
    /** @type {TimestampDisplay} The timestamp display */
    this.timestampDisplay = CcLogsComponent.DEFAULT_TIMESTAMP_DISPLAY;
    /** @type {boolean} Whether to wrap long lines */
    this.wrapLines = false;

    /** @type {Ref<HTMLElement>} */
    this._logsRef = createRef();
    /** @type {boolean} */
    this._shouldFollow = this.follow;
    /**
     * @type {TimestampFormatter|null} instance of the formatter to use to format timestamp.
     * It is maintained in sync with the `timestampDisplay` property.
     * It is `null` when the `timestampDisplay` property is `hidden`.
     */
    this._timestampFormatter = this._resolveTimestampFormatter();
  }

  /* region private methods */

  _resolveTimestampFormatter () {
    return this.timestampDisplay === 'hidden' ? null : new TimestampFormatter(this.timestampDisplay);
  }

  _resolveShouldFollow () {
    const element = this._logsRef.value;
    if (element != null) {
      return element.scrollTop + element.offsetHeight >= element.scrollHeight - 50;
    }
    return false;
  }

  _onScroll () {
    if (this._unpinning) {
      return;
    }
    this._shouldFollow = this._resolveShouldFollow();
  }

  _onWheel (e) {
    // when logs appending is very fast, it is useful to add this to stop follow.
    if (e.wheelDeltaY > 0) {
      this._shouldFollow = false;

      this._unpinning = true;
      setTimeout(() => {
        this._unpinning = false;
      }, 50);
    }
  }

  _onUnpinned () {
    this._shouldFollow = false;
  }

  /* endregion */

  /* region public API */

  scrollToBottom () {
    const element = this._logsRef.value;
    if (element != null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  /* endregion */

  firstUpdated (_changedProperties) {
    if (_changedProperties.has('follow')) {
      this._shouldFollow = this.follow;
    }
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('timestampDisplay')) {
      this._timestampFormatter = this._resolveTimestampFormatter();
    }
    if (_changedProperties.has('follow')) {
      if (!this.follow) {
        this._shouldFollow = false;
      }
      else {
        this._shouldFollow = this._resolveShouldFollow();
      }
    }
  }

  render () {
    const state = this.logs.state;

    if (state === 'loading') {
      return html`
        <div id="loading">
          <cc-loader></cc-loader>
        </div>`;
    }

    if (state === 'error') {
      return html`
        <cc-notice intent="danger" message="${i18n('cc-logs.error')}"></cc-notice>
      `;
    }

    const __refName = this._logsRef;
    const logs = this.logs.logs;
    const lastLogIndex = logs.length - 1;
    const pin = this._shouldFollow ? {
      index: logs.length - 1,
      block: 'end',
    } : null;
    const onScroll = this.follow ? this._onScroll : null;
    const onWheel = this.follow ? this._onWheel : null;
    const onUnpinned = this.follow ? this._onUnpinned : null;

    return html`
      <lit-virtualizer 
        id="logs" ${ref(__refName)} @scroll=${onScroll} @wheel=${onWheel} @unpinned=${onUnpinned}
        .items=${logs}
        .keyFunction=${(it) => it.id ?? it.timestamp}               
        .renderItem=${(item, index) => {
          return this._renderLog(
            item,
            this.wrapLines,
            this._timestampFormatter,
            this.metadataRenderers,
            this.messageRenderer,
            index === lastLogIndex,
          );
        }}
        ?scroller=${true}
        .layout=${{ pin }}
      >
      </lit-virtualizer>
    `;
  }

  /* region Single log line rendering */

  /**
   * Renders a single line of log.
   *
   * @param {Log} log
   * @param {boolean} wrap
   * @param {TimestampFormatter} timestampFormatter
   * @param {Object.<string, MetadataRenderer>} metadataRenderers
   * @param {MessageRenderer} messageRenderer
   * @param {boolean} isLast
   */
  _renderLog (log, wrap, timestampFormatter, metadataRenderers, messageRenderer, isLast) {
    return html`
      <div class="log ${classMap({ wrap: wrap, last: isLast })}">
        ${this._renderLogTimestamp(log, timestampFormatter)}
        ${this._renderLogMetadata(log, metadataRenderers)}
        ${this._renderLogMessage(log, messageRenderer)}
      </div>
    `;
  }

  /**
   *
   * @param {Log} log
   * @param {TimestampFormatter} timestampFormatter
   */
  _renderLogTimestamp (log, timestampFormatter) {
    if (timestampFormatter == null) {
      return null;
    }

    return html`<span class="timestamp">${timestampFormatter.format(log.timestamp)}</span>`;
  }

  /**
   * @param {Log} log
   * @param {Object.<string, MetadataRenderer>} metadataRenderers
   */
  _renderLogMetadata (log, metadataRenderers) {
    if (log.metadata == null) {
      return null;
    }

    return html`
      <span class="metadata">
        ${repeat(
          log.metadata,
          (metadata) => metadata.name,
          (metadata, index) => {
            const metadataRenderer = metadataRenderers[metadata.name] ?? DEFAULT_METADATA_RENDERER;
            return metadataRenderer(metadata, { index, log });
          },
        )}
      </span>
    `;
  }

  /**
   * @param {Log} log
   * @param {MessageRenderer} messageRenderer
   */
  _renderLogMessage (log, messageRenderer) {
    return html`
      <span class="message">${messageRenderer(log.message, { log })}</span>
    `;
  }

  /* endregion */

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        #loading {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #logs {
          overflow: auto;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.8em;
        }

        .log {
          line-height: 1.7em;
          white-space: nowrap;
        }

        .log.wrap {
          white-space: normal;
        }

        .log > * {
          line-height: normal;
        }

        .timestamp {
          color: var(--cc-color-text-weak);
        }
      `];
  }
}

window.customElements.define('cc-logs', CcLogsComponent);
