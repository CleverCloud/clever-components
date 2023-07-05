import '../cc-input-text/cc-input-text.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-controller/cc-logs-controller.js';
import '../cc-logs/cc-logs.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddLine,
  iconRemixArrowDownLine,
  iconRemixArrowLeftSLine,
  iconRemixArrowRightSLine,
  iconRemixArrowUpLine,
  iconRemixCheckboxCircleFill,
  iconRemixCheckLine,
  iconRemixCloseCircleFill,
  iconRemixCloseCircleLine,
  iconRemixCloseLine,
  iconRemixPlayCircleLine,
  iconRemixPlayLine,
  iconRemixRestartLine,
  iconRemixSpaceShipLine,
  iconRemixStopCircleFill,
  iconRemixStopCircleLine,
  iconRemixStopLine,
  iconRemixSubtractLine,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { groupBy } from '../../lib/utils.js';

const INSTANCE_SORT_ORDER = (i1, i2) => {
  const number = i1.instanceNumber - i2.instanceNumber;
  if (number !== 0) {
    return number;
  }
  return i1.creationDate - i2.creationDate;
};
const CUSTOM_METADATA_RENDERERS = {
  level: (metadata) => {
    let intent = 'neutral';
    if (metadata.value === 'ERROR') {
      intent = 'danger';
    }
    else if (metadata.value === 'WARN') {
      intent = 'warning';
    }
    else if (metadata.value === 'INFO') {
      intent = 'info';
    }
    return {
      intent,
      size: 5,
    };
  },
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
const DEFAULT_LIVE_DURATION = 5 * 60 * 1000;
const DEFAULT_COLD_DURATION = 60 * 60 * 1000;
const MOVE_DURATION = 10 * 60 * 1000;

/**
 * @param {number} duration
 * @return {{until: string, since: string}}
 */
function getRangeToNow (duration) {
  const now = Date.now();
  return {
    since: new Date(now - duration).toISOString(),
    until: new Date(now).toISOString(),
  };
}

function isValidDate (d) {
  return d instanceof Date && !isNaN(d);
}

function shiftDate (date, duration) {
  return new Date(new Date(date).getTime() + duration).toISOString();
}

/**
 * @typedef {import('./cc-logs-view.types.js').DateRange} DateRange
 * @typedef {import('./cc-logs-view.types.js').LogsViewState} LogsViewState
 */

/**
 *
 * @event {CustomEvent<string>} cc-logs-view:dateRangeChanged - Fires the `range` whenever the `range` changes.
 * @event {CustomEvent<string>} cc-logs-view:instancesSelectionChanged - Fires the `selected instances` whenever the selection changes.
 *
 * @beta
 */
export class CcLogsViewComponent extends LitElement {

  static get properties () {
    return {
      state: { type: Array },
      dateRange: { type: Object },
      selectedInstances: { type: Array },
      _dateRangeValidation: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {LogsViewState} */
    this.state = {
      type: 'loadingInstances',
    };

    /** @type {Array<string>} - Array containing the selected instances id */
    this.selectedInstances = [];

    /** @type {DateRange} */
    this.dateRange = {
      type: 'live',
      since: getRangeToNow(DEFAULT_LIVE_DURATION).since,
    };

    this._dateRangeValidation = {
      since: 'ok',
      until: 'ok',
    };

    /** @type {Ref<CcLogs>} A reference to cc-logs component. */
    this._logsRef = createRef();
  }

  _isSelected (instance) {
    return this.selectedInstances.includes(instance.id);
  }

  _onInstanceClick (instance) {
    if (this._isSelected(instance)) {
      this.selectedInstances = this.selectedInstances.filter((i) => i !== instance.id);
    }
    else {
      this.selectedInstances = [...this.selectedInstances, instance.id];
    }

    dispatchCustomEvent(this, 'instancesSelectionChanged', this.selectedInstances);
  }

  _isDateRangeValid () {
    return this._dateRangeValidation.since === 'ok' && this._dateRangeValidation.until === 'ok';
  }

  _onLiveModeChange (isOn) {
    if (isOn) {
      this.dateRange = {
        type: 'live',
        since: getRangeToNow(DEFAULT_LIVE_DURATION).since,
      };
    }
    else {
      this.dateRange = {
        type: 'cold',
        ...getRangeToNow(DEFAULT_COLD_DURATION),
      };
    }

    this._dateRangeValidation = {
      since: 'ok',
      until: 'ok',
    };

    dispatchCustomEvent(this, 'dateRangeChanged', this.dateRange);
  }

  _onDateChanged (property, value) {
    if (this.dateRange.type === 'cold') {
      this.dateRange = {
        ...this.dateRange,
        [property]: value,
      };

      this._validateDateRange();

      if (this._isDateRangeValid()) {
        dispatchCustomEvent(this, 'dateRangeChanged', this.dateRange);
      }
    }
  }

  _onShiftDate (property, direction) {
    if (this.dateRange.type === 'cold' && this._dateRangeValidation[property] !== 'invalidFormat') {
      this.dateRange = {
        ...this.dateRange,
        [property]: shiftDate(this.dateRange[property], direction * MOVE_DURATION),
      };

      this._validateDateRange();

      if (this._isDateRangeValid()) {
        dispatchCustomEvent(this, 'dateRangeChanged', this.dateRange);
      }
    }
  }

  _onShiftRange (direction) {
    if (this.dateRange.type === 'cold' && this._isDateRangeValid()) {
      this.dateRange = {
        type: 'cold',
        since: shiftDate(this.dateRange.since, direction * MOVE_DURATION),
        until: shiftDate(this.dateRange.until, direction * MOVE_DURATION),
      };

      this._validateDateRange();

      if (this._isDateRangeValid()) {
        dispatchCustomEvent(this, 'dateRangeChanged', this.dateRange);
      }
    }
  }

  _validateDateRange () {
    if (this.dateRange.type === 'live') {
      this._dateRangeValidation = {
        since: 'ok',
        until: 'ok',
      };
    }
    else {
      const since = new Date(this.dateRange.since);
      const until = new Date(this.dateRange.until);

      const sinceFormatValid = isValidDate(since);
      const untilFormatValid = isValidDate(until);
      if (!sinceFormatValid || !untilFormatValid) {
        this._dateRangeValidation = {
          since: sinceFormatValid ? 'ok' : 'invalidFormat',
          until: untilFormatValid ? 'ok' : 'invalidFormat',
        };
      }
      else if (since.getTime() > until.getTime()) {
        this._dateRangeValidation = {
          since: 'tooBig',
          until: 'tooLow',
        };
      }
      else {
        this._dateRangeValidation = {
          since: 'ok',
          until: 'ok',
        };
      }
    }
  }

  appendLogs (logs) {
    if (this.state.type === 'loaded' || this.state.type === 'loadingLogs') {
      this._logsRef.value.appendLogs(logs);
    }
  }

  clear () {
    this._logsRef.value?.clear();
  }

  updated (_changedProperties) {
    if (_changedProperties.has('dateRange')) {
      this._validateDateRange();
    }
  }

  render () {
    if (this.state.type === 'errorInstances') {
      return html`
        <cc-notice intent="danger" message="An error occurred while loading instances"></cc-notice>
      `;
    }

    const metadataDisplay = {
      instance: { label: 'Afficher le nom de l\'instance', hidden: false },
      level: { label: 'Afficher le niveau de log', hidden: false },
    };

    return html`
      ${this._renderFilterPanel()}
      
      <cc-logs-controller
        ?follow=${true}
        ?wrap-lines=${true}
        .metadataDisplay=${metadataDisplay}
      >
        <div class="cc-logs-controller-header" slot="header">
          ${this._renderDateRange()}
        </div>
        
        ${this._renderLogs()}
      </cc-logs-controller>
    `;
  }

  _renderLogs () {
    if (this.state.type === 'connectingLogs') {
      return html`<cc-loader></cc-loader>`;
    }

    if (this.state.type === 'errorLogs') {
      return html`<cc-notice intent="danger" message="An error occurred while connecting to logs stream"></cc-notice>`;
    }

    const __refName = this._logsRef;

    const filter = this.selectedInstances.map((i) => {
      return {
        metadata: 'instanceId',
        value: i,
      };
    });

    return html`
      ${this.state.type === 'loadingLogs' ? html`<cc-notice intent="info">Loading logs...</cc-notice>` : ''}
      <cc-logs
        ${ref(__refName)}
        ?follow=${true}
        ?wrap-lines=${true}
        .metadataRenderers=${CUSTOM_METADATA_RENDERERS}
        .filter=${filter}
        .limit=${20000}
      ></cc-logs>`;
  }

  _renderDateRange () {
    const ON_OFF = [
      { label: 'on', value: 'on' },
      { label: 'off', value: 'off' },
    ];

    const liveMode = this.dateRange.type === 'live' ? 'on' : 'off';

    return html`
      <cc-toggle
        legend="Live"
        .value=${liveMode}
        @cc-toggle:input=${({ detail }) => this._onLiveModeChange(detail === 'on')}
        .choices=${ON_OFF}
        inline
      ></cc-toggle>

      ${this.dateRange.type === 'cold' ? html`
        <div class="date-range">
          <cc-button hide-text .icon=${iconRemixArrowLeftSLine}
                     @cc-button:click=${() => this._onShiftRange(-1)}></cc-button>
          ${this._renderDateInput('since')}
          ${this._renderDateInput('until')}
          <cc-button hide-text .icon=${iconRemixArrowRightSLine}
                     @cc-button:click=${() => this._onShiftRange(+1)}></cc-button>
        </div>
      ` : ''}
    `;
  }

  _renderDateInput (property) {

    const valid = this._dateRangeValidation[property] === 'ok';

    return html`
      <div class="date-input ${valid ? '' : 'invalid'}">
        <button @click=${(e) => this._onShiftDate(property, -1)}>
          <cc-icon .icon=${iconRemixSubtractLine}></cc-icon>
        </button>
        <input type="text" .value=${this.dateRange[property]}
               @input=${(e) => this._onDateChanged(property, e.target.value)}></input-text>
        <button @click=${(e) => this._onShiftDate(property, +1)}>
          <cc-icon .icon=${iconRemixAddLine}></cc-icon>
        </button>
      </div>
    `;
  }

  _renderFilterPanel () {
    if (this.state.type === 'loadingInstances') {
      return html`
        <div class="left">
          <cc-loader></cc-loader>
        </div>
      `;
    }

    if (this.dateRange.type === 'live') {
      const deployingInstances = [];
      const runningInstances = [];
      const stoppingInstances = [];
      const deletedInstances = [];

      this.state.instances.forEach((instance) => {
        if (instance.deployState === 'WIP') {
          deployingInstances.push(instance);
        }
        else if (instance.state === 'DELETED') {
          deletedInstances.push(instance);
        }
        else if (instance.state === 'STOPPING') {
          stoppingInstances.push(instance);
        }
        else {
          runningInstances.push(instance);
        }
      });
      return html`
        <div class="left">
          ${this._renderDeployingInstances(deployingInstances.sort(INSTANCE_SORT_ORDER))}
          ${this._renderRunningInstances(runningInstances.sort(INSTANCE_SORT_ORDER))}
          ${this._renderStoppingInstances(stoppingInstances.sort(INSTANCE_SORT_ORDER))}
          ${this._renderDeletedInstances(deletedInstances.sort(INSTANCE_SORT_ORDER))}
        </div>
    `;
    }

    return html`
      <div class="left">
        ${this._renderColdInstances(this.state.instances)}
      </div>
    `;
  }

  _renderDeployingInstances (instances) {
    if (instances.length === 0) {
      return '';
    }

    const commit = instances[0].commit;

    return html`
      <div class="header header--deployment">
        <cc-icon .icon=${iconRemixSpaceShipLine} class="header--icon"></cc-icon>
        <span class="header--title">New deployment</span>
        <span class="header--commit">${commit}</span>
      </div>
      ${this._renderDeploymentDetails(instances[0])}
      <div class="instances">
        ${instances.map((instance) => html`
          <div>
            <label>
              <input type="checkbox" .checked="${this._isSelected(instance)}"
                     @change=${() => this._onInstanceClick(instance)}>
              <span>${this._renderInstanceState(instance.state)}</span>
              <span class="instance">${this._renderInstanceName(instance)}</span>
            </label>
          </div>
        `)}
      </div>
    `;
  }

  _renderRunningInstances (instances) {
    if (instances.length === 0) {
      return html`
        <div class="header header--running">
          <cc-icon .icon=${iconRemixPlayCircleLine} class="header--icon"></cc-icon>
          <span class="header--title">Running instances</span>
        </div>
        <div>No instance running</div>
      `;
    }

    const commit = instances[0].commit;

    return html`
      <div class="header header--running">
        <cc-icon .icon=${iconRemixPlayCircleLine} class="header--icon"></cc-icon>
        <span class="header--title">Running instances</span>
        <span class="header--commit">${commit}</span>
      </div>
      <div class="instances">
        ${instances.map((instance) => html`
          <label>
            <input type="checkbox" .checked="${this._isSelected(instance)}"
                   @change=${() => this._onInstanceClick(instance)}>
            ${this._renderInstanceState(instance.state)}
            <span class="instance">${this._renderInstanceName(instance)}</span>
          </label>
        `)}
      </div>
    `;
  }

  _renderStoppingInstances (instances) {
    if (instances.length === 0) {
      return '';
    }

    const commit = instances[0].commit;

    return html`
      <div class="header header--stopping">
        <cc-icon .icon=${iconRemixStopCircleLine} class="header--icon"></cc-icon>
        <span class="header--title">Stopping instances</span>
        <span class="header--commit">${commit}</span>
      </div>
      <div class="instances">
        ${instances.map((instance) => html`
          <label>
            <input type="checkbox" .checked="${this._isSelected(instance)}"
                   @change=${() => this._onInstanceClick(instance)}>
            ${this._renderInstanceState(instance.state)}
            <span class="instance">${this._renderInstanceName(instance)}</span>
          </label>
        `)}
      </div>
    `;
  }

  _renderDeletedInstances (instances) {
    if (instances.length === 0) {
      return '';
    }

    const groups = groupBy(instances, 'deployDate');

    return html`
      <div class="header header--deleted">
        <cc-icon .icon=${iconRemixCloseCircleLine} class="header--icon"></cc-icon>
        <span class="header--title">Deleted instances</span>
      </div>
      ${Object.entries(groups)
        .sort(([deployDate1], [deployDate2]) => deployDate2 - deployDate1)
        .map(([deployDate, instances]) => {
          return html`
            ${this._renderDeploymentDetails(instances[0])}
            <div class="instances padding">
              ${instances.sort(INSTANCE_SORT_ORDER).map((instance) => html`
                <label>
                  <input type="checkbox" .checked="${this._isSelected(instance)}"
                         @change=${() => this._onInstanceClick(instance)}>
                  <span class="instance">${this._renderInstanceName(instance)}</span>
                </label>
              `)}
            </div>
          `;
        })}
    `;
  }

  _renderColdInstances (instances) {
    if (instances.length === 0) {
      return html`
        <div class="header header--cold">
          <cc-icon .icon=${iconRemixPlayCircleLine} class="header--icon"></cc-icon>
          <span class="header--title">Instances</span>
        </div>
        <div>No instances</div>
      `;
    }

    const groups = groupBy(instances, 'deployDate');

    return html`
      <div class="header header--cold">
        <span class="header--title">Instances</span>
      </div>
      ${Object.entries(groups)
        .sort(([deployDate1], [deployDate2]) => deployDate2 - deployDate1)
        .map(([deployDate, instances]) => {
          return html`
              ${this._renderDeploymentDetails(instances[0])}
              <div class="instances padding">
                ${instances.sort(INSTANCE_SORT_ORDER).map((instance) => html`
                  <label>
                    <input type="checkbox" .checked="${this._isSelected(instance)}"
                           @change=${() => this._onInstanceClick(instance)}>
                    <span class="instance">${this._renderInstanceName(instance)}</span>
                  </label>
                `)}
              </div>
            `;
        })}
    `;
  }

  _renderInstanceName (instance) {
    return html`[${instance.instanceNumber}] <i>${instance.displayName}</i>`;
  }

  _renderDeploymentDetails (instance) {
    return html`
      <div class="deployment">
        <div>${this._renderDeployAction(instance)}</div>
        <div>${this._renderDeployState(instance)}</div>
        <div>${instance.deployDate !== 0 ? html`
          <cc-datetime-relative
            datetime=${new Date(instance.deployDate).toISOString()}></cc-datetime-relative>` : 'Unknown deployment'}
        </div>
        <span class="header--commit">${instance.commit}</span>
      </div>
    `;
  }

  _renderDeployAction (instance) {
    if (instance.deployAction === 'DEPLOY') {
      return html`
        <cc-icon .icon=${iconRemixRestartLine} class="state"></cc-icon>`;
    }

    if (instance.deployAction === 'UPSCALE') {
      return html`
        <cc-icon .icon=${iconRemixArrowUpLine} class="state"></cc-icon>`;
    }

    if (instance.deployAction === 'DOWNSCALE') {
      return html`
        <cc-icon .icon=${iconRemixArrowDownLine} class="state"></cc-icon>`;
    }

    return '';
  }

  _renderDeployState (instance) {
    if (instance.deployState === 'OK') {
      return html`
        <cc-icon .icon=${iconRemixCheckboxCircleFill} class="state"
                 style="--cc-icon-color: var(--cc-color-text-success)"></cc-icon>`;
    }

    if (instance.deployState === 'FAIL') {
      return html`
        <cc-icon .icon=${iconRemixCloseCircleFill} class="state"
                 style="--cc-icon-color: var(--cc-color-text-danger)"></cc-icon>`;
    }

    if (instance.deployState === 'CANCELLED') {
      return html`
        <cc-icon .icon=${iconRemixStopCircleFill} class="state"
                 style="--cc-icon-color: var(--cc-color-text-warning)"></cc-icon>`;
    }

    return '';
  }

  _renderInstanceState (state) {
    if (state === 'BOOTING' || state === 'STARTING' || state === 'DEPLOYING') {
      return html`
        <cc-loader class="instance-state state"></cc-loader>`;
    }
    if (state === 'READY') {
      return html`
        <cc-icon .icon=${iconRemixCheckLine} class="instance-state state"
                 style="--cc-icon-color: var(--cc-color-text-success)"></cc-icon>`;
    }
    if (state === 'UP') {
      return html`
        <cc-icon .icon=${iconRemixPlayLine} class="instance-state state"
                 style="--cc-icon-color: var(--cc-color-text-success)"></cc-icon>`;
    }
    if (state === 'STOPPING') {
      return html`
        <cc-icon .icon=${iconRemixStopLine} class="instance-state state"
                 style="--cc-icon-color: var(--cc-color-text-warning)"></cc-icon>`;
    }
    if (state === 'DELETED') {
      return html`
        <cc-icon .icon=${iconRemixCloseLine} class="instance-state state"
                 style="--cc-icon-color: var(--cc-color-text-danger)"></cc-icon>`;
    }

    return '';
    /*
    * * BOOTING
* STARTING
* DEPLOYING
* MIGRATION_IN_PROGRESS
* TASK_IN_PROGRESS
* READY
* UP
* GHOST
* STOPPING
* DELETED
    * */

  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          background-color: var(--cc-color-bg-default, #fff);
          gap: 1em;
        }

        .left {
          display: flex;
          overflow: auto;
          min-width: 250px;
          min-height: 0;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.5em;
        }

        cc-logs-controller {
          display: flex;
          flex: 1;
          flex-direction: column;
        }

        cc-logs {
          flex: 1;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
        }

        .header {
          display: grid;
          align-items: center;
          grid-column-gap: 0.2em;
          grid-template-columns: auto 1fr auto;
        }

        .header--icon {
          width: 1.5em;
          height: 1.5em;
        }

        .header--title {
          font-size: 1em;
          font-weight: bold;
        }

        .header--commit {
          color: var(--cc-color-text-weak, #555);
          font-size: 0.8em;
        }

        .header--deployment {
          color: var(--cc-color-text-primary);
        }

        .header--running {
          color: var(--cc-color-text-success);
        }

        .header--stopping {
          color: var(--cc-color-text-warning);
        }

        .header--deleted {
          color: var(--cc-color-text-weak);
        }

        .instances {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
        }

        .instances label {
          display: flex;
          align-items: center;
          gap: 0.3em;
        }

        .instance i {
          color: var(--cc-color-text-weak, #ddd);
        }

        /* .instance:hover { */
        /*  background-color: var(--cc-color-bg-neutral-hovered, #ddd); */
        /* } */

        /* .instance.selected { */
        /*  background-color: var(--cc-color-bg-neutral-active, #ccc); */
        /* } */

        .padding {
          margin-left: 0.3em;
        }

        .deployment {
          display: grid;
          align-items: center;
          padding: 0.3em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-small);
          grid-column-gap: 0.2em;
          grid-template-columns: min-content min-content 1fr auto;
        }

        .state {
          display: inline-flex;
          width: 1.2em;
          height: 1.2em;
          flex: auto 0 0;
        }

        cc-loader.state {
          width: 1em;
          height: 1em;
          justify-self: end;
        }

        .cc-logs-controller-header {
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 0.1em;
        }

        .date-input {
          display: flex;
          align-items: center;
          border: 1px solid var(--cc-color-border-neutral-strong, #000);
          border-radius: var(--cc-border-radius-small);
        }

        .date-input.invalid {
          border-color: var(--cc-color-border-danger, red);
        }

        .date-input button {
          z-index: 2;
          display: block;
          width: 1.6em;
          height: 1.6em;
          flex-shrink: 0;
          padding: 0;
          border: none;
          margin: 0.2em;
          background: transparent;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
          font-family: inherit;
          font-size: unset;
        }

        .date-input button:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .date-input button:active,
        .date-input button:hover {
          box-shadow: none;
          outline: 0;
        }

        .date-input button:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .date-input button:active {
          background-color: var(--cc-color-bg-neutral-active);
        }

        .date-input input {
          z-index: 2;
          display: block;
          overflow: hidden;
          width: 100%;
          height: 2em;
          box-sizing: border-box;
          padding: 0;
          border: none;
          margin: 0;
          -webkit-appearance: none;
          background: none;
          color: inherit;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          line-height: 2em;
          resize: none;
          text-align: var(--cc-input-number-align, left);
        }

        .date-input input:focus,
        .date-input input:active {
          outline: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-view', CcLogsViewComponent);
