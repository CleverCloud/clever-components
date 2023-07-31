import '../cc-button/cc-button.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-popover/cc-popover.js';
import '../cc-logs/cc-logs.js';
import { css, html, LitElement } from 'lit';
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

const WRAP_LINES_CHOICES = [
  { label: 'on', value: 'on' },
  { label: 'off', value: 'off' },
];
const METADATA_CHOICES = [
  { label: 'show', value: 'show' },
  { label: 'hide', value: 'hide' },
];

/**
 * @typedef {import('./cc-logs-controller.types.js').LogsControllerPalette} LogsControllerPalette
 * @typedef {import('./cc-logs-controller.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../../lib/timestamp-formatter.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('../../lib/timestamp-formatter.types.js').Timezone} Timezone
 */

export class CcLogsControllerOptionsComponent extends LitElement {

  static get properties () {
    return {
      metadataDisplay: { type: Object },
      palette: { type: String },
      timestampDisplay: { type: String, attribute: 'timestamp-display' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
      version: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {{[key: string]: LogsMetadataDisplay}} An object where key is the metadata name and value controls whether the corresponding metadata should be displayed. */
    this.metadataDisplay = {};

    /** @type {LogsControllerPalette} The palette to be used. */
    this.palette = 'default';

    /** @type {TimestampDisplay} The timestamp display. */
    this.timestampDisplay = 'datetime-iso';

    /** @type {Timezone} The timezone to use when displaying timestamp. */
    this.timezone = 'UTC';

    /** @type {boolean} Whether to wrap long lines. */
    this.wrapLines = false;

    this.version = '0';
  }

  _onWrapLinesChanged (isOn) {
    this.wrapLines = isOn;
    dispatchCustomEvent(this, 'optionChanged', { name: 'wrapLines', value: this.wrapLines });
  }

  _onTimestampDisplayToggle ({ detail }) {
    this.timestampDisplay = detail;
    dispatchCustomEvent(this, 'optionChanged', { name: 'timestampDisplay', value: this.timestampDisplay });
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
    dispatchCustomEvent(this, 'optionChanged', { name: 'metadataDisplay', value: this.metadataDisplay });
  }

  render () {
    return this._renderOptions();
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
    if (this.version === '0') {
      return this._renderOptionsV0();
    }
    if (this.version === '1') {
      return this._renderOptionsV1();
    }
    if (this.version === '2') {
      return this._renderOptionsV2();
    }
  }

  _renderOptionsV0 () {
    const TIMESTAMP_DISPLAY_CHOICES = TIMESTAMP_DISPLAYS
      .map((d) => ({ label: this._getTimestampDisplayLabel(d), value: d }));
    const TIMEZONE_CHOICES = TIMEZONES
      .map((z) => ({ label: this._getTimezoneLabel(z), value: z }));
    const PALETTE_CHOICES = Object.entries(PALETTES)
      .map(([p]) => ({ label: this._getPaletteLabel(p), value: p }));

    return html`
      <div class="options">
        <cc-toggle
          legend="${i18n('cc-logs-controller.wrap-lines')}"
          .value=${this.wrapLines ? 'on' : 'off'}
          @cc-toggle:input=${({ detail }) => this._onWrapLinesChanged(detail === 'on')}
          .choices=${WRAP_LINES_CHOICES}
          inline
          subtle
        ></cc-toggle>

        <div class="options--inline-group">
          <cc-select
            label="${i18n('cc-logs-controller.timestamp-display')}"
            inline
            .options=${TIMESTAMP_DISPLAY_CHOICES}
            .value=${this.timestampDisplay}
            @cc-select:input=${this._onTimestampDisplayToggle}
          ></cc-select>
          <cc-toggle
            inline
            subtle
            .choices=${TIMEZONE_CHOICES}
            .value=${this.timezone}
            @cc-toggle:input=${this._onTimezoneToggle}
          ></cc-toggle>
        </div>

        <cc-select
          label="${i18n('cc-logs-controller.palette')}"
          inline
          .options=${PALETTE_CHOICES}
          .value=${this.palette}
          @cc-select:input=${this._onPaletteToggle}
        ></cc-select>

        ${Object.entries(this.metadataDisplay)
          .map(([name, display]) => {
            return html`
              <cc-toggle
                legend="${display.label}"
                .value=${display.hidden ? 'hide' : 'show'}
                @cc-toggle:input=${({ detail }) => this._onMetadataToggle(name, detail === 'hide')}
                .choices=${METADATA_CHOICES}
                inline
                subtle
              ></cc-toggle>
            `;
          })
        }
      </div>
    `;
  }

  _renderOptionsV1 () {
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
          })
        }
      </div>
    `;
  }

  updated (changedProperties) {
    /*
     * The `<select>` value must match the value of an `<option>` element.
     * We need to make sure the value of the `<select>` element in only updated after
     * `<option>` elements have been rendered.
    */
    if (
      changedProperties.has('timestampDisplay')
      || changedProperties.has('timezone')
      || changedProperties.has('palette')
    ) {
      const setValue = (s, v) => {
        const e = this.shadowRoot.querySelector(s);
        if (e != null) {
          e.value = v;
        }
      };
      setValue('#timestampDisplay', this.timestampDisplay);
      setValue('#timezone', this.timezone);
      setValue('#palette', this.palette);
    }
  }

  _renderOptionsV2 () {
    const TIMESTAMP_DISPLAY_CHOICES = TIMESTAMP_DISPLAYS
      .map((d) => ({ label: this._getTimestampDisplayLabel(d), value: d }));
    const TIMEZONE_CHOICES = TIMEZONES
      .map((z) => ({ label: this._getTimezoneLabel(z), value: z }));
    const PALETTE_CHOICES = Object.entries(PALETTES)
      .map(([p]) => ({ label: this._getPaletteLabel(p), value: p }));

    return html`
      <div class="options-grid">
        <label class="full-line" for="wrapLines">
          <input id="wrapLines"
                 type="checkbox"
                 @change=${(e) => this._onWrapLinesChanged(e.target.checked)}
                 .checked=${this.wrapLines}> ${i18n('cc-logs-controller.wrap-lines')}
        </label>

