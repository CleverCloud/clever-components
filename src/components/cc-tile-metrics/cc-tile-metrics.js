import { BarController, BarElement, CategoryScale, Chart, LinearScale, Title, Tooltip } from 'chart.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';
import { tileStyles } from '../../styles/info-tiles.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-stretch/cc-stretch.js';
import '../cc-button/cc-button.js';
import '../cc-error/cc-error.js';

// TODO: How do we handle this with cc-icon?
const closeSvg = new URL('../../assets/close.svg', import.meta.url).href;
const infoSvg = new URL('../../assets/info.svg', import.meta.url).href;
const grafanaSvg = new URL('../../assets/grafana.svg', import.meta.url).href;

Chart.register(BarController, BarElement, Tooltip, CategoryScale, LinearScale, Title);

const TOP_COLOR_CHART = 'rgb(190, 52, 97)';
const MIDDLE_COLOR_CHART = 'rgb(78, 100, 234)';
const BOTTOM_COLOR_CHART = 'rgb(100, 146, 234)';

// TODO: If we agree on this don't forget to move this in CSS.
const TOP_COLOR_LEGEND = 'var(--cc-color-text-danger)';
const MIDDLE_COLOR_LEGEND = 'var(--color-blue-80)';
const BOTTOM_COLOR_LEGEND = 'var(--cc-color-text-primary)';

const TOP_THRESHOLD = 80;
const BOTTOM_THRESHOLD = 20;

const NUMBER_OF_POINTS = 24;

const SKELETON_REQUESTS = Array
  .from(new Array(NUMBER_OF_POINTS))
  .map((_, index) => {
    const startTs = new Date().getTime();
    return { value: Math.random(), timestamp: startTs + index * 3600 };
  });

/**
 * @typedef {import('./cc-tile-metrics.types.js').TileMetricsState} TileMetricsState
 */

/**
 * A "tile" component to display CPU and RAM metrics in a bar chart.
 *
 * @cssdisplay grid
 */
export class CcTileMetrics extends LitElement {

