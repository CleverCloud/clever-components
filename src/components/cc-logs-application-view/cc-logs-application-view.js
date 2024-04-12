import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-date/cc-input-date.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-control/cc-logs-control.js';
import '../cc-logs-instances/cc-logs-instances.js';
import '../cc-notice/cc-notice.js';
import '../cc-popover/cc-popover.js';
import '../cc-toggle/cc-toggle.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowDownSLine,
  iconRemixArrowLeftSLine,
  iconRemixArrowRightSLine,
  iconRemixCalendarScheduleLine,
  iconRemixCheckLine,
  iconRemixFlashlightLine,
  iconRemixPauseLine,
  iconRemixPlayLine,
  iconRemixTimeLine,
  iconRemixFullscreenLine as fullscreenIcon,
  iconRemixFullscreenExitLine as fullscreenExitIcon,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import {
  getRangeToNow,
  isLive,
  isRightDateRangeAfterNow,
  lastXDays,
  shiftDateRange,
  today,
  yesterday,
} from './date-range.js';

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

/** @type {DateRangeSelectionMenuEntry[]} */
const MENU_ENTRIES = ['live', 'lastHour', 'last4Hours', 'today', 'yesterday', 'last7Days', 'custom'];

/**
 * @typedef {import('../cc-input-date/cc-input-date.js').CcInputDate} CcInputDate
 * @typedef {import('../cc-popover/cc-popover.js').CcPopover} CcPopover
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../cc-logs-control/cc-logs-control.js').CcLogsControl} CcLogsControl
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsControlOption} LogsControlOption
 * @typedef {import('../cc-logs-control/cc-logs-control.types.js').LogsMetadataDisplay} LogsMetadataDisplay
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').LogsInstancesState} LogsInstancesState
 * @typedef {import('./cc-logs-application-view.types.js').DateRange} DateRange
 * @typedef {import('./cc-logs-application-view.types.js').DateRangeSelection} DateRangeSelection
 * @typedef {import('./cc-logs-application-view.types.js').DateRangeSelectionPredefinedDefinition} DateRangeSelectionPredefinedDefinition
 * @typedef {import('./cc-logs-application-view.types.js').DateRangeSelectionMenuEntry} DateRangeSelectionMenuEntry
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewState} LogsApplicationViewState
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewOptions} LogsApplicationViewOptions
 * @typedef {import('./cc-logs-application-view.types.js').Validity} Validity
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs/cc-logs.types.js').MetadataRenderer} MetadataRenderer
 * @typedef {import('lit/directives/ref').Ref<CcInputDate>} RefCcInputDate
 * @typedef {import('lit/directives/ref').Ref<CcLogsControl>} RefCcLogsControl
 * @typedef {import('lit/directives/ref').Ref<CcPopover>} RefCcPopover
 * @typedef {import('lit').PropertyValues<CcLogsApplicationView>} CcLogsApplicationViewPropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {'none'|'init'|'started'|'waiting'|'running'|'paused'|'completed'} ProgressState
 */

/**
 *
 * @fires {CustomEvent<DateRange>} cc-logs-application-view:date-range-change - Fires the `range` whenever the `range` changes.
 * @fires {CustomEvent<void>} cc-logs-application-view:pause - Fires when the pause button is clicked.
 * @fires {CustomEvent<void>} cc-logs-application-view:resume - Fires when the resume button is clicked.
 *
 * @beta
 */
export class CcLogsApplicationView extends LitElement {

