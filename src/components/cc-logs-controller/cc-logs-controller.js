import '../cc-button/cc-button.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-popover/cc-popover.js';
import '../cc-logs/cc-logs.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixSettings_5Line as optionsIcon,
  iconRemixDownloadFill as followIcon,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';
import { TIMESTAMP_DISPLAYS, TIMEZONES } from '../../lib/timestamp-formatter.js';

const PALETTES = {
  default: ansiPaletteStyle(defaultPalette),
  'One Light': ansiPaletteStyle(oneLightPalette),
  'Tokyo Night Light': ansiPaletteStyle(tokyoNightLightPalette),
  'Night Owl': ansiPaletteStyle(nightOwlPalette),
  Everblush: ansiPaletteStyle(everblushPalette),
  Hyoob: ansiPaletteStyle(hyoobPalette),
};

const PALETTE_CHOICES = Object.entries(PALETTES).map(([name]) => {
  return {
    label: name,
    value: name,
  };
});

/**
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
 * * follow
 * * timestampDisplay
 * * wrapLines
 *
 * Options are encapsulated into a `<cc-popover>` element.
 *
 * ## Usage
 *
 * ```html
 * <cc-logs-controller>
 *   <p slot="header">A header</p>
 *   <cc-logs .logs=${{ state: 'loaded', logs: logs }}></cc-logs>
 * </cc-logs-controller>
 * ```
 *
 * @cssdisplay block
 *
 * @slot - The <cc-logs> component to control. The controls become useless if no <cc-logs> is in this slot.
 * @slot header - A zone on top of the main slot
 */
export class CcLogsControllerComponent extends LitElement {

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

      palette: { type: String },
      metadataDisplay: { type: Object },
      _timestampOptions: { type: Object, state: true },
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

    this.metadataDisplay = {};
    this.palette = 'default';

    this._logsRef = createRef();
  }

  _onScrollToBottomButtonClick () {
    this._getCcLogs().scrollToBottom();
  }

  _onDisplayToggle ({ detail }) {
    this.timestampDisplay = detail;
  }

  _onTimezoneToggle ({ detail }) {
    this.timezone = detail;
  }

  _onWrapLinesChanged (isOn) {
    this.wrapLines = isOn;
  }

  _onMetadataToggle (name, isOn) {
    this.metadataDisplay = {
      ...this.metadataDisplay,
      [name]: isOn,
    };
  }

  _onPaletteToggle ({ detail }) {
    this.palette = detail;
  }

  /**
   * @return {CcLogsComponent}
   */
  _getCcLogs () {
    return this._logsRef.value;
  }

  /**
   * Force scroll to bottom.
   */
  scrollToBottom () {
    this._getCcLogs()?.scrollToBottom();
  }

  /**
   * @param {Log} log
   */
  appendLog (log) {
    this._getCcLogs()?.appendLog(log);
  }

  /**
   * @param {Array<Log>} logs
   */
  appendLogs (logs) {
    this._getCcLogs()?.appendLogs(logs);
  }

  clear () {
    this._getCcLogs()?.clear();
  }

  getMetadataRenderer () {
    return Object.fromEntries(
      Object.entries(this.metadataRenderers).map(([name, renderer]) => {
        const display = this.metadataDisplay[name];

        return [
          name,
          display == null || display === true ? renderer : { hidden: true },
        ];
      }),
    );
  }

  render () {
    // todo: i18n
    return html`
      <div class="header">
        <div class="header--slot">
          <slot name="header"></slot>
        </div>
        
        <div class="header--options">
          <cc-button
            .icon=${followIcon}
            .accessibleName=${'Scroll to bottom'}
            hide-text
            @cc-button:click=${this._onScrollToBottomButtonClick}
          ></cc-button>
          
          <cc-popover 
            .position=${'bottom-right'}
            .icon=${optionsIcon}
            .accessibleName=${'Show logs options'}
            hide-text
          >
            ${this._renderOptions()}
          </cc-popover>
        </div>
      </div>
      
      <!-- this is where the <cc-logs> element comes -->
      <cc-logs
        ${ref(this._logsRef)}
        ?follow=${this.follow}
        .limit=${this.limit}
        .logs=${this.logs}
        ?wrap-lines=${this.wrapLines}
        .timestampDisplay=${this.timestampDisplay}
        .timezone=${this.timezone}
        .metadataRenderers=${this.getMetadataRenderer()}
        .filter=${this.filter}
        ?strip-ansi=${this.stripAnsi}
        style=${PALETTES[this.palette]}
      >
      </cc-logs>
    `;
  }

  _renderOptions () {
    const DISPLAYS = TIMESTAMP_DISPLAYS.map((d) => ({ label: d, value: d }));
    const ZONES = TIMEZONES.map((d) => ({ label: d, value: d }));
    const ON_OFF = [
      { label: 'on', value: 'on' },
      { label: 'off', value: 'off' },
    ];

    return html`
      <div class="options">
        <cc-toggle 
          legend="Wrap lines" 
          .value=${this.wrapLines ? 'on' : 'off'}
          @cc-toggle:input=${({ detail }) => this._onWrapLinesChanged(detail === 'on')}
          .choices=${ON_OFF}
          inline
        ></cc-toggle>
        
        <hr>

        <div class="options--header">Timestamp</div>
        <div class="options--inner">
          <cc-toggle
          legend="" 
          .value=${this.timestampDisplay} 
          @cc-toggle:input=${this._onDisplayToggle} 
          .choices=${DISPLAYS}
          inline
        ></cc-toggle>
        <cc-toggle
          legend="Timezone"
          .value=${this.timezone}
          @cc-toggle:input=${this._onTimezoneToggle}
          .choices=${ZONES}
          inline
        ></cc-toggle>
        </div>
        
        <hr>
        
        <div class="options--header">Color scheme</div>
        <div class="options--inner">
          <cc-select
            inline
            .options=${PALETTE_CHOICES}
            .value=${this.palette}
            @cc-select:input=${this._onPaletteToggle}
          ></cc-select>
        </div>
        
        <hr>
        
        <div class="options--header">Metadata</div>
        <div class="options--inner">
          ${
            Object.entries(this.metadataDisplay).map(([name, value]) => {
              const v = value === true ? 'on' : 'off';

              return html`
              <cc-toggle 
                legend="${name}"
                .value=${v}
                @cc-toggle:input=${({ detail }) => this._onMetadataToggle(name, detail === 'on')} 
                .choices=${ON_OFF}
                inline
              ></cc-toggle>
            `;
            })
          }
        </div>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region header */
        
        .header {
          display: flex;
          padding: 0.3em;
        }
        
        .header--slot {
          flex: 1;
        }
        
        .header--options {
          display: flex;
          flex: auto 0 0;
          flex-direction: row;
          align-items: center;
          gap: 0.4em;
        }
        
        hr {
          width: 100%;
          height: 1px;
          padding: 0;
          border: 0;
          border-top: 1px solid #ccc;
          margin: 0.5em 0;
        }
        
        /* endregion */
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
        }

        label {
          white-space: nowrap;
        }
        
        .options--inner {
          display: flex;
          flex-direction: column;
          margin-left: 1em;
          gap: 0.2em;
        }

        cc-logs {
          padding: 0.5em;
          border: 1px solid #ddd;
          border-radius: 0.2em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-controller', CcLogsControllerComponent);
