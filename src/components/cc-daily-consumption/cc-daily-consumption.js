import { BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixFundsLine as iconDaily,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-toggle/cc-toggle.js';

Chart.register(BarController, LineController, LineElement, BarElement, PointElement, Tooltip, CategoryScale, LinearScale, Title);

const BREAKPOINT = 600;
/**
 * TODO: prepare preview with different charts
 */

/**
 * @typedef {import('./cc-daily-consumption.types.js').OneDayOfConsumption} OneDayOfConsumption
 * @typedef {import('../common.types.js').ConsumptionCurrency} Currency
 * @typedef {import('lit/directives/ref.js').Ref<HTMLCanvasElement>} RefCanvas
 */

/**
 * A component drawing a chart to highlight daily consumption data.
 *
 * @cssdisplay block
 */
export class CcDailyConsumption extends LitElement {
  static get properties () {
    return {
      currency: { type: String },
      dailyConsumption: { attribute: false },
      digits: { type: Number },
      endDate: { attribute: false },
      skeleton: { type: Boolean },
      startDate: { attribute: false },
      _displayMode: { type: String, state: true },
      _widthGtBreakpoint: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Currency} - Sets the currency */
    this.currency = 'EUR';

    /** @type {OneDayOfConsumption[]|null} - Sets the daily consumption data */
    this.dailyConsumption = null;

    /** @type {number} Sets the number of digits to display */
    this.digits = 2;

    /** @type {Date|null} Sets the end date */
    this.endDate = null;

    /** @type {boolean} Sets the component in skeleton mode */
    this.skeleton = false;

    /** @type {Date|null} Sets the start date */
    this.startDate = null;

    /** @type {Chart|null} Sets the chart instance to be manipulated */
    this._chart = null;

    /** @type {RefCanvas} References the `<canvas>` element that draws the chart */
    this._chartRef = createRef();

    /** @type {'chart'|'table'} ... */
    this._displayMode = 'chart';

    /** @type {boolean}
     * Used to toggle between the display of all dates within the month or dates until the last day of consumption within the chart.
     * This allows to only trigger data reformating when needed, as if we were using a media query.
     * See the `resizeController` callback below and the `updated` lifecycle hook for more info.
     */
    this._widthGtBreakpoint = false;

    this._resizeController = new ResizeController(this, {
      callback: async (width) => {
        this._widthGtBreakpoint = width > BREAKPOINT;
        this._chart?.resize();
      },
    });
  }

  /**
   * @param {HTMLCanvasElement} chartElement
   * @returns {Chart} the chartJS instance
   */
  _createChart (chartElement) {

    return new Chart(chartElement, {
      type: 'bar',
      data: {
        datasets: [],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return i18n('cc-daily-consumption.price', {
                  price: Number(context.raw),
                  currency: this.currency,
                  digits: 0,
                });
              },
              title: ([context]) => {
                const year = new Date(this.startDate).getFullYear();
                const month = new Date(this.startDate).getMonth();
                const day = Number(context.label);

                return i18n('cc-daily-consumption.long-date', new Date(year, month, day));
              },
            },
          },
        },
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
            },
            grid: {
              display: true,
            },
            ticks: {
              display: true,
              callback: (price) => i18n('cc-daily-consumption.price', { price, currency: this.currency, digits: 0 }),
            },
          },
          x: {
            beginAtZero: false,
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: i18n('cc-daily-consumption.legend.x-axis', { date: this.startDate }),
            },
          },
        },
      },
    });
  }

  /**
   * @param {OneDayOfConsumption[]} chartData
   * @returns {import('chart.js').ChartData} the chart data
   */
  _formatChartData (chartData) {
    const labels = [];
    const values = [];
    const lastConsumptionData = this.dailyConsumption.slice(-1)[0];
    const lastConsumptionDayAsNumber = lastConsumptionData.date.getDate();
    const lastPeriodDayAsNumber = new Date(this.endDate).getDate();

    // if we have enough space, display all days till the end of the period with 0 as value when there is no data,
    // if we don't have enough space, display days till the last day with consumption data
    const lastDayToDisplayAsNumber = this._widthGtBreakpoint ? lastPeriodDayAsNumber : lastConsumptionDayAsNumber;

    for (let i = 0; i < lastDayToDisplayAsNumber; i++) {
      labels.push(chartData[i]?.date?.getDate() ?? i + 1);
      values.push(chartData[i]?.value ?? 0);
    }

    return {
      labels,
      datasets: [
        {
          data: values,
          barPercentage: 0.6,
          backgroundColor: [
            this.skeleton ? '#bbb' : '#355EEF',
          ],
          fill: false,
          borderColor: this.skeleton ? '#bbb' : '#355EEF',
          tension: 0.1,
        },
      ],
    };
  }

  _onDisplayModeChange ({ detail: value }) {
    this._displayMode = value;
  }

  firstUpdated () {
    this._chart = this._createChart(this._chartRef.value);
  }

  /** @param {Map} changedProperties */
  updated (changedProperties) {
    if (changedProperties.has('_displayMode') || this.dailyConsumption == null || this.dailyConsumption.length === 0) {
      return;
    }

    this._chart.data = this._formatChartData(this.dailyConsumption);
    // disable tooltips in skeleton mode
    this._chart.options.plugins.tooltip.enabled = !this.skeleton;
    this._chart.update();
    this._chart?.resize();
  }

  render () {
    const skeleton = this.skeleton;
    const toggleOptions = [{
      label: i18n('cc-daily-consumption.a11y-toggle.chart'),
      value: 'chart',
    },
    {
      label: i18n('cc-daily-consumption.a11y-toggle.table'),
      value: 'table',
    }];

    const isEmpty = this.dailyConsumption == null || this.dailyConsumption.length === 0;
    return html`
      <cc-block>
        <div slot="title">
          <div class="heading">
            <cc-icon .icon=${iconDaily} class=${classMap({ skeleton })}></cc-icon>
            <span class=${classMap({ skeleton })}>${i18n('cc-daily-consumption.heading')}</span>
          </div>
          <!-- TODO: hidden legend? => cc-toggle does not support that -->
          <!-- TODO: skeleton? => cc-toggle does not support that -->
          <cc-toggle 
            legend=${i18n('cc-daily-consumption.display-mode.legend')}
            inline
            .choices=${toggleOptions}
            value=${this._displayMode}
            @cc-toggle:input=${this._onDisplayModeChange}
            ?disabled=${skeleton || isEmpty}
          ></cc-toggle>
        </div>
        <div class="daily-consumption-chart">
          <div class="chart-wrapper ${classMap({ empty: isEmpty })}" ?hidden=${this._displayMode !== 'chart'}>
            <canvas ${ref(this._chartRef)} class=${classMap({ skeleton })} aria-hidden="true"></canvas>
            ${isEmpty ? html`
              <p class="empty-message">${i18n('cc-daily-consumption.empty')}</p>
            ` : ''}
          </div>
          <table ?hidden=${this._displayMode !== 'table'}>
            <caption class="visually-hidden">${i18n('cc-daily-consumption.a11y-table-caption')}</caption>
            <tbody>
              ${!isEmpty && this.dailyConsumption.map(({ date, value }) => html`
                <tr>
                  <th scope="row">${i18n('cc-daily-consumption.long-date', date)}</th>
                  <td>
                    ${i18n('cc-daily-consumption.price', {
                      price: value,
                      currency: this.currency,
                      digits: this.digits,
                    })}
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <div class="daily-description ${classMap({ skeleton })}">${i18n('cc-daily-consumption.desc')}</div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      accessibilityStyles,
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        div[slot='title'] {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1em;
        }

        .heading {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        div[slot='title'] cc-toggle {
          font-size: 0.8em;
        }

        /* region desc */

        p {
          margin: 0;
        }

        ul {
          margin: 0.5em;
        }

        /* endregion */

        /* region chart */

        .daily-consumption-chart {
          position: relative;
          width: 100%;
          min-height: 200px;
        }

        .empty-message {
          position: absolute;
          top: 40%;
          left: 50%;
          font-style: italic;
          transform: translate(-50%, -50%);
        }

        .chart-wrapper {
          position: absolute;
          width: 100%;
          min-width: 0;
          height: 100%;
          margin: auto;
        }

        .chart-wrapper.empty canvas {
          filter: blur(3px);
        }

        .daily-description {
          line-height: 1.4;
        }

        /* endregion */

        /* region table */

        table {
          overflow: hidden;
          width: 100%;
          border-collapse: collapse;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        th[scope='row'] {
          width: 13em;
        }
            
        th,
        td {
          padding: 1em;
          text-align: left;
        }

        th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
        }

        td {
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-normal);
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
        }

        /* applied on th and td */

        .number {
          text-align: right;
        }

        .cell-content-center {
          font-style: italic;
          text-align: center;
        }

        tr:hover td {
          background-color: var(--cc-color-bg-neutral-hovered, #f9f9f9);
        }

        /* endregion */

        .skeleton:not(canvas),
        .skeleton:not(canvas) * {
          background-color: #bbb !important;
          color: transparent !important;
        }
      `,
    ];
  }
}

window.customElements.define('cc-daily-consumption', CcDailyConsumption);
