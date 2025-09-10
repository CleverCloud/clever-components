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
import '../cc-logs-instances/cc-logs-instances.js';
import { buildLogsLoadingProgressState } from '../cc-logs-loading-progress/cc-logs-loading-progress-state-builder.js';
import '../cc-logs-loading-progress/cc-logs-loading-progress.js';
import '../cc-logs-message-filter/cc-logs-message-filter.js';
import '../cc-notice/cc-notice.js';

/** @type {{instanceId: MetadataRenderer, instance: MetadataRenderer}} */
const CUSTOM_METADATA_RENDERERS = {
  instanceId: () => {
    return {
      hidden: true,
    };
  },
  instance: {
    strong: true,
    size: 18,
  },
};

/**
 * @typedef {import('./cc-logs-app-runtime.types.js').LogsAppRuntimeState} LogsAppRuntimeState
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('../cc-logs-control/cc-logs-control.js').CcLogsControl} CcLogsControl
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsOptions} LogsOptions
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.events.js').CcLogsDateRangeSelectionChangeEvent} CcLogsDateRangeSelectionChangeEvent
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').LogsInstancesState} LogsInstancesState
 * @typedef {import('../cc-logs-message-filter/cc-logs-message-filter.types.js').LogsMessageFilterValue} LogsMessageFilterValue
 * @typedef {import('../cc-logs-message-filter/cc-logs-message-filter.events.js').CcLogsMessageFilterChangeEvent} CcLogsMessageFilterChangeEvent
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('lit/directives/ref.js').Ref<CcLogsControl>} RefCcLogsControl
 * @typedef {import('lit').PropertyValues<CcLogsAppRuntime>} PropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 *
 * @beta
 */
export class CcLogsAppRuntime extends LitElement {
  static get properties() {
    return {
      dateRangeSelection: { type: Object, attribute: 'date-range-selection' },
      limit: { type: Number },
      options: { type: Object },
      selectedInstances: { type: Array, attribute: 'selected-instances' },
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

    /** @type {number|null} The maximum number of logs to display. `null` for no limit. */
    this.limit = 1000;

    /** @type {LogsOptions} The logs options. */
    this.options = {
      'date-display': 'datetime-iso',
      'metadata-display': {
        instance: false,
      },
      palette: 'default',
      'strip-ansi': false,
      timezone: 'UTC',
      'wrap-lines': false,
    };

    /** @type {Array<string>} The array of instances ids that should be selected */
    this.selectedInstances = [];

    /** @type {LogsAppRuntimeState} The state of the component */
    this.state = {
      type: 'loadingInstances',
    };

    /** @type {RefCcLogsControl} */
    this._logsRef = createRef();

    /** @type {LogsMessageFilterValue} */
    this._messageFilter = { value: '', mode: 'loose' };

    /** @type {{instance: LogsMetadataDisplay}} */
    this._metadataDisplay = {
      instance: {
        label: i18n('cc-logs-app-runtime.options.display-instance'),
        hidden: !this.options['metadata-display'].instance,
      },
    };

    this._fullscreen = false;
  }

  /* region Public methods */

  /**
   * @param {Log[]} logs
   */
  appendLogs(logs) {
    this._logsRef.value?.appendLogs(logs);
  }

  clear() {
    this._logsRef.value?.clear();
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

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('options')) {
      this._metadataDisplay = {
        instance: {
          label: this._metadataDisplay.instance.label,
          hidden: !this.options['metadata-display'].instance,
        },
      };
    }
  }

  render() {
    const overlay = {
      overlay: true,
      fullscreen: this._fullscreen,
    };
    const wrapper = {
      wrapper: true,
      fullscreen: this._fullscreen,
    };
    return html`
      <div class=${classMap(overlay)}>
        <div class=${classMap(wrapper)}>
          <div class="logs-wrapper">${this._renderLogs()}</div>
          ${this._renderLoadingProgress()}
        </div>
      </div>
    `;
  }

  _renderInstances() {
    /**
     * @type {LogsInstancesState}
     */
    let state;
    if (this.state.type === 'loadingInstances') {
      state = { state: 'loading' };
    } else if (this.state.type === 'errorInstances') {
      state = { state: 'error' };
    } else {
      state = {
        state: 'loaded',
        mode: this.dateRangeSelection.type === 'live' ? 'live' : 'cold',
        instances: this.state.instances,
        selection: this.state.selection,
      };
    }

    return html`<cc-logs-instances-beta class="instances" slot="left" .state=${state}></cc-logs-instances-beta>`;
  }

  /**
   * @return {TemplateResult|null}
   */
  _renderLoadingProgress() {
    if (this.state.type === 'loadingInstances' || this.state.type === 'errorInstances') {
      return null;
    }

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
          <cc-notice slot="header" intent="warning" message=${i18n('cc-logs-app-runtime.logs.error')}></cc-notice>
        </div>
      `;
    }

    const metadataFilter =
      this.state.type === 'loaded' &&
      (this.state.streamState.type === 'connecting' ||
        this.state.streamState.type === 'running' ||
        this.state.streamState.type === 'paused' ||
        this.state.streamState.type === 'completed')
        ? this.state.selection?.map((instanceId) => {
            return {
              metadata: 'instanceId',
              value: instanceId,
            };
          })
        : [];

    return html`
      <cc-logs-control-beta
        ${ref(this._logsRef)}
        class="logs"
        follow
        limit="${this.limit}"
        .dateDisplay=${this.options['date-display']}
        .metadataDisplay=${this._metadataDisplay}
        .messageFilter=${this._messageFilter.value}
        .messageFilterMode=${this._messageFilter.mode}
        .metadataFilter=${metadataFilter}
        .metadataRenderers=${CUSTOM_METADATA_RENDERERS}
        .palette=${this.options.palette}
        ?strip-ansi=${this.options['strip-ansi']}
        .timezone=${this.options.timezone}
        ?wrap-lines=${this.options['wrap-lines']}
      >
        <div slot="header" class="logs-header">
          <cc-logs-date-range-selector-beta
            class="date-range-selector"
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
              ? i18n('cc-logs-app-runtime.fullscreen.exit')
              : i18n('cc-logs-app-runtime.fullscreen')}
            hide-text
            @cc-click=${this._onFullscreenToggle}
          ></cc-button>
        </div>

        ${this._renderInstances()}
      </cc-logs-control-beta>

      ${this.state.type === 'loaded' &&
      this.state.streamState.type === 'completed' &&
      this.state.streamState.progress.value === 0
        ? html`
            <div class="overlay-logs-wrapper">
              <cc-notice
                intent="info"
                heading=${i18n('cc-logs-app-runtime.logs.warning.no-logs.title')}
                message=${i18n('cc-logs-app-runtime.logs.warning.no-logs.message')}
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
                  <span>${i18n('cc-logs-app-runtime.logs.loading')}</span>
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
                heading=${i18n('cc-logs-app-runtime.logs.warning.waiting.title')}
                message=${i18n('cc-logs-app-runtime.logs.warning.waiting.message')}
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
          --instances-width: 20em;

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
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.5em;
        }

        .wrapper.fullscreen {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          margin: 1em;
          padding: 1em;
        }

        .instances {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          width: var(--instances-width);
        }

        .logs-wrapper {
          flex: 1;
          grid-area: logs;
          min-height: 0;
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

        .progress {
          grid-area: progress;
        }

        .overlay-logs-wrapper {
          left: calc(50% + var(--instances-width) / 2);
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
window.customElements.define('cc-logs-app-runtime-beta', CcLogsAppRuntime);
