import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixArrowUpLine as deploymentUpscaleIcon,
  iconRemixArrowDownLine as deploymentDownscaleIcon,
  iconRemixGitMergeFill as deploymentGitIcon,
  iconRemixSendPlaneFill as deploymentDeployIcon,

  iconRemixBuilding_3Line as instanceBuildIcon,
  iconRemixCloseCircleFill as instanceDeletedIcon,
  iconRemixCloseCircleLine as deploymentCancelledIcon,
  iconRemixPlayCircleFill as instanceUpIcon,
  iconRemixStopFill as instanceStoppingIcon,
} from '../../assets/cc-remix.icons.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';

const withZero = (number) => {
  const str = `${number}`;
  if (str.length === 0) {
    return `00`;
  }
  if (str.length === 1) {
    return `0${str}`;
  }
  return str;
};

function formatDateTime (timestamp) {
  if (timestamp == null) {
    return '';
  }

  return formatDate(timestamp) + ' ' + formatTime(timestamp);
}
function formatDate (timestamp) {
  if (timestamp == null) {
    return '';
  }

  const date = new Date(timestamp);
  return withZero(date.getDate()) + '/' + withZero(date.getMonth() + 1) + '/' + date.getFullYear();
}

function formatTime (timestamp) {
  if (timestamp == null) {
    return '';
  }

  const date = new Date(timestamp);
  return withZero(date.getHours()) + ':' + withZero(date.getMinutes()) + ':' + withZero(date.getSeconds());
}

export class DateRange {
  static relative (window) {
    const now = new Date().getTime();
    return new DateRange(now - window, now);
  }

  constructor (from, to) {
    this.from = from;
    this.to = to;
  }

  size () {
    return (this.to - this.from);
  }

  center () {
    return this.from + this.size() / 2;
  }

  format () {
    return `[${formatDateTime(this.from)} - ${formatDateTime(this.to)}]`;
  }
}

function bound (num, inRange) {
  return Math.min(Math.max(num, inRange.x1), inRange.x2);
}

function boundRange (range, inRange) {
  return {
    x1: bound(range.x1, inRange),
    x2: bound(range.x2, inRange),
  };
}

function toStyle (range, width) {
  return {
    left: range.x1,
    right: width - range.x2,
  };
}

export class CcInstancesTimeline extends withResizeObserver(LitElement) {
  static get properties () {
    return {
      dateRange: { type: Object },
      deployments: { type: Array },
      instances: { type: Array },
      _instanceBlocks: { type: Array },
      _deploymentBlocks: { type: Array },
      _ticks: { type: Array },
      _cursorPosition: { type: Number },
      _selection: { type: Object },
      _logsAggregation: { type: Array },
      _logsChart: { type: Array },
    };
  }

  constructor () {
    super();

    /**
     *
     * @type {DateRange}
     */
    this.dateRange = null;
    this.deployments = [];
    this.instances = [];

    this._instanceBlocks = [];
    this._deploymentBlocks = [];
    this._ticks = [];
    this._cursorPosition = null;
    this._selection = null;

    this._axis = {
      top: 0,
    };
    this._scale = null;
    this._logsAggregation = [];
    this._logsChart = [];
  }

  onResize ({ width }) {
    this._layout(width);
  }

  addLogs (logs) {
    const now = new Date().getTime();
    const bucketDuration = 5000;

    if (this._logsAggregation.length === 0) {
      this._logsAggregation = [{
        date: now,
        size: bucketDuration,
        count: logs.length,
      }];
    }
    else {
      const lastAggregation = this._logsAggregation[this._logsAggregation.length - 1];
      if (now - lastAggregation.date <= bucketDuration) {
        this._logsAggregation = [
          ...this._logsAggregation.slice(0, -1),
          {
            ...lastAggregation,
            count: lastAggregation.count + logs.length,
          },
        ];
      }
      else {
        this._logsAggregation = [
          ...this._logsAggregation,
          {
            date: now,
            size: bucketDuration,
            count: logs.length,
          },
        ];
      }
    }

    this._logsAggregation = this._logsAggregation.filter((b) => b.date + b.size >= this.dateRange.from);
  }

