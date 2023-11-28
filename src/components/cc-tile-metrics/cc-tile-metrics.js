import { BarController, BarElement, CategoryScale, Chart, LinearScale, Title, Tooltip, Filler } from 'chart.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconCleverGrafana as iconGrafana,
  iconCleverInfo as iconInfo,
  iconCleverRam as iconMem,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixCpuLine as iconCpu,
  iconRemixCloseLine as iconClose,
  iconRemixAlertFill as iconAlert,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { tileStyles } from '../../styles/info-tiles.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, Title, Filler);

const TOP_COLOR_CHART = 'rgb(190, 52, 97)';
const MIDDLE_COLOR_CHART = 'rgb(78, 100, 234)';
const BOTTOM_COLOR_CHART = 'rgb(100, 146, 234)';

const TOP_COLOR_PERCENT = 'var(--cc-color-text-danger)';
const MIDDLE_COLOR_PERCENT = 'var(--cc-color-text-primary-strong)';
const BOTTOM_COLOR_PERCENT = 'var(--cc-color-text-primary)';

const SKELETON_COLOR = '#bbb';

const TOP_THRESHOLD = 80;
const BOTTOM_THRESHOLD = 20;

const NUMBER_OF_POINTS = 24;

const ONE_DAY = 60 * 60 * 1000 * 24;

const SKELETON_REQUESTS = Array
  .from(new Array(NUMBER_OF_POINTS))
  .map((_, index) => {
    const startTs = Date.now() - ONE_DAY;
    return {
      skeleton: true,
      value: 0,
      timestamp: startTs + index * 3600,
    };
  });

/**
 * @typedef {import('./cc-tile-metrics.types.js').MetricsState} MetricsState
 */

/**
 * A "tile" component to display CPU and RAM metrics in a bar chart.
 *
 * ## Details
 *
 * The tile is composed of two panels:
 *  * One for the charts (CPU and MEM).
 *  * The other one is for the docs.
 * You can switch between them by clicking on the info button.
 *
 * The Grafana link is the link to the Grafana app.
 * The Metrics link is the link to the Metrics section of the app in the console.
 *
 * @cssdisplay grid
 */
export class CcTileMetrics extends LitElement {

