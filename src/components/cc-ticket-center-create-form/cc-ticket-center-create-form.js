import { css, html, LitElement } from 'lit';
import { iconRemixAddLine } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';

import '../cc-icon/cc-icon.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-select/cc-select.js';

/**
 * A component handling the ticket-center interface for Crisp
 *
 * ## Details
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-addon-admin:delete-addon - Fires when the delete button is clicked.
 * @event {CustomEvent<string>} cc-addon-admin:update-name - Fires the new name of the add-on when update name button is clicked.
 * @event {CustomEvent<string[]>} cc-addon-admin:update-tags - Fires the new list of tags when update tags button is clicked.
 */
export class CcTicketCenterCreate extends LitElement {

  static get properties () {
    return {
      orga: { type: Object },
      user: { type: Object },
      error: { type: String },
      files: { type: Array, state: true },
      _name: { type: String, state: true },
      _skeleton: { type: Boolean, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Organisation|null} Sets the orga details. */
    this.orga = null;

    this.user = null;

    this.files = [];

    /** @type {ErrorType} Sets the error state on the component. */
    this.error = false;

    /** @type {string} */
    this._name = '';

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string[]} */
    this._tags = [];
  }

  _onDismissError () {
    this.error = false;
  }

  willUpdate (changedProperties) {

    if (changedProperties.has('addon')) {
      this._skeleton = (this.addon == null);
      this._name = this._skeleton ? '' : this.addon.name;
      this._tags = this._skeleton ? [] : this.addon.tags;
    }
  }

  _addFile (e) {
    e.target.files.forEach((f) => {
      // TODO: send file, but how do we put the file back?
    });
  }

  _removeFile (id) {
    this.files = this.files.filter((f) => f.id !== id);
  }

  _renderButtons () {
    return html`
      <cc-button primary class="open-ticket">${i18n('cc-ticket-center.button.open-ticket')}</cc-button>
    `;
  }

  _renderUploadForm () {
    return html`
      <div class="files">
        ${this.files.map((f) => html`
        <div class="selected_file" id=${f.id}>
          ${f.file_name}
          <cc-button icon='{"content":"<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 10.586l4.95-4.95 1.415 1.415-4.95 4.95 4.95 4.95-1.415 1.414-4.95-4.95-4.95 4.95-1.413-1.415 4.95-4.95-4.95-4.95L7.05 5.638l4.95 4.95z\"/></svg>"}'
                     hide-text
                     circle
                     @click=${this._removeFile(f.id)}
          >${i18n('cc-ticket-center.button.remove')}</cc-button>
        </div>
        `)}
        <div class="file_upload">
          <label for="fileinput">
            <cc-button outlined .icon=${iconRemixAddLine}>${i18n('cc-ticket-center.button.attach-file')}</cc-button>
          </label>
          <input type="file" id="fileinput" class="fileupload" multiple @change=${this._addFile}>
        </div>
      </div>
    `;
  }

  _categoryOptions () {
    return [
      'emergency',
      'question',
      'invoicing',
      'feedback',
      'troubleshooting',
      'upgrade',
    ].map((value) => ({ value, label: i18n(`cc-ticket-center.category.${value}`) }));
  }

  render () {
    const options = this._categoryOptions();
    console.log(options);
    return html`
    <div class="wrapper">
      <form class="new-ticket-form">
        <cc-select class="input-category"
                   value=""
                   options=${JSON.stringify(options)}
                   label=${i18n('cc-ticket-center.input.category')}
        ></cc-select>
        <cc-input-text class="input-ids" label=${i18n('cc-ticket-center.input.ids')}></cc-input-text>
        <div>
          <label for="message"><span>${i18n('cc-ticket-center.input.message')}</span></label>
          <div class="ta-wrapper">
            <textarea class="input" rows="10" name="message" id="message" required></textarea>
            <div class="ring"></div>
          </div>
        </div>
        ${this._renderUploadForm()}
        <div class="form-buttons">
          ${this._renderButtons()}
        </div>
      </form>
    </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`

        /* This part was stolen from cc-input-text that I can't use as-is.
         * The other way is to update cc-input-text to make the line-height customizable
         */

        /* RESET */

        .input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0;
          border: 1px solid #000;
          margin: 0;
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: none;
          color: inherit;
          font-family: inherit;
          font-size: unset;
          resize: vertical;
        }

        /* BASE */

        .ta-wrapper {
          display: grid;
          position: relative;
          width: 100%;
          /* see input to know why 0.15em */
          padding: 0.15em;
          box-sizing: border-box;
        }

        .input {
          z-index: 2;
          overflow: hidden;
          /* multiline behaviour */
          min-height: 8em;
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          line-height: 1em;
        }

        .input::placeholder {
          font-style: italic;
        }

        textarea:not([wrap]) {
          white-space: pre;
        }

        /* STATES */

        .input:focus,
        .input:active {
          outline: 0;
        }

        .input[disabled] {
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }


        .ring {
          position: absolute;
          z-index: 0;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          background: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
        }
        
        .input.error + .ring {
          border-color: var(--cc-color-border-danger) !important;
        }

        .input:focus + .ring {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
        
        input.error:focus + .ring {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .form-buttons {
          margin-top: .8em;
        }

        form {
          margin-bottom: 1em;
        }

        .new-ticket-form {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1em;
          padding-top: 1em;
        }

        .messages {
          display: flex;
          flex-direction: column;
          justify-content: start;
          gap: 1em;
        }

        .message {
          width: calc(100% - 2em);
          box-sizing: border-box;
          border-radius: 2px;
          padding: .25em 1em;
        }

        .message.msg-in {
          align-self: start;
          border-inline-start: 2px ridge var(--cc-color-bg-success);
          background-color: var(--color-green-10);
          box-shadow: 1px 1px 2px 1px var(--color-green-20);
        }

        .message.msg-out {
          align-self: end;
          border-inline-end: 2px ridge var(--cc-color-border-primary-weak);
          background-color: var(--color-grey-10);
          box-shadow: -1px 1px 2px 1px var(--color-grey-20);
        }

        .message-header, .message-footer {
          font-size: .85em;
          font-style: italic;
          color: var(--cc-color-text-weak);
        }

        .message-footer img {
          font-size: .5em;
          width: 24px;
          height: 24px;
        }

        label {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 0.35em;
          cursor: pointer;
          gap: 2em;
          line-height: 1.25em;
        }

        input[type="file"] {
          display: none;
        }

        .file_upload {
          width: 100%;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          justify-content: center;
          padding: 2em 1em 1.5em 1em;
          align-items: center;
          box-sizing: border-box;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center-create', CcTicketCenterCreate);
