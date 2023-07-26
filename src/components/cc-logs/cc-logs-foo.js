import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '@lit-labs/virtualizer';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { join } from 'lit/directives/join.js';
import { iconRemixCheckboxBlankCircleFill as iconSelected } from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import { ansiStyles, ansiToLit, stripAnsi } from '../../lib/ansi/ansi.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import { TimestampFormatter } from '../../lib/timestamp-formatter.js';
import { accessibilityStyles } from '../../styles/accessibility.js';

// This style is the default ansi palette plus the ability to be overridden with the css theme.
const DEFAULT_PALETTE_STYLE = ansiPaletteStyle(
  Object.fromEntries(
    Object
      .entries(defaultPalette)
      .map(([name, color]) => [name, `var(--cc-color-ansi-default-${name}, ${color})`]),
  ),
);

/**
 * @typedef {import('./cc-logs.types.js').Log} Log
 * @typedef {import('./cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('../../lib/timestamp-formatter.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('../../lib/timestamp-formatter.types.js').Timezone} Timezone
 */

export class CcLogsComponent extends LitElement {
  static get properties () {
    return {
      logs: { type: Array },
      stripAnsi: { type: Boolean, attribute: 'strip-ansi' },
      timestampDisplay: { type: String, attribute: 'timestamp-display' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
      _logs: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    this.logs = [];

    this.stripAnsi = false;

    this.timestampDisplay = 'datetime-iso';

    this.timezone = 'UTC';

    this.wrapLines = false;

    this._logs = [];

    this._timestampFormatter = this._resolveTimestampFormatter();
  }

  _resolveTimestampFormatter () {
    return new TimestampFormatter(this.timestampDisplay, this.timezone);
  }

  /**
   * @param {Array<Log>} logs
   */
  appendLogs (logs) {
    this._logs = this._logs.concat(logs);
  }

  clear () {
    this._logs = [];
  }

  willUpdate (changedProperties) {

    if (changedProperties.has('timestampDisplay') || changedProperties.has('timezone')) {
      this._timestampFormatter = this._resolveTimestampFormatter();
    }

    if (changedProperties.has('logs')) {
      this.clear();
      this.appendLogs(this.logs);
    }
  }

  render () {
    return html`
      <lit-virtualizer
        id="logs"
        tabindex="0"
        .items=${this._logs}
        ?scroller=${true}
        .keyFunction=${(it) => it.id}
        .renderItem=${(item, index) => this._renderLog(item, index)}
      ></lit-virtualizer>
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

    return html`
      <p
        class="log"
        data-index="${index}"
        data-id="${log.id}"
      >
        <span class="gutter">
          <button
            class="select_button visually-hidden-focusable"
            tabindex="-1"
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

    if (log.metadata == null) {
      return null;
    }

    const metadata = log.metadata
      .map((metadata) => this._renderMetadata(metadata));

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

    const text = metadata.value;
    const classInfo = {
      neutral: true,
    };

    return html`<span class="${classMap(classInfo)}">${text}</span>`;
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
      `,
    ];
  }
}

window.customElements.define('cc-logs-foo', CcLogsComponent);