  static get properties () {
    return {
      grafanaLink: { type: String },
      metrics: { type: Object },
      metricsLink: { type: String },
      _docsPanelVisible: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {string} - Sets the link to the grafana app. */
    this.grafanaLink = '';

    /** @type {MetricsState} - State of the component. */
    this.metrics = { state: 'loading' };

    /** @type {string} - Sets the link to the metrics section. */
    this.metricsLink = '';

    /** @type {boolean} */
    this._docsPanelVisible = false;

    /** @type {Ref<Canvas>} */
    this._cpuCtxRef = createRef();

    /** @type {Ref<Canvas>} */
    this._memCtxRef = createRef();

    new ResizeController(this, {
      callback: () => this.updateComplete.then(() => {
        // everytime the component is resized, we need to trigger the chartJS resize
        this._cpuChart?.resize();
        this._memChart?.resize();
      }),
    });
  }

  _createChart (chartElement) {
    return new Chart(chartElement, {
      type: 'bar',
      options: {
        responsive: false,
        maintainAspectRatio: false,
        radius: 0,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: false,
            stacked: true,
          },
          y: {
            display: false,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }

  _getChartData (inputData) {

    const labels = inputData.map((item) => item.timestamp);
    const values = inputData.map((item) => item.value);

    // We use this series as a trick to scale the chart with the values given (0 to 100).
    // It also serves as a background for the other bar with the data.
    const maxValues = Array
      .from(new Array(NUMBER_OF_POINTS))
      .map((_) => 100);

    const colors = inputData.map(({ value, skeleton }) => {
      return skeleton
        ? SKELETON_COLOR
        : this._getColorChart(value);
    });

    return {
      labels,
      datasets: [
        {
          fill: 'origin',
          data: values,
          backgroundColor: colors,
        },
        {
          fill: 'origin',
          data: maxValues,
        },
      ],
    };
  }

  _getColorChart (percent) {
    if (percent > TOP_THRESHOLD) {
      return TOP_COLOR_CHART;
    }
    else if (percent > BOTTOM_THRESHOLD) {
      return MIDDLE_COLOR_CHART;
    }
    return BOTTOM_COLOR_CHART;
  }

  _getColorLegend (percent) {
    if (percent > TOP_THRESHOLD) {
      return TOP_COLOR_PERCENT;
    }
    else if (percent > BOTTOM_THRESHOLD) {
      return MIDDLE_COLOR_PERCENT;
    }
    return BOTTOM_COLOR_PERCENT;
  }

  _getCurrentPanel () {
    if (this._docsPanelVisible) {
      return 'docs';
    }
    if (this.metrics.state === 'error') {
      return 'error';
    }
    if (this.metrics.state === 'empty') {
      return 'empty';
    }
    if (this.metrics.state === 'loading' || this.metrics.state === 'loaded') {
      return 'chart';
    }
  }

  _onToggleDocs () {
    this._docsPanelVisible = !this._docsPanelVisible;
  }

  firstUpdated () {
    this._cpuChart = this._createChart(this._cpuCtxRef.value);
    this._memChart = this._createChart(this._memCtxRef.value);
  }

  // updated and not willUpdate because we need this._cpuChart and this._memChart before
  updated (changedProperties) {

    if (changedProperties.has('metrics')) {

      this._cpuChart.data = (this.metrics.state === 'loaded')
        ? this._getChartData(this.metrics.value.cpuData)
        : this._getChartData(SKELETON_REQUESTS);

      this._cpuChart.update();
      this._cpuChart.resize();

      this._memChart.data = (this.metrics.state === 'loaded')
        ? this._getChartData(this.metrics.value.memData)
        : this._getChartData(SKELETON_REQUESTS);

      this._memChart.update();
      this._memChart.resize();
    }

  }

  render () {

    const state = this.metrics.state;

    const lastCpuValue = (state === 'loaded') ? this.metrics.value.cpuData[this.metrics.value.cpuData.length - 1].value : 0;
    const lastMemValue = (state === 'loaded') ? this.metrics.value.memData[this.metrics.value.memData.length - 1].value : 0;

    const cpuColorType = (state === 'loaded') ? this._getColorLegend(lastCpuValue) : SKELETON_COLOR;
    const memColorType = (state === 'loaded') ? this._getColorLegend(lastMemValue) : SKELETON_COLOR;

    const panel = this._getCurrentPanel();

    return html`
      <div class="tile_title">
        ${i18n('cc-tile-metrics.title')}
        <div class="docs-buttons">
          ${state === 'loaded' ? html`
            ${ccLink(this.grafanaLink, html`
              <cc-icon class="icon--grafana" .icon=${iconGrafana} accessible-name="${i18n('cc-tile-metrics.link-to-grafana')}"></cc-icon>
            `, false, i18n('cc-tile-metrics.link-to-grafana'))}
          ` : ''}
          <cc-button
            class="docs-toggle ${classMap({ 'icon--close': this._docsPanelVisible, 'icon--info': !this._docsPanelVisible })}"
            .icon=${this._docsPanelVisible ? iconClose : iconInfo}
            hide-text
            @cc-button:click=${this._onToggleDocs}
          > ${this._docsPanelVisible ? i18n('cc-tile-metrics.close-btn') : i18n('cc-tile-metrics.about-btn')}
          </cc-button>
        </div>
      </div>
      <div class="tile_body ${classMap({ 'tile--hidden': panel !== 'chart' })}">
        <div class="category" aria-hidden="true">
          <cc-icon size="lg" class="icon--cpu" .icon=${iconCpu}></cc-icon>
          <div class="chart-container-wrapper chart-cpu">
            <div class="chart-container ${classMap({ skeleton: state === 'loading' })}">
              <canvas id="cpu_chart" ${ref(this._cpuCtxRef)}></canvas>
            </div>
          </div>
          <div class="current-percentage percent-cpu ${classMap({
            skeleton: state === 'loading', 'skeleton-data-value': state === 'loading',
          })}" style="color: ${cpuColorType}">${i18n('cc-tile-metrics.percent', { percent: lastCpuValue / 100 })}
          </div>
          <div class="legend-cpu">${i18n('cc-tile-metrics.legend.cpu')}</div>
        </div>
        <div class="category" aria-hidden="true">
          <cc-icon size="lg" class="icon--mem" .icon=${iconMem}></cc-icon>
          <div class="chart-container-wrapper chart-mem">
            <div class="chart-container ${classMap({ skeleton: state === 'loading' })}">
              <canvas id="mem_chart" ${ref(this._memCtxRef)}></canvas>
            </div>
          </div>
          <div class="current-percentage percent-mem ${classMap({
            skeleton: state === 'loading', 'skeleton-data-value': state === 'loading',
          })}" style="color: ${memColorType}">${i18n('cc-tile-metrics.percent', { percent: lastMemValue / 100 })}
          </div>
          <div class="legend-mem">${i18n('cc-tile-metrics.legend.mem')}</div>
        </div>
        ${state === 'loaded'
          ? this._renderAccessibleTable()
          : ''}
      </div>

      <div class="tile_message ${classMap({ 'tile--hidden': panel !== 'empty' })}">${i18n('cc-tile-metrics.empty')}</div>

      <div class="tile_message ${classMap({ 'tile--hidden': panel !== 'error' })}">
        <div class="error-message">
          <cc-icon .icon="${iconAlert}" accessible-name="${i18n('cc-tile-metrics.error.icon-a11y-name')}" class="icon-warning"></cc-icon>
          <p>${i18n('cc-tile-metrics.error')}</p>
        </div>
      </div>

      <div class="tile_docs ${classMap({ 'tile--hidden': panel !== 'docs' })}">
        ${i18n('cc-tile-metrics.docs.msg')}
        <div class="docs-links">
          <p>${i18n('cc-tile-metrics.docs.more-metrics')}</p>
          <ul>
            <li>
              ${ccLink(this.grafanaLink, i18n('cc-tile-metrics.grafana'), state === 'loading', i18n('cc-tile-metrics.link-to-grafana'))}
            </li>
            <li>
              ${ccLink(this.metricsLink, i18n('cc-tile-metrics.metrics-link'), state === 'loading', i18n('cc-tile-metrics.link-to-metrics'))}
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  _renderAccessibleTable () {
    return html`
      <table class="visually-hidden">
        <caption>${i18n('cc-tile-metrics.title')}</caption>
        <thead>
        <tr>
          <th lang="en">${i18n('cc-tile-metrics.a11y.table-header.timestamp')}</th>
          <th>${i18n('cc-tile-metrics.a11y.table-header.cpu')}</th>
          <th>${i18n('cc-tile-metrics.a11y.table-header.mem')}</th>
        </tr>
        </thead>
        <tbody>
        ${this.metrics.value.cpuData.map((cpuData, index) => {
          const memData = this.metrics.value.memData[index];

          return html`
            <tr>
              <th>${i18n('cc-tile-metrics.timestamp-format', { timestamp: cpuData.timestamp })}</th>
              <td>${i18n('cc-tile-metrics.percent', { percent: cpuData.value / 100 })}</td>
              <td>${i18n('cc-tile-metrics.percent', { percent: memData.value / 100 })}</td>
            </tr>
          `;
        })}
        </tbody>
      </table>
    `;
  }

  static get styles () {
    return [
      accessibilityStyles,
      linkStyles,
      skeletonStyles,
      tileStyles,
      // language=CSS
      css`
        /* region header */

        .tile_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tile_title .cc-link {
          display: flex;
          width: 1.75em;
          height: 1.75em;
          box-sizing: border-box;
          align-items: center;
          justify-content: center;
          /* TODO: Change variable when we have proper border token */
          border: 1px solid var(--cc-color-bg-strong);
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-shadow: rgb(255 255 255 / 0%) 0 0 0 0;
          transition: box-shadow 75ms ease-in-out 0s;
        }

        .tile_title .cc-link:hover {
          box-shadow: rgb(0 0 0 / 40%) 0 1px 3px;
        }

        .docs-buttons {
          display: flex;
          align-items: center;
          font-size: 0.8em;
          gap: 0.5em;
        }

        /* endregion */

        /* region chart */

        .chart-container-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          grid-area: chart-wrapper;
        }

        .chart-cpu {
          grid-area: chart-cpu;
        }

        .chart-mem {
          grid-area: chart-mem;
        }

        .chart-container {
          position: absolute;
          width: 100%;
          min-width: 0;
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
          margin: auto;
        }

        /* endregion */

        /* region tile-body */

        .tile_body {
          position: relative;
          min-height: 8.75em;
          align-items: center;
          gap: 0 1em;
          grid-template-areas: 
            'icon-cpu chart-cpu percent-cpu'
            '. legend-cpu .'
            'icon-mem chart-mem percent-mem'
            '. legend-mem .';
          grid-template-columns: min-content 1fr min-content;
          grid-template-rows: 1fr max-content 1fr max-content;
        }

        .percent-cpu {
          grid-area: percent-cpu;
        }

        .percent-mem {
          grid-area: percent-mem;
        }

        .skeleton-data-value {
          background-color: #bbb;
        }

        /*
          body, message and docs are placed in the same area (on top of each other)
          this way, we can just hide the docs
          and let the tile take at least the height of the docs text content
         */

        .tile_body,
        .tile_message,
        .tile_docs {
          grid-area: 2 / 1 / 3 / 2;
        }

        /* See above why we hide instead of display:none */

        .tile--hidden {
          visibility: hidden;
        }

        .category {
          display: contents;
        }

        .current-percentage {
          justify-self: end;
        }

        .legend-cpu,
        .legend-mem {
          align-self: center;
          margin-top: 0.5em;
          color: var(--cc-color-text-weak);
          font-size: 0.75em;
          font-style: italic;
          justify-self: center;
        }

        .legend-cpu {
          margin-bottom: 1.25em;
          grid-area: legend-cpu;
        }

        .legend-mem {
          grid-area: legend-mem;
        }

        .tile_docs {
          display: grid;
          align-content: center;
        }

        p {
          margin: 0;
        }

        .tile_docs ul {
          display: flex;
          padding: 0;
          margin: 0;
          gap: 0.5em;
          list-style: none;
        }

        .docs-links {
          display: flex;
          align-items: flex-end;
          margin-top: 0.5em;
          gap: 0.5em;
        }

        /* endregion */

        /* region icons */

        .icon--close {
          --cc-icon-size: 1.4em;
        }

        .icon--info {
          --cc-icon-color: var(--color-blue-60);
          --cc-icon-size: 1.25em;
        }

        .icon--grafana {
          --cc-icon-size: 1.25em;
        }

        .icon--cpu {
          grid-area: icon-cpu;

          --cc-icon-color: var(--cc-color-text-weak);
        }

        .icon--mem {
          grid-area: icon-mem;

          --cc-icon-color: var(--cc-color-text-weak);
        }
        
        /* endregion */
        
        /* region error */

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
        
        /* endregion */
      `,
    ];
  }

}

window.customElements.define('cc-tile-metrics', CcTileMetrics);
