import { css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixAddFill as iconAdd, iconRemixDeleteBinFill as iconDelete } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { RequiredValidator } from '../../lib/form/validation.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLInputElement>} HTMLInputElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('../../lib/form/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../lib/form/form.types.js').FormControlData} FormControlData
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 */

export class CcRedisKeyListEditor extends CcFormControlElement {
  static reactiveValidationProperties = ['required'];

  static get properties() {
    return {
      ...super.properties,
      value: { type: Array },
      resetValue: { type: Array },
      required: { type: Boolean },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {Array<string>} */
    this.value = [];

    /** @type {Array<string>} */
    this.resetValue = [];

    /** @type {boolean} */
    this.required = false;

    /** @type {boolean} */
    this.skeleton = false;

    /** @type {HTMLInputElementRef} */
    this._addInputRef = createRef();
    /** @type {HTMLFormElementRef} */
    this._addFormRef = createRef();
    /** @type {HTMLElementRef} */
    this._errorRef = createRef();

    this._onAddFormSubmit = this._onAddFormSubmit.bind(this);

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      focusBySelector(suggestedElement, '.delete-button', () => {
        this._addInputRef.value.focus();
      });
    });

    /** @type {ErrorMessageMap} */
    this._errorMessages = {
      // todo i18n
      empty: () => {
        return 'oups! empty';
      },
    };
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   */
  _getFormControlElement() {
    return this._addInputRef.value;
  }

  /**
   * @return {HTMLElement}
   */
  _getErrorElement() {
    return this._errorRef.value;
  }

  /**
   * @return {ErrorMessageMap}
   */
  _getErrorMessages() {
    return this._errorMessages;
  }

  /**
   * @return {Validator}
   */
  _getValidator() {
    return this.required ? new RequiredValidator() : null;
  }

  /**
   * @return {FormControlData}
   */
  _getFormControlData() {
    const data = new FormData();
    this.value.forEach((value) => {
      data.append(this.name, value);
    });
    return data;
  }

  /**
   * @return {Array<string>}
   */
  _getReactiveValidationProperties() {
    return CcRedisKeyListEditor.reactiveValidationProperties;
  }

  /* endregion */

  /**
   * @param {FormDataMap & {value: string}} formData
   */
  _onAddFormSubmit(formData) {
    this.value = [...this.value, formData.value];
    this._addFormRef.value.reset();
  }

  /**
   * @param {Event & {target: {dataset: {index: string}}}} e
   */
  _onDeleteButtonClick(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.filter((_, i) => i !== index);
  }

  /**
   * @param {HTMLInputElementEvent & {target: {dataset: {index: string}}}} e
   */
  _onInput(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.map((it, i) => (i === index ? e.target.value : it));
  }

  render() {
    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';

    return html`
      <form ${ref(this._addFormRef)} ${formSubmit(this._onAddFormSubmit)}>
        <cc-input-text ${ref(this._addInputRef)} .skeleton=${this.skeleton} name="value" label="Value"></cc-input-text>
        <cc-button
          type="submit"
          .icon=${iconAdd}
          .skeleton=${this.skeleton}
          hide-text
          a11y-name="Add"
          primary
        ></cc-button>
      </form>

      ${hasErrorMessage
        ? html` <p class="error-container" id="error-id" ${ref(this._errorRef)}>${this.errorMessage}</p>`
        : ''}

      <div class="items">
        ${this.value.map(
          (item, i) =>
            html`<div class="item">
              <cc-input-text .value=${item} data-index=${i} @cc-input-text:input=${this._onInput}></cc-input-text>
              <cc-button
                class="delete-button"
                data-index=${i}
                @cc-button:click=${this._onDeleteButtonClick}
                .icon=${iconDelete}
                hide-text
                a11y-name="Delete"
                danger
                outlined
              ></cc-button>
            </div>`,
        )}
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        form {
          display: flex;
          gap: 0.5em;
        }

        form cc-input-text {
          flex: 1;
        }

        form cc-button {
          margin-top: calc(var(--cc-margin-top-btn-horizontal-form) + 1px);
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
          margin-top: 1em;
        }

        .item {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .item cc-input-text {
          flex: 1;
        }

        .error-container {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-key-list-editor', CcRedisKeyListEditor);
