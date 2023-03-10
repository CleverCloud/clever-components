import '../cc-button/cc-button.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-popover/cc-popover.js';
import '../cc-logs/cc-logs.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixDownloadFill as followIcon,
  iconRemixSettings_5Line as optionsIcon,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { TIMESTAMP_DISPLAYS, TIMEZONES } from '../../lib/timestamp-formatter.js';

/**
 * @type {{[key: LogsControllerPalette]: string}}
 */
const PALETTES = {
  default: ansiPaletteStyle(defaultPalette),
  'One Light': ansiPaletteStyle(oneLightPalette),
  'Tokyo Night Light': ansiPaletteStyle(tokyoNightLightPalette),
  'Night Owl': ansiPaletteStyle(nightOwlPalette),
  Everblush: ansiPaletteStyle(everblushPalette),
  Hyoob: ansiPaletteStyle(hyoobPalette),
};

/**
 * @typedef {import('./cc-logs-controller.types.js').LogsControllerPalette} LogsControllerPalette
 * @typedef {import('./cc-logs-controller.types.js').LogsControllerOption} LogsControllerOption
 * @typedef {import('./cc-logs-controller.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('../../lib/timestamp-formatter.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('../../lib/timestamp-formatter.types.js').Timezone} Timezone
 */

/**
 * A component adding visual controls over `<cc-logs>` component.
 *
 * ## Details
 *
 * This component is a wrapper around a `<cc-logs>` component and adds the ability for a user to toggle some options.
 *
 * Controlled options are:
 *
 * * lines wrapping
 * * timestamp display
 * * timezone
 * * palette scheme
 * * displayed metadata
 *
 * Options are encapsulated into a `<cc-popover>` element.
 *
 * @cssdisplay grid
 *
 * @event {CustomEvent<LogsControllerOption>} cc-logs-controller:optionChanged - Fires a `LogsControllerOption` whenever an `option` changes.
 *
 * @cssprop {Border} --cc-logs-controller-logs-border - The border around the <cc-logs> element (defaults: `1px solid var(--cc-color-border-neutral)`).
 * @cssprop {BorderRadius} --cc-logs-controller-logs-border-radius - The border radius around the <cc-logs> element (defaults: `var(--cc-border-radius-default)`).
 *
 * @slot header - A zone on top of the cc-logs
 */
export class CcLogsControllerComponent extends LitElement {

