import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../cc-logs-poc/cc-logs-poc.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-button/cc-button.js';
import '../cc-loader/cc-loader.js';
import { groupBy } from '../../../logs/utils/utils.js';
import {
  iconRemixArrowUpLine as deploymentUpscaleIcon,
  iconRemixGitMergeFill as deploymentGitIcon,
  iconRemixBuilding_3Fill as instanceDedicatedBuildIcon,
  iconRemixBuilding_3Line as instanceBuildIcon,
  iconRemixCloseCircleFill as instanceDeletedIcon,
  iconRemixCloseCircleLine as deploymentCancelledIcon,
  iconRemixPlayCircleFill as instanceUpIcon,
  iconRemixSearchLine as searchIcon,
  iconRemixSendPlaneFill as deploymentDeployIcon,
  iconRemixSpamFill as deploymentFailIcon,
  iconRemixStopFill as instanceStoppingIcon,
} from '../../assets/cc-remix.icons.js';

function formatDate (timestamp) {
  const date = new Date(timestamp);
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

export class CcLogsAdvanced extends LitElement {
  static get properties () {
    return {
      logs: { type: Array },
      deployments: { type: Array },
      instances: { type: Array },
      filter: { type: Array },
      _instanceFilters: { type: Object },
      _metaFilters: { type: Object },
      _filteredLogs: { type: Array },
    };
  }

  constructor () {
    super();

    this.logs = [];

    this.deployments = [];
    this.instances = [];

    this.filter = [];
    this.textFilter = '';

    this._deploymentFilters = {};
    this._metaFilters = {};
    this._filteredLogs = [];

    /** @type {Ref<CcLogsPoc>} */
    this._logsRef = createRef();
    this._inputRef = createRef();
  }

  addLogs (logs) {
    this.logs = [...this.logs, ...logs];
    this._updateFilters(logs);
    // this._logsRef.value.addLogs(logs);
  }

  toggleFilter (name, value) {
    if (this._isMetaFiltered(name, value)) {
      this.filter = this.filter.filter((f) => !(f.type === 'meta' && f.name === name && f.value === value));
    }
    else {
      this.filter = [...this.filter, { type: 'meta', name: name, value: value }];
    }
  }

  _updateFilters (logs) {
    logs.forEach((log) => {
      this._updateDeploymentFilter(log);
      this._updateMetaFilter(log);
    });
  }

  _updateDeploymentFilter (log) {
    const deploymentId = log.metadata.deploymentId;
    const instanceId = log.metadata.instanceId;

    let deployFilter = this._deploymentFilters[deploymentId];
    if (deployFilter == null) {
      deployFilter = {
        id: deploymentId,
        count: 1,
        instances: [],
        logs: [log],
      };
    }
    else {
      deployFilter.count = deployFilter.count + 1;
      deployFilter.logs = [...deployFilter.logs, log];
    }

    const instanceFilter = deployFilter.instances.find((f) => f.id === instanceId);
    if (instanceFilter == null) {
      deployFilter.instances = [...deployFilter.instances, {
        id: instanceId,
        count: 1,
        logs: [log],
      }].sort((i1, i2) => i1.instanceNumber - i2.instanceNumber);
    }
    else {
      instanceFilter.count = instanceFilter.count + 1;
      instanceFilter.logs = [...instanceFilter.logs, log];
    }

    this._deploymentFilters = {
      ...this._deploymentFilters,
      [deploymentId]: deployFilter,
    };
  }

  _updateMetaFilter (log) {
    const metadata = log.metadata;
    Object.entries(metadata)
      .filter(([k]) => k !== 'instanceId')
      .filter(([k]) => k !== 'deploymentId')
      .forEach(([k, v]) => {
        let filter = this._metaFilters[k];
        if (filter == null) {
          filter = {
            name: k,
            values: [],
          };
        }

        const valueFilter = filter.values.find((val) => val.value === v);
        if (valueFilter == null) {
          filter.values = [...filter.values, {
            value: v,
            count: 1,
            logs: [log],
          }];
        }
        else {
          valueFilter.count = valueFilter.count + 1;
          valueFilter.logs = [...valueFilter.logs, log];
        }

        this._metaFilters = {
          ...this._metaFilters,
          [k]: filter,
        };
      });
  }

  _isMetaFiltered (name, value) {
    return this.filter.find((f) => {
      return f.type === 'meta' && f.name === name && f.value === value;
    }) != null;
  }

  _isInstanceFiltered (instanceId) {
    return this.filter.find((f) => {
      return f.type === 'instance' && f.id === instanceId;
    }) != null;
  }

  _getDeployment (deploymentId) {
    return this.deployments.find((d) => d.uuid === deploymentId);
  }

  _getInstance (instanceId) {
    return this.instances.find((i) => i.id === instanceId);
  }

  _getCustomMetadataRenderers () {
    return Object.fromEntries([
      ...this.filter
        .filter((f) => f.type === 'meta')
        .map((f) => {
          return [f.name, (k, v) => {
            return html`<cc-badge weight="outlined">${k}: ${v}</cc-badge>`;
          }];
        }),
      ['level', (k, v) => {
        const weight = this.filter.find((f) => f.name === 'level') ? 'outlined' : 'dimmed';
        const intent = ((level) => {
          if (level === 'INFO') {
            return 'info';
          }
          if (level === 'WARN') {
            return 'warning';
          }
          if (level === 'ERROR') {
            return 'danger';
          }
          return 'neutral';
        })(v);

        return html`
          <cc-badge .weight=${weight} .intent=${intent}>${v}</cc-badge>
        `;
      }],
      ['instanceId', (k, v, log) => {
        const instance = this._getInstance(v);
        const weight = this.filter.find((f) => f.name === 'instanceId') ? 'outlined' : 'dimmed';
        return html`
          <cc-badge .weight=${weight}>${instance.displayName} / ${log.metadata.instanceState}</cc-badge>
        `;
      }],
      ['deploymentId', () => null],
      ['instanceState', () => null],
    ]);
  }

  // --

  _onMetaFilterClick (name, value) {
    this.toggleFilter(name, value);
  }

  _onInstanceFilterClick (instanceId) {
    this.toggleFilter('instanceId', instanceId);
  }

  _onApplyTextFilter () {
    this.textFilter = this._inputRef.value.value;
  }

  _match (filter, log) {
    if (filter.type === 'instance') {
      return log.instanceId === filter.id;
    }
    if (filter.type === 'meta') {
      return log.metadata[filter.name] === filter.value;
    }
    if (filter.type === 'text' && filter.value.length > 0) {
      return log.message.includes(filter.value);
    }
    return true;
  }

  _matchFilter (filter, log) {
    if (filter.length === 0) {
      return true;
    }

    const groups = groupBy(filter, (f) => {
      return `${f.type}$$${f.name}`;
    });

    for (const filters of Object.values(groups)) {
      let match = false;
      for (const f of filters) {
        if (this._match(f, log)) {
          match = true;
          break;
        }
      }
      if (!match) {
        return false;
      }
    }

    return true;
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('logs') || _changedProperties.has('filter') || _changedProperties.has('textFilter')) {
      this._filteredLogs = this.logs.filter((l) => {
        return this._matchFilter([...this.filter, { type: 'text', value: this.textFilter }], l);
      });
    }
  }

  render () {
    const __logsRef = this._logsRef;
    const _inputRef = this._inputRef;

    const customMetadataRenderers = this._getCustomMetadataRenderers();

    return html`
      <div class="left">
        <div class="filters">
          <h1>Filters</h1>
          <div class="filters-wrapper">
            ${this.filter.map((f) => this._renderFilter(f))}
          </div>
        </div>
        <div class="filter-ctrl">
          <h1>Deployments / Instances</h1>
          <div class="filter-ctrl--level-0 deployment-filters">
            ${Object.values(this._deploymentFilters).map((d) => this._renderDeploymentFilter(d))}
          </div>

          ${Object.values(this._metaFilters).map((d) => this._renderMetaFilter(d))}
        </div>
      </div>

      <div class="right">
        <cc-input-text
          ?inline=${true}
          label="Search"
          @cc-input-text:requestimplicitsubmit=${this._onApplyTextFilter}
          ${ref(_inputRef)}
          .value=${this.textFilter}
        ></cc-input-text>
        <cc-button
          class="search-button" @cc-button:click=${this._onApplyTextFilter}
          ?hide-text=${true}
          ?circle=${true}
          .icon=${searchIcon}
        ></cc-button>
        <cc-logs-poc
          .logs=${this._filteredLogs}
          .customMetadataRenderers=${customMetadataRenderers}
          ${ref(__logsRef)}
          ?follow=${true}
        ></cc-logs-poc>
      </div>
    `;
  }

  _renderDeploymentFilter (deploymentFilter) {
    const deployment = this._getDeployment(deploymentFilter.id);
    return html`
      <div class="deployment-filter">
        ${this._renderDeploymentIcon(deployment)}
        ${this._renderDeploymentState(deployment.state)}
        <span>[${deployment.id}] ${formatDate(deployment.date)}</span>
        <cc-badge class="counter">${deployment.commit}</cc-badge>

        <div class="instance-filters">
          ${
            deploymentFilter.instances
              .map((i) => [i, this._getInstance(i.id)])
              .sort((i1, i2) => i1[1].instanceNumber - i2[1].instanceNumber)
              .map((i) => this._renderInstanceFilter(i[0]))
          }
        </div>
      </div>
    `;
  }

  _renderInstanceFilter (instanceFilter) {
    const id = `instance_${instanceFilter.id}`;
    const instance = this._getInstance(instanceFilter.id);
    return html`
      <div class="instance-filter">
        <input id=${id} type="checkbox"
               @change=${() => this._onInstanceFilterClick(instanceFilter.id)}
               .checked=${this._isInstanceFiltered(instanceFilter.id)}>
        ${this._renderInstanceState(instance.state)}
        <label for=${id}>
          ${instance.displayName}
          ${instance.dedicatedBuild ? html`
            <cc-icon .icon=${instanceDedicatedBuildIcon}></cc-icon>
          ` : ''}
          ${!instance.dedicatedBuild && instance.build ? html`
            <cc-icon .icon=${instanceBuildIcon}></cc-icon>
          ` : ''}
            [${instance.instanceNumber}]
        </label>
        <span class="counter">${instanceFilter.count}</span>
      </div>
    `;
  }

  _renderMetaFilter (metaFilter) {
    return html`
      <h1>${metaFilter.name}</h1>
      <div class="filter-ctrl--level-0 meta-value-filters">
        ${metaFilter.values.map((v) => this._renderMetaValueFilter(metaFilter.name, v))}
      </div>
    `;
  }

  _renderMetaValueFilter (name, metaValueFilter) {
    const id = `meta_${name}_${metaValueFilter.value}`;
    return html`
      <div class="meta-value-filter">
        <input id=${id} type="checkbox"
               @change=${() => this._onMetaFilterClick(name, metaValueFilter.value)}
               .checked=${this._isMetaFiltered(name, metaValueFilter.value)}>
        <label for=${id}>${metaValueFilter.value}</label>
        <div class="counter">${metaValueFilter.count}</div>
      </div>
    `;
  }

  _renderFilter (filter) {
    if (filter.name === 'instanceId') {
      const instance = this._getInstance(filter.value);
      return html`
        <cc-badge weight="outlined">instance: ${instance.displayName}</cc-badge>`;
    }
    return html`
      <cc-badge weight="outlined">${filter.name}: ${filter.value}</cc-badge>`;
  }

  _renderDeploymentIcon (deployment) {
    if (deployment.action === 'UPSCALE') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary)" .icon=${deploymentUpscaleIcon}></cc-icon>
      `;
    }
    if (deployment.cause === 'Git') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary)" .icon=${deploymentGitIcon}></cc-icon>
      `;
    }
    return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary)" .icon=${deploymentDeployIcon}></cc-icon>
      `;
  }

  _renderDeploymentState (state) {
    if (state === 'WIP') {
      return html`
        <cc-loader></cc-loader>`;
    }
    if (state === 'CANCELLED') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-warning)" .icon=${deploymentCancelledIcon}></cc-icon>`;
    }
    if (state === 'FAIL') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-danger)" .icon=${deploymentFailIcon}></cc-icon>`;
    }
  }

  _renderInstanceState (state) {
    if (state === 'BOOTING' || state === 'STARTING' || state === 'DEPLOYING' || state === 'READY') {
      return html`
        <cc-loader></cc-loader>`;
    }
    if (state === 'STOPPING') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-warning)" .icon=${instanceStoppingIcon}></cc-icon>`;
    }
    if (state === 'DELETED') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-danger)" .icon=${instanceDeletedIcon}></cc-icon>`;
    }
    if (state === 'UP') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-success)" .icon=${instanceUpIcon}></cc-icon>`;
    }
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: row;
          gap: 1em;
        }

        h1 {
          padding: 0;
          margin: 0;
          color: var(--cc-color-text-primary);
          font-size: 1.2em;
        }

        .left {
          display: flex;
          width: 22em;
          min-height: 0;
          flex-direction: column;
          gap: 0.5em;
        }

        /* region filters */

        .filters {
          display: flex;
          flex-direction: column;
          padding: 0.3em;
          border: 1px solid #aaa;
          border-radius: 3px;
          gap: 0.5em;
        }

        .filters-wrapper {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.3em;
        }

        /* endregion */

        .filter-ctrl {
          overflow: auto;
          min-height: 0;
          flex: 1;
          padding: 0.3em;
          border: 1px solid #aaa;
          border-radius: 3px;
        }

        .deployment-filters {
          gap: 0.5em;
        }

        .filter-ctrl--level-0 {
          display: flex;
          flex-direction: column;
          padding: 0.7em;
        }

        .deployment-filter {
          display: grid;
          align-items: center;
          grid-gap: 0.2em;
          grid-template-columns: min-content max-content 1fr max-content;
        }

        .instance-filters {
          margin-left: 1em;
          grid-column: 1 / span 4;
        }

        .instance-filter {
          display: grid;
          align-items: center;
          color: var(--cc-color-text-default);
          grid-gap: 0.2em;
          grid-template-columns: min-content max-content 1fr max-content;
        }

        .meta-value-filters {
          display: flex;
        }

        .meta-value-filter {
          display: grid;
          color: var(--cc-color-text-default);
          grid-template-columns: min-content 1fr max-content;
        }

        .counter {
          justify-self: end;
        }
        
        span.counter {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
        
        cc-badge.counter {
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.9em;
        }

        cc-loader {
          width: 1em;
          height: 1em;
        }

        /* region right */

        .right {
          display: grid;
          flex: 1;
          grid-gap: 0.5em;
          grid-template-columns: 1fr min-content;
          grid-template-rows: min-content 1fr;
        }

        cc-logs-poc {
          flex: 1;
          padding: 0.5em;
          border: 1px solid #aaa;
          border-radius: 3px;
          grid-column: 1 / span 2;
        }

        /* endregion */

      `];
  }

}

window.customElements.define('cc-logs-advanced', CcLogsAdvanced);
