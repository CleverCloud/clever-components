import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddFill as addIcon,
  iconRemixDeleteBin_2Fill as clearIcon,
  iconRemixPlayFill as playIcon,
  iconRemixSkipDownFill as scrollToBottomIcon,
  iconRemixStopMiniFill as stopIcon,
} from '../../src/assets/cc-remix.icons.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import '../../src/components/cc-logs/cc-logs.js';
import { DATE_DISPLAYS, TIMEZONES } from '../../src/components/cc-logs/date-displayer.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-toggle/cc-toggle.js';
import { ansiPaletteStyle } from '../../src/lib/ansi/ansi-palette-style.js';
import defaultPalette from '../../src/lib/ansi/palettes/default.js';
import everblushPalette from '../../src/lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../src/lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../src/lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../src/lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../src/lib/ansi/palettes/tokyo-night-light.js';
import { Buffer } from '../../src/lib/buffer.js';
import { createFakeLog, CUSTOM_METADATA_RENDERERS } from '../../src/stories/fixtures/logs.js';
import { sandboxStyles } from '../sandbox-styles.js';

/**
 * @typedef {import('../../src/components/cc-logs/cc-logs.js').CcLogs} CcLogs
 * @typedef {import('../../src/components/cc-logs/cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('../../src/components/cc-logs/cc-logs.events.js').CcLogsFollowChangeEvent} CcLogsFollowChangeEvent
 * @typedef {import('../../src/components/cc-logs/date-display.types.js').DateDisplay} DateDisplay
 * @typedef {import('../../src/components/cc-input-number/cc-input-number.js').CcInputNumber} CcInputNumber
 * @typedef {import('../../src/lib/date/date.types.js').Timezone} Timezone
 * @typedef {import('../../src/lib/events.types.js').EventWithTarget<CcInputNumber>} CcInputNumberEvent
 * @typedef {import('lit/directives/ref.js').Ref<CcLogs>} CcLogsRef
 * @typedef {import('lit').PropertyValues<CcLogsSandbox>} PropertyValues
 */

const IPS = ['192.168.12.1', '192.168.48.157'];
const LEVELS = ['INFO', 'WARN', 'DEBUG', 'ERROR'];
const IP_OPTIONS = IPS.map((d) => ({ label: d, value: d }));
const LEVEL_OPTIONS = LEVELS.map((d) => ({ label: d, value: d }));
const RATE_OPTIONS = [
  { label: '🐌', value: '1000' },
  { label: '🐇', value: '100' },
  { label: '🐎', value: '10' },
];
const PALETTE_OPTIONS = [
  { label: 'Default overridable with theme', value: '' },
  { label: 'Default', value: ansiPaletteStyle(defaultPalette) },
  { label: 'One Light', value: ansiPaletteStyle(oneLightPalette) },
  { label: 'Tokyo Night Light', value: ansiPaletteStyle(tokyoNightLightPalette) },
  { label: 'Night Owl', value: ansiPaletteStyle(nightOwlPalette) },
  { label: 'Everblush', value: ansiPaletteStyle(everblushPalette) },
  { label: 'Hyoob', value: ansiPaletteStyle(hyoobPalette) },
];
const DATE_DISPLAY_OPTIONS = DATE_DISPLAYS.map((d) => ({ label: d, value: d }));
const ZONE_OPTIONS = TIMEZONES.map((d) => ({ label: d, value: d }));

