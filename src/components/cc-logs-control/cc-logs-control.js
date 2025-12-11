import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendarScheduleLine as dateIcon,
  iconRemixPaletteLine as displayIcon,
  iconRemixPantoneLine as metadataIcon,
  iconRemixSettings_5Line as optionsIcon,
  iconRemixSkipDownLine as scrollToBottomIcon,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-logs/cc-logs.js';
import { DATE_DISPLAYS, TIMEZONES } from '../cc-logs/date-displayer.js';
import '../cc-popover/cc-popover.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import { CcLogsOptionsChangeEvent } from './cc-logs-control.events.js';

/**
 * @type {{[key in LogsControlPalette]: string}}
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
 * @import { LogsMetadataDisplay, LogsControlPalette, LogsOptions } from './cc-logs-control.types.js'
 * @import { LogMessageFilterMode, Log, MetadataFilter, MetadataRenderer } from '../cc-logs/cc-logs.types.js'
 * @import { DateDisplay } from '../cc-logs/date-display.types.js'
 * @import { CcLogs } from '../cc-logs/cc-logs.js'
 * @import { Timezone } from '../../lib/date/date.types.js'
 * @import { Translated } from '../../lib/i18n/i18n.types.js'
 * @import { EventWithTarget } from '../../lib/events.types.js'
 * @import { PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
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
 * * palette scheme
 * * strip ansi
 * * date display
 * * timezone
 * * displayed metadata
 *
 * Options are encapsulated into a `<cc-popover>` element.
 *
 * @cssdisplay grid
 *
 * @slot header - The content of the space on top of the logs block.
 * @slot left - The content of the space on the left of the logs block.
 */
export class CcLogsControl extends LitElement {
  static get properties() {
    return {
      dateDisplay: { type: String, attribute: 'date-display' },
      follow: { type: Boolean },
      limit: { type: Number },
      logs: { type: Array },
      messageFilter: { type: String, attribute: 'message-filter' },
      messageFilterMode: { type: String, attribute: 'message-filter-mode' },
      metadataDisplay: { type: Object, attribute: 'metadata-display' },
      metadataFilter: { type: Array, attribute: 'metadata-filter' },
      metadataRenderers: { type: Object, attribute: 'metadata-renderers' },
      palette: { type: String },
      stripAnsi: { type: Boolean, attribute: 'strip-ansi' },
      timezone: { type: String },
      wrapLines: { type: Boolean, attribute: 'wrap-lines' },
    };
  }

  constructor() {
    super();

    /** @type {DateDisplay} The date display. */
    this.dateDisplay = 'datetime-iso';

    /** @type {boolean} Whether the `cc-logs` should scroll to the bottom everytime a new log line is added. */
    this.follow = false;

    /** @type {number|null} The maximum number of logs to display. `null` for no limit. */
    this.limit = null;

    /** @type {Array<Log>} The initial logs. */
    this.logs = [];

    /** @type {string|null} The filter to apply onto the logs' message. */
    this.messageFilter = null;

    /** @type {LogMessageFilterMode} The mode used to filter by message. */
    this.messageFilterMode = 'loose';

    /** @type {{[key: string]: LogsMetadataDisplay}} An object where key is the metadata name and value controls whether the corresponding metadata should be displayed. */
    this.metadataDisplay = {};

    /** @type {Array<MetadataFilter>} The filter to apply onto the logs' metadata. */
    this.metadataFilter = [];

    /** @type {{[key: string]: MetadataRenderer}} The custom renderers to use for displaying metadata. */
    this.metadataRenderers = {};

    /** @type {LogsControlPalette} The palette to be used. */
    this.palette = 'default';

    /** @type {boolean} Whether to strip ANSI from log message. */
    this.stripAnsi = false;

    /** @type {Timezone} The timezone to use when displaying date. */
    this.timezone = 'UTC';

    /** @type {boolean} Whether to wrap long lines. */
    this.wrapLines = false;

    /** @type {Ref<CcLogs>} */
    this._logsRef = createRef();

    /** @type {{[key: string]: MetadataRenderer}} The resolved metadata renderers to use for displaying metadata. */
    this._resolvedMetadataRenderers = {};
  }

  /* region Public methods */

  /**
   * Appends some logs.
   *
   * @param {Array<Log>} logs The logs to append
   */
  appendLogs(logs) {
    this._logsRef.value?.appendLogs(logs);
  }

  /**
   * Clears the logs
   */
  clear() {
    this._logsRef.value?.clear();
  }

  /* endregion */

  /* region Event handlers */

  _onScrollToBottomButtonClick() {
    this._logsRef.value?.scrollToBottom();
  }

