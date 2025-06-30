import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendarScheduleLine as iconOptionCustom,
  iconRemixFlashlightLine as iconOptionLive,
  iconRemixTimeLine as iconOptionPreset,
  iconRemixCheckLine as iconOptionSelected,
  iconRemixArrowDownSLine as iconOptionsToggle,
  iconRemixArrowLeftSLine as iconShiftLeft,
  iconRemixArrowRightSLine as iconShiftRight,
} from '../../assets/cc-remix.icons.js';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import { isLive, isRightDateRangeAfterNow, shiftDateRange } from '../../lib/date/date-range-utils.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { focusFirstFormControlWithError } from '../../lib/form/form-utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-date/cc-input-date.js';
import '../cc-popover/cc-popover.js';
import { CcLogsDateRangeSelectionChangeEvent } from './cc-logs-date-range-selector.events.js';
import { dateRangeSelectionToDateRange } from './date-range-selection.js';

/** @type {Array<LogsDateRangeSelectOption>} */
const OPTIONS = ['live', 'lastHour', 'last4Hours', 'today', 'yesterday', 'last7Days', 'custom'];

/**
 * @typedef {import('./cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('./cc-logs-date-range-selector.types.js').LogsDateRangeSelectOption} LogsDateRangeSelectOption
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../cc-input-date/cc-input-date.js').CcInputDate} CcInputDate
 * @typedef {import('../cc-popover/cc-popover.js').CcPopover} CcPopover
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('../../lib/date/date.types.js').Timezone} Timezone
 * @typedef {import('../../lib/date/date-range.types.js').DateRange} DateRange
 * @typedef {import('lit/directives/ref.js').Ref<CcPopover>} CcPopoverRef
 * @typedef {import('lit/directives/ref.js').Ref<CcInputDate>} CcInputDateRef
 * @typedef {import('lit').PropertyValues<CcLogsDateRangeSelector>} PropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component that allows to select a date range with some quick presets or with a custom date range.
 *
 * @cssdisplay block
 *
 * @beta
 */
