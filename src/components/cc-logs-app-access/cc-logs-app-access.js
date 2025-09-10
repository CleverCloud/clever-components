import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixFullscreenExitLine as fullscreenExitIcon,
  iconRemixFullscreenLine as fullscreenIcon,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-control/cc-logs-control.js';
import '../cc-logs-date-range-selector/cc-logs-date-range-selector.js';
import { buildLogsLoadingProgressState } from '../cc-logs-loading-progress/cc-logs-loading-progress-state-builder.js';
import '../cc-logs-loading-progress/cc-logs-loading-progress.js';
import '../cc-logs-message-filter/cc-logs-message-filter.js';
import '../cc-notice/cc-notice.js';

/** @type {{[k in 'ip'|'country'|'city'|'method'|'status']: MetadataRenderer}} */
const CUSTOM_METADATA_RENDERERS = {
  ip: {
    size: 15,
  },
  country: {
    size: 2,
  },
  city: (metadata) => {
    const size = 12;

    let value = metadata.value;
    if (metadata.value.length > size) {
      value = metadata.value.substring(0, size - 1) + '\u2026';
    }

    return {
      text: value,
      size: size,
    };
  },
  method: (metadata) => {
    return {
      text: metadata.value.toUpperCase(),
      size: 7,
    };
  },
  status: (metadata) => {
    /**
     * @return {MetadataIntent}
     */
    function getIntent() {
      const statusCode = Number(metadata.value);
      if (statusCode >= 500) {
        return 'danger';
      }
      if (statusCode >= 400) {
        return 'warning';
      }
      if (statusCode >= 300) {
        return 'info';
      }
      if (statusCode >= 200) {
        return 'success';
      }

      return 'neutral';
    }

    return {
      intent: getIntent(),
      text: metadata.value,
    };
  },
};

/**
 * @typedef {import('./cc-logs-app-access.types.js').LogsAppAccessState} LogsAppAccessState
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataIntent} MetadataIntent
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('../cc-logs-control/cc-logs-control.js').CcLogsControl} CcLogsControl
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsOptions} LogsOptions
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.events.js').CcLogsDateRangeSelectionChangeEvent} CcLogsDateRangeSelectionChangeEvent
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').LogsInstancesState} LogsInstancesState
 * @typedef {import('../cc-logs-message-filter/cc-logs-message-filter.types.js').LogsMessageFilterValue} LogsMessageFilterValue
 * @typedef {import('../cc-logs-message-filter/cc-logs-message-filter.events.js').CcLogsMessageFilterChangeEvent} CcLogsMessageFilterChangeEvent
 * @typedef {import('lit/directives/ref.js').Ref<CcLogsControl>} CcLogsControlRef
 * @typedef {import('lit').PropertyValues<CcLogsAppAccess>} PropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component displaying application access logs.
 *
 * @cssdisplay block
 *
 * @beta
 */