  /**
   * @param {CcSelectEvent<LogsControlPalette>} event
   */
  _onPaletteChange(event) {
    this.palette = event.detail;
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'palette', options: this._getOptions() }));
  }

  /**
   * @param {EventWithTarget<HTMLInputElement>} event
   */
  _onStripAnsiChange(event) {
    this.stripAnsi = event.target.checked;
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'strip-ansi', options: this._getOptions() }));
  }

  /**
   * @param {EventWithTarget<HTMLInputElement>} event
   */
  _onWrapLinesChange(event) {
    this.wrapLines = event.target.checked;
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'wrap-lines', options: this._getOptions() }));
  }

  /**
   * @param {CcSelectEvent<DateDisplay>} event
   */
  _onDateDisplayChange(event) {
    this.dateDisplay = event.detail;
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'date-display', options: this._getOptions() }));
  }

  /**
   * @param {CcSelectEvent<Timezone>} event
   */
  _onTimezoneChange(event) {
    this.timezone = event.detail;
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'timezone', options: this._getOptions() }));
  }

  /**
   * @param {EventWithTarget<HTMLInputElement>} event
   */
  _onMetadataChange(event) {
    const name = event.target.dataset.name;
    const isHidden = !event.target.checked;
    this.metadataDisplay = {
      ...this.metadataDisplay,
      [name]: {
        ...this.metadataDisplay[name],
        hidden: isHidden,
      },
    };
    this.dispatchEvent(new CcLogsOptionsChangeEvent({ name: 'metadata-display', options: this._getOptions() }));
  }

  /* endregion */

  /* region Private methods */

  /**
   * Resolves the metadata renderers according to the `metadataDisplay` and `metadataRenderers` properties.
   *
   * @param {{[key: string]: MetadataRenderer}} metadataRenderers
   * @param {{[key: string]: LogsMetadataDisplay}} metadataDisplay
   * @return {{[key: string]: MetadataRenderer}}
   */
  _resolveMetadataRenderers(metadataRenderers, metadataDisplay) {
    return Object.fromEntries(
      Object.entries(metadataRenderers).map(([name, renderer]) => {
        const display = metadataDisplay[name];

        return [name, display == null || !display.hidden ? renderer : { hidden: true }];
      }),
    );
  }

  /**
   * @param {DateDisplay} dateDisplay
   * @return {Translated}
   */
  _getDateDisplayLabel(dateDisplay) {
    switch (dateDisplay) {
      case 'datetime-iso':
        return i18n('cc-logs-control.date-display.datetime-iso');
      case 'time-iso':
        return i18n('cc-logs-control.date-display.time-iso');
      case 'datetime-short':
        return i18n('cc-logs-control.date-display.datetime-short');
      case 'time-short':
        return i18n('cc-logs-control.date-display.time-short');
      case 'none':
        return i18n('cc-logs-control.date-display.none');
    }
  }

  /**
   *
   * @param {Timezone} timezone
   * @return {Translated}
   */
  _getTimezoneLabel(timezone) {
    switch (timezone) {
      case 'UTC':
        return i18n('cc-logs-control.timezone.utc');
      case 'local':
        return i18n('cc-logs-control.timezone.local');
    }
  }

  /**
   *
   * @param {string} palette
   * @return {Translated}
   */
  _getPaletteLabel(palette) {
    if (palette === 'default') {
      return i18n('cc-logs-control.palette.default');
    }
    return palette;
  }

  /* endregion */

  /**
   * @param {PropertyValues<CcLogsControl>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('metadataRenderers') || changedProperties.has('metadataDisplay')) {
      this._resolvedMetadataRenderers = this._resolveMetadataRenderers(this.metadataRenderers, this.metadataDisplay);
    }
  }

  render() {
    return html`
      <div class="header">
        <slot name="header"></slot>

        <cc-button
          class="header--scroll"
          .icon=${scrollToBottomIcon}
          a11y-name="${i18n('cc-logs-control.scroll-to-bottom')}"
          hide-text
          @cc-click=${this._onScrollToBottomButtonClick}
        ></cc-button>

        <cc-popover
          class="header--options"
          .icon=${optionsIcon}
          a11y-name="${i18n('cc-logs-control.show-logs-options')}"
          hide-text
          position="bottom-right"
        >
          <div class="options">
            ${this._renderDisplayOptions()} ${this._renderDateOptions()} ${this._renderMetadataOptions()}
          </div>
        </cc-popover>
      </div>

      <div class="center">
        <slot name="left"></slot>
        <cc-logs-beta
          class="logs"
          ${ref(this._logsRef)}
          .dateDisplay=${this.dateDisplay}
          ?follow=${this.follow}
          .limit=${this.limit}
          .logs=${this.logs}
          .messageFilter=${this.messageFilter}
          .messageFilterMode=${this.messageFilterMode}
          .metadataFilter=${this.metadataFilter}
          .metadataRenderers=${this._resolvedMetadataRenderers}
          ?strip-ansi=${this.stripAnsi}
          style=${PALETTES[this.palette]}
          .timezone=${this.timezone}
          ?wrap-lines=${this.wrapLines}
        ></cc-logs-beta>
      </div>
    `;
  }

  _renderDisplayOptions() {
    const PALETTE_CHOICES = Object.entries(PALETTES).map(([p]) => ({ label: this._getPaletteLabel(p), value: p }));

    return html` <div class="options-header">
        <cc-icon .icon=${displayIcon} size="lg"></cc-icon>
        <span>${i18n('cc-logs-control.option-header.display')}</span>
      </div>
      <div class="options-group">
        <cc-select
          label="${i18n('cc-logs-control.palette')}"
          .options=${PALETTE_CHOICES}
          .value=${this.palette}
          @cc-select=${this._onPaletteChange}
        ></cc-select>

        <label for="strip-ansi">
          <input id="strip-ansi" type="checkbox" @change=${this._onStripAnsiChange} .checked=${this.stripAnsi} />
          ${i18n('cc-logs-control.strip-ansi')}
        </label>

        <label for="wrap-lines">
          <input id="wrap-lines" type="checkbox" @change=${this._onWrapLinesChange} .checked=${this.wrapLines} />
          ${i18n('cc-logs-control.wrap-lines')}
        </label>
      </div>`;
  }

  _renderDateOptions() {
    const DATE_DISPLAY_CHOICES = DATE_DISPLAYS.map((d) => ({ label: this._getDateDisplayLabel(d), value: d }));
    const TIMEZONE_CHOICES = TIMEZONES.map((z) => ({ label: this._getTimezoneLabel(z), value: z }));

    return html`
      <div class="options-header">
        <cc-icon .icon=${dateIcon} size="lg"></cc-icon>
        <span>${i18n('cc-logs-control.option-header.date')}</span>
      </div>
      <div class="options-group">
        <cc-select
          label="${i18n('cc-logs-control.date-display')}"
          .options=${DATE_DISPLAY_CHOICES}
          .value=${this.dateDisplay}
          @cc-select=${this._onDateDisplayChange}
        ></cc-select>

        <cc-select
          label="${i18n('cc-logs-control.timezone')}"
          .options=${TIMEZONE_CHOICES}
          .value=${this.timezone}
          @cc-select=${this._onTimezoneChange}
        ></cc-select>
      </div>
    `;
  }

  _renderMetadataOptions() {
    const metadataDisplayEntries = Object.entries(this.metadataDisplay ?? {});
    if (metadataDisplayEntries.length === 0) {
      return null;
    }

    return html`
      <div class="options-header">
        <cc-icon .icon=${metadataIcon} size="lg"></cc-icon>
        <span>${i18n('cc-logs-control.option-header.metadata')}</span>
      </div>
      <div class="options-group">
        ${metadataDisplayEntries.map(([name, display]) => {
          return html`
            <label for="metadata-${name}">
              <input
                id="metadata-${name}"
                type="checkbox"
                data-name="${name}"
                @change=${this._onMetadataChange}
                .checked=${!display.hidden}
              />
              ${display.label}
            </label>
          `;
        })}
      </div>
    `;
  }

  /**
   * @return {LogsOptions}
   */
  _getOptions() {
    const metadataDisplayOption = Object.fromEntries(
      Object.entries(this.metadataDisplay).map(([k, v]) => [k, !v.hidden]),
    );
    return {
      'date-display': this.dateDisplay,
      'metadata-display': metadataDisplayOption,
      palette: this.palette,
      timezone: this.timezone,
      'wrap-lines': this.wrapLines,
      'strip-ansi': this.stripAnsi,
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          gap: 0.5em;
          grid-template-rows:
            [header] auto
            [center] 1fr;
        }

        .header {
          align-items: center;
          display: flex;
          gap: 0.35em;
          justify-content: end;
        }

        .center {
          display: flex;
          gap: 0.5em;
          justify-content: stretch;
          min-height: 0;
        }

        .logs {
          flex: 1;
        }

        .options {
          margin: 0.5em 0.75em;
          white-space: nowrap;
        }

        .options-header {
          align-items: center;
          color: var(--cc-color-text-weak, #333);
          display: grid;
          font-weight: bold;
          grid-gap: 0.5em;
          grid-template-columns: auto auto 1fr;
          width: 100%;
        }

        .options-header:not(:first-of-type) {
          margin-top: 1.85em;
        }

        .options-header::after {
          background-color: var(--cc-color-text-weak, #333);
          content: '';
          height: 1px;
        }

        .options-group {
          display: grid;
          grid-template-columns: minmax(max-content, 1fr);
          margin: 1em 0.75em 0.75em;
          row-gap: 0.75em;
        }

        input[type='checkbox'] {
          height: 1em;
          margin: 0;
          width: 1em;
        }

        input[type='checkbox']:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-control-beta', CcLogsControl);