export class CcLogsDateRangeSelector extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      timezone: { type: String },
      value: { type: Object },
      _customDateRange: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Sets `disabled` attribute on the underlying `cc-popover` element */
    this.disabled = false;

    /** @type {boolean} Sets `disabled` attribute on the underlying `cc-popover` element and make custom date range form readonly */
    this.readonly = false;

    /** @type {Timezone} The timezone to be used in the custom date range */
    this.timezone = 'UTC';

    /** @type {LogsDateRangeSelection} The date range selection */
    this.value = { type: 'live' };

    /** @type {DateRange} The date range always in sync with the `value` */
    this._currentDateRange = dateRangeSelectionToDateRange(this.value);

    /** @type {DateRange|null} The date range when `custom` option is selected */
    this._customDateRange = null;

    /** @type {LogsDateRangeSelectOption} The option always in sync with the `value` */
    this._selectedOption = this._getOption(this.value);

    /** @type {{until: CcInputDateRef , since: CcInputDateRef}} */
    this._customDateRangeRefs = {
      since: createRef(),
      until: createRef(),
    };

    /** @type {CcPopoverRef} */
    this._optionSelectorRef = createRef();

    // for form submission
    this._onCustomDateRangeFormSubmit = this._onCustomDateRangeFormSubmit.bind(this);
  }

  /* region Public methods */

  /**
   * @return {DateRange}
   */
  getDateRange() {
    return this._currentDateRange;
  }

  /* endregion */

  /* region Private methods */

  /**
   * @param {LogsDateRangeSelection} dateRangeSelection
   * @return {LogsDateRangeSelectOption}
   */
  _getOption(dateRangeSelection) {
    return dateRangeSelection.type === 'preset' ? dateRangeSelection.preset : dateRangeSelection.type;
  }

  /**
   * @param {LogsDateRangeSelectOption} option
   * @return {IconModel}
   */
  _getOptionIcon(option) {
    if (option === 'live') {
      return iconOptionLive;
    }
    if (option === 'custom') {
      return iconOptionCustom;
    }
    return iconOptionPreset;
  }

  /**
   * @param {LogsDateRangeSelection} dateRangeSelection
   */
  _applyDateRange(dateRangeSelection) {
    this.value = dateRangeSelection;
    this._currentDateRange = dateRangeSelectionToDateRange(this.value);
    this.dispatchEvent(
      new CcLogsDateRangeSelectionChangeEvent({ selection: this.value, range: this._currentDateRange }),
    );
  }

  /* endregion */

  /* region Event handlers */

  /**
   * @param {Event & {target: {dataset: {option: LogsDateRangeSelectOption}}}} event
   */
  _onOptionChange(event) {
    /** @type {LogsDateRangeSelectOption} */
    const option = event.target.dataset.option;

    if (option === this._selectedOption) {
      this._optionSelectorRef.value.close();
      return;
    }

    this._selectedOption = option;

    if (this._selectedOption === 'custom') {
      this._customDateRange = {
        since: this._currentDateRange.since,
        until: isLive(this._currentDateRange) ? new Date().toISOString() : this._currentDateRange.until,
      };
    } else if (this._selectedOption === 'live') {
      this._optionSelectorRef.value.close();
      this._applyDateRange({ type: 'live' });
    } else {
      this._optionSelectorRef.value.close();
      this._applyDateRange({ type: 'preset', preset: this._selectedOption });
    }
  }

  /**
   * @param {FormDataMap} formData
   */
  _onCustomDateRangeFormSubmit(formData) {
    this._optionSelectorRef.value.close();
    this._applyDateRange({
      type: 'custom',
      since: /** @type {string} */ (formData.since),
      until: /** @type {string} */ (formData.until),
    });
  }

  /**
   * @param {CcInputEvent} event
   */
  _onCustomSinceInput(event) {
    this._customDateRange = {
      since: event.detail,
      until: this._customDateRange.until,
    };
  }

  /**
   * @param {CcInputEvent} event
   */
  _onCustomUntilInput(event) {
    this._customDateRange = {
      since: this._customDateRange.since,
      until: event.detail,
    };
  }

  /**
   * @param {Event & {target: {dataset: {direction: 'left'|'right'}}}} event
   */
  _onCustomDateRangeShift(event) {
    const valid =
      this._customDateRangeRefs.since.value.reportInlineValidity() &&
      this._customDateRangeRefs.until.value.reportInlineValidity();

    if (valid) {
      this._customDateRange = shiftDateRange(this._customDateRange, event.target.dataset.direction);
    } else {
      focusFirstFormControlWithError(this._customDateRangeRefs.since.value.form);
    }
  }

  /* endregion */

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('value')) {
      this._selectedOption = this._getOption(this.value);
      if (this.value.type === 'custom') {
        this._customDateRange = { since: this.value.since, until: this.value.until };
      } else {
        this._customDateRange = null;
      }
      this._currentDateRange = dateRangeSelectionToDateRange(this.value);
    }
  }

  render() {
    const currentOptions = this._getOption(this.value);

    return html`
      <div class="wrapper">
        <cc-popover
          ${ref(this._optionSelectorRef)}
          .icon=${this._getOptionIcon(currentOptions)}
          class="options-popover"
          ?disabled=${this.disabled || this.readonly}
        >
          <div slot="button-content" class="options-popover-trigger">
            <div>${this._renderOptionLabel(currentOptions, true)}</div>
            <cc-icon .icon=${iconOptionsToggle}></cc-icon>
          </div>
          <div class="options-popover-content">
            <div class="options-popover-content--left">
              ${OPTIONS.map((option) => {
                const isSelected = option === this._selectedOption;

                return html`
                  <button
                    class="option-button"
                    data-option="${option}"
                    data-selected="${isSelected}"
                    @click=${this._onOptionChange}
                  >
                    <cc-icon .icon=${this._getOptionIcon(option)} data-option="${option}"></cc-icon>
                    <span data-option="${option}">${this._renderOptionLabel(option, false)}</span>
                    ${isSelected
                      ? html`<cc-icon
                          class="option-button-current"
                          .icon=${iconOptionSelected}
                          data-option="${option}"
                        ></cc-icon>`
                      : ''}
                  </button>
                `;
              })}
            </div>
            ${this._selectedOption === 'custom'
              ? html`<div class="options-popover-content--right">${this._renderCustomDateRange()}</div>`
              : ''}
          </div>
        </cc-popover>
      </div>
    `;
  }

  _renderCustomDateRange() {
    if (this._customDateRange == null) {
      return null;
    }

    const nextDisabled = isRightDateRangeAfterNow(this._customDateRange);

    return html`
      <form class="custom-date-range" ${formSubmit(this._onCustomDateRangeFormSubmit)}>
        <cc-input-date
          ${ref(this._customDateRangeRefs.since)}
          label=${this.timezone === 'UTC'
            ? i18n('cc-logs-date-range-selector.custom-date-range.since.utc')
            : i18n('cc-logs-date-range-selector.custom-date-range.since.local')}
          name="since"
          required
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          timezone=${this.timezone}
          .max=${this._customDateRange.until}
          .value=${this._customDateRange.since}
          @cc-input=${this._onCustomSinceInput}
        ></cc-input-date>
        <cc-input-date
          ${ref(this._customDateRangeRefs.until)}
          label=${this.timezone === 'UTC'
            ? i18n('cc-logs-date-range-selector.custom-date-range.until.utc')
            : i18n('cc-logs-date-range-selector.custom-date-range.until.local')}
          name="until"
          required
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          timezone=${this.timezone}
          .min=${this._customDateRange.since}
          .value=${this._customDateRange.until}
          @cc-input=${this._onCustomUntilInput}
        ></cc-input-date>
        <div class="custom-date-range-buttons">
          <cc-button
            .icon=${iconShiftLeft}
            hide-text
            a11y-name=${i18n('cc-logs-date-range-selector.custom-date-range.previous')}
            data-direction="left"
            ?disabled=${this.readonly || this.disabled}
            @cc-click=${this._onCustomDateRangeShift}
          >
          </cc-button>
          <cc-button
            .icon=${iconShiftRight}
            hide-text
            a11y-name=${i18n('cc-logs-date-range-selector.custom-date-range.next')}
            data-direction="right"
            ?disabled=${this.readonly || this.disabled || nextDisabled}
            @cc-click=${this._onCustomDateRangeShift}
          >
          </cc-button>
          <cc-button type="submit" ?disabled=${this.readonly || this.disabled} primary>
            ${i18n('cc-logs-date-range-selector.custom-date-range.apply')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /**
   * @param {LogsDateRangeSelectOption} option
   * @param {boolean} withDate
   * @return {string|TemplateResult}
   */
  _renderOptionLabel(option, withDate) {
    switch (option) {
      case 'live':
        return i18n('cc-logs-date-range-selector.option.live');
      case 'lastHour':
        return i18n('cc-logs-date-range-selector.option.last-hour');
      case 'last4Hours':
        return i18n('cc-logs-date-range-selector.option.last-4-hours');
      case 'last7Days':
        return i18n('cc-logs-date-range-selector.option.last-7-days');
      case 'today':
        return i18n('cc-logs-date-range-selector.option.today');
      case 'yesterday':
        return i18n('cc-logs-date-range-selector.option.yesterday');
      case 'custom': {
        if (withDate) {
          const formatter = new DateFormatter('datetime-short', this.timezone);
          const since = formatter.format(new Date(this._currentDateRange.since));
          const until = formatter.format(new Date(this._currentDateRange.until));
          const dateRange = `[${since} - ${until}]`;

          return html`
            <div class="options-popover-trigger--with-detail">
              <span>${i18n('cc-logs-date-range-selector.option.custom')}</span>
              <span class="date-range">${dateRange}</span>
            </div>
          `;
        }

        return i18n('cc-logs-date-range-selector.option.custom');
      }
    }
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          height: 100%;
        }

        .options-popover {
          --cc-popover-trigger-button-font-weight: normal;
          --cc-popover-trigger-button-text-transform: none;
          --cc-popover-padding: 0;
        }

        .options-popover-trigger {
          align-items: center;
          display: flex;
          font-size: 1.2em;
          gap: 1em;
        }

        .options-popover-trigger div {
          display: flex;
          flex: 1;
          justify-content: start;
        }

        .options-popover-trigger cc-icon {
          transition: transform 0.2s;
        }

        .options-popover[is-open] .options-popover-trigger cc-icon {
          transform: rotate(180deg);
        }

        .options-popover-trigger--with-detail {
          align-items: center;
          display: flex;
          gap: 0.25em;
        }

        .date-range {
          color: var(--cc-color-text-weak, #000);
          font-size: 0.75em;
        }

        .options-popover-content {
          display: flex;
        }

        .options-popover-content--left {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }

        .options-popover-content--right {
          align-items: center;
          border-left: 1px solid var(--cc-color-border-neutral, #000);
          display: flex;
          margin-left: 1em;
          padding: 1em;
        }

        .option-button {
          align-items: start;
          background: unset;
          border: none;
          cursor: pointer;
          display: grid;
          font-family: inherit;
          font-size: unset;
          gap: 0.5em;
          grid-template-columns: auto 1fr auto;
          justify-items: start;
          margin: 0;
          padding: 0.5em;
          white-space: nowrap;
        }

        .option-button:focus {
          border-radius: var(--cc-border-radius-small, 0.15em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          z-index: 3;
        }

        .option-button:hover,
        .option-button[data-selected='true'] {
          background-color: var(--cc-color-bg-neutral);
        }

        .option-button[data-selected='false'] {
          padding-right: 1.5em;
        }

        .option-button-current {
          margin-left: 1em;
        }

        .custom-date-range {
          display: flex;
          flex-direction: column;
          gap: 0.75em;
          min-width: max-content;
        }

        .custom-date-range-buttons {
          align-items: center;
          display: grid;
          grid-gap: 0.5em;
          grid-template-columns: auto auto 1fr;
          justify-items: end;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-date-range-selector-beta', CcLogsDateRangeSelector);
