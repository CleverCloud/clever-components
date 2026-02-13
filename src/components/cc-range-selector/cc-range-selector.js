import { css, html, render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixArrowRightDoubleFill as iconArrow } from '../../assets/cc-remix.icons.js';
import { EventHandler } from '../../lib/events.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { RequiredValidator } from '../../lib/form/validation.js';
import { isStringBlank, trimArray } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-range-selector-option/cc-range-selector-option.js';
import { CcSelectEvent } from '../common.events.js';
import { CcRangeSelectEvent, CcRangeSelectorSelectCustomEvent } from './cc-range-selector.events.js';
import { RangeSelectorDraggingController } from './range-selector-dragging-controller.js';

/**
 * @import { RangeSelectorMode, RangeSelectorOption, RangeSelectorSelection, RenderOptionContext } from './cc-range-selector.types.js'
 * @import { GenericEventWithTarget } from '../../lib/events.types.js'
 * @import { Validator, ErrorMessageMap } from '../../lib/form/validation.types.js'
 * @import { FormControlData } from '../../lib/form/form.types.js'
 * @import { PropertyValues } from 'lit'
 * @import { ClassInfo } from 'lit/directives/class-map.js'
 * @import { Ref } from 'lit/directives/ref.js'
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
 * Additionally, on component updates (willUpdate), any disabled options at the start or end
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
 * **Hidden Range Inputs for Keyboard Navigation:**
 * Both modes use hidden `<input type="range">` elements for keyboard navigation.
 * These native inputs require a valid value within their min-max bounds.
 * When no initial selection exists, default indices ensure the inputs are valid
 * and accessible for keyboard interaction.
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
 * @cssprop {Display} --cc-range-selector-trailing-arrow-display - Controls the display of the trailing arrow after the final option, mostly needed when options default layout is overridden to `grid` (defaults: `none`).
 * @cssprop {Width} --cc-range-selector-options-width - Sets the width of the form control content (defaults: `fit-content`).
 * @cssprop {Size} --cc-range-selector-options-indent - Horizontal space between the start of the line and the options (defaults: `0.25em`).
 *
 * @slot help - The help message to be displayed right below the options. Please use a `<p>` tag.
 */