  _layout (width) {
    if (this.dateRange == null) {
      this._instanceBlocks = [];
      return;
    }

    const windowRange = {
      x1: 0,
      x2: width,
    };

    // scale is the duration represented by 1px
    this._scale = this.dateRange.size() / width;

    const instanceBlockHeight = this._measure('instance').height;
    const gapBetweenInstances = 5;
    const gapAfterLastInstance = 15;
    const topMargin = 10;
    const reservedHeightForSelectionBoundsLabel = this._measure('date').height;
    const tickTimeLabel = this._measure('tick-date', formatTime(new Date().getTime()));
    const gapBeforeAxis = 0;
    let y = 0;

    this._instanceBlocks = this.instances.map((i) => {
      const deletionDate = i.state === 'DELETED' ? i.history[i.history.length - 1].timing.start : null;
      const timeRange = new DateRange(i.creationDate, deletionDate);

      // time offset from the global time range start
      const instanceStartTimeOffset = timeRange.from - this.dateRange.from;
      const instanceEndTimeOffset = timeRange.to == null ? null : timeRange.to - this.dateRange.from;

      const top = topMargin + reservedHeightForSelectionBoundsLabel + i.instanceNumber * (instanceBlockHeight + gapBetweenInstances);

      y = Math.max(y, top);

      return {
        instance: i,
        timeRange: timeRange,
        coordinates: {
          ...toStyle(
            boundRange({
              x1: instanceStartTimeOffset / this._scale,
              x2: instanceEndTimeOffset == null ? width : instanceEndTimeOffset / this._scale,
            }, windowRange),
            width,
          ),
          top,
        },
      };
    });
    y = y + instanceBlockHeight + gapAfterLastInstance;

    // logs chart
    let logsChartHeight = 0;

    if (this._logsAggregation.length > 0) {
      logsChartHeight = 150;

      const bucketGap = 4;
      const maxLogsCount = this._logsAggregation.map((b) => b.count).reduce((a, b) => Math.max(a, b), this._logsAggregation[0].count);
      this._logsChart = this._logsAggregation.map((b) => {
        const height = b.count * logsChartHeight / maxLogsCount;
        const left = (b.date - this.dateRange.from) / this._scale;
        const bucketWidth = (b.size / this._scale);

        return {
          count: b.count,
          date: b.date,
          height,
          left: left,
          width: bucketWidth - bucketGap,
          top: y + logsChartHeight - height,
        };
      });
    }
    y += logsChartHeight;

    // axis
    this._axis = {
      top: y + gapBeforeAxis,
    };

    y = this._axis.top;

    // cursor
    this._cursor = {
      height: this._axis.top - reservedHeightForSelectionBoundsLabel,
      top: reservedHeightForSelectionBoundsLabel,
    };

    this._deploymentBlocks = this.deployments.map((d) => {
      const startTimeOffset = d.date - this.dateRange.from;

      return {
        deployment: d,
        coordinates: {
          left: startTimeOffset / this._scale,
          height: this._axis.top - reservedHeightForSelectionBoundsLabel,
          top: reservedHeightForSelectionBoundsLabel,
        },
      };
    });

    const count = 10;
    const labelRange = {
      x1: 0,
      x2: width - tickTimeLabel.width,
    };
    this._ticks = new Array(count + 1).fill(0).map((o, i) => {
      const left = i * width / count;
      return {
        date: {
          left: bound(left - (tickTimeLabel.width / 2), labelRange),
          top: this._axis.top + 5,
          value: formatTime(),
        },
        left: Math.min(left, width - 1),
        height: this._cursor.height,
        top: reservedHeightForSelectionBoundsLabel,
      };
    });

    this._height = y + 40;
  }

  _toTimestamp (position) {
    return position * this._scale + this.dateRange.from;
  }

  _measure (clazz, text = 'fake') {
    const element = document.createElement('div');
    element.classList.add(clazz);
    element.classList.add('measure');
    element.innerText = text;
    this.shadowRoot.appendChild(element);

    const style = getComputedStyle(element);

    const marginLeft = parseInt(style.marginLeft);
    const marginRight = parseInt(style.marginRight);
    const marginTop = parseInt(style.marginTop);
    const marginBottom = parseInt(style.marginBottom);

    const result = {
      width: element.offsetWidth + marginLeft + marginRight,
      height: element.offsetHeight + marginTop + marginBottom,
    };
    element.remove();
    return result;
  }

  _fireBoundChanged (left, right) {
    this.dateRange = new DateRange(left, right);
  }