  static get properties () {
    return {
      dateRangeSelection: { type: Object, attribute: 'date-range-selection' },
      limit: { type: Number },
      options: { type: Object },
      overflowWatermarkOffset: { type: Number, attribute: 'overflow-watermark-offset' },
      selectedInstances: { type: Array, attribute: 'selected-instances' },
      state: { type: Object },
      _selectedDateRangeMenuEntry: { type: String, state: true },
      _dateRangeValidation: { type: Object, state: true },
      _customDateRange: { type: Object, state: true },
      _overflowDecision: { type: String, state: true },
      _textFilter: { type: String, state: true },
      _fullscreen: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {DateRangeSelection} The date range selection. */
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

    /** @type {number|null} The number of logs before the limit from which the user will be asked to accept or discard logs limit overflow. */
    this.overflowWatermarkOffset = 10;

    /** @type {Array<string>} The array of instances ids that should be selected. */
    this.selectedInstances = [];

    /** @type {LogsApplicationViewState} The state of the component. */
    this.state = {
      type: 'loadingInstances',
    };

    /** @type {DateRangeSelectionMenuEntry} */
    this._selectedDateRangeMenuEntry = this._getDateRangeSelectionMenuEntry(this.dateRangeSelection);

    /** @type {DateRange|null} */
    this._customDateRange = null;

    /** @type {DateRange} */
    this._currentDateRange = this._toDateRange(this.dateRangeSelection);

    /** @type {{until: Validity, since: Validity}} */
    this._dateRangeValidation = {
      since: { valid: true },
      until: { valid: true },
    };

    /** @type {{dateRangeSelector: RefCcPopover, until: RefCcInputDate, logs: RefCcLogsControl, since: RefCcInputDate}} */
    this._refs = {
      since: createRef(),
      until: createRef(),
      logs: createRef(),
      dateRangeSelector: createRef(),
    };

    this._loadingProgressCtrl = new LoadingProgressController(this);

    /** @type {{instance: LogsMetadataDisplay}} */
    this._metadataDisplay = {
      instance: {
        label: i18n('cc-logs-application-view.options.display-instance'),
        hidden: !this.options['metadata-display'].instance,
      },
    };

    /** @type {'none'|'accepted'|'discarded'} */
    this._overflowDecision = 'none';

    this._textFilter = '';

    this._fullscreen = false;
  }

  /* region Public methods */

  /**
   * @param {Log[]} logs
   */
  appendLogs (logs) {
    if (logs == null || logs.length <= 0) {
      return;
    }

    if (this.state.type === 'receivingLogs') {
      this._refs.logs.value.appendLogs(logs);
      this._loadingProgressCtrl.progress(logs);
    }
  }

  clear () {
    this._refs.logs.value?.clear();
    this._loadingProgressCtrl.reset();
  }

  /**
   * @return {DateRange}
   */
  getDateRange () {
    return this._currentDateRange;
  }

  /* endregion */

  /* region Private methods */

  /**
   * @param {DateRangeSelection} dateRangeSelection
   * @return {DateRangeSelectionMenuEntry}
   */
  _getDateRangeSelectionMenuEntry (dateRangeSelection) {
    return dateRangeSelection.type === 'predefined' ? dateRangeSelection.def : dateRangeSelection.type;
  }

  /**
   * @param {DateRangeSelectionMenuEntry} menuEntry
   * @return {IconModel}
   */
  _getDateRangeSelectionMenuEntryIcon (menuEntry) {
    if (menuEntry === 'live') {
      return iconRemixFlashlightLine;
    }
    if (menuEntry === 'custom') {
      return iconRemixCalendarScheduleLine;
    }
    return iconRemixTimeLine;
  }

  /**
   * @param {DateRangeSelectionMenuEntry} type
   * @return {string}
   */
  _getDateRangeSelectionMenuEntryLabel (type) {
    if (type === 'live') {
      return i18n('cc-logs-application-view.date-selection.live');
    }
    if (type === 'custom') {
      return i18n('cc-logs-application-view.date-selection.custom');
    }
    if (type === 'lastHour') {
      return i18n('cc-logs-application-view.date-selection.last-hour');
    }
    if (type === 'last4Hours') {
      return i18n('cc-logs-application-view.date-selection.last-4-hours');
    }
    if (type === 'today') {
      return i18n('cc-logs-application-view.date-selection.today');
    }
    if (type === 'yesterday') {
      return i18n('cc-logs-application-view.date-selection.yesterday');
    }
    if (type === 'last7Days') {
      return i18n('cc-logs-application-view.date-selection.last-7-days');
    }

    throw new Error(`Unsupported menu entry "${type}"`);
  }

  /**
   * @return {string}
   */
  _getLoadingProgressTitle () {
    if (this._loadingProgressCtrl.state === 'completed') {
      return i18n('cc-logs-application-view.progress.loaded');
    }

    if (this._loadingProgressCtrl.percent == null) {
      return i18n('cc-logs-application-view.progress.loading.live');
    }

    return i18n('cc-logs-application-view.progress.loading', { percent: (this._loadingProgressCtrl.percent) / 100 });
  }

  _validateCustomDateRange () {
    if (this._customDateRange != null) {
      this._refs.since.value.max = this._customDateRange.until;
      this._refs.until.value.min = this._customDateRange.since;
      this._dateRangeValidation = {
        since: this._refs.since.value.validate(),
        until: this._refs.until.value.validate(),
      };
    }
  }

  /**
   *
   * @param {string} code
   * @param {{min: string, max: string}} minMax
   * @return {string}
   */
  _getDateError (code, minMax) {
    if (code === 'empty') {
      return i18n('cc-logs-application-view.custom-date-range.date.empty');
    }

    if (code === 'badInput') {
      return i18n('cc-logs-application-view.custom-date-range.date.bad-input');
    }

    if (code === 'rangeOverflow') {
      return i18n('cc-logs-application-view.custom-date-range.date.range-overflow', minMax);
    }

    if (code === 'rangeUnderflow') {
      return i18n('cc-logs-application-view.custom-date-range.date.range-underflow', minMax);
    }
  }

  /**
   * @param {DateRangeSelection} dateRangeSelection
   * @return {DateRange}
   */
  _toDateRange (dateRangeSelection) {
    switch (dateRangeSelection.type) {
      case 'custom':
        return {
          since: dateRangeSelection.since,
          until: dateRangeSelection.until,
        };
      case 'live':
        return {
          since: getRangeToNow(1000 * 60 * 10).since,
        };
      case 'predefined':
        switch (dateRangeSelection.def) {
          case 'lastHour':
            return getRangeToNow(1000 * 60 * 60);
          case 'last4Hours':
            return getRangeToNow(1000 * 60 * 60 * 4);
          case 'last7Days':
            return lastXDays(7);
          case 'today':
            return today();
          case 'yesterday':
            return yesterday();
        }
    }
  }

  /**
   * @param {DateRange} dateRange
   */
  _applyDateRange (dateRange) {
    this._loadingProgressCtrl.cancel();
    this._currentDateRange = dateRange;
    this._overflowDecision = 'none';
    dispatchCustomEvent(this, 'date-range-change', this._currentDateRange);
  }

  /* endregion */

  /* region Event handlers */

  /**
   * @param {MouseEvent & {target: {dataset: {type: DateRangeSelectionMenuEntry, current: 'true'|'false'}}}} e
   */
  _onDateSelectionRangeItemClick (e) {
    /** @type {DateRangeSelectionMenuEntry} */
    this._selectedDateRangeMenuEntry = e.target.dataset.type;
    const isCurrent = e.target.dataset.current;
    this._refs.dateRangeSelector.value.close();

    if (isCurrent === 'true') {
      return;
    }

    if (this._selectedDateRangeMenuEntry === 'custom') {
      this._customDateRange = {
        since: this._currentDateRange.since,
        until: isLive(this._currentDateRange) ? new Date().toISOString() : this._currentDateRange.until,
      };
    }
    else if (this._selectedDateRangeMenuEntry === 'live') {
      this.dateRangeSelection = {
        type: 'live',
      };

      this._customDateRange = null;
      this._applyDateRange(this._toDateRange(this.dateRangeSelection));
    }
    else {
      this.dateRangeSelection = {
        type: 'predefined',
        def: this._selectedDateRangeMenuEntry,
      };

      this._customDateRange = null;
      this._applyDateRange(this._toDateRange(this.dateRangeSelection));
    }
  }

  /**
   * @param {'since'|'until'} field
   * @param {string} value
   */
  _onCustomDateChanged (field, value) {
    this._customDateRange = {
      ...this._customDateRange,
      [field]: value,
    };

    this._validateCustomDateRange();
  }

  /**
   * @param {Object} event
   * @param {string} event.detail
   */
  _onCustomSinceDateChanged ({ detail }) {
    this._onCustomDateChanged('since', detail);
  }

  /**
   * @param {Object} event
   * @param {string} event.detail
   */
  _onCustomUntilDateChanged ({ detail }) {
    this._onCustomDateChanged('until', detail);
  }

  _onCustomDateRangeShiftLeft () {
    this._customDateRange = shiftDateRange(this._customDateRange, 'left');
  }

  _onCustomDateRangeShiftRight () {
    this._customDateRange = shiftDateRange(this._customDateRange, 'right');
  }

  _onApplyCustomDateRange () {
    this._applyDateRange(this._customDateRange);
  }

  _onInstanceSelectionChange ({ detail: instances }) {
    if (!isLive(this._currentDateRange)) {
      this._loadingProgressCtrl.cancel();
      dispatchCustomEvent(this, 'instance-selection-change', instances);
    }
    else {
      this.state = {
        ...this.state,
        selection: instances,
      };
    }
  }

  /**
   * @param {Object} event
   * @param {LogsControlOption} event.detail
   */
  _onLogsOptionChange ({ detail }) {
    this.options = {
      ...this.options,
      [detail.name]: detail.value,
    };

    dispatchCustomEvent(this, 'options-change', this.options);
  }

  _onFullscreenToggle () {
    this._fullscreen = !this._fullscreen;
  }

  _onPause () {
    dispatchCustomEvent(this, 'pause');
  }

  _onResume () {
    dispatchCustomEvent(this, 'resume');
  }

  _onOverflowWatermarkReached () {
    if (this._overflowDecision === 'none') {
      dispatchCustomEvent(this, 'pause');
    }
  }

  _onAcceptOverflow () {
    this._overflowDecision = 'accepted';
    dispatchCustomEvent(this, 'resume');
  }

  _onDiscardOverflow () {
    this._overflowDecision = 'discarded';
    this.dateRangeSelection = {
      type: 'custom',
      since: this._currentDateRange.since,
      until: this._loadingProgressCtrl.lastLogDate.toISOString(),
    };
  }

  _onTextFilterInput ({ detail }) {
    this._textFilter = detail;
  }

  /* endregion */

  /**
   * @param {CcLogsApplicationViewPropertyValues} changedProperties
   */
  updated (changedProperties) {
    if (changedProperties.has('_customDateRange')) {
      this._validateCustomDateRange();
    }
  }

  /**
   *
   * @param {CcLogsApplicationViewPropertyValues} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has('dateRangeSelection')) {
      this._selectedDateRangeMenuEntry = this._getDateRangeSelectionMenuEntry(this.dateRangeSelection);
      this._customDateRange = this.dateRangeSelection.type === 'custom' ? {
        since: this.dateRangeSelection.since,
        until: this.dateRangeSelection.until,
      } : null;
      this._currentDateRange = this._toDateRange(this.dateRangeSelection);
    }
    if (changedProperties.has('state')) {
      const oldStateType = changedProperties.get('state')?.type;
      if (oldStateType !== this.state.type) {

        if (this.state.type === 'errorLogs') {
          this._loadingProgressCtrl.reset();
        }
        else if (this.state.type === 'connectingLogs') {
          this._loadingProgressCtrl.init(this._currentDateRange);
        }
        else if (this.state.type === 'receivingLogs') {
          this._loadingProgressCtrl.start();
        }
        else if (this.state.type === 'logStreamPaused') {
          this._loadingProgressCtrl.pause();
        }
        else if (this.state.type === 'logStreamEnded') {
          this._loadingProgressCtrl.complete();
        }
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

  render () {
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
            ${this._renderDateRangeSelection()}
            ${this._renderCustomDateRange()}
            ${this._renderInstances()}
            ${this._renderLoadingProgress()}
          </div>
  
          <div class="logs-wrapper">
            ${this._renderLogs()}
          </div>
        </div>
      </div>
    `;
  }

  _renderDateRangeSelection () {
    return html`
      <cc-popover 
        ${ref(this._refs.dateRangeSelector)}
        .icon=${this._getDateRangeSelectionMenuEntryIcon(this._selectedDateRangeMenuEntry)}
        class="date-range-selection"
      >
        <div slot="button-content" class="date-range-selection-button-content">
          <div>${this._getDateRangeSelectionMenuEntryLabel(this._selectedDateRangeMenuEntry)}</div>
          <cc-icon class="date-range-selection-icon" .icon=${iconRemixArrowDownSLine}></cc-icon>
        </div>
        <div class="date-range-selection-list" style="display: flex; flex-direction: column; gap: 0.25em;">
          ${MENU_ENTRIES.map((type) => {
            const current = type === this._selectedDateRangeMenuEntry;

            return html`<button 
              class="date-range-selection-menu-entry" 
              data-type="${type}"
              data-current="${current}"
              @click=${this._onDateSelectionRangeItemClick}>
              <cc-icon .icon=${this._getDateRangeSelectionMenuEntryIcon(type)} data-type="${type}"></cc-icon>
              <span data-type="${type}">${this._getDateRangeSelectionMenuEntryLabel(type)}</span>
              ${current ? html`<cc-icon class="date-range-selection-current" .icon=${iconRemixCheckLine} data-type="${type}"></cc-icon>` : ''}
            </button>`;
          })}
        </div>
      </cc-popover>
    `;
  }

  _renderCustomDateRange () {
    if (this._customDateRange == null) {
      return null;
    }

    const sinceErr = this._dateRangeValidation.since.valid === true
      ? null
      : this._getDateError(this._dateRangeValidation.since.code, { min: this._customDateRange.since, max: this._customDateRange.until });
    const untilErr = this._dateRangeValidation.until.valid === true
      ? null
      : this._getDateError(this._dateRangeValidation.until.code, { min: this._customDateRange.since, max: this._customDateRange.until });
    const nextDisabled = isRightDateRangeAfterNow(this._customDateRange);
    const isDateRangeInvalid = !this._dateRangeValidation.since.valid || !this._dateRangeValidation.until.valid;

    return html`
      <div class="date-range">
        <cc-input-date
          ${ref(this._refs.since)}
          .value=${this._customDateRange.since}
          label=${this.options.timezone === 'UTC' ? i18n('cc-logs-application-view.custom-date-range.since.utc') : i18n('cc-logs-application-view.custom-date-range.since.local')}
          .max=${this._customDateRange.until}
          timezone=${this.options.timezone}
          @cc-input-date:input=${this._onCustomSinceDateChanged}
          @cc-input-date:requestimplicitsubmit=${this._onApplyCustomDateRange}
        >
          ${sinceErr != null ? html`<p slot="error">${sinceErr}</p>` : ''}
        </cc-input-date>
        <cc-input-date
          ${ref(this._refs.until)}
          .value=${this._customDateRange.until}
          label=${this.options.timezone === 'UTC' ? i18n('cc-logs-application-view.custom-date-range.until.utc') : i18n('cc-logs-application-view.custom-date-range.until.local')}
          .min=${this._customDateRange.since}
          timezone=${this.options.timezone}
          @cc-input-date:input=${this._onCustomUntilDateChanged}
          @cc-input-date:requestimplicitsubmit=${this._onApplyCustomDateRange}
        >
          ${untilErr != null ? html`<p slot="error">${untilErr}</p>` : ''}
        </cc-input-date>
        <div class="date-range-buttons">
          <cc-button class="date-range-left"
                     ?disabled=${isDateRangeInvalid}
                     .icon=${iconRemixArrowLeftSLine}
                     hide-text
                     a11y-name=${i18n('cc-logs-application-view.custom-date-range.previous')}
                     @cc-button:click=${this._onCustomDateRangeShiftLeft}>
          </cc-button>
          <cc-button class="date-range-right"
                     ?disabled=${nextDisabled || isDateRangeInvalid}
                     .icon=${iconRemixArrowRightSLine}
                     hide-text
                     a11y-name=${i18n('cc-logs-application-view.custom-date-range.next')}
                     @cc-button:click=${this._onCustomDateRangeShiftRight}>
          </cc-button>
          <cc-button
            class="date-range-apply-button"
            ?disabled=${isDateRangeInvalid}
            @cc-button:click=${this._onApplyCustomDateRange}
          >${i18n('cc-logs-application-view.custom-date-range.apply')}
          </cc-button>                 
        </div>
      </div>
    `;
  }

  _renderInstances () {
    /**
     * @type {LogsInstancesState}
     */
    let state;
    if (this.state.type === 'loadingInstances') {
      state = { state: 'loading' };
    }
    else if (this.state.type === 'errorInstances') {
      state = { state: 'error' };
    }
    else {
      state = {
        state: 'loaded',
        mode: isLive(this._currentDateRange) ? 'live' : 'cold',
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
  _renderLoadingProgress () {
    if (this._loadingProgressCtrl.value === 0) {
      return null;
    }

    const shouldAskForOverflowDecision = this._overflowDecision === 'none' && this._loadingProgressCtrl.overflowWatermarkReached;
    const shouldDisplayPauseResumeControls = !shouldAskForOverflowDecision
      && (this._loadingProgressCtrl.state === 'running' || this._loadingProgressCtrl.state === 'paused');
    const shouldDisplayOverflowWarning = !shouldAskForOverflowDecision && this._loadingProgressCtrl.overflowing;

    const getPlayPauseButton = () => {
      if (!shouldDisplayPauseResumeControls) {
        return null;
      }
      if (this._loadingProgressCtrl.state === 'running') {
        return {
          icon: iconRemixPauseLine,
          a11yName: i18n('cc-logs-application-view.progress.pause'),
          onclick: this._onPause,
        };
      }
      if (this._loadingProgressCtrl.state === 'paused') {
        return {
          icon: iconRemixPlayLine,
          a11yName: i18n('cc-logs-application-view.progress.resume'),
          onclick: this._onResume,
        };
      }
      return null;
    };

    const playPauseButton = getPlayPauseButton();

    return html`
      <div class="logs-loading-state">
        <div class="loading-state-heading">
          <div class="loading-state-title">
            ${this._getLoadingProgressTitle()}
          </div>

          ${playPauseButton != null ? html`
            <cc-button .icon=${playPauseButton.icon}
                       hide-text
                       a11y-name=${playPauseButton.a11yName}
                       @cc-button:click=${playPauseButton.onclick}
            ></cc-button>
          ` : ''}
        </div>
        ${this._loadingProgressCtrl.percent != null ? html`
          <div class="progress-bar">
            <div class="progress-bar-track" style="width: ${this._loadingProgressCtrl.percent}%;"></div>
          </div>
        ` : ''}
        <div class="loading-state-content">
          <div class="loading-state-text">
            ${i18n('cc-logs-application-view.progress.message', { count: this._loadingProgressCtrl.value })}
          </div>
          
          ${shouldAskForOverflowDecision ? html`
            <cc-notice intent="info" heading="${i18n('cc-logs-application-view.progress.overflow.title')}">
              <div slot="message">
                ${i18n('cc-logs-application-view.progress.overflow.message.almost', { limit: this.limit })}
                <div class="overflow-control">
                  <cc-button link @cc-button:click=${this._onAcceptOverflow}>
                    ${i18n('cc-logs-application-view.progress.overflow.continue')}
                  </cc-button>
                  <cc-button link @cc-button:click=${this._onDiscardOverflow}>
                    ${i18n('cc-logs-application-view.progress.overflow.stop')}
                  </cc-button>
                </div>
              </div>
            </cc-notice>
          ` : ''}

          ${shouldDisplayOverflowWarning ? html`
            <cc-notice intent="info" no-icon>
              <div slot="message">
                ${i18n('cc-logs-application-view.progress.overflow.message', { limit: this.limit })}
              </div>
            </cc-notice>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * @return {TemplateResult}
   */
  _renderLogs () {
    if (this.state.type === 'errorLogs') {
      return html`
        <div class="center-logs-wrapper">
          <cc-notice slot="header"
                     intent="warning"
                     message=${i18n('cc-logs-application-view.logs.error')}
          ></cc-notice>
        </div>
      `;
    }

    const metadataFilter = this.state.type === 'connectingLogs' || this.state.type === 'receivingLogs' || this.state.type === 'logStreamEnded' || this.state.type === 'logStreamPaused'
      ? this.state.selection?.map((instanceId) => {
        return {
          metadata: 'instanceId',
          value: instanceId,
        };
      }) : [];

    return html`
      <cc-logs-control-beta
        ${ref(this._refs.logs)}
        class="logs"
        follow
        limit="${this.limit}"
        .dateDisplay=${this.options['date-display']}
        .metadataDisplay=${this._metadataDisplay}
        .messageFilter=${this._textFilter}
        .metadataFilter=${metadataFilter}
        .metadataRenderers=${CUSTOM_METADATA_RENDERERS}
        .palette=${this.options.palette}
        ?strip-ansi=${this.options['strip-ansi']}
        .timezone=${this.options.timezone}
        ?wrap-lines=${this.options['wrap-lines']}
        @cc-logs-control:option-change=${this._onLogsOptionChange}
      >
        <div slot="header">
          <div class="logs-header">
            <cc-input-text
              class="logs-filter-input"
              label=${i18n('cc-logs-application-view.filter')}
              .value=${this._textFilter}
              inline
              @cc-input-text:input=${this._onTextFilterInput}
            ></cc-input-text>
            <cc-button
              class="header-fullscreen-button"
              .icon=${this._fullscreen ? fullscreenExitIcon : fullscreenIcon}
              a11y-name=${this._fullscreen ? i18n('cc-logs-application-view.fullscreen.exit') : i18n('cc-logs-application-view.fullscreen')}
              hide-text
              @cc-button:click=${this._onFullscreenToggle}
            ></cc-button>
          </div>
        </div>
      </cc-logs-control-beta>

      ${this._loadingProgressCtrl.state === 'completed' && this._loadingProgressCtrl.value === 0 ? html`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info"
                     heading=${i18n('cc-logs-application-view.logs.warning.no-logs.title')}
                     message=${i18n('cc-logs-application-view.logs.warning.no-logs.message')}
          ></cc-notice>
        </div>
      ` : ''}

      ${this._loadingProgressCtrl.state === 'init' || this._loadingProgressCtrl.state === 'started' ? html`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info" no-icon>
            <div class="overlay-logs-wrapper--loader" slot="message">
              <cc-loader></cc-loader>
              <span>${i18n('cc-logs-application-view.logs.loading')}</span>
            </div>
          </cc-notice>
        </div>
      ` : ''}

      ${this._loadingProgressCtrl.state === 'waiting' ? html`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info"
                     heading=${i18n('cc-logs-application-view.logs.warning.waiting.title')}
                     message=${i18n('cc-logs-application-view.logs.warning.waiting.message')}
          ></cc-notice>
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
        
        .overlay {
          display: flex;
          height: 100%;
        }

        .overlay.fullscreen {
          position: fixed;
          z-index: 999;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          backdrop-filter: blur(5px);
        }

        .wrapper {
          display: flex;
          flex: 1;
          gap: 0.5em;
        }
        
        .wrapper.fullscreen {
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral);
          margin: 1em;
          background-color: var(--cc-color-bg-default);
          border-radius: var(--cc-border-radius-default);
        }
        
        .left {
          display: flex;
          width: 18em;
          height: 100%;
          flex-direction: column;
          gap: 0.5em;
        }
        
        .cc-logs-instances {
          flex: 1;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .mode {
          padding: 0.25em;
          grid-area: mode;
        }

        .date-range {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.75em;
          grid-area: date-range;
        }
        
        .date-range-buttons {
          display: grid;
          align-items: center;
          grid-gap: 0.5em;
          grid-template-areas: 'left right spacer apply';
          grid-template-columns: auto auto 1fr auto;
        }

        .date-range-apply-button {
          grid-area: apply;
        }
        
        .date-range-selection {
          --cc-button-font-weight: normal;
          --cc-button-text-transform: none;
          --cc-popover-trigger-button-width: 100%;
        }
        
        .date-range-selection-button-content {
          display: flex;
          align-items: center;
          font-size: 1.2em;
          gap: 1em;
        }

        .date-range-selection-button-content div {
          display: flex;
          flex: 1;
          justify-content: start;
        }

        .date-range-selection-button-content cc-icon {
          transition: transform 0.2s;
        }
        
        .date-range-selection[is-open] .date-range-selection-button-content cc-icon {
          transform: rotate(180deg);
        }

        .date-range-selection-list {
          display: flex;
        }
        
        button {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: unset;
          font-family: inherit;
          font-size: unset;
        }

        .date-range-selection-menu-entry {
          display: grid;
          align-items: start;
          padding: 0.5em;
          cursor: pointer;
          gap: 0.5em;
          grid-template-columns: auto 1fr auto;
          justify-items: start;
        }

        .date-range-selection-current {
          align-self: end;
        }

        .date-range-selection-button:hover,
        .date-range-selection-button[data-current='true'] {
          background-color: var(--cc-color-bg-neutral);
        }

        .logs-loading-state {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .loading-state-heading {
          display: flex;
          max-height: 2em;
          align-items: center;
          padding: 0.5em;
          background-color: var(--cc-color-bg-neutral, #eee);
          border-top-left-radius: var(--cc-border-radius-default, 0.25em);
          border-top-right-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.3em;
        }
        
        .loading-state-title {
          flex: 1;
          color: var(--cc-color-text-default, #000);
          font-weight: bold;
        }

        .loading-state-content {
          display: flex;
          flex-direction: column;
          padding: 1em;
          color: var(--cc-color-text-weak);
          gap: 1em;
        }
        
        .progress-bar {
          overflow: hidden;
          width: 100%;
          height: 0.2em;
          background-color: var(--cc-color-bg-primary-weak);
        }

        .progress-bar-track {
          height: 100%;
          background-color: var(--cc-color-bg-primary);
        }

        .progress-bar-track.indeterminate {
          width: 100%;
          animation: indeterminate-animation 1s infinite linear;
          transform-origin: 0 50%;
        }
        
        .overflow-control {
          display: flex;
          gap: 1.5em;
        }

        @keyframes indeterminate-animation {

          0% {
            transform: translateX(0) scaleX(0);
          }

          40% {
            transform: translateX(0) scaleX(0.4);
          }

          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }

        .logs-wrapper {
          position: relative;
          flex: 1;
        }

        .logs {
          height: 100%;
        }
        
        .logs-header {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 1em;
        }
        
        .logs-filter-input {
          flex: 1;
        }
        
        .center-logs-wrapper {
          display: flex;
          height: 100%;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        .overlay-logs-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .overlay-logs-wrapper--loader {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .overlay-logs-wrapper--loader cc-loader {
          width: 1.5em;
          height: 1.5em;
        }
        
        .spacer {
          flex: 1;
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-application-view-beta', CcLogsApplicationView);

/**
 * State:
 * * `none`: No progression yet, reset state
 * * 'init': The dateRange has been set and the progress is ready to start
 * * 'started': The progress has been started (but no logs have been received yet)
 * * 'waiting': The progress has been started since a long time and no logs have been received yet (this state is used only on live mode)
 * * 'running': The progress is running: some logs are being received
 * * 'paused': The progress is on pause
 * * 'completed': The progress is completed
 */
class LoadingProgressController {
  /**
   *
   * @param {CcLogsApplicationView} host
   */
  constructor (host) {
    this._host = host;
    this._debug = false;
    this.reset();
  }

  reset () {
    this._dateRange = null;
    this._isLive = false;
    this._dateRangeStart = null;
    this._dateRangeDuration = null;
    this._lastLogDate = null;
    /** @type {ProgressState} */
    this._state = 'none';
    this._percent = 0;
    this._value = 0;
    this._clearWaitingTimeout();

    this._host.requestUpdate();
  }

  /**
   * @param {DateRange} dateRange
   */
  init (dateRange) {
    this.reset();

    this._dateRange = dateRange;

    this._step('init', {
      none: () => {
        this._isLive = isLive(this._dateRange);
        this._dateRangeStart = new Date(this._dateRange.since).getTime();
        this._dateRangeDuration = this._isLive ? 0 : new Date(this._dateRange.until).getTime() - this._dateRangeStart;

        return 'init';
      },
    });
  }

  start () {
    this._step('start', {
      none: () => {
        return 'none';
      },
      paused: () => {
        return 'running';
      },
      init: () => {
        this._waitingTimeoutId = setTimeout(() => {
          this._step('nothingReceived', {
            started: () => {
              return this._isLive ? 'waiting' : 'completed';
            },
          });
        }, 2000);
        return 'started';
      },
    });
  }

  /**
   *
   * @param {Array<Log>} logs
   */
  progress (logs) {
    if (logs.length === 0) {
      return;
    }

    const doProgress = () => {
      this._value = this._value + logs.length;
      this._lastLogDate = logs[logs.length - 1].date;

      if (!this._isLive) {
        const timeProgress = this._lastLogDate.getTime() - this._dateRangeStart;
        this._percent = 100 * timeProgress / this._dateRangeDuration;
      }

      if (this.overflowWatermarkReached) {
        this._host._onOverflowWatermarkReached();
      }
    };

    this._step('progress', {
      started: () => {
        this._clearWaitingTimeout();
        doProgress();
        return 'running';
      },
      waiting: () => {
        doProgress();
        return 'running';
      },
      running: () => {
        doProgress();
        return 'running';
      },
      completed: () => {
        doProgress();
        return 'running';
      },
    });
  }

  pause () {
    this._step('pause', {
      running: () => {
        return 'paused';
      },
    });
  }

  complete () {
    this._step('complete', {
      none: () => {
        return 'none';
      },
      init: () => {
        return 'init';
      },
      started: () => {
        this._clearWaitingTimeout();
        this._percent = 100;
        return 'completed';
      },
      '*': () => {
        this._percent = 100;
        return 'completed';
      },
    });
  }

  cancel () {
    this._step('cancel', {
      '*': () => {
        this.reset();
        return 'none';
      },
    });
  }

  /**
   * @return {ProgressState}
   */
  get state () {
    return this._state;
  }

  /**
   * @return {number|null}
   */
  get percent () {
    return this._isLive ? null : this._percent;
  }

  /**
   * @return {number}
   */
  get value () {
    return this._value;
  }

  /**
   * @return {boolean}
   */
  get overflowing () {
    return this._value > this._host.limit;
  }

  /**
   * @return {boolean}
   */
  get overflowWatermarkReached () {
    return this._value >= this._host.limit - this._host.overflowWatermarkOffset;
  }

  /**
   * @return {Date}
   */
  get lastLogDate () {
    return this._lastLogDate;
  }

  _clearWaitingTimeout () {
    if (this._waitingTimeoutId != null) {
      clearTimeout(this._waitingTimeoutId);
      this._waitingTimeoutId = null;
    }
  }

  /**
   *
   * @param {string} actionName
   * @param {{[state: ProgressState|'*']: () => ProgressState|null}} machine
   */
  _step (actionName, machine) {
    const state = this._state;

    this._log(`progressCtrl: ACTION<${actionName}> from state ${state}`);

    const step = machine[state] ?? machine['*'];

    if (step == null) {
      console.warn(`progressCtrl: ACTION<${actionName}>: no step walker found from state ${state}`);
      return;
    }

    const newState = step();

    if (newState != null) {
      if (newState !== this._state) {
        this._log(`progressCtrl: ${this._state} -> ${newState}`);
        this._state = newState;
      }
      this._host.requestUpdate();
    }
  }

  _log (...args) {
    if (this._debug) {
      console.log(...args);
    }
  }
}