  static get properties () {
    return {
      grafanaLink: { type: String },
      metricsLink: { type: String },
      metrics: { type: Object },
      _docs: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {string} - Sets the link to the grafana app. */
    this.grafanaLink = '';

    /** @type {string} - Sets the link to the metrics section. */
    this.metricsLink = '';

    /** @type {TileMetricsState} - State of the component. */
    this.metrics = { state: 'loading' };

    /** @type {boolean} */
    this._docs = false;
  }

  _createChart (chartElement) {
    return new Chart(chartElement, {
      type: 'bar',
      options: {
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

    const data = inputData ?? SKELETON_REQUESTS;
    const labels = data.map((item) => item.timestamp);
    const values = data.map((item) => item.value);

    const maxValues = Array
      .from(new Array(NUMBER_OF_POINTS))
      .map((_) => 100);

    const colors = inputData == null
      ? values.map((_) => '#bbb')
      : values.map((percent) => this._getColorChart(percent));

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
      return TOP_COLOR_LEGEND;
    }
    else if (percent > BOTTOM_THRESHOLD) {
      return MIDDLE_COLOR_LEGEND;
    }
    return BOTTOM_COLOR_LEGEND;
  }

  _getCurrentPanel () {
    if (this._docs) {
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
    this._docs = !this._docs;
  }

  firstUpdated () {
    this._cpuCtx = this.renderRoot.getElementById('cpu_chart');
    this._memCtx = this.renderRoot.getElementById('mem_chart');

    this._cpuChart = this._createChart(this._cpuCtx);
    this._memChart = this._createChart(this._memCtx);

  }

  // updated and not update because we need this._chart before
  updated (changedProperties) {

    if (changedProperties.has('metrics')) {

      this._cpuChart.data = (this.metrics.state === 'loaded')
        ? this._getChartData(this.metrics.value.cpuData)
        : this._getChartData(null);

      this._cpuChart.update();
      this._cpuChart.resize();

      this._memChart.data = (this.metrics.state === 'loaded')
        ? this._getChartData(this.metrics.value.memData)
        : this._getChartData(null);

      this._memChart.update();
      this._memChart.resize();
    }

  }

  render () {

    const lastCpuValue = (this.metrics.state === 'loaded') ? this.metrics.value.cpuData[this.metrics.value.cpuData.length - 1].value : 0;
    const lastMemValue = (this.metrics.state === 'loaded') ? this.metrics.value.memData[this.metrics.value.memData.length - 1].value : 0;

    const cpuColorType = (this.metrics.state === 'loaded') ? this._getColorLegend(lastCpuValue) : '#bbb';
    const memColorType = (this.metrics.state === 'loaded') ? this._getColorLegend(lastMemValue) : '#bbb';

    const panel = this._getCurrentPanel();

    return html`
      <div class="tile_title">
        ${i18n('cc-tile-metrics.title')}
        <div class="docs-buttons">
          ${ccLink(this.grafanaLink, html`
            <img class="grafana-logo" src=${grafanaSvg} alt="">
          `, false, i18n('cc-tile-metrics.link-to-grafana'))}
          <cc-button
            class="docs-toggle"
            image=${(this._docs ? closeSvg : infoSvg)}
            hide-text
            @cc-button:click=${this._onToggleDocs}
          >${this._docs ? i18n('cc-tile-metrics.close-btn') : i18n('cc-tile-metrics.about-btn')}
          </cc-button>
        </div>
      </div>
      <div class="tile_body ${classMap({ 'tile--hidden': panel !== 'chart' })}">
        <div class="category">
          <div>${i18n('cc-tile-metrics.cpu')}</div>
          <div class="chart-wrapper">
            <div class="chart-container ${classMap({ skeleton: this.metrics.state === 'loading' })}">
              <canvas id="cpu_chart"></canvas>
            </div>
          </div>
          <div class="current-percentage ${classMap({ skeleton: this.metrics.state === 'loading' })}" style=${`color: ${cpuColorType}`}>${i18n('cc-tile-metrics.percent', { percent: lastCpuValue / 100 })}</div>
        </div>
        <div class="category">
          <div>${i18n('cc-tile-metrics.mem')}</div>
          <div class="chart-wrapper">
            <div class="chart-container ${classMap({ skeleton: this.metrics.state === 'loading' })}">
              <canvas id="mem_chart"></canvas>
            </div>
          </div>
          <div class="current-percentage ${classMap({ skeleton: this.metrics.state === 'loading' })}" style=${`color: ${memColorType}`}>${i18n('cc-tile-metrics.percent', { percent: lastMemValue / 100 })}</div>
        </div>
      </div>

      <div class="tile_message ${classMap({ 'tile--hidden': panel !== 'empty' })}">${i18n('cc-tile-metrics.empty')}</div>

      <cc-error class="tile_message ${classMap({ 'tile--hidden': panel !== 'error' })}">${i18n('cc-tile-metrics.error')}</cc-error>

      <div class="tile_docs ${classMap({ 'tile--hidden': panel !== 'docs' })}">
        <p>
          ${i18n('cc-tile-metrics.docs.msg', { grafanaLink: this.grafanaLink, metricsLink: this.metricsLink })}
        </p>
      </div>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      tileStyles,
      skeletonStyles,
      // language=CSS
      css`
        /* :host { } */
        
        /* TODO: check order */

        /* region header */

        .tile_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .grafana-logo {
          display: block;
          width: 1em;
          height: 1em;
        }

        .docs-toggle,
        .docs-grafana-btn {
          margin: 0 0 0 1rem;
          font-size: 1rem;
        }

        .docs-buttons {
          display: flex;
          align-items: center;
        }

        /* endregion */

        /* region chart */

        .chart-wrapper {
          position: relative;
          /* Change chart height size */
          height: 2em;
        }

        .chart-container {
          position: absolute;
          width: 100%;
          min-width: 0;
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
        }

        /* endregion */

        /* region tile-body */

        .tile_body {
          display: grid;
          align-items: center;
          gap: 1em;
          grid-template-columns: max-content 1fr min-content;
          grid-template-rows: auto auto;
        }

        /*
          body, message and docs are placed in the same area (on top of each other)
          this way, we can just hide the docs
          and let the tile take at least the height of the docs text content
         */

        .tile_body,
        .tile_message,
        .tile_docs {
          grid-area: 2 / 1 / 2 / 1;
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
        
        .current-percentage .skeleton {
          --background-color: #bbb;
        }

        /* endregion */
      `,
    ];
  }

}

window.customElements.define('cc-tile-metrics', CcTileMetrics);
