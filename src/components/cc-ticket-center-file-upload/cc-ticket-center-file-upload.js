import { css, html, LitElement } from 'lit';
import { iconRemixAddLine } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';

import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
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
export class CcTicketCenterFileUpload extends LitElement {

  static get properties () {
    return {
      error: { type: String },
      files: { type: Array, state: true },
      _name: { type: String, state: true },
      _skeleton: { type: Boolean, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Array<File>} List of selected files */
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

  _onChange (evt) {
    this.files = Array.from(evt.target.files);

  }

  _renderFile (f) {
    console.log('Render file');
    if (/^image/.test(f.type)) {
      return html`
        <cc-img a11y-name=${f.name}
                skeleton
                src=${URL.createObjectURL(f)}
        ></cc-img>
      `;
    }
    else {
      return html`
        <cc-img class="text" a11y-name=${f.name}></cc-img>
      `;
    }
  }

  render () {
    console.log('Render');
    return html`
      <div class="files">
        <div class="file_upload">
          <cc-button outlined .icon=${iconRemixAddLine} @cc-button:click=""><label for="fileinput">${i18n('cc-ticket-center.button.attach-file')}</label></cc-button>
          <input type="file" id="fileinput" name="fileinput" multiple @change=${this._onChange}>
        </div>
        <div class="selected_files">
          ${this.files.map(this._renderFile)}
        </div>
      </div>
    `;
  }

  static get styles () {
    return [
      css`

        input[type="file"] {
          display: none
        }

        .files {
          width: 100%;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          padding: 1em 1em 1em 1em;
          box-sizing: border-box;
        }

        .file_upload {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .selected_files {
          display: flex;
          flex-wrap: wrap;
          gap: .5em;
          justify-content: center;
          margin-top: 1em;
        }

        cc-img {
          height: 50px;
          width: 50px;
          border-radius: 5px;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          box-sizing: border-box;
        }

        cc-img.text {
          width: 8em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center-file-upload', CcTicketCenterFileUpload);