  connectedCallback () {
    super.connectedCallback();

    this.shadowRoot.addEventListener('mousemove', (e) => {
      const x = e.clientX - e.target.getBoundingClientRect().left;

      this._cursorPosition = x;
      if (this._selection != null) {
        this._selection = {
          ...this._selection,
          end: x,
        };
      }
    });
    this.shadowRoot.addEventListener('mouseout', (e) => {
      this._cursorPosition = null;
    });

    this.shadowRoot.addEventListener('mousedown', (e) => {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      this._selection = {
        start: x,
      };
    });
    this.shadowRoot.addEventListener('mouseup', (e) => {
      if (this._selection?.end != null) {
        const revert = this._selection.end <= this._selection.start;
        const left = revert ? this._selection.end : this._selection.start;
        const right = revert ? this._selection.start : this._selection.end;
        this._fireBoundChanged(this._toTimestamp(left), this._toTimestamp(right));
      }
      this._selection = null;
    });

    this.shadowRoot.addEventListener('wheel', (e) => {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const size = this.dateRange.size();
      const zoomIn = e.deltaY < 0;
      const zoomSpeed = 1.2;
      const offset = this._toTimestamp(x) - this.dateRange.center();

      if (zoomIn) {
        const newSize = size / zoomSpeed;

        const dateRange = new DateRange(
          this.dateRange.from + newSize / 2 + offset,
          this.dateRange.to - newSize / 2 + offset,
        );
        console.log('zoomIn', this.dateRange.format(), dateRange.format());
        this._fireBoundChanged(dateRange.from, dateRange.to);
      }
      else {
        const newSize = size * zoomSpeed;
        const dateRange = new DateRange(
          this.dateRange.from - newSize / 2 + offset,
          Math.min(new Date().getTime(), this.dateRange.to + newSize / 2 + offset),
        );
        console.log('zoomOut', this.dateRange.format(), dateRange.format());
        this._fireBoundChanged(dateRange.from, dateRange.to);
      }
    });
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('dateRange') || _changedProperties.has('_logsAggregation')) {
      this._layout(this.getBoundingClientRect().width);
    }
  }

  render () {
    return html`
      <div class="main" style="height: ${this._height}px">
        ${this.renderInner()}
      </div>
    `;
  }

  renderInner () {
    return [
      ...this._instanceBlocks.map((block) => this._renderInstance(block)),
      ...this._deploymentBlocks.map((block) => this._renderDeployment(block)),
      ...this._logsChart.map((bucket) => this._renderLogBucket(bucket)),
      this._renderBackground(),
      this._renderAxis(),
      ...this._ticks.map((tick) => this._renderTick(tick)),
      this._renderCursor(),
      this._renderSelection(),
    ];
  }

  _renderBackground () {
    return html`
      <div class="background ${classMap({ dragging: this._selection != null })}"
           style="width: 100%; height: ${this._axis.top}px;">
      </div>
    `;
  }

  _renderInstance (block) {
    const clazz = ((state) => {
      if (state === 'BOOTING' || state === 'STARTING' || state === 'DEPLOYING' || state === 'READY') {
        return 'loading';
      }
      if (state === 'STOPPING') {
        return 'stopping';
      }
      if (state === 'DELETED') {
        return 'deleted';
      }
      if (state === 'UP') {
        return 'up';
      }
    })(block.instance.state);

    return html`
      <div class="instance ${clazz}"
           style="left: ${block.coordinates.left}px; right: ${block.coordinates.right}px; top: ${block.coordinates.top}px;">
        ${this._renderInstanceState(block.instance.state)} <span>[${block.instance.instanceNumber}]</span><span>${block.instance.displayName}</span>
      </div>
    `;
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

  _renderDeployment (block) {
    const labelTop = block.coordinates.height + block.coordinates.top + 5;
    const labelLeft = block.coordinates.left - 10;

    return html`
      <div class="deployment-bound" style="height: ${block.coordinates.height}px; top: ${block.coordinates.top}px; left: ${block.coordinates.left}px;"></div>
      <div class="deployment-label" style="top: ${labelTop}px; left: ${labelLeft}px;">
        ${this._renderDeploymentIcon(block.deployment)}
      </div>
      
    `;
  }

  _renderDeploymentIcon (deployment) {
    if (deployment.action === 'UPSCALE') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary)" .icon=${deploymentUpscaleIcon}></cc-icon>
      `;
    }
    if (deployment.action === 'DOWNSCALE') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary)" .icon=${deploymentDownscaleIcon}></cc-icon>
      `;
    }
    if (deployment.action === 'UNDEPLOY') {
      return html`
        <cc-icon style="--cc-icon-color: var(--cc-color-bg-primary); transform: rotate(75deg);" .icon=${deploymentDeployIcon}></cc-icon>
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

  _renderAxis () {
    return html`
      <div class="axis" style="top: ${this._axis.top}px;">
        <span class="axis-unit axis-unit-left">${formatDate(this.dateRange?.from)}</span>
        <span class="spacer"></span>
        <span class="axis-unit axis-unit-right">${formatDate(this.dateRange?.to)}</span>
      </div>
    `;
  }

  _renderTick (tick) {
    const date = formatTime(this._toTimestamp(tick.left));

    return html`
      <div class="tick-date" style="left: ${tick.date.left}px; top: ${tick.date.top}px;">${date}</div>
      <div class="tick" style="height: ${tick.height}px; top : ${tick.top}px; left: ${tick.left}px;"></div>
    `;
  }

  _renderCursor () {
    if (this._cursorPosition == null || this._selection?.end != null) {
      return null;
    }

    const date = formatDateTime(this._toTimestamp(this._cursorPosition));

    return html`
      <div class="date" style="left: ${this._cursorPosition}px;">${date}</div>
      <div class="cursor" style="height: ${this._cursor.height}px; top : ${this._cursor.top}px; left: ${this._cursorPosition}px;"></div>
    `;
  }

  _renderSelection () {
    if (this._selection?.end == null) {
      return null;
    }

    const revert = this._selection.end <= this._selection.start;
    const left = revert ? this._selection.end : this._selection.start;
    const right = revert ? this._selection.start : this._selection.end;
    const width = Math.abs(this._selection.end - this._selection.start);
    const cls = revert ? 'revert' : 'normal';

    const leftDate = formatDateTime(this._toTimestamp(left));
    const rightDate = formatDateTime(this._toTimestamp(right));

    return html`
      <div class="date">[${leftDate} - ${rightDate}]</div>
      <div class="cursor" style="height: ${this._cursor.height}px; top : ${this._cursor.top}px; left: ${left}px;"></div>
      <div class="selection ${cls}" style="height: ${this._cursor.height}px; top : ${this._cursor.top}px; left: ${left}px; width: ${width}px;"></div>
      <div class="cursor" style="height: ${this._cursor.height}px; top : ${this._cursor.top}px; left: ${right}px;"></div>
    `;
  }

  _renderLogBucket (bucket) {
    return html`
      <div class="bucket" style="left: ${bucket.left}px; top: ${bucket.top}px; width: ${bucket.width}px; height: ${bucket.height}px;">
        ${bucket.count}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          color: var(--cc-color-text-default);
          -webkit-user-select: none; /* Safari */
          -ms-user-select: none; /* IE 10 and IE 11 */
          user-select: none; /* Standard syntax */
        }
        
        .main {
          position: relative;
          overflow: hidden;
        }
        
        .background {
          position: absolute;
          z-index: 5;
          color: transparent;
        }

        .dragging {
          cursor: col-resize;
        }

        .instance {
          position: absolute;
          z-index: 2;
          display: flex;
          overflow: clip;
          flex-wrap: nowrap;
          align-items: center;
          padding: 0.2em;
          border: 1px solid #aaa;
          background-color: #ccc;
          border-radius: 3px;
          font-size: 1em;
          gap: 0.3em;
          white-space: nowrap;
          /* cursor: pointer; */
          /* transition: left 0.15s linear; */
        }

        .instance.up {
          border-color: var(--cc-color-border-success-weak);
          border-right: 0;
          background-color: var(--cc-color-bg-success-weaker);
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
        }

        .instance.deleted {
          border-color: var(--cc-color-bg-soft);
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-weak);
        }

        .measure {
          left: -999999999px;
        }

        .axis {
          position: absolute;
          left: 1px;
          display: flex;
          width: calc(100% - 2px);
          padding-top: 0.2em;
          border-top: 2px solid #aaa;
        }

        .axis-unit {
          margin-top: 1.2em;
          font-size: 0.9em;
        }

        .spacer {
          flex: 1;
        }

        .cursor {
          position: absolute;
          z-index: 3;
          width: 0;
          border-right: 1px dashed #000;
        }
        
        .selection {
          position: absolute;
          z-index: 3;
          background-color: #eee;
          opacity: 0.5;
        }
        
        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-bottom: 1px solid #000;
          background-color: #eee;
          border-radius: 3px;
          font-size: 0.9em;
        }
        
        .tick {
          position: absolute;
          width: 1px;
          background-color: var(--cc-color-bg-soft);
          /* transition: left 0.15s linear; */
        }
        
        .tick-date {
          position: absolute;
          display: flex;
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
        }
        
        .deployment-bound {
          position: absolute;
          z-index: 3;
          width: 1px;
          border-right: 1px solid var(--cc-color-bg-primary);
          /* transition: left 0.15s linear; */
        }
        
        .deployment-label {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border: 1px solid var(--cc-color-bg-primary);
          background-color: white;
          border-radius: 50%;
          /* transition: left 0.15s linear; */
        }
        
        .bucket {
          /* border: 1px solid var(--cc-color-bg-primary); */
          position: absolute;
          display: flex;
          align-items: center;
          
          /* transition: left 0.15s linear; */
          justify-content: center;
          background-color: var(--cc-color-bg-primary-weaker);
          color: var(--cc-color-text-primary);
          font-size: 0.8em;
        }

        cc-icon {
          min-width: 1em;
          max-width: 1em;
          min-height: 1em;
          max-height: 1em;
        }
        
        cc-loader {
          width: 1em;
          min-width: 1em;
          height: 1em;
          min-height: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-instances-timeline', CcInstancesTimeline);
