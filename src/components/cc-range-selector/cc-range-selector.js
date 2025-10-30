import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixArrowRightDoubleFill as iconArrow } from '../../assets/cc-remix.icons.js';
import { EventHandler } from '../../lib/events.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { RequiredValidator, Validation, combineValidators, createValidator } from '../../lib/form/validation.js';
import { trimArray } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-range-selector-option/cc-range-selector-option.js';
import { CcSelectEvent } from '../common.events.js';
import { CcRangeSelectEvent, CcRangeSelectorSelectCustom } from './cc-range-selector.events.js';
import { RangeSelectorDraggingController } from './range-selector-dragging-controller.js';

/**
 * @typedef {import('./cc-range-selector.types.js').RangeSelectorMode} RangeSelectorMode
 * @typedef {import('./cc-range-selector.types.js').RangeSelectorOption} RangeSelectorOption
 * @typedef {import('./cc-range-selector.types.js').RangeSelectorSelection} RangeSelectorSelection
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../lib/form/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('../../lib/form/form.types.js').FormControlData} FormControlData
 * @typedef {import('lit/directives/class-map.js').ClassInfo} ClassInfo
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFieldSetElement>} HTMLFieldSetElementRef
 */

/**
 * @typedef {object} RenderOptionContext
 * @property {{ first: number, current: number, last: number }} indexes - Selection index information
 * @property {boolean} isModeSingle - Whether the selector is in single selection mode
 * @property {boolean} isModeRange - Whether the selector is in range selection mode
 * @property {boolean} isLastOption - Whether this is the last option in the list (used to control arrow visibility)
 * @property {RangeSelectorOption} nextOption - The next option in the list, used to determine arrow highlighting state
 */

/**
 * A range selector component that allows users to select ranges from a list of options.
 *
 * It extends `CcFormControlElement`, so it can be used in a form and its value can be submitted.
 *
 * ## Important Caveats
 *
 * **Disabled Options in Selections:**
 * For visualization purposes, disabled options can appear within a selected range in range mode.
 * However, these disabled options are automatically excluded from form submission and the values array.
 * Additionally, on component initialization (firstUpdated), any disabled options at the start or end
 * of the values array are automatically trimmed to ensure clean selection boundaries.
 *
 * **Range Mode Interaction:**
 * In range mode, the drag interaction uses a clear/preview/apply pattern:
 * - On mousedown: Current selection is cleared and stored for potential rollback
 * - During drag: "dragging" visual state shows preview, "selected" state is hidden
 * - On mouseup: Selection is applied if range is valid (>1 option)
 * - On outside click: Previous selection is restored (rollback)
 *
 * **Single-Click Limitation:**
 * In range mode, clicking a single option without dragging will not create a selection.
 * This is intentional to distinguish between single clicks and drag operations.
 *
 * @cssdisplay inline-block
 *
 * @csspart options - Styles the options container, mainly to modify their layout.
 *
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em`).
 * @cssprop {Size} --cc-form-label-gap-inline - The space between the label and the control when layout is inline (defaults: `0.75em`).
 * @cssprop {Color} --cc-input-label-color - The color for the input's label (defaults: `inherit`).
 * @cssprop {FontSize} --cc-input-label-font-size - The font-size for the input's label (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-input-label-font-weight - The font-weight for the input's label (defaults: `normal`).
 * @cssprop {Width} --cc-range-selector-options-width - Sets the width of the form control content (defaults: `fit-content`).
 * @cssprop {Size} --cc-range-selector-options-indent - horizontal space between the start of the line and the options (defaults: `0.25em`).
 *
 * @slot help - The help message to be displayed right below the options. Please use a `<p>` tag.
 */