  static get properties () {
    return {
      filter: { type: Array },
      follow: { type: Boolean },
      limit: { type: Number },
      logs: { type: Array },
      metadataDisplay: { type: Object },
      metadataRenderers: { type: Object },
      palette: { type: String },
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

    /** @type {boolean} Whether the `cc-logs` should scroll to the bottom everytime a new log line is added. */
    this.follow = false;

    /** @type {number|null} The maximum number of logs to display. `null` for no limit. */
    this.limit = null;

    /** @type {Array<Log>} The initial logs. */
    this.logs = [];

    /** @type {{[key: string]: LogsMetadataDisplay}} An object where key is the metadata name and value controls whether the corresponding metadata should be displayed. */
    this.metadataDisplay = {};

    /** @type {{[key: string], MetadataRenderer}} The custom renderers to use for displaying metadata. */
    this.metadataRenderers = {};

    /** @type {LogsControllerPalette} The palette to be used. */
    this.palette = 'default';

    /** @type {boolean} Whether to strip ANSI from log message. */
    this.stripAnsi = false;

    /** @type {TimestampDisplay} The timestamp display. */
    this.timestampDisplay = 'datetime-iso';

    /** @type {Timezone} The timezone to use when displaying timestamp. */
    this.timezone = 'UTC';

    /** @type {boolean} Whether to wrap long lines. */
    this.wrapLines = false;

    /** @type {Ref<CcLogsComponent>} */
    this._logsRef = createRef();

    /** @type {{[key: string], MetadataRenderer}} The resolved metadata renderers to use for displaying metadata. */
    this._resolvedMetadataRenderers = {};
  }

  /**
   * Resolves the metadata renderers according to the `metadataDisplay` and `metadataRenderers` properties.
   *
   * @param {{[key: string], MetadataRenderer}} metadataRenderers
   * @param {{[key: string]: LogsMetadataDisplay}} metadataDisplay
   * @return {[key: string], MetadataRenderer}
   */
  _resolveMetadataRenderers (metadataRenderers, metadataDisplay) {
    return Object.fromEntries(
      Object.entries(metadataRenderers).map(([name, renderer]) => {
        const display = metadataDisplay[name];

        return [
          name,
          display == null || !display.hidden ? renderer : { hidden: true },
        ];
      }),
    );
  }

  _onScrollToBottomButtonClick () {
    this.scrollToBottom();
  }

  _onWrapLinesChanged (isOn) {
    this.wrapLines = isOn;
    dispatchCustomEvent(this, 'optionChanged', { name: 'wrap-lines', value: this.wrapLines });
  }

  _onTimestampDisplayToggle ({ detail }) {
    this.timestampDisplay = detail;
    dispatchCustomEvent(this, 'optionChanged', { name: 'timestamp-display', value: this.timestampDisplay });
  }

  _onTimezoneToggle ({ detail }) {
    this.timezone = detail;
    dispatchCustomEvent(this, 'optionChanged', { name: 'timezone', value: this.timezone });
  }

  _onPaletteToggle ({ detail }) {
    this.palette = detail;
    dispatchCustomEvent(this, 'optionChanged', { name: 'palette', value: this.palette });
  }

  _onMetadataToggle (name, isHidden) {
    this.metadataDisplay = {
      ...this.metadataDisplay,
      [name]: {
        ...this.metadataDisplay[name],
        hidden: isHidden,
      },
    };
    dispatchCustomEvent(this, 'optionChanged', { name: 'metadata-display', value: this.metadataDisplay });
  }

  /* region Public methods */

  /**
   * Force scroll to bottom.
   */
  scrollToBottom () {
    this._logsRef.value?.scrollToBottom();
  }

  /**
   * @param {Log} log
   */
  appendLog (log) {
    this._logsRef.value?.appendLog(log);
  }

  /**
   * @param {Array<Log>} logs
   */
  appendLogs (logs) {
    this._logsRef.value?.appendLogs(logs);
  }

  clear () {
    this._logsRef.value?.clear();
  }

  /* endregion */

  willUpdate (_changedProperties) {
    if (_changedProperties.has('metadataRenderers') || _changedProperties.has('metadataDisplay')) {
      this._resolvedMetadataRenderers = this._resolveMetadataRenderers(this.metadataRenderers, this.metadataDisplay);
    }
  }

  render () {
    const __refName = this._logsRef;

    return html`
      <div class="header--slot">
        <slot name="header"></slot>
      </div>

      <cc-button
        class="header--scroll-btn"
        .icon=${followIcon}
        accessible-name="${i18n('cc-logs-controller.scroll-to-bottom')}"
        hide-text
        @cc-button:click=${this._onScrollToBottomButtonClick}
      ></cc-button>

      <cc-popover
        class="header--options-popover"
        .icon=${optionsIcon}
        accessible-name="${i18n('cc-logs-controller.show-logs-options')}"
        hide-text
        position="bottom-right"
      >
        ${this._renderOptions()}
      </cc-popover>

      <cc-logs
        ${ref(__refName)}
        ?follow=${this.follow}
        .limit=${this.limit}
        .logs=${this.logs}
        ?wrap-lines=${this.wrapLines}
        .timestampDisplay=${this.timestampDisplay}
        .timezone=${this.timezone}
        .metadataRenderers=${this._resolvedMetadataRenderers}
        .filter=${this.filter}
        ?strip-ansi=${this.stripAnsi}
        style=${PALETTES[this.palette]}
      >
      </cc-logs>
    `;
  }

  /**
   *
   * @param {TimestampDisplay} timestampDisplay
   * @return {string}
   */
  _getTimestampDisplayLabel (timestampDisplay) {
    if (timestampDisplay === 'none') {
      return i18n('cc-logs-controller.timestamp-display.none');
    }
    if (timestampDisplay === 'datetime-iso') {
      return i18n('cc-logs-controller.timestamp-display.datetime-iso');
    }
    if (timestampDisplay === 'time-iso') {
      return i18n('cc-logs-controller.timestamp-display.time-iso');
    }
    if (timestampDisplay === 'datetime-short') {
      return i18n('cc-logs-controller.timestamp-display.datetime-short');
    }
    if (timestampDisplay === 'time-short') {
      return i18n('cc-logs-controller.timestamp-display.time-short');
    }
  }

  /**
   *
   * @param {Timezone} timezone
   * @return {string}
   */
  _getTimezoneLabel (timezone) {
    if (timezone === 'UTC') {
      return i18n('cc-logs-controller.timezone.utc');
    }
    if (timezone === 'local') {
      return i18n('cc-logs-controller.timezone.local');
    }
  }

  /**
   *
   * @param {string} palette
   * @return {string}
   */
  _getPaletteLabel (palette) {
    if (palette === 'default') {
      return i18n('cc-logs-controller.palette.default');
    }
    return palette;
  }

  _renderOptions () {
    const TIMESTAMP_DISPLAY_CHOICES = TIMESTAMP_DISPLAYS
      .map((d) => ({ label: this._getTimestampDisplayLabel(d), value: d }));
    const TIMEZONE_CHOICES = TIMEZONES
      .map((z) => ({ label: this._getTimezoneLabel(z), value: z }));
    const PALETTE_CHOICES = Object.entries(PALETTES)
      .map(([p]) => ({ label: this._getPaletteLabel(p), value: p }));

    return html`
      <div class="options">
        <label for="follow">
          <input id="follow"
                 type="checkbox"
                 @change=${(e) => this._onWrapLinesChanged(e.target.checked)}
                 .checked=${this.wrapLines}> ${i18n('cc-logs-controller.wrap-lines')}
        </label>

        <hr>

        <div class="select">
          <label for="input-id">${i18n('cc-logs-controller.timestamp-display')}</label>
          <div class="select-wrapper">
            <select
              id="input-id"
              @input=${(e) => this._onTimestampDisplayToggle({ detail: e.target.value })}
              .value=${this.timestampDisplay}
            >
              ${TIMESTAMP_DISPLAY_CHOICES.map((option) => html`
                <option value=${option.value}>${option.label}</option>
              `)}
            </select>
          </div>

          <label for="input-id">${i18n('cc-logs-controller.timezone')}</label>
          <div class="select-wrapper">
            <select
              id="input-id"
              @input=${(e) => this._onTimezoneToggle({ detail: e.target.value })}
              .value=${this.timezone}
            >
              ${TIMEZONE_CHOICES.map((option) => html`
                <option value=${option.value}>${option.label}</option>
              `)}
            </select>
          </div>
        </div>

        <cc-select
          label="${i18n('cc-logs-controller.timestamp-display')}"
          inline
          .options=${TIMESTAMP_DISPLAY_CHOICES}
          .value=${this.timestampDisplay}
          @cc-select:input=${this._onTimestampDisplayToggle}
        ></cc-select>
        <cc-select
          label="${i18n('cc-logs-controller.timezone')}"
          inline
          .options=${TIMEZONE_CHOICES}
          .value=${this.timezone}
          @cc-select:input=${this._onTimezoneToggle}
        ></cc-select>

        <hr>

        <cc-select
          label="${i18n('cc-logs-controller.palette')}"
          inline
          .options=${PALETTE_CHOICES}
          .value=${this.palette}
          @cc-select:input=${this._onPaletteToggle}
        ></cc-select>

        <hr>

        ${Object.entries(this.metadataDisplay)
          .map(([name, display]) => {
            return html`
              <label for="metadata-${name}">
                <input id="metadata-${name}"
                       type="checkbox"
                       @change=${(e) => this._onMetadataToggle(name, !e.target.checked)}
                       .checked=${!display.hidden}> ${display.label}
              </label>
            `;
          })}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          column-gap: 0.3em;
          grid-template-areas: 
            'header-slot scroll-btn options-popover'
            'logs        logs       logs';
          grid-template-columns: 1fr max-content max-content;
          grid-template-rows: max-content 1fr;
          row-gap: 0.5em;
        }

        .header--slot {
          grid-area: header-slot;
        }

        .header--scroll-btn {
          grid-area: scroll-btn;
        }

        .header--options-popover {
          grid-area: options-popover;
        }

        cc-select {
          width: 100%;
        }

        cc-logs {
          border: var(--cc-logs-controller-logs-border, 1px solid var(--cc-color-border-neutral, #aaa));
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: logs;
        }

        .options {
          display: flex;
          width: max-content;
          flex-direction: column;
          align-items: start;
          gap: 0.5em;
          white-space: nowrap;
        }

        .options--inline-group {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.2em;
        }

        hr {
          width: 100%;
          height: 1px;
          border: none;
          background-color: var(--cc-color-border-neutral, #aaa);
        }

        /* select */

        .select {
          display: inline-grid;
          width: 100%;
          gap: 0.5em 1em;
          grid-template-columns: max-content 1fr;
        }

        .select label {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 0.35em;
          cursor: pointer;
          gap: 2em;
          line-height: 1.25em;
        }

        select {
          width: 100%;
          height: 2em;
          box-sizing: border-box;
          padding: 0 3em 0 0.5em;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          margin: 0;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: inherit;
          cursor: inherit;
          font-family: inherit;
          font-size: inherit;
          grid-area: input;
          line-height: inherit;
        }

        select:hover {
          border-color: var(--cc-color-border-neutral-hovered, #777);
          cursor: pointer;
        }

        select:focus {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .select-wrapper {
          position: relative;
          display: inline-flex;
          width: 100%;
          vertical-align: top;
        }

        .select-wrapper::after {
          position: absolute;
          top: 50%;
          right: 0.5em;
          width: 0.8em;
          height: 0.5em;
          background-color: var(--cc-color-bg-primary, #000);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          content: '';
          transform: translateY(-50%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-controller', CcLogsControllerComponent);