export class CcRangeSelector extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      customA11yDesc: { type: String, attribute: 'custom-a11y-desc' },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      isCustomActive: { type: Boolean, attribute: 'is-custom-active' },
      label: { type: String },
      mode: { type: String, reflect: true },
      options: { type: Array },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      selection: { type: Object },
      showCustom: { type: Boolean, attribute: 'show-custom' },
      value: { type: String },
    };
  }

  static reactiveValidationProperties = ['required', 'options', 'mode'];

  constructor() {
    super();

    /** @type {string} Optional accessibility description appended to the custom option button's title attribute for screen readers (default: null) */
    this.customA11yDesc = null;

    /** @type {boolean} Whether the component should be disabled (default: 'false') */
    this.disabled = false;

    /**
     * @type {boolean} Sets the `<label>` on the left of the options.
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

    /** @type {RangeSelectorSelection | null} The current boundaries of the selector for range mode - stores boundary values (start and end) of the selection. */
    this.selection = null;

    /** @type {Ref<HTMLElement>} */
    this._errorRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._selectorRef = createRef();

    /** @type {RangeSelectorDraggingController} */
    this._dragCtrl = new RangeSelectorDraggingController(this);

    /** @type {ErrorMessageMap} */
    this._errorMessages = {
      empty: () => i18n('cc-range-selector.error.empty'),
    };

    const onOutsideClick = (/** @type {Event} */ event) => {
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
    };
    this._onOutsideClickHandler = new EventHandler(window, 'click', onOutsideClick);
    this._onCcButtonClickHandler = new EventHandler(window, 'cc-click', onOutsideClick);

    this.isCustomActive = false;

    /** @type {string[]} */
    this._optionsInnerText = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onOutsideClickHandler.connect();
    this._onCcButtonClickHandler.connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._onOutsideClickHandler.disconnect();
    this._onCcButtonClickHandler.disconnect();
  }

  /**
   * Validates selection and trims disabled options from the start and end of the selected range.
   * This ensures that the selection doesn't visually include leading or trailing disabled options.
   * @param {PropertyValues<CcRangeSelector>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('options')) {
      this._optionsInnerText = this.options.map(this._getOptionText);
    }

    if (!changedProperties.has('selection') && !changedProperties.has('options')) {
      return;
    }

    if (this.disabled || this.selection == null) {
      return;
    }

    // Validate selection in range mode - this can only happen if set programmatically with invalid values
    if (this._isModeRange()) {
      const indexes = this._getSelectionIndexes();

      if (indexes.start === -1) {
        throw new Error(
          `Invalid selection: startValue "${this.selection.startValue}" not found in options. Available values: ${this.options?.map((o) => o.value).join(', ')}`,
        );
      }
      if (indexes.end === -1) {
        throw new Error(
          `Invalid selection: endValue "${this.selection.endValue}" not found in options. Available values: ${this.options?.map((o) => o.value).join(', ')}`,
        );
      }
      if (indexes.start > indexes.end) {
        throw new Error(
          `Invalid selection: startValue "${this.selection.startValue}" comes after endValue "${this.selection.endValue}" in options array`,
        );
      }
      if (indexes.start === indexes.end) {
        throw new Error(
          `Invalid selection: startValue and endValue are the same ("${this.selection.startValue}"). Use mode="single" with value="${this.selection.startValue}" for single selection`,
        );
      }
    }

    const valuesArray = this._getValuesArray(/* includeDisabled */ true);
    const trimmedArray = trimArray(valuesArray, (/** @type {string} */ value) => {
      return this.options?.find((option) => option.value === value)?.disabled;
    });

    // Only trim if not already clean (prevent loops)
    if (trimmedArray.length !== valuesArray.length) {
      this.selection =
        trimmedArray.length === 0
          ? null
          : {
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
    return this.required ? new RequiredValidator() : null;
  }

  /**
   * Returns the form control data for submission.
   * Note: Return type differs based on mode:
   * - Single mode: returns a string value (this.value)
   * - Range mode: returns FormData with multiple entries under the same name
   * @return {FormControlData} FormData for range mode, string for single mode
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
   * For single mode: converts index to option value, skipping disabled options.
   * For range mode: computes next valid range boundaries when user adjusts start/end via keyboard,
   * handling disabled options and boundary crossings. Only applies if adjustment succeeds.
   * @param {GenericEventWithTarget<InputEvent, HTMLInputElement>} e
   * @private
   */
  _onControlInput(e) {
    if (this.readonly) {
      return;
    }

    this.isCustomActive = false;

    const value = e.target.value;
    if (this._isModeSingle()) {
      // Single mode: convert index to option value, skipping disabled options
      const currentIndex = this._getOptionIndexFromValue(this.value);
      const nextIndex = parseInt(value);

      // Handle first interaction when no value selected
      if (currentIndex === -1) {
        const option = this.options[nextIndex];
        if (option && !option.disabled) {
          this.value = option.value;
          this.dispatchEvent(new CcSelectEvent(this.value));
        }
        return;
      }

      const direction = nextIndex > currentIndex ? 1 : -1;

      // Find next eligible (non-disabled) option
      const eligibleIndex = this._getNextEligibleOptionIndex(currentIndex, direction);
      if (eligibleIndex != null) {
        this.value = this.options[eligibleIndex].value;
        this.dispatchEvent(new CcSelectEvent(this.value));
      }
    } else {
      let currentIndexes = this._getSelectionIndexes();

      // Guard against invalid selection state (use case: when leaving custom mode)
      if (currentIndexes.start === -1 || currentIndexes.end === -1) {
        currentIndexes = { start: null, end: null };
      }

      const nextRange = this._computeNextRange({
        input: e.target.id === 'start-input' ? 'start' : 'end',
        currentIndexes,
        nextIndex: parseInt(value),
      });
      if (nextRange.adjusted) {
        this._applyRangeSelection(nextRange);
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
      this.isCustomActive = false;
    }
  }

  /**
   * Handles mouse up event on the fieldset to finalize range selection when drag ends on non-option elements.
   * This catches cases where the user releases the mouse over arrows or gaps between options,
   * ensuring the selection is applied regardless of where the mouseup occurs within the component.
   * @private
   */
  _onFieldsetMouseUp() {
    if (this._dragCtrl.isDragging() && this._dragCtrl.getSize() > 0) {
      this._applyRangeSelection();
      this.isCustomActive = false;
    }
  }

  /**
   * Handles click on the custom option button.
   * Prevents multiple activations, clears current selection, and dispatches a custom selection event.
   * @param {MouseEvent} e
   * @private
   */
  _onCustomOptionClick(e) {
    if (this.isCustomActive) {
      return;
    }

    e.preventDefault();

    if (this._dragCtrl.isDragging()) {
      this._dragCtrl.stop();
    }

    this.isCustomActive = true;

    const detail = this._isModeSingle() ? this.value : [...this._getValuesArray()];
    this.dispatchEvent(new CcRangeSelectorSelectCustomEvent(detail));

    if (this._isModeSingle()) {
      this.value = null;
    }
    if (this._isModeRange()) {
      this.selection = null;
    }
  }

  /**
   * Handles click on an option.
   * In range mode: prevents default to avoid input event collision.
   * In single mode: updates selection and dispatches event.
   * @param {MouseEvent} e
   * @param {RangeSelectorOption} option
   * @private
   */
  _onOptionClick(e, option) {
    if (this._isModeRange()) {
      e.preventDefault();
    } else if (!this.disabled && !this.readonly && !option.disabled) {
      this.value = option.value;
      this.isCustomActive = false;
      this.dispatchEvent(new CcSelectEvent(this.value));
    }
  }

  /**
   * Calculates selected values from current drag range and dispatches range select event
   * @param {{ start?: number, end?: number }} range
   * @private
   */
  _applyRangeSelection(range = null) {
    const { start = 0, end = 1 } = range ?? this._dragCtrl.getRanges();
    const selectedOptions = this.options.slice(start, end + 1);

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
   * Calculates the next valid range selection boundaries when user adjusts a boundary via keyboard input.
   * Handles disabled options by finding the next eligible option in the direction of adjustment.
   * Automatically recalculates the opposite boundary if the adjusted boundary would cross it,
   * ensuring the selection always maintains start < end constraint.
   *
   * @param {object} params
   * @param {'start'|'end'} params.input - Which boundary is being adjusted
   * @param {{ start: number, end: number }} params.currentIndexes - Current selection boundaries
   * @param {number} params.nextIndex - New index value from range input
   * @returns {{ start: number, end: number, adjusted: boolean }} - New range with adjustment success flag
   */
  _computeNextRange({ input, currentIndexes, nextIndex }) {
    const { start, end } = currentIndexes;
    const isStart = input === 'start';
    const currentBoundaryIndex = isStart ? start : end;
    const adjustmentDirection = nextIndex - currentBoundaryIndex > 0 ? 1 : -1;

    let newStart, newEnd;
    if (isStart) {
      newStart = this._getNextEligibleOptionIndex(currentBoundaryIndex, adjustmentDirection);
      if (newStart != null && newStart >= end) {
        // Start crossed end - push end past the new start position
        newEnd = this._getNextEligibleOptionIndex(newStart, adjustmentDirection);
      } else if (newStart != null) {
        // newStart is valid and < end, keep end unchanged
        newEnd = end;
      } else {
        // No valid start found - return current range
        return { start, end, adjusted: false };
      }
    } else {
      newEnd = this._getNextEligibleOptionIndex(currentBoundaryIndex, adjustmentDirection);
      if (newEnd != null && newEnd <= start) {
        // End crossed start - push start past the new end position
        newStart = this._getNextEligibleOptionIndex(newEnd, adjustmentDirection);
      } else if (newEnd != null) {
        // newEnd is valid and > start, keep start unchanged
        newStart = start;
      } else {
        // No valid end found - return current range
        return { start, end, adjusted: false };
      }
    }

    // Return adjusted range if both boundaries valid
    if (newStart != null && newEnd != null) {
      return { start: newStart, end: newEnd, adjusted: true };
    }

    // Fallback to current range if adjustment failed
    return { start, end, adjusted: false };
  }

  /**
   * Finds the next non-disabled option in a given direction from a starting index.
   * Skips all consecutive disabled options by iterating in the specified direction.
   * Returns the index of the first enabled option found, or null if no valid option exists
   * in that direction (i.e., reached boundary or all remaining options are disabled).
   * @param {number} index - Starting index
   * @param {number} direction - Expects +1 and -1 values
   * @returns {number|null}
   */
  _getNextEligibleOptionIndex(index, direction) {
    let nextOption;
    let nextIndex = index;
    do {
      nextIndex += direction;
      // Check bounds before accessing array
      if (nextIndex < 0 || nextIndex >= this.options.length) {
        return null;
      }
      nextOption = this.options[nextIndex];
    } while (nextOption != null && nextOption.disabled);

    // Loop exits when: nextOption === null (boundary) OR !nextOption.disabled (found enabled)
    return nextOption != null ? nextIndex : null;
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
   * Gets the indexes of the start and end selected options
   * @return {{ start: number, end: number }}
   * @private
   */
  _getSelectionIndexes() {
    return {
      start: this._getOptionIndexFromValue(this.selection?.startValue),
      end: this._getOptionIndexFromValue(this.selection?.endValue),
    };
  }

  /**
   * Derives the full array of selected values from boundary values.
   * Expands the range between startValue and endValue.
   * @param {boolean} [includeDisabled=false] - When true, includes disabled options in the range. When false (default), filters out disabled options.
   * @return {string[]} Array of selected values (enabled only by default, or all if includeDisabled=true), or empty array if no selection
   * @private
   */
  _getValuesArray(includeDisabled = false) {
    if (this.selection == null) {
      return [];
    }

    const { start, end } = this._getSelectionIndexes();
    if (start === -1 || end === -1) {
      return [];
    }

    // Extract options in range
    const selectedOptions = this.options.slice(start, end + 1);
    if (includeDisabled) {
      return selectedOptions.map((option) => option.value);
    }
    return selectedOptions.filter((option) => !option.disabled).map((option) => option.value);
  }

  /**
   * Extracts text content from an option for accessibility purposes.
   * Handles string, Node, and TemplateResult body types.
   * @param {RangeSelectorOption} option
   * @returns {string}
   * @private
   */
  _getOptionText(option) {
    const { body, value } = option;

    // If body is string, return directly
    if (typeof body === 'string') {
      return body;
    }

    // If body is Node, extract textContent
    if (body instanceof Node) {
      return body.textContent || value;
    }

    // If body is TemplateResult, render to temp container and extract text
    if (isTemplateResult(body)) {
      const container = document.createElement('div');
      render(body, container);
      return container.textContent?.trim() || value;
    }

    return value;
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
    if (this.isCustomActive) {
      return false;
    }

    if (this._isModeSingle()) {
      return this.value === value;
    } else if (!this._dragCtrl.isDragging()) {
      // Hide selected state during drag - show only the "dragging" visual state
      const { start, end } = this._getSelectionIndexes();
      const current = this._getOptionIndexFromValue(value);

      // Guard against invalid indices (-1 means not found)
      if (start === -1 || end === -1 || current === -1) {
        return false;
      }

      return start <= current && current <= end;
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
      'is-first': isFirst,
      'is-last': isLast,
      'is-selected': isSelected,
      'is-error': isError,
      'range-continues-right': rangeHasRightContinuation,
      'range-continues-left': rangeHasLeftContinuation,
      'within-selection': withinSelection,
      'arrow-highlighted': shouldHighlightArrow,
      'arrow-highlighted--disabled': isDisabled && !nextOptionSelected,
    };
  }

  /**
   * Renders hidden range inputs for keyboard navigation in range mode.
   * @param {object} params
   * @param {number} params.firstEnabledIndex
   * @param {number} params.lastEnabledIndex
   * @param {number} params.start
   * @param {number} params.end
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderRangeInputs({ firstEnabledIndex, lastEnabledIndex, start, end }) {
    const inputRangeStartIndex = start >= 0 ? start : 0;
    const inputRangeEndIndex = end >= 0 ? end : inputRangeStartIndex + 1;

    return html`
      <label for="start-input" class="visually-hidden">${i18n('cc-range-selector.label.start')}</label>
      <input
        class="visually-hidden"
        id="start-input"
        type="range"
        min="${firstEnabledIndex}"
        max="${lastEnabledIndex - 1}"
        .value="${inputRangeStartIndex}"
        ?disabled=${this.disabled || this.readonly || this.isCustomActive}
        aria-valuetext="${this._optionsInnerText.at(inputRangeStartIndex)}"
        aria-describedby="help-id error-id"
      />

      <label for="end-input" class="visually-hidden">${i18n('cc-range-selector.label.end')}</label>
      <input
        class="visually-hidden"
        id="end-input"
        type="range"
        min="${firstEnabledIndex + 1}"
        max="${lastEnabledIndex}"
        .value="${inputRangeEndIndex}"
        ?disabled=${this.disabled || this.readonly || this.isCustomActive}
        aria-valuetext="${this._optionsInnerText.at(inputRangeEndIndex)}"
        aria-describedby="help-id error-id"
      />
    `;
  }

  /**
   * Renders hidden range input for keyboard navigation in single mode.
   * @param {object} params
   * @param {number} params.firstEnabledIndex
   * @param {number} params.lastEnabledIndex
   * @param {number} params.selectedIndex
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderSingleInput({ firstEnabledIndex, lastEnabledIndex, selectedIndex }) {
    const inputValue = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex;

    return html`
      <label for="single-input" class="visually-hidden">${i18n('cc-range-selector.label.single')}</label>
      <input
        class="visually-hidden"
        id="single-input"
        type="range"
        min="${firstEnabledIndex}"
        max="${lastEnabledIndex}"
        .value="${inputValue}"
        ?disabled=${this.disabled || this.readonly || this.isCustomActive}
        aria-valuetext="${this._optionsInnerText.at(inputValue)}"
        aria-describedby="help-id error-id"
      />
    `;
  }

  /**
   * Renders a visually hidden summary of all options with their selection states for screen readers.
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderVisuallyHiddenSummary() {
    return html`
      <div class="visually-hidden">
        <div>${i18n('cc-range-selector.summary.introduction', this.label)}</div>
        <ul>
          ${this.options.map((option, index) => {
            let status = i18n('cc-range-selector.summary.unselected');
            if (this.disabled || option.disabled) {
              status = i18n('cc-range-selector.summary.disabled');
            } else if (this._isOptionSelected(option.value)) {
              status = i18n('cc-range-selector.summary.selected');
            }
            return html`<li>${this._optionsInnerText.at(index)} (${status})</li>`;
          })}
          ${this.showCustom
            ? html`<li>
                ${i18n('cc-range-selector.custom')}
                (${i18n(
                  this.isCustomActive ? 'cc-range-selector.summary.selected' : 'cc-range-selector.summary.unselected',
                )})
              </li>`
            : ''}
        </ul>
      </div>
    `;
  }

  render() {
    if (this.options?.length === 0) {
      return '';
    }

    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';
    const { start, end } = this._getSelectionIndexes();

    const isModeSingle = this._isModeSingle();
    const isModeRange = this._isModeRange();

    const selectedIndex = this._getOptionIndexFromValue(this.value);
    const firstEnabledIndex = this.options.findIndex((option) => !option.disabled);
    const lastEnabledIndex = this.options.findLastIndex((option) => !option.disabled);

    return html`
      <div
        class="fieldset ${classMap({ 'is-error': hasErrorMessage })}"
        @input=${this._onControlInput}
        @mouseup=${this._onFieldsetMouseUp}
        ${ref(this._selectorRef)}
        role="group"
        aria-labelledby="legend-${this.name}"
        tabindex="-1"
      >
        <div class="fieldset-content">
          <div class="legend" id="legend-${this.name}">
            <span class="legend-text">${this.label}</span>
            ${this.required ? html` <span class="required">${i18n('cc-range-selector.required')}</span> ` : ''}
          </div>

          ${isModeRange
            ? this._renderRangeInputs({
                firstEnabledIndex,
                lastEnabledIndex,
                start,
                end,
              })
            : this._renderSingleInput({
                firstEnabledIndex,
                lastEnabledIndex,
                selectedIndex,
              })}
          ${this._renderVisuallyHiddenSummary()}

          <div class="options" part="options">
            ${this.options.map((option, index) =>
              this._renderOption(option, hasErrorMessage, {
                indexes: {
                  start,
                  current: index,
                  end,
                },
                isModeSingle,
                isModeRange,
                isLastOption: index === this.options.length - 1,
                nextOption: this.options.at(index + 1),
              }),
            )}
            ${this.showCustom ? this._renderCustomOption(hasErrorMessage) : ''}
          </div>

          <div class="help-container" id="help-id">
            <slot name="help"></slot>
          </div>

          ${hasErrorMessage
            ? html`<p class="error-container" id="error-id" ${ref(this._errorRef)}>${this.errorMessage}</p>`
            : ''}
        </div>
      </div>
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
    const { indexes, isModeRange, isLastOption, nextOption } = context;

    // Calculate basic option states
    const isDisabled = this.disabled || disabled;

    // Calculate selection state
    const isFirst = indexes.current === indexes.start;
    const isLast = indexes.current === indexes.end;
    const isSelected = this._isOptionSelected(value);

    // Check if option is within a range selection but not at the boundaries (used for border-radius styling)
    const withinSelection = !this.isCustomActive && indexes.start < indexes.current && indexes.current < indexes.end;

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
      <div class="option-wrapper ${classMap(classes)}" aria-hidden="true">
        <cc-range-selector-option
          ?disabled=${isDisabled}
          ?readonly=${this.readonly}
          ?error=${isError}
          ?selected=${isSelected}
          ?dragging=${!isDisabled && inRangeWhileDragging}
          ?pointer=${hasPointer}
          @click=${(/** @type {MouseEvent} */ e) => this._onOptionClick(e, option)}
          @mousedown=${() => this._onOptionMouseDown(indexes.current, option)}
          @mouseup=${() => this._onOptionMouseUp(indexes.current, option)}
          @mouseenter=${() => this._onOptionMouseEnter(indexes.current, option)}
        >
          <span>${body}</span>
        </cc-range-selector-option>
        <div
          class="arrow-wrapper ${classMap({
            'arrow-visible': isModeRange && !isLastOption,
            'arrow-trailing': isLastOption && !this.showCustom,
          })}"
        >
          <cc-icon class="arrow-icon" .icon=${iconArrow}></cc-icon>
        </div>
      </div>
    `;
  }

  /**
   * Renders the custom option button at the end of the options list.
   * This button allows users to trigger custom selection logic (e.g., opening custom form controls).
   * @param {boolean} isError
   * @return {import('lit').TemplateResult}
   * @private
   */
  _renderCustomOption(isError) {
    const isDisabled = this.disabled;
    const isSelected = this.isCustomActive;
    const inRangeWhileDragging = false;
    const hasPointer = !isDisabled && !this.readonly && !this.isCustomActive;

    const a11yDesc = this.customA11yDesc?.trim() ?? '';
    const title = i18n('cc-range-selector.custom') + (!isStringBlank(a11yDesc) ? ` - ${a11yDesc}` : '');

    return html`
      <div class="option-wrapper">
        <button
          class="btn-custom"
          title="${title}"
          @click=${this._onCustomOptionClick}
          ?disabled=${isDisabled || this.readonly}
        >
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
        <div class="arrow-wrapper arrow-trailing">
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
        .fieldset {
          border: none;
          display: inline-block;
          margin: 0;
          padding: 0;
        }

        .fieldset,
        .fieldset-content {
          width: var(--cc-range-selector-options-width, fit-content);
        }

        .fieldset:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: 0.5em;
        }

        .fieldset.is-error:focus-visible {
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

        .option-wrapper > cc-range-selector-option {
          flex: 1 1 auto;
        }

        .option-wrapper > .arrow-wrapper {
          flex: 0 0 auto;
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

        .arrow-wrapper.arrow-trailing {
          display: var(--cc-range-selector-trailing-arrow-display, none);
        }

        #start-input:focus-visible ~ .options .is-first cc-range-selector-option,
        #end-input:focus-visible ~ .options .is-last cc-range-selector-option,
        #single-input:focus-visible ~ .options .is-selected cc-range-selector-option {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        #single-input:focus-visible ~ .options .is-selected cc-range-selector-option[error] {
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
          user-select: auto;
        }

        .btn-custom:focus-within {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
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