export class CcRangeSelector extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      mode: { type: String, reflect: true },
      options: { type: Array },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      selection: { type: Object },
      showCustom: { type: Boolean, attribute: 'show-custom' },
      value: { type: String },
      _isCustomOptionActive: { type: Boolean, state: true },
    };
  }

  static reactiveValidationProperties = ['required', 'options'];

  constructor() {
    super();

    /** @type {boolean} Whether the component should be disabled (default: 'false') */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the options.
     * Only use this if your form contains 1 or 2 fields and your labels are short (default: 'false').
     */
    this.inline = false;

    /** @type {string} The label describing the range selector, displayed before the options (default: '') */
    this.label = '';

    /** @type {RangeSelectorMode} The selection mode: 'single' for single selection or 'range' for range selection (default: 'range') */
    this.mode = 'range';

    /** @type {RangeSelectorOption[]} The list of options */
    this.options = null;

    /** @type {boolean} Whether the component should be readonly when not disabled (default: 'false') */
    this.readonly = false;

    /** @type {boolean} Sets the "required" text inside the label (default: 'false'). */
    this.required = false;

    /** @type {boolean} Shows a custom option button at the end of the options list, allowing users to trigger custom selection logic (default: 'false'). */
    this.showCustom = false;

    /** @type {string} The current value of the selector for single mode. */
    this.value = null;

    /** @type {RangeSelectorSelection | null} The current boudaries of the selector for range mode - stores boundary values (start and end) of the selection. */
    this.selection = null;

    /** @type {HTMLElementRef} */
    this._errorRef = createRef();

    /** @type {HTMLFieldSetElementRef} */
    this._selectorRef = createRef();

    /** @type {RangeSelectorDraggingController} */
    this._dragCtrl = new RangeSelectorDraggingController(this);

    /** @type {ErrorMessageMap} */
    this._errorMessages = {
      empty: () => i18n('cc-range-selector.error.empty'),
      invalidSelection: () => i18n('cc-range-selector.error.invalid-selection'),
    };

    this._onOutsideClickHandler = new EventHandler(window, 'click', (event) => {
      if (!this._dragCtrl.isDragging()) {
        return;
      }

      const contentElement = this._selectorRef.value;
      if (contentElement != null && !event.composedPath().includes(contentElement)) {
        if (this._isModeRange()) {
          this._dragCtrl.stop();
          this.selection = this._dragCtrl.getPreviousSelection();
        }
      }
    });

    this._isCustomOptionActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onOutsideClickHandler.connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._onOutsideClickHandler.disconnect();
  }

  /**
   * Lifecycle method called after the first render.
   * Trims disabled options from the start and end of the selected range.
   * This ensures that the selection doesn't visually include leading or trailing disabled options.
   */
  firstUpdated() {
    if (this.disabled || this.selection == null) {
      return;
    }

    // Get full array, trim it, then convert back to boundary values
    const valuesArray = this._getValuesArray();
    if (valuesArray.length === 0) {
      return;
    }

    const trimmedArray = trimArray(valuesArray, (/** @type {string} */ value) => {
      return this.options?.find((option) => option.value === value)?.disabled;
    });

    if (trimmedArray.length === 0) {
      this.selection = null;
    } else {
      // Update boundary values with trimmed range
      this.selection = {
        startValue: trimmedArray.at(0),
        endValue: trimmedArray.at(-1),
      };
    }
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getFormControlElement() {
    return this._selectorRef.value;
  }

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getErrorElement() {
    return this._errorRef.value;
  }

  /**
   * Returns the name of the property that holds the form control value.
   *
   * @return {string}
   * @protected
   */
  _getValuePropertyName() {
    return this._isModeRange() ? 'selection' : 'value';
  }

  /**
   * @return {ErrorMessageMap}
   * @protected
   */
  _getErrorMessages() {
    return this._errorMessages;
  }

  /**
   * @return {Validator}
   * @protected
   */
  _getValidator() {
    return combineValidators([
      this.required ? new RequiredValidator() : null,
      createValidator(() => {
        const indexes = this._getSelectionIndexes();
        if (!this.required && this.selection == null) {
          return Validation.VALID;
        }
        if (indexes.first == null || indexes.last == null || indexes.first >= indexes.last) {
          return Validation.invalid('invalidSelection');
        }
        return Validation.VALID;
      }),
    ]);
  }

  /**
   * Returns the form control data for submission.
   * Note: Return type differs based on mode:
   * - Single mode: returns a string value (this.value)
   * - Range mode: returns FormData with multiple entries under the same name
   * @return {string|FormControlData} FormData for range mode, string for single mode
   * @protected
   */
  _getFormControlData() {
    if (this._isModeRange()) {
      // Range mode: return FormData with multiple values under the same field name
      // Derive full array from boundary values
      const data = new FormData();
      const valuesArray = this._getValuesArray();
      valuesArray.forEach((value) => {
        data.append(this.name, value);
      });
      return data;
    }
    // Single mode: return string value directly
    return this.value;
  }

  /**
   * @return {Array<string>}
   * @protected
   */
  _getReactiveValidationProperties() {
    return CcRangeSelector.reactiveValidationProperties;
  }

  /* endregion */

  /**
   * Triggers focus on the fieldset element.
   */
  focus() {
    this._selectorRef.value?.focus();
  }

  /**
   * Checks if the selector is in single selection mode
   * @return {boolean}
   * @private
   */
  _isModeSingle() {
    return this.mode === 'single';
  }

  /**
   * Checks if the selector is in range selection mode
   * @return {boolean}
   * @private
   */
  _isModeRange() {
    return this.mode === 'range';
  }

  /**
   * Handles selection via input events (primarily for keyboard interaction).
   * For single mode: directly updates value on each input.
   * For range mode: uses a two-step process requiring two inputs to create a range.
   * @param {HTMLInputElementEvent} e
   * @private
   */
  _onControlInput(e) {
    if (this.readonly) {
      return;
    }

    const value = e.target.value;
    if (this._isModeSingle()) {
      // Single mode: immediate selection on input
      this.value = value;
      this.dispatchEvent(new CcSelectEvent(this.value));
      this._isCustomOptionActive = false;
    } else {
      // Range mode: keyboard interaction requires two inputs to define a range
      const index = this.options.findIndex((option) => option.value === e.target.value);

      if (!this._dragCtrl.isDragging()) {
        // First input: start drag at this index (drag start)
        this._dragCtrl.setPreviousSelection(this.selection);
        this._dragCtrl.start(index);
      } else {
        // Second input: update end index and apply selection (drag end)
        this._dragCtrl.update(index);

        // Only apply if range spans multiple options
        if (this._dragCtrl.getSize() > 0) {
          this._applyRangeSelection();
          this._isCustomOptionActive = false;
        }
      }
    }
  }

  /**
   * Initiates drag selection when mouse is pressed on an option in range mode.
   * This is the first step in the mouse drag interaction flow:
   * 1. MouseDown: Start drag at this index
   * 2. MouseEnter: Update end index as mouse moves
   * 3. MouseUp: Finalize selection
   * @param {number} index
   * @param {RangeSelectorOption} option
   * @private
   */
  _onOptionMouseDown(index, option) {
    // Only handle in range mode, when not already dragging, and when enabled
    if (this._isModeSingle() || this.disabled || option.disabled || this.readonly || this._dragCtrl.isDragging()) {
      return;
    }
    // Store current values for potential rollback (e.g., clicking outside)
    this._dragCtrl.setPreviousSelection(this.selection);

    // Clear current selection to provide immediate visual feedback that a new selection is starting.
    // UX rationale: Setting values to null immediately removes the "selected" visual state,
    // allowing the "dragging" state to be the only visible indicator during the drag operation.
    // This prevents visual confusion between the previous selection and the new drag preview.
    // If the user cancels (clicks outside), the previous values are restored from dragCtrl.
    this.selection = null;

    // Start drag at the clicked index
    this._dragCtrl.start(index);
  }

  /**
   * Updates drag selection as mouse moves over options during an active drag.
   * Continuously updates the end index to expand/contract the selection range.
   * @param {number} index
   * @param {RangeSelectorOption} option
   * @private
   */
  _onOptionMouseEnter(index, option) {
    // Only update if in range mode, drag is active, and option is not disabled
    if (this._isModeSingle() || option.disabled || !this._dragCtrl.isDragging()) {
      return;
    }
    // Update the end index of the drag range
    this._dragCtrl.update(index);
  }

  /**
   * Handles mouse up event to finalize range selection via drag.
   * @param {number} index
   * @param {RangeSelectorOption} option
   * @private
   */
  _onOptionMouseUp(index, option) {
    if (this._isModeSingle() || !this._dragCtrl.isDragging() || this.readonly) {
      return;
    }

    if (!option.disabled) {
      this._dragCtrl.update(index);
    }

    // Only apply selection if range spans multiple options (getSize() > 0)
    // This means clicking a single option without dragging will not trigger selection
    if (this._dragCtrl.getSize() > 0) {
      this._applyRangeSelection();
      this._isCustomOptionActive = false;
    }
  }

  /**
   * Handles click on the custom option button.
   * Prevents multiple activations, clears current selection, and dispatches a custom selection event.
   * @param {MouseEvent} e
   * @private
   */
  _onCustomOptionClick(e) {
    if (this._isCustomOptionActive) {
      return;
    }

    e.preventDefault();

    if (this._dragCtrl.isDragging()) {
      this._dragCtrl.stop();
    }

    this._isCustomOptionActive = true;

    const detail = this._isModeSingle() ? this.value : [...this._getValuesArray()];
    this.dispatchEvent(new CcRangeSelectorSelectCustom(detail));

    this.value = null;
    this.selection = null;
  }

  /**
   * Prevents default click behavior in range mode to avoid input event collision
   * @param {MouseEvent} e
   * @private
   */
  _onOptionClick(e) {
    if (this._isModeRange()) {
      e.preventDefault();
    }
  }

  /**
   * Calculates selected values from current drag range and dispatches range select event
   * @private
   */
  _applyRangeSelection() {
    const rangesIndex = this._dragCtrl.getRanges();
    const selectedOptions = this.options.slice(rangesIndex.start, rangesIndex.end + 1);

    // Filter out disabled options to find actual boundaries
    const enabledOptions = selectedOptions.filter((option) => !option.disabled);

    if (enabledOptions.length > 0) {
      // Store boundary values
      this.selection = {
        startValue: enabledOptions.at(0).value,
        endValue: enabledOptions.at(-1).value,
      };

      // Dispatch event with full array
      this.dispatchEvent(new CcRangeSelectEvent(this._getValuesArray()));
    } else {
      // No enabled options in range
      this.selection = null;
      this.dispatchEvent(new CcRangeSelectEvent([]));
    }

    this._dragCtrl.stop();
  }

  /**
   * Finds the index of an option by its value.
   * @param {string} value - The option value to search for
   * @return {number} The index of the option, or -1 if not found
   * @private
   */
  _getOptionIndexFromValue(value) {
    return this.options?.findIndex((option) => option.value === value);
  }

  /**
   * Gets the indexes of the first and last selected options
   * @return {{ first: number, last: number }}
   * @private
   */
  _getSelectionIndexes() {
    return {
      first: this._getOptionIndexFromValue(this.selection?.startValue),
      last: this._getOptionIndexFromValue(this.selection?.endValue),
    };
  }

  /**
   * Derives the full array of selected values from boundary values.
   * Expands the range between startValue and endValue, filtering out disabled options.
   * @return {string[]} Array of selected values, or empty array if no selection
   * @private
   */
  _getValuesArray() {
    if (this.selection == null) {
      return [];
    }

    const { first, last } = this._getSelectionIndexes();
    if (first === -1 || last === -1) {
      return [];
    }

    // Extract options in range and filter disabled options
    const selectedOptions = this.options.slice(first, last + 1);
    return selectedOptions.filter((option) => !option.disabled).map((option) => option.value);
  }

  /**
   * Determines if an option is currently selected.
   * Caveat: for visualisation purpose, a disabled option can be selected,
   * though it will not be returned on form submission.
   * In range mode, selected state is hidden during active dragging to avoid
   * visual confusion between the previous selection and the current drag preview.
   * @param {string} value - The option value to check
   * @return {boolean}
   * @private
   */
  _isOptionSelected(value) {
    if (this._isModeSingle()) {
      return this.value === value;
    } else if (!this._dragCtrl.isDragging()) {
      // Hide selected state during drag - show only the "dragging" visual state
      const { first, last } = this._getSelectionIndexes();
      const current = this._getOptionIndexFromValue(value);

      // Guard against invalid indices (-1 means not found)
      if (first === -1 || last === -1 || current === -1) {
        return false;
      }

      return first <= current && current <= last;
    }
    return false;
  }

  /**
   * Calculates CSS classes for an option wrapper
   * @param {object} params
   * @param {boolean} params.isSelected - Whether option is selected
   * @param {boolean} params.isDisabled - Whether option is disabled
   * @param {boolean} params.isError - Whether there's a validation error
   * @param {boolean} params.isFirst - Whether this is the first selected option
   * @param {boolean} params.isLast - Whether this is the last selected option
   * @param {boolean} params.withinSelection - Whether option is within a range selection (not at first or last position)
   * @param {boolean} params.nextOptionSelected - Whether the next option in sequence is selected
   * @return {ClassInfo}
   * @private
   */
  _calculateOptionClasses({ isSelected, isDisabled, isError, isFirst, isLast, withinSelection, nextOptionSelected }) {
    if (this._isModeSingle()) {
      return {
        'is-selected': isSelected,
        'is-error': isError,
      };
    }

    // In range mode, selected option continues to another option on the right
    // Used to remove right border radius for continuous visual appearance
    const rangeHasRightContinuation = isSelected && !isLast;

    // In range mode, selected option continues from another option on the left
    // Used to remove left border radius for continuous visual appearance
    const rangeHasLeftContinuation = isSelected && !isFirst;

    // Highlight arrow when showing a selection (not dragging), option is selected
    const shouldHighlightArrow = !this._dragCtrl.isDragging() && !isLast && isSelected;

    return {
      'is-selected': isSelected,
      'is-error': isError,
      'range-continues-right': rangeHasRightContinuation,
      'range-continues-left': rangeHasLeftContinuation,
      'within-selection': withinSelection,
      'arrow-highlighted': shouldHighlightArrow,
      'arrow-highlighted--disabled': isDisabled && !nextOptionSelected,
    };
  }

  render() {
    if (this.options?.length === 0) {
      return '';
    }

    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';
    const { first, last } = this._getSelectionIndexes();

    // Calculate mode constants once for all options
    const isModeSingle = this._isModeSingle();
    const isModeRange = this._isModeRange();

    return html`
      <fieldset
        class="fieldset ${classMap({ 'is-error': hasErrorMessage })}"
        @input=${this._onControlInput}
        ${ref(this._selectorRef)}
        role="${isModeRange ? 'group' : 'radiogroup'}"
        tabindex="-1"
      >
        <div class="fieldset-content">
          <legend class="legend">
            <span class="legend-text">${this.label}</span>
            ${this.required ? html` <span class="required">${i18n('cc-range-selector.required')}</span> ` : ''}
          </legend>

          <div class="options" part="options">
            ${this.options.map((option, index) =>
              this._renderOption(option, hasErrorMessage, {
                indexes: {
                  first,
                  current: index,
                  last,
                },
                isModeSingle,
                isModeRange,
                isLastOption: index === this.options.length - 1,
                nextOption: this.options.at(index + 1),
              }),
            )}
            ${this.showCustom ? this._renderCustomOption() : ''}
          </div>

          <div class="help-container" id="help-id">
            <slot name="help"></slot>
          </div>

          ${hasErrorMessage
            ? html`<p class="error-container" id="error-id" ${ref(this._errorRef)}>${this.errorMessage}</p>`
            : ''}
        </div>
      </fieldset>
    `;
  }

  /**
   * Renders a single option element
   * @param {RangeSelectorOption} option
   * @param {boolean} isError
   * @param {RenderOptionContext} context
   * @return {import('lit').TemplateResult}
   * @private
   */
  _renderOption(option, isError, context) {
    const { body, value, disabled } = option;
    const { indexes, isModeSingle, isModeRange, isLastOption, nextOption } = context;

    // Calculate basic option states
    const id = this.name + '-' + value;
    const isDisabled = this.disabled || disabled;

    // Calculate selection state
    const isFirst = indexes.current === indexes.first;
    const isLast = indexes.current === indexes.last;
    const isSelected = this._isOptionSelected(value);

    // Check if option is within a range selection but not at the boundaries (used for border-radius styling)
    const withinSelection = indexes.first < indexes.current && indexes.current < indexes.last;

    // Check if the next option exists and is selected (used for arrow highlighting logic)
    const nextOptionSelected =
      !this.disabled && nextOption != null && !nextOption.disabled && this._isOptionSelected(nextOption.value);

    // Calculate CSS classes using helper
    const classes = this._calculateOptionClasses({
      isSelected,
      isDisabled,
      isError,
      isFirst,
      isLast,
      withinSelection,
      nextOptionSelected,
    });

    // Calculate additional render states
    const inRangeWhileDragging = isModeRange && this._dragCtrl.isInRange(indexes.current);
    const hasPointer = !isDisabled && !this.readonly && (isModeRange || !isSelected);

    return html`
      <div class="option-wrapper ${classMap(classes)} ">
        <input
          class="hidden-input visually-hidden"
          type="${isModeSingle ? 'radio' : 'checkbox'}"
          id="${id}"
          name="${this.name}"
          .value=${value}
          .checked=${isSelected}
          ?disabled=${isDisabled || (this.readonly && !isSelected)}
          aria-describedby="help-id error-id"
        />
        <label class="option-label" for="${id}">
          <cc-range-selector-option
            ?disabled=${isDisabled}
            ?readonly=${this.readonly}
            ?error=${isError}
            ?selected=${isSelected}
            ?dragging=${!isDisabled && inRangeWhileDragging}
            ?pointer=${hasPointer}
            @click=${this._onOptionClick}
            @mousedown=${() => this._onOptionMouseDown(indexes.current, option)}
            @mouseup=${() => this._onOptionMouseUp(indexes.current, option)}
            @mouseenter=${() => this._onOptionMouseEnter(indexes.current, option)}
          >
            <span>${body}</span>
          </cc-range-selector-option>
        </label>
        <div class="arrow-wrapper ${classMap({ 'arrow-visible': isModeRange && !isLastOption })}">
          <cc-icon class="arrow-icon" .icon=${iconArrow}></cc-icon>
        </div>
      </div>
    `;
  }

  /**
   * Renders the custom option button at the end of the options list.
   * This button allows users to trigger custom selection logic (e.g., opening custom form controls).
   * @return {import('lit').TemplateResult}
   * @private
   */
  _renderCustomOption() {
    const isDisabled = false;
    const isSelected = this._isCustomOptionActive;
    const isError = false;
    const inRangeWhileDragging = false;
    const hasPointer = !this._isCustomOptionActive;

    return html`
      <div class="option-wrapper">
        <button class="btn-custom" @click=${this._onCustomOptionClick}>
          <cc-range-selector-option
            ?disabled=${isDisabled}
            ?readonly=${this.readonly}
            ?error=${isError}
            ?selected=${isSelected}
            ?dragging=${!isDisabled && inRangeWhileDragging}
            ?pointer=${hasPointer}
          >
            <span part="btn-custom">${i18n('cc-range-selector.custom')}</span>
          </cc-range-selector-option>
        </button>
        <div class="arrow-wrapper">
          <cc-icon class="arrow-icon" .icon=${iconArrow}></cc-icon>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */
        :host {
          display: inline-block;
        }
        /* endregion */

        /* region fieldset */
        fieldset {
          border: none;
          display: inline-block;
          margin: 0;
          padding: 0;
        }

        fieldset,
        .fieldset-content {
          width: var(--cc-range-selector-options-width, fit-content);
        }

        fieldset:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: 0.5em;
        }

        fieldset.is-error:focus-visible {
          outline: var(--cc-focus-outline-error);
        }

        button {
          background-color: initial;
          border: none;
          font-size: 1em;
          margin: 0;
          padding: 0;
          text-align: initial;
        }
        /* endregion */

        /* region legend */
        .legend {
          align-items: flex-end;
          cursor: pointer;
          display: flex;
          gap: 2em;
          justify-content: space-between;
          padding-block-end: var(--cc-form-label-gap, 0.35em);
          width: 100%;
        }

        .legend-text {
          color: var(--cc-input-label-color, inherit);
          font-size: var(--cc-input-label-font-size, inherit);
          font-weight: var(--cc-input-label-font-weight, normal);
        }

        .required {
          color: var(--cc-color-text-weak, #404040);
          font-size: 0.9em;
          font-variant: small-caps;
        }
        /* endregion */

        /* region options layout */
        .options {
          display: flex;
          flex-wrap: wrap;
          grid-area: input;
          padding-inline-start: var(--cc-range-selector-options-indent, 0.25em);
          row-gap: 1em;
        }
        /* endregion */

        /* region option */
        .option-wrapper {
          align-items: stretch;
          display: inline-flex;
        }

        .option-wrapper > .option-label {
          flex: 1 1 auto;
        }

        .option-wrapper > .arrow-wrapper {
          flex: 0 0 auto;
        }

        .option-label {
          display: inline-flex;
        }

        .option-label cc-range-selector-option {
          flex: 1 1 auto;
        }

        .arrow-wrapper {
          align-items: center;
          color: var(--cc-color-text-weak, #404040);
          display: inline-flex;
          padding-inline: 0.25em;
          visibility: hidden;
        }

        .arrow-wrapper.arrow-visible {
          visibility: visible;
        }

        .hidden-input:focus-visible + label cc-range-selector-option {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .hidden-input:focus-visible + label cc-range-selector-option[error] {
          outline-color: var(--cc-color-border-danger, #be242d);
        }
        /* endregion */

        /* region option - arrow highlighted */
        .arrow-highlighted .arrow-wrapper {
          background-color: var(--cc-color-bg-primary, #3569aa);
          border-color: var(--cc-color-bg-primary, #3569aa);
          color: var(--cc-color-text-inverted, #fff);
        }

        .arrow-highlighted.is-error .arrow-wrapper {
          background-color: var(--cc-color-bg-danger, #be242d);
          border-color: var(--cc-color-bg-danger, #be242d);
        }

        .arrow-highlighted.arrow-highlighted--disabled .arrow-wrapper {
          background-color: var(--color-grey-60, #737373);
          border-color: var(--color-grey-60, #737373);
        }

        :host([readonly]) .arrow-highlighted .arrow-wrapper {
          background-color: var(--cc-color-bg-primary-weak, #cedcff);
          border-color: var(--cc-color-bg-primary-weak, #cedcff);
          color: var(--cc-color-text-primary-strong, #002c9d);
        }
        /* endregion */

        /* region option - custom button */
        .btn-custom {
          align-items: stretch;
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: inline-flex;
          flex: 1 1 auto;
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .btn-custom:focus-within {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
        }

        .btn-custom cc-range-selector-option {
          flex: 1 1 auto;
        }
        /* endregion */

        /* region option - border-radius managment */
        .option-wrapper.range-continues-right cc-range-selector-option {
          border-end-end-radius: 0;
          border-start-end-radius: 0;
        }

        .option-wrapper.range-continues-left cc-range-selector-option {
          border-end-start-radius: 0;
          border-start-start-radius: 0;
        }

        .within-selection cc-range-selector-option {
          border-radius: 0;
        }
        /* endregion */

        /* region inline layout */
        :host([inline]) .fieldset-content {
          align-items: baseline;
          display: grid;
          gap: 0 var(--cc-form-label-gap-inline, 0.75em);
          grid-auto-rows: min-content;
          grid-template-areas:
            'label input'
            'label help'
            'label error';
          grid-template-columns: auto 1fr;
        }

        :host([inline]) .legend {
          flex-direction: column;
          gap: 0;
          grid-area: label;
          line-height: normal;
          padding: 0;
          width: auto;
        }
        /* endregion */

        /* region help & error messages */
        slot[name='help']::slotted(*) {
          color: var(--cc-color-text-weak, #404040);
          font-size: 0.9em;
          margin: 0.3em 0 0;
        }

        .help-container {
          grid-area: help;
        }

        .error-container {
          color: var(--cc-color-text-danger, #be242d);
          grid-area: error;
          margin: 0.5em 0 0;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-range-selector', CcRangeSelector);
