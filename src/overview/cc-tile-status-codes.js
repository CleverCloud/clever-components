import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { css, html, LitElement } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';
import status from 'statuses';
import { i18n } from '../lib/i18n.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { linkStyles } from '../templates/cc-link.js';

const closeSvg = new URL('../assets/close.svg', import.meta.url).href;
const infoSvg = new URL('../assets/info.svg', import.meta.url).href;

Chart.register(ArcElement, DoughnutController, Legend, Tooltip);

function xor (a, b) {
  return Number(a) ^ Number(b);
}

const COLORS = {
  1: '#bbb',
  2: '#30ab61',
  3: '#365bd3',
  4: '#ff9f40',
  5: '#cf3942',
};

const SKELETON_STATUS_CODES = { 200: 1 };

/**
 * @typedef {import('./types.js').StatusCodesData} StatusCodesData
 */

/**
 * A "tile" component to display HTTP response status codes in a pie chart (donut).
 *
 * ## Details

 * * When `data` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * A short doc is available when the (i) button is clicked.
 *
 * @cssdisplay grid
 */
export class CcTileStatusCodes extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      statusCodes: { type: Object, attribute: 'status-codes' },
      _docs: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {boolean|null} Displays an error message. */
    this.error = null;

    /** @type {StatusCodesData|null} Sets data with the number of requests for each HTTP status code. */
    this.statusCodes = null;

    /** @type {boolean} */
    this._docs = false;

    /** @type {boolean} */
    this._empty = false;

    /** @type {boolean} */
    this._skeleton = false;
  }

  _onToggleDocs () {
    this._docs = !this._docs;
  }

  firstUpdated () {

    this._ctx = this.renderRoot.getElementById('chart');
    this._chart = new Chart(this._ctx, {
      type: 'doughnut',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false,
          },
          legend: {
            onClick: function (e, legendItem) {
              this.chart.data.labels.forEach((label, i) => {
                const sameLabel = (label === legendItem.text);
                if (xor(e.native.shiftKey, sameLabel)) {
                  this.chart.toggleDataVisibility(i);
                }
              });
              this.chart.update();
            },
            onHover: (e) => {
              this._ctx.style.cursor = 'pointer';
            },
            onLeave: (e) => {
              this._ctx.style.cursor = null;
            },
            position: 'right',
            labels: {
              fontFamily: 'monospace',
              usePointStyle: true,
              // Filter legend items so we can only keep 1xx, 2xx... instead of all status codes
              filter: (current, all) => {
                const label = current.text;
                const previousLabel = all.labels[current.index - 1];
                return label !== previousLabel;
              },
            },
          },
          tooltip: {
            backgroundColor: '#000',
            displayColors: false,
            callbacks: {
              // Add official english title of the HTTP status code
              title: ([context]) => {
                const statusCode = this._labels[context.dataIndex];
                return `HTTP ${statusCode}: ${status.message[statusCode]}`;
              },
              // Display number of requests and percentage
              label: (context) => {
                const allData = context.dataset.data;
                const total = allData.reduce((a, b) => a + b, 0);
                const value = allData[context.dataIndex];
                const percent = value / total;
                return i18n('cc-tile-status-codes.tooltip', { value, percent });
              },
            },
          },
        },
        animation: {
          duration: 0,
        },
      },
    });
  }

  // updated and not udpate because we need this._chart before
  updated (changedProperties) {

    if (changedProperties.has('statusCodes')) {

      this._skeleton = (this.statusCodes == null);

      const value = this._skeleton ? SKELETON_STATUS_CODES : this.statusCodes;

      this._empty = Object.keys(value).length === 0;

      // Raw status codes
      this._labels = Object.keys(value);

      // Status codes as categories (2xx, 3xx...)
      this._chartLabels = this._skeleton
        ? this._labels.map(() => '???')
        : this._labels.map((statusCode) => statusCode[0] + 'xx');

      this._data = Object.values(value);

      this._backgroundColor = this._skeleton
        ? this._labels.map(() => '#bbb')
        : this._labels.map((statusCode) => COLORS[statusCode[0]]);

      this.updateComplete.then(() => {
        this._chart.options.animation.duration = this._skeleton ? 0 : 300;
        this._chart.options.plugins.tooltip.enabled = !this._skeleton;
        this._chart.data = {
          labels: this._chartLabels,
          datasets: [{
            data: this._data,
            backgroundColor: this._backgroundColor,
          }],
        };
        this._chart.update();
      });

    }
    super.updated(changedProperties);
  }

  render () {

    const displayChart = (!this.error && !this._empty && !this._docs);
    const displayError = (this.error && !this._docs);
    const displayEmpty = (this._empty && !this._docs);
    const displayDocs = (this._docs);

    return html`
      <div class="tile_title tile_title--image">
        ${i18n('cc-tile-status-codes.title')}
        <cc-button
          class="docs-toggle"
          image=${displayDocs ? closeSvg : infoSvg}
          hide-text
          @cc-button:click=${this._onToggleDocs}
        >${this._docs ? i18n('cc-tile-status-codes.close-btn') : i18n('cc-tile-status-codes.about-btn')}</cc-button>
      </div>

      ${cache(displayChart ? html`
        <div class="tile_body">
          <!-- https://www.chartjs.org/docs/latest/general/responsive.html -->
          <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
            <canvas id="chart"></canvas>
          </div>
        </div>
      ` : '')}

      ${displayEmpty ? html`
        <div class="tile_message">${i18n('cc-tile-status-codes.empty')}</div>
      ` : ''}

      ${displayError ? html`
        <cc-error class="tile_message">${i18n('cc-tile-status-codes.error')}</cc-error>
      ` : ''}

      <div class="tile_docs ${classMap({ 'tile_docs--hidden': !displayDocs })}">
        <p>${i18n('cc-tile-status-codes.docs.msg')}</p>
        <p>${i18n('cc-tile-status-codes.docs.link')}</p>
      </div>
    `;
  }

  static get styles () {
    return [
      tileStyles,
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        .tile_title {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .docs-toggle {
          font-size: 1rem;
          margin: 0 0 0 1rem;
        }

        .tile_body {
          position: relative;
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

        .tile_docs {
          align-self: center;
          font-size: 0.9rem;
          font-style: italic;
        }

        /* See above why we hide instead of display:none */
        .tile_docs.tile_docs--hidden {
          visibility: hidden;
        }

        .tile_docs_link {
          color: #2b96fd;
          text-decoration: underline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-status-codes', CcTileStatusCodes);
