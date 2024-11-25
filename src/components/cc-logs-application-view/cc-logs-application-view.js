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
import '../cc-logs-loading-progress/cc-logs-loading-progress.js';
import { LogsLoadingProgressController } from '../cc-logs-loading-progress/logs-loading-progress-ctrl.js';
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
 * @typedef {import('./cc-logs-application-view.types.js').ProgressState} ProgressState
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData} LogsDateRangeSelectionChangeEventData
 * @typedef {import('../cc-logs-loading-progress/cc-logs-loading-progress.types.js').LogsLoadingProgressState} LogsLoadingProgressState
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
      overflowWatermarkOffset: { type: Number, attribute: 'overflow-watermark-offset' },
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

    /** @type {number|null} The number of logs before the limit from which the user will be asked to accept or discard logs limit overflow */
    this.overflowWatermarkOffset = 10;

    /** @type {Array<string>} The array of instances ids that should be selected */
    this.selectedInstances = [];

    /** @type {LogsApplicationViewState} The state of the component */
    this.state = {
      type: 'loadingInstances',
    };

    this._loadingProgressCtrl = new LogsLoadingProgressController(this);

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
    if (logs == null || logs.length <= 0) {
      return;
    }

    if (this.state.type === 'receivingLogs') {
      this._logsRef.value.appendLogs(logs);
      this._loadingProgressCtrl.progress(logs);
    }
  }

  clear() {
    this._logsRef.value?.clear();
    this._loadingProgressCtrl.reset();
  }

  /* endregion */

  /* region Event handlers */

  /**
   * @param {CustomEvent<LogsDateRangeSelectionChangeEventData>} event
   */
  _onDateRangeSelectionChange(event) {
    this._loadingProgressCtrl.cancel();
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
      this._loadingProgressCtrl.cancel();
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
    const stateTypeHasChanged =
      changedProperties.has('state') && changedProperties.get('state')?.type !== this.state.type;

    if (stateTypeHasChanged) {
      if (this.state.type === 'errorLogs') {
        this._loadingProgressCtrl.reset();
      } else if (this.state.type === 'connectingLogs') {
        this._loadingProgressCtrl.init();
      } else if (this.state.type === 'receivingLogs') {
        this._loadingProgressCtrl.start();
      } else if (this.state.type === 'logStreamPaused') {
        this._loadingProgressCtrl.pause();
      } else if (this.state.type === 'logStreamEnded') {
        this._loadingProgressCtrl.complete();
      }
    }
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
          <div class="left">
            ${this._renderDateRangeSelection()} ${this._renderInstances()} ${this._renderLoadingProgress()}
          </div>

          <div class="logs-wrapper">${this._renderLogs()}</div>
        </div>
      </div>
    `;
  }

  _renderDateRangeSelection() {
    return html`
      <cc-logs-date-range-selector-beta
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
      .state=${state}
      class="cc-logs-instances"
      @cc-logs-instances:selection-change=${this._onInstanceSelectionChange}
    ></cc-logs-instances-beta>`;
  }

  /**
   * @return {TemplateResult|null}
   */
  _renderLoadingProgress() {
    const state = this._loadingProgressCtrl.getLoadingProgressState();

    if (state == null) {
      return null;
    }

    return html`<cc-logs-loading-progress-beta
      .state=${this._loadingProgressCtrl.getLoadingProgressState()}
      limit=${this.limit}
    ></cc-logs-loading-progress-beta>`;
  }

  /**
   * @return {TemplateResult}
   */
  _renderLogs() {
    if (this.state.type === 'errorLogs') {
      return html`
        <div class="center-logs-wrapper">
          <cc-notice slot="header" intent="warning" message=${i18n('cc-logs-application-view.logs.error')}></cc-notice>
        </div>
      `;
    }

    const metadataFilter =
      this.state.type === 'connectingLogs' ||
      this.state.type === 'receivingLogs' ||
      this.state.type === 'logStreamEnded' ||
      this.state.type === 'logStreamPaused'
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

      ${this._loadingProgressCtrl.state === 'completed' && this._loadingProgressCtrl.value === 0
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
      ${this._loadingProgressCtrl.state === 'init' || this._loadingProgressCtrl.state === 'started'
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
      ${this._loadingProgressCtrl.state === 'waiting'
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
          display: flex;
          flex: 1;
          gap: 0.5em;
        }

        .wrapper.fullscreen {
          background-color: var(--cc-color-bg-default);
          border: 1px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          margin: 1em;
          padding: 1em;
        }

        .left {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          height: 100%;
          width: 18em;
        }

        .cc-logs-instances {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          flex: 1;
        }

        .logs-wrapper {
          flex: 1;
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
window.customElements.define('cc-logs-application-view-beta', CcLogsApplicationView);
