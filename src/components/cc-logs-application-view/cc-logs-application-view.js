import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixFullscreenExitLine as fullscreenExitIcon,
  iconRemixFullscreenLine as fullscreenIcon,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../translations/translation.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-control/cc-logs-control.js';
import '../cc-logs-date-range-selector/cc-logs-date-range-selector.js';
import '../cc-logs-instances/cc-logs-instances.js';
import { buildLogsLoadingProgressState } from '../cc-logs-loading-progress/cc-logs-loading-progress-state-builder.js';
import '../cc-logs-loading-progress/cc-logs-loading-progress.js';
import '../cc-logs-message-filter/cc-logs-message-filter.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

/** @type {{instanceId: MetadataRenderer, instance: MetadataRenderer}} */
const CUSTOM_METADATA_RENDERERS = {
  instanceId: () => {
    return {
      hidden: true,
    };
  },
  instance: (metadata) => {
    const size = 18;

    let value = metadata.value;
    if (metadata.value.length > size) {
      value = metadata.value.substring(0, size - 1) + '.';
    }

    return {
      strong: true,
      text: value,
      size: size,
    };
  },
};

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../cc-logs-control/cc-logs-control.js').CcLogsControl} CcLogsControl
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsControlOption} LogsControlOption
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').LogsInstancesState} LogsInstancesState
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewState} LogsApplicationViewState
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewOptions} LogsApplicationViewOptions
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData} LogsDateRangeSelectionChangeEventData
 * @typedef {import('../cc-logs-message-filter/cc-logs-message-filter.types.js').LogsMessageFilterValue} LogsMessageFilterValue
 * @typedef {import('lit/directives/ref.js').Ref<CcLogsControl>} RefCcLogsControl
 * @typedef {import('lit').PropertyValues<CcLogsApplicationView>} CcLogsApplicationViewPropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 *
 * @beta
 */
export class CcLogsApplicationView extends LitElement {
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

    /** @type {LogsApplicationViewOptions} The logs options. */
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

    /** @type {LogsApplicationViewState} The state of the component */
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
        label: i18n('cc-logs-application-view.options.display-instance'),
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
   * @param {CustomEvent<LogsDateRangeSelectionChangeEventData>} event
   */
  _onDateRangeSelectionChange(event) {
    this.dateRangeSelection = event.detail.selection;
  }

  /**
   * @param {CustomEvent<Array<string>>} event
   */
  _onInstanceSelectionChange(event) {
    if (this.state.type === 'errorInstances' || this.state.type === 'loadingInstances') {
      return;
    }

    if (this.dateRangeSelection.type !== 'live') {
      dispatchCustomEvent(this, 'instance-selection-change', event.detail);
    } else {
      this.state = {
        ...this.state,
        selection: event.detail,
      };
    }
  }

  /**
   * @param {Object} event
   * @param {LogsControlOption} event.detail
   */
  _onLogsOptionChange({ detail }) {
    this.options = {
      ...this.options,
      [detail.name]: detail.value,
    };

    dispatchCustomEvent(this, 'options-change', this.options);
  }

  _onFullscreenToggle() {
    this._fullscreen = !this._fullscreen;
  }

  /**
   * @param {CustomEvent<LogsMessageFilterValue>} event
   */
  _onMessageFilterInput(event) {
    this._messageFilter = event.detail;
  }

  /* endregion */

  /**
   * @param {CcLogsApplicationViewPropertyValues} changedProperties
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
          ${this._renderDateRangeSelection()} ${this._renderInstances()}
          <div class="logs-wrapper">${this._renderLogs()}</div>
          ${this._renderLoadingProgress()}
        </div>
      </div>
    `;
  }

  _renderDateRangeSelection() {
    return html`
      <cc-logs-date-range-selector-beta
        class="date-range-selector"
        .value=${this.dateRangeSelection}
        @cc-logs-date-range-selector:change=${this._onDateRangeSelectionChange}
      ></cc-logs-date-range-selector-beta>
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

    return html`<cc-logs-instances-beta
      class="instances"
      .state=${state}
      @cc-logs-instances:selection-change=${this._onInstanceSelectionChange}
    ></cc-logs-instances-beta>`;
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
          <cc-notice slot="header" intent="warning" message=${i18n('cc-logs-application-view.logs.error')}></cc-notice>
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
        @cc-logs-control:option-change=${this._onLogsOptionChange}
      >
        <div slot="header" class="logs-header">
          <cc-logs-message-filter-beta
            class="logs-message-filter"
            .filter=${this._messageFilter}
            @cc-logs-message-filter:input=${this._onMessageFilterInput}
          ></cc-logs-message-filter-beta>

          <cc-button
            class="header-fullscreen-button"
            .icon=${this._fullscreen ? fullscreenExitIcon : fullscreenIcon}
            a11y-name=${this._fullscreen
              ? i18n('cc-logs-application-view.fullscreen.exit')
              : i18n('cc-logs-application-view.fullscreen')}
            hide-text
            @cc-button:click=${this._onFullscreenToggle}
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
                heading=${i18n('cc-logs-application-view.logs.warning.no-logs.title')}
                message=${i18n('cc-logs-application-view.logs.warning.no-logs.message')}
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
                  <span>${i18n('cc-logs-application-view.logs.loading')}</span>
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
                heading=${i18n('cc-logs-application-view.logs.warning.waiting.title')}
                message=${i18n('cc-logs-application-view.logs.warning.waiting.message')}
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
          grid-auto-columns: 18em 1fr;
          grid-auto-rows: auto 1fr auto;
          grid-template-areas:
            'date-range logs'
            'instances  logs'
            'progress   progress';
        }

        .wrapper.fullscreen {
          background-color: var(--cc-color-bg-default);
          border: 1px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          margin: 1em;
          padding: 1em;
        }

        .date-range-selector {
          grid-area: date-range;
        }

        .instances {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: instances;
        }

        .logs-wrapper {
          flex: 1;
          grid-area: logs;
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
window.customElements.define('cc-logs-application-view-beta', CcLogsApplicationView);