class CcLogsSandbox extends LitElement {
  static get properties() {
    return {
      _dateDisplay: { type: String, state: true },
      _filterIps: { type: Array, state: true },
      _filterLevels: { type: Array, state: true },
      _follow: { type: Boolean, state: true },
      _limit: { type: Number, state: true },
      _palette: { type: String, state: true },
      _rate: { type: Number, state: true },
      _started: { type: Boolean, state: true },
      _stripAnsi: { type: Boolean, state: true },
      _timezone: { type: String, state: true },
      _useCustomMetadataRenderers: { type: Boolean, state: true },
      _wrapLines: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {DateDisplay} */
    this._dateDisplay = 'datetime-iso';
    /** @type {Array<string>} */
    this._filterIps = [];
    /** @type {Array<string>} */
    this._filterLevels = [];
    this._follow = true;
    this._limit = 50000;
    this._palette = PALETTE_OPTIONS[0].value;
    this._rate = 1000;
    this._started = false;
    this._stripAnsi = false;
    /** @type {Timezone} */
    this._timezone = 'UTC';
    this._useCustomMetadataRenderers = false;
    this._wrapLines = false;
    /** @type {Array<MetadataFilter>} */
    this._filter = [];
    this._index = 0;
    this._timer = null;
    /** @type {CcLogsRef} */
    this._logsRef = createRef();
    this._buffer = new Buffer(
      (logs) => {
        this._logsRef.value.appendLogs(logs);
      },
      { timeout: 200 },
    );
  }

  _newLog() {
    this._index++;

    return createFakeLog(this._index, { longMessage: true, ansi: true });
  }

  _addLog() {
    this._buffer.add(this._newLog());
  }

  _clear() {
    this._buffer.clear();
    this._logsRef.value.clear();
  }

  _isStarted() {
    return this._started;
  }

  /**
   * @param {number} rate
   */
  _start(rate) {
    if (this._isStarted()) {
      this._stop();
    }

    this._timer = setInterval(() => this._addLog(), rate);
    this._started = true;
  }

  _stop() {
    if (this._isStarted()) {
      clearInterval(this._timer);
      this._timer = null;
      this._started = false;
    }
  }

  _onStartStopClick() {
    if (this._isStarted()) {
      this._stop();
    } else {
      this._start(this._rate);
    }
  }

  _onAddClick() {
    this._logsRef.value.appendLogs([this._newLog()]);
  }

  _onClearClick() {
    this._clear();
  }

  /**
   * @param {CcInputNumberEvent} e
   */
  _onLimitChanged(e) {
    this._limit = e.target.value;
  }

  /**
   * @param {CustomEvent<string>} e
   */
  _onRateToggle(e) {
    this._rate = parseInt(e.detail);
    if (this._isStarted()) {
      this._start(this._rate);
    }
  }

  /**
   * @param {CustomEvent<DateDisplay>} e
   */
  _onDateDisplayToggle(e) {
    this._dateDisplay = e.detail;
  }

  /**
   * @param {CustomEvent<Timezone>} e
   */
  _onTimezoneToggle(e) {
    this._timezone = e.detail;
  }

  /**
   * @param {CustomEvent<string>} e
   */
  _onPaletteToggle(e) {
    this._palette = e.detail;
  }

  /**
   * @param {CustomEvent<Array<string>>} e
   */
  _onFilterIpsToggle(e) {
    this._filterIps = e.detail;
  }

  /**
   * @param {CustomEvent<Array<string>>} e
   */
  _onFilterLevelsToggle(e) {
    this._filterLevels = e.detail;
  }

  _onWrapLinesSwitched() {
    this._wrapLines = !this._wrapLines;
  }

  _onStripAnsiSwitched() {
    this._stripAnsi = !this._stripAnsi;
  }

  _onFollowSwitched() {
    this._follow = !this._follow;
  }

  _onUseCustomMetadataRenderersSwitched() {
    this._useCustomMetadataRenderers = !this._useCustomMetadataRenderers;
  }

  /**
   * @param {CcLogsFollowChangeEvent} e
   */
  _onFollowChange({ detail }) {
    this._follow = detail;
  }

  _onScrollToBottomClick() {
    this._logsRef.value.scrollToBottom();
  }

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('_filterLevels') || changedProperties.has('_filterIps')) {
      this._filter = [
        ...this._filterLevels.map((v) => ({ metadata: 'level', value: v })),
        ...this._filterIps.map((v) => ({ metadata: 'ip', value: v })),
      ];
    }
  }

  render() {
    return html`
      <div class="ctrl-top">
        <cc-toggle
          .value=${`${this._rate}`}
          @cc-toggle:input=${this._onRateToggle}
          .choices=${RATE_OPTIONS}
        ></cc-toggle>
        <cc-button
          @cc-button:click=${this._onStartStopClick}
          ?danger=${this._started}
          ?success=${!this._started}
          .icon=${this._started ? stopIcon : playIcon}
          a11y-name=${this._started ? 'Stop' : 'Start'}
          hide-text
        ></cc-button>
        <cc-button @cc-button:click=${this._onAddClick} ?primary=${true} ?outlined=${true} .icon=${addIcon}
          >Add one log
        </cc-button>
        <cc-button @cc-button:click=${this._onClearClick} ?danger=${true} ?outlined=${true} .icon=${clearIcon}
          >Clear
        </cc-button>
      </div>

      <div class="main">
        <cc-logs-beta
          id="cc-logs"
          ?follow=${this._follow}
          ?wrap-lines=${this._wrapLines}
          ?strip-ansi=${this._stripAnsi}
          .dateDisplay=${this._dateDisplay}
          .timezone=${this._timezone}
          .limit=${this._limit}
          .metadataFilter=${this._filter}
          .metadataRenderers=${this._useCustomMetadataRenderers ? CUSTOM_METADATA_RENDERERS : null}
          style="${this._palette}"
          ${ref(this._logsRef)}
          @cc-logs-follow-change=${this._onFollowChange}
        ></cc-logs-beta>
      </div>

      <div class="ctrl-right">
        <label for="useCustomMetadataRenderer">
          <input
            id="useCustomMetadataRenderer"
            type="checkbox"
            @change=${this._onUseCustomMetadataRenderersSwitched}
            .checked=${this._useCustomMetadataRenderers}
          />
          Use custom metadata rendering
        </label>

        <label for="wrap-lines">
          <input id="wrap-lines" type="checkbox" @change=${this._onWrapLinesSwitched} .checked=${this._wrapLines} />
          Wrap lines
        </label>

        <cc-select
          label="ANSI Palette"
          .value=${this._palette}
          @cc-select:input=${this._onPaletteToggle}
          .options=${PALETTE_OPTIONS}
        >
          <p slot="help">You can change the ANSI color palette</p>
        </cc-select>

        <label for="strip-ansi">
          <input id="strip-ansi" type="checkbox" @change=${this._onStripAnsiSwitched} .checked=${this._stripAnsi} />
          Strip ANSI
        </label>

        <cc-select
          label="Date display"
          .value=${this._dateDisplay}
          @cc-select:input=${this._onDateDisplayToggle}
          .options=${DATE_DISPLAY_OPTIONS}
        >
          <p slot="help">You can change the date format</p>
        </cc-select>

        <cc-toggle
          legend="Timezone"
          .value=${this._timezone}
          @cc-toggle:input=${this._onTimezoneToggle}
          .choices=${ZONE_OPTIONS}
          inline
        ></cc-toggle>

        <cc-input-number
          @blur=${this._onLimitChanged}
          @cc-input-number:requestimplicitsubmit=${this._onLimitChanged}
          .value=${this._limit}
          label="Limit"
          min="0"
        >
          <p slot="help">Limit saves memory!</p>
        </cc-input-number>

        <cc-toggle
          legend="Filtered IP"
          .multipleValues=${this._filterIps}
          @cc-toggle:input-multiple=${this._onFilterIpsToggle}
          .choices=${IP_OPTIONS}
        ></cc-toggle>

        <cc-toggle
          legend="Filtered Log Level"
          .multipleValues=${this._filterLevels}
          @cc-toggle:input-multiple=${this._onFilterLevelsToggle}
          .choices=${LEVEL_OPTIONS}
        ></cc-toggle>

        <div class="spacer"></div>

        <div>
          <cc-button @cc-button:click=${this._onScrollToBottomClick} .icon=${scrollToBottomIcon}
            >Scroll to bottom</cc-button
          >
        </div>
        <label for="follow">
          <input id="follow" type="checkbox" @change=${this._onFollowSwitched} .checked=${this._follow} /> Follow
        </label>
      </div>
    `;
  }

  static get styles() {
    return [
      sandboxStyles,
      css`
        .spacer {
          flex: 1;
        }

        #cc-logs {
          border: 1px solid #ddd;
          border-radius: 0.2em;
          height: 600px;
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-sandbox', CcLogsSandbox);
