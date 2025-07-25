import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { LitElement, css, html } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import status from 'statuses';
import { iconCleverInfo as iconInfo } from '../../assets/cc-clever.icons.js';
import { iconRemixAlertFill as iconAlert, iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { tileStyles } from '../../styles/info-tiles.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-link/cc-link.js';

Chart.register(ArcElement, DoughnutController, Legend, Tooltip);

/**
 * @param {any} a
 * @param {any} b
 * @returns {BigInt|number}
 */
function xor(a, b) {
  return Number(a) ^ Number(b);
}

// prettier-ignore
// we need keys to be of type `string` to help TypeScript
const COLORS = /** @type {const} */ ({
  "1": '#bbb',
  "2": '#30ab61',
  "3": '#365bd3',
  "4": '#ff9f40',
  "5": '#cf3942',
});

/** @type {StatusCodesData} */
const SKELETON_STATUS_CODES = { 200: 1 };

/**
 * @typedef {import('./cc-tile-status-codes.types.js').TileStatusCodesState} TileStatusCodesState
 * @typedef {import('./cc-tile-status-codes.types.js').StatusCodesData} StatusCodesData
 * @typedef {import('lit').PropertyValues<CcTileStatusCodes>} CcTileStatusCodesChangedProperties
 * @typedef {import('lit/directives/ref.js').Ref<HTMLCanvasElement>} RefCanvas
 */

/**
 * A "tile" component to display HTTP response status codes in a pie chart (donut).
 *
 * ## Details

 * * A short doc is available when the (i) button is clicked.
 *
 * @cssdisplay grid
 */
export class CcTileStatusCodes extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _docs: { type: Boolean, state: true },
      _empty: { type: Boolean, state: true },
      _skeleton: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {TileStatusCodesState} Sets the status codes state. */
    this.state = { type: 'loading' };

    /** @type {boolean} */
    this._docs = false;

    /** @type {boolean} */
    this._empty = false;

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {RefCanvas} */
    this._refCanvas = createRef();
  }

  /**
   * @param {keyof StatusCodesData} statusCode
   * @returns {COLORS[keyof typeof COLORS]}
   */
  _getChartColor(statusCode) {
    const colorKey = /** @type {keyof typeof COLORS} */ (statusCode[0]);
    return COLORS[colorKey];
  }

  _onToggleDocs() {
    this._docs = !this._docs;
  }

  firstUpdated() {
    if (this.state.type === 'error') {
      return;
    }

    this._chart = new Chart(this._refCanvas.value, {
      type: 'doughnut',
      data: null,
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
                const sameLabel = label === legendItem.text;
                // @ts-expect-error shiftKey may be undefined but it won't trigger any issue anyway
                if (xor(e.native.shiftKey, sameLabel)) {
                  this.chart.toggleDataVisibility(i);
                }
              });
              this.chart.update();
            },
            onHover: () => {
              this._refCanvas.value.style.cursor = 'pointer';
            },
            onLeave: () => {
              this._refCanvas.value.style.cursor = null;
            },
            position: 'right',
            labels: {
              font: { family: 'monospace' },
              usePointStyle: true,
              // Filter legend items so we can only keep 1xx, 2xx... instead of all status codes
              filter: (current, all) => {
                const label = current.text;
                // @ts-expect-error FIXME: remove this when we upgrade chartjs (see https://github.com/CleverCloud/clever-components/issues/1056)
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
                const statusMessage = status.message[statusCode];
                return statusMessage != null
                  ? `HTTP ${statusCode}: ${status.message[statusCode]}`
                  : `HTTP ${statusCode}`;
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

  /**
   * updated and not willUpdate because we need this._chart before
   *
   * @param {CcTileStatusCodesChangedProperties} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('state')) {
      if (this.state.type === 'error') {
        return;
      }

      this._skeleton = this.state.type === 'loading';

      const statusCodes = this.state.type === 'loaded' ? this.state.statusCodes : SKELETON_STATUS_CODES;

      this._empty = Object.keys(statusCodes).length === 0;

      // Raw status codes
      this._labels = /** @type {Array<keyof StatusCodesData>} */ (Object.keys(statusCodes));

      // Status codes as categories (2xx, 3xx...)
      this._chartLabels = this._skeleton
        ? this._labels.map(() => '???')
        : this._labels.map((statusCode) => statusCode[0] + 'xx');

      this._data = Object.values(statusCodes);

      this._backgroundColor = this._skeleton ? this._labels.map(() => '#bbb') : this._labels.map(this._getChartColor);

      this.updateComplete.then(() => {
        // @ts-expect-error issue with chartjs itself https://github.com/chartjs/Chart.js/issues/10896
        this._chart.options.animation.duration = this._skeleton ? 0 : 300;
        this._chart.options.plugins.tooltip.enabled = !this._skeleton;
        this._chart.data = {
          labels: this._chartLabels,
          datasets: [
            {
              data: this._data,
              backgroundColor: this._backgroundColor,
            },
          ],
        };
        this._chart.update();
      });
    }
    super.updated(changedProperties);
  }

  render() {
    const error = this.state.type === 'error';
    const displayChart = !error && !this._empty && !this._docs;
    const displayError = error && !this._docs;
    const displayEmpty = this._empty && !this._docs;
    const displayDocs = this._docs;

    return html`
      <div class="tile_title tile_title--image">
        ${i18n('cc-tile-status-codes.title')}
        <cc-button
          class="docs-toggle ${displayDocs ? 'close' : 'info'}"
          .icon=${displayDocs ? iconClose : iconInfo}
          hide-text
          outlined
          primary
          @cc-click=${this._onToggleDocs}
          >${this._docs ? i18n('cc-tile-status-codes.close-btn') : i18n('cc-tile-status-codes.about-btn')}
        </cc-button>
      </div>

      ${cache(
        displayChart
          ? html`
              <div class="tile_body">
                <!-- https://www.chartjs.org/docs/latest/general/responsive.html -->
                <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
                  <canvas id="chart" ${ref(this._refCanvas)}></canvas>
                </div>
              </div>
            `
          : '',
      )}
      ${displayEmpty ? html` <div class="tile_message">${i18n('cc-tile-status-codes.empty')}</div> ` : ''}
      ${displayError
        ? html`
            <div class="tile_message">
              <div class="error-message">
                <cc-icon
                  .icon="${iconAlert}"
                  a11y-name="${i18n('cc-tile-status-codes.error.icon-a11y-name')}"
                  class="icon-warning"
                ></cc-icon>
                <p>${i18n('cc-tile-status-codes.error')}</p>
              </div>
            </div>
          `
        : ''}

      <div class="tile_docs ${classMap({ 'tile_docs--hidden': !displayDocs })}">
        <p>${i18n('cc-tile-status-codes.docs.msg')}</p>
        <p>${i18n('cc-tile-status-codes.docs.link')}</p>
      </div>
    `;
  }

  static get styles() {
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
          font-size: 0.8em;
          margin: 0 0 0 1em;
        }

        .docs-toggle.close {
          --cc-icon-size: 1.5em;
        }

        .docs-toggle.info {
          --cc-icon-size: 1.25em;
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
          font-size: 0.9em;
          font-style: italic;
        }

        /* See above why we hide instead of display:none */

        .tile_docs.tile_docs--hidden {
          visibility: hidden;
        }

        .tile_docs_link {
          color: var(--cc-color-text-highlight);
          text-decoration: underline;
        }

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
      `,
    ];
  }
}

window.customElements.define('cc-tile-status-codes', CcTileStatusCodes);