        <hr>

        <label for="timestampDisplay">${i18n('cc-logs-controller.timestamp-display')}</label>
        <div class="select-wrapper">
          <select
            id="timestampDisplay"
            @input=${(e) => this._onTimestampDisplayToggle({ detail: e.target.value })}
            .value=${this.timestampDisplay}
          >
            ${TIMESTAMP_DISPLAY_CHOICES.map((option) => html`
              <option value=${option.value}>${option.label}</option>
            `)}
          </select>
        </div>

        <label for="timezone">${i18n('cc-logs-controller.timezone')}</label>
        <div class="select-wrapper">
          <select
            id="timezone"
            @input=${(e) => this._onTimezoneToggle({ detail: e.target.value })}
            .value=${this.timezone}
          >
            ${TIMEZONE_CHOICES.map((option) => html`
              <option value=${option.value}>${option.label}</option>
            `)}
          </select>
        </div>

        <hr>

        <label for="palette">${i18n('cc-logs-controller.palette')}</label>
        <div class="select-wrapper">
          <select
            id="palette"
            @input=${(e) => this._onPaletteToggle({ detail: e.target.value })}
            .value=${this.palette}
          >
            ${PALETTE_CHOICES.map((option) => html`
                <option value=${option.value}>${option.label}</option>
              `)}
          </select>
        </div>
        
        <hr>

        ${Object.entries(this.metadataDisplay)
          .map(([name, display]) => {
            return html`
              <label class="full-line" for="metadata-${name}">
                <input id="metadata-${name}"
                       type="checkbox"
                       @change=${(e) => this._onMetadataToggle(name, !e.target.checked)}
                       .checked=${!display.hidden}> ${display.label}
              </label>
            `;
          })
        }
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          width: max-content;
        }

        cc-select {
          width: 100%;
        }

        .options {
          display: flex;
          width: max-content;
          flex-direction: column;
          align-items: start;
          gap: 0.5em;
          white-space: nowrap;
        }
        
        .options-grid {
          display: grid;
          width: max-content;
          align-items: center;
          grid-gap: 0.5em 1em;
          grid-template-columns: max-content 1fr;
          white-space: nowrap;
        }
        
        .full-line {
          grid-column-end: span 2;
        }

        .options--inline-group {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 0.2em;
        }

        hr {
          width: 100%;
          height: 1px;
          border: none;
          background-color: var(--cc-color-border-neutral, #aaa);
          grid-column-end: span 2;
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
          padding: 0 2em 0 0.5em;
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

window.customElements.define('cc-logs-controller-options', CcLogsControllerOptionsComponent);