export class CcLogsAppAccess extends LitElement {
  static get properties() {
    return {
      dateRangeSelection: { type: Object, attribute: 'date-range-selection' },
      limit: { type: Number },
      options: { type: Object },
      state: { type: Object },
      _fullscreen: { type: Boolean, state: true },
      _messageFilter: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {LogsDateRangeSelection} The date range selection. */
    this.dateRangeSelection = {
      type: 'live',
    };

    /** @type {number} The maximum number of logs to display. */
    this.limit = 1000;

    /** @type {LogsOptions} The logs options. */
    this.options = {
      'date-display': 'datetime-iso',
      'metadata-display': {
        ip: true,
        country: true,
        city: true,
      },
      palette: 'default',
      'strip-ansi': false,
      timezone: 'UTC',
      'wrap-lines': false,
    };

    /** @type {LogsAppAccessState} The state of the component */
    this.state = {
      type: 'loaded',
      streamState: { type: 'idle' },
    };

    /** @type {CcLogsControlRef} */
    this._logsRef = createRef();

    /** @type {LogsMessageFilterValue} */
    this._messageFilter = { value: '', mode: 'loose' };

    this._fullscreen = false;
  }

  /* region Public methods */

  /**
   * @param {Array<Log>} logs
   */
  appendLogs(logs) {
    this._logsRef.value?.appendLogs(logs);
  }

  clear() {
    this._logsRef.value?.clear();
  }

  /* endregion */

  /* region Private methods */

  _getMetadataDisplay() {
    return {
      ip: {
        label: i18n('cc-logs-app-access.options.ip'),
        hidden: !this.options['metadata-display'].ip,
      },
      country: {
        label: i18n('cc-logs-app-access.options.country'),
        hidden: !this.options['metadata-display'].country,
      },
      city: {
        label: i18n('cc-logs-app-access.options.city'),
        hidden: !this.options['metadata-display'].city,
      },
    };
  }

  /* endregion */

  /* region Event handlers */

  /**
   * @param {CcLogsDateRangeSelectionChangeEvent} event
   */
  _onDateRangeSelectionChange(event) {
    this.dateRangeSelection = event.detail.selection;
  }

  _onFullscreenToggle() {
    this._fullscreen = !this._fullscreen;
  }

  /**
   * @param {CcLogsMessageFilterChangeEvent} event
   */
  _onMessageFilterChange({ detail }) {
    this._messageFilter = detail;
  }

  /* endregion */

  render() {
    const fullscreen = { fullscreen: this._fullscreen };

    return html`
      <div class="overlay ${classMap(fullscreen)}">
        <div class="wrapper ${classMap(fullscreen)}">
          <div class="logs-wrapper">${this._renderLogs()}</div>
          ${this._renderLoadingProgress()}
        </div>
      </div>
    `;
  }

  /**
   * @return {TemplateResult|null}
   */
  _renderLoadingProgress() {
    const state = buildLogsLoadingProgressState(this.state.streamState);
    if (state == null) {
      return null;
    }

    return html`<cc-logs-loading-progress-beta
      class="progress"
      .state=${state}
      limit=${this.limit}
    ></cc-logs-loading-progress-beta>`;
  }

  /**
   * @return {TemplateResult}
   */
  _renderLogs() {
    if (this.state.type === 'loaded' && this.state.streamState.type === 'error') {
      return html`
        <div class="center-logs-wrapper">
          <cc-notice slot="header" intent="warning" message=${i18n('cc-logs-app-access.error')}></cc-notice>
        </div>
      `;
    }

    return html`
      <cc-logs-control-beta
        ${ref(this._logsRef)}
        class="logs"
        follow
        limit="${this.limit}"
        .dateDisplay=${this.options['date-display']}
        .messageFilter=${this._messageFilter.value}
        .messageFilterMode=${this._messageFilter.mode}
        .metadataDisplay=${this._getMetadataDisplay()}
        .metadataRenderers=${CUSTOM_METADATA_RENDERERS}
        .palette=${this.options.palette}
        .timezone=${this.options.timezone}
        .wrapLines=${this.options['wrap-lines']}
      >
        <div slot="header" class="logs-header">
          <cc-logs-date-range-selector-beta
            .value=${this.dateRangeSelection}
            @cc-logs-date-range-selection-change=${this._onDateRangeSelectionChange}
          ></cc-logs-date-range-selector-beta>

          <cc-logs-message-filter-beta
            class="logs-message-filter"
            .filter=${this._messageFilter}
            @cc-logs-message-filter-change=${this._onMessageFilterChange}
          ></cc-logs-message-filter-beta>

          <cc-button
            class="header-fullscreen-button"
            .icon=${this._fullscreen ? fullscreenExitIcon : fullscreenIcon}
            a11y-name=${this._fullscreen
              ? i18n('cc-logs-app-access.fullscreen.exit')
              : i18n('cc-logs-app-access.fullscreen')}
            hide-text
            @cc-click=${this._onFullscreenToggle}
          ></cc-button>
        </div>
      </cc-logs-control-beta>

      ${this.state.type === 'loaded' &&
      this.state.streamState.type === 'completed' &&
      this.state.streamState.progress.value === 0
        ? html`
            <div class="overlay-logs-wrapper">
              <cc-notice
                intent="info"
                heading=${i18n('cc-logs-app-access.no-logs.title')}
                message=${i18n('cc-logs-app-access.no-logs.message')}
              ></cc-notice>
            </div>
          `
        : ''}
      ${this.state.type === 'loaded' &&
      (this.state.streamState.type === 'idle' || this.state.streamState.type === 'connecting')
        ? html`
            <div class="overlay-logs-wrapper">
              <cc-notice intent="info" no-icon>
                <div class="overlay-logs-wrapper--loader" slot="message">
                  <cc-loader></cc-loader>
                  <span>${i18n('cc-logs-app-access.loading')}</span>
                </div>
              </cc-notice>
            </div>
          `
        : ''}
      ${this.state.type === 'loaded' && this.state.streamState.type === 'waitingForFirstLog'
        ? html`
            <div class="overlay-logs-wrapper">
              <cc-notice
                intent="info"
                heading=${i18n('cc-logs-app-access.waiting.title')}
                message=${i18n('cc-logs-app-access.waiting.message')}
              ></cc-notice>
            </div>
          `
        : ''}
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */
        :host {
          display: block;
        }

        .overlay {
          display: flex;
          height: 100%;
        }

        .overlay.fullscreen {
          backdrop-filter: blur(5px);
          bottom: 0;
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 999;
        }

        .wrapper {
          display: grid;
          flex: 1;
          gap: 0.5em;
          grid-auto-rows: 1fr auto;
        }

        .wrapper.fullscreen {
          background-color: var(--cc-color-bg-default);
          border: 1px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          margin: 1em;
          padding: 1em;
        }

        .logs-wrapper {
          position: relative;
        }

        .logs {
          height: 100%;
        }

        .logs-header {
          align-items: center;
          display: flex;
          gap: 1em;
          width: 100%;
        }

        .logs-message-filter {
          flex: 1;
        }

        .center-logs-wrapper {
          align-items: center;
          display: flex;
          flex-direction: row;
          height: 100%;
          justify-content: center;
        }

        .overlay-logs-wrapper {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .overlay-logs-wrapper--loader {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .overlay-logs-wrapper--loader cc-loader {
          height: 1.5em;
          width: 1.5em;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-app-access-beta', CcLogsAppAccess);
