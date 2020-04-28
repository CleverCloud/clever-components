import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { assetUrl } from '../lib/asset-url.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';

const closeSvg = assetUrl(import.meta, '../assets/close.svg');
const infoSvg = assetUrl(import.meta, '../assets/info.svg');

const SKELETON_REQUESTS = Array
  .from(new Array(24))
  .map(() => [0, 0, 1]);

/**
 * A "tile" component to display HTTP requests distribution over the last 24 hours in a bar chart.
 *
 * ## Details
 *
 * * When `data` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * A short doc is available when the (i) button is clicked.
 * * `data` MUST be an array of 24 slices of one hour but the display will depend on the width of the component:
 *   * 6 bars of 4 hours
 *   * 8 bars of 3 hours
 *   * 12 bars of 2 hours
 *
 * ## Type definitions
 *
 * An array of 3 values:
 *
 * ```js
 * interface RequestsData [
 *   number, // Start timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
 *   number, // End timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
 *   number, // Number of request during this time window.
 * ]
 * ```
 *
 * @prop {RequestsData[24]} data - Sets the list of 24 time windows of one hour with timestamps and number of requests.
 * @prop {Boolean} error - Displays an error message.
 */
export class CcTileRequests extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      data: { type: Object },
      error: { type: Boolean, reflect: true },
      _skeleton: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _docs: { type: Boolean, attribute: false },
      _barCount: { type: Number, attribute: false },
    };
  }

  constructor () {
    super();
    this.error = 0;
    // Default to lower resolution
    this._barCount = 6;
    this._data = null;
    this._docs = false;
  }

  get data () {
    return this._data;
  }

  set data (newVal) {
    const oldVal = this._data;
    this._data = newVal;
    this._refreshChart();
    this.requestUpdate('data', oldVal);
  }

  /** @protected */
  onResize ({ width }) {
    if (width < 380) {
      this._barCount = 6;
    }
    if (width >= 380 && width < 540) {
      this._barCount = 8;
    }
    if (width >= 540) {
      this._barCount = 12;
    }
    this._refreshChart();
    this.requestUpdate();
  }

  _onToggleDocs () {
    this._docs = !this._docs;
  }

  async _refreshChart () {

    this._skeleton = (this.data == null);

    const data = this._skeleton ? SKELETON_REQUESTS : this.data;

    this._empty = (data.length === 0);

    if (this._empty) {
      return;
    }

    const windowSize = 24 / this._barCount;

    this._groupedData = Array
      .from(new Array(this._barCount))
      .map((_, i) => {
        const fromIndex = i * windowSize;
        const toIndex = (i + 1) * windowSize;
        const fromTs = data[fromIndex][0];
        const toTs = data[toIndex - 1][1];
        const requestCount = data
          .slice(fromIndex, toIndex)
          .map((item) => item[2])
          .reduce((a, b) => a + b, 0);
        return [fromTs, toTs, requestCount];
      });

    this._groupedValues = this._groupedData.map(([a, b, requestCount]) => requestCount);

    this._xLabels = this._skeleton
      ? this._groupedData.map(() => '??')
      : this._groupedData.map(([from], i) => i18n('cc-tile-requests.date-hours', { date: from }));

    const backgroundColor = this._skeleton
      ? '#bbb'
      : '#30ab61';

    await this.updateComplete;

    // * 1.3 helps to let some white space on top of the bar for the label
    // (I didn't found a better yet)
    const maxRequestCount = Math.ceil(Math.max(...this._groupedValues) * 1.3);
    this._chart.options.scales.yAxes[0].ticks.suggestedMax = maxRequestCount;

    this._chart.options.tooltips.enabled = !this._skeleton;

    const totalRequests = this._groupedValues.reduce((a, b) => a + b, 0);
    this._chart.options.title.text = this._skeleton
      ? '...'
      : i18n('cc-tile-requests.requests-nb.total', { totalRequests });

    this._chart.data = {
      labels: this._xLabels,
      datasets: [{
        backgroundColor,
        data: this._groupedValues,
      }],
    };

    // Disable animations when skeleton
    this._chart.options.animation.duration = this._skeleton ? 0 : 300;

    this._chart.update();
    this._chart.resize();
  }

  render () {

    const displayChart = (!this.error && !this._empty && !this._docs);
    const displayError = (this.error && !this._docs);
    const displayEmpty = (this._empty && !this._docs);
    const displayDocs = (this._docs);

    return html`
      <div class="tile_title tile_title--image">
        ${i18n('cc-tile-requests.title')}
        <cc-button
          class="docs-toggle"
          image=${displayDocs ? closeSvg : infoSvg}
          title=${ifDefined(!displayDocs ? i18n('cc-tile-requests.about') : undefined)}
          @cc-button:click=${this._onToggleDocs}
        ></cc-button>
      </div>

      <div class="tile_body ${classMap({ 'tile--hidden': !displayChart })}">
        <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
          <canvas id="chart"></canvas>
        </div>
      </div>
        
      <div class="tile_message ${classMap({ 'tile--hidden': !displayEmpty })}">${i18n('cc-tile-requests.empty')}</div>
    
      <cc-error class="tile_message ${classMap({ 'tile--hidden': !displayError })}">${i18n('cc-tile-requests.error')}</cc-error>
      
      <div class="tile_docs ${classMap({ 'tile--hidden': !displayDocs })}">
        <p>${i18n('cc-tile-requests.docs.msg', { windowHours: 24 / this._barCount })}</p>
      </div>
    `;
  }

  firstUpdated () {
    this._ctx = this.renderRoot.getElementById('chart');
    this._chart = new Chart(this._ctx, {
      plugins: [ChartDataLabels],
      type: 'bar',
      options: {
        // We don't need the responsive mode because we already observe resize to compute bar count
        responsive: false,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'bottom',
          padding: 0,
          fontStyle: 'italic',
        },
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            offset: 0,
            align: 'end',
            formatter: (value, context) => {
              return this._skeleton
                ? '?'
                : i18n('cc-tile-requests.requests-count', { requestCount: value });
            },
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
                drawTicks: false,
              },
              ticks: {
                padding: 10,
                fontSize: 12,
              },
            },
          ],
          yAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        tooltips: {
          backgroundColor: '#000',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, data) => {
              const [from, to] = this._groupedData[tooltipItem[0].index];
              return i18n('cc-tile-requests.date-tooltip', { from, to });
            },
            label: (tooltipItem, data) => {
              const windowHours = (24 / this._barCount);
              return i18n('cc-tile-requests.requests-nb', {
                value: this._groupedValues[tooltipItem.index],
                windowHours,
              });
            },
          },
        },
        animation: {
          duration: 0,
        },
      },
    });
  }

  static get styles () {
    return [
      tileStyles,
      skeletonStyles,
      // language=CSS
      css`
        .tile_title {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .docs-toggle {
          margin: 0 0 0 1rem;
        }

        .chart-container {
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
          min-width: 0;
          position: absolute;
          width: 100%;
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

        .tile_body {
          position: relative;
          min-height: 140px;
        }

        .tile_docs {
          align-self: center;
          font-size: 0.9rem;
          font-style: italic;
        }

        .tile_docs_link {
          color: #2b96fd;
          text-decoration: underline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-requests', CcTileRequests);
