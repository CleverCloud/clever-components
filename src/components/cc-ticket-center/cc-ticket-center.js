import '../cc-button/cc-button.js';
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').Addon} Addon
 */

export class CcTicketCenter extends LitElement {

  static get properties () {
    return {
      orga: { type: Object },
      userEmail: { type: String },
      tickets: { type: Array },
      currentTicket: { type: Object },
      participantsEmails: { type: Array },
      error: { type: String },
      _name: { type: String, state: true },
      _skeleton: { type: Boolean, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Organisation|null} Sets the orga details. */
    this.orga = null;

    this.tickets = [];

    this.currentTicket = null;

    this.participantsEmails = null;

    /** @type {ErrorType} Sets the error state on the component. */
    this.error = false;

    /** @type {boolean} Enables the saving state (form is disabled and blurred). */
    this.saving = false;

    /** @type {string} */
    this._name = '';

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string[]} */
    this._tags = [];
  }

  _onNameInput ({ detail: name }) {
    this._name = name;
  }

  _onNameSubmit () {
    dispatchCustomEvent(this, 'update-name', { name: this._name });
  }

  _onTagsInput ({ detail: tags }) {
    this._tags = tags;
  }

  _onTagsSubmit () {
    dispatchCustomEvent(this, 'update-tags', { tags: this._tags });
  }

  _onDeleteSubmit () {
    dispatchCustomEvent(this, 'delete-addon');
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

  render () {
    if (this.currentTicket != null) {
      return html`<cc-ticket-center-edit
        orga=${this.orga}
        user=${this.user}
        ticket=${this.currentTicket}
        messages=${this.messages}
      >
      </cc-ticket-center-edit>`;
    }
    else {
      return this.renderTicketsList();
    }
  }

  static get styles () {
    return [
      // language=CSS
      css`
.field-select {
  position: relative;
}

.field-select select,
.field-select::after {
  cursor: pointer;
}

.field-select select {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding-right: 36px;
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
  display: block;
}

.field-select select::-ms-expand {
  display: none;
}

.field-select select:focus {
  outline: none;
}

.field-select select option {
  font-weight: normal;
}

.field-select::after {
  content: "";
  background-image: url('../../images/tickets/field-select-arrow.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 11px;
  height: 7px;
  position: absolute;
  top: 50%;
  right: 21px;
  transform: translateY(-50%);
  opacity: 0.35;
  z-index: 1;
  transition: opacity 100ms linear;
}

.field-select:hover::after {
  opacity: 0.6;
}

.field-attach {
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding: 8px 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1px;
}

.field-attach .file-list {
  font-size: 13.5px;
  line-height: 22px;
  margin-right: 12px;
  overflow: hidden;
  flex: 1;
  display: none;
}

.field-attach[data-has-files="true"] .file-list {
  display: block;
}

.field-attach .file-list li {
  list-style-type: none;
  align-items: center;
  display: flex;
}

.field-attach .file-list .file-name {
  color: #000000;
  text-decoration: underline;
  flex: 0 1 auto;
}

.field-attach .file-list .file-delete,
.field-attach .file-list li[data-uploading="true"]:after {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 7px;
  margin-bottom: -1px;
  flex: 0 0 auto;
}

.field-attach .file-list .file-delete {
  background-image: url('../../images/tickets/file-delete.svg');
  width: 13px;
  height: 13px;
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 100ms linear;
}

.field-attach .file-list .file-delete:hover {
  opacity: 0.85;
}

.field-attach .file-list .file-delete:active {
  opacity: 1;
}

.field-attach .file-list li[data-uploading="true"] .file-name {
  text-decoration: none;
  pointer-events: none;
}

.field-attach .file-list li[data-uploading="true"] .file-delete {
  display: none;
}

.field-attach .file-list li[data-uploading="true"]:after {
  content: "";
  border: 2px solid #cccccc;
  border-top-color: #000000;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 50%;
  animation: file-list-uploading-spinner 900ms ease-in-out infinite;
}

.field-attach .file-button {
  padding: 12px 0;
  flex: 0 0 auto;
  display: inline-block;
  transition: opacity 100ms linear;
}

.field-attach[data-has-button="false"] .file-button {
  pointer-events: none;
  opacity: 0.4;
}

.field-attach .file-button .button {
  margin: 0;
}

.field-attach .file-button input[type="file"] {
  display: none;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 0 auto;
}

.title-action {
  display: flex;
  align-items: center;
  flex: 1;
}

.title-action h1 {
  text-align: left;
}

.title-action .button {
  margin-right: 16px;
}

.title-action .button.button--icon.button--icon-lone {
  padding: 13px 12px;
}

.title {
  color: #000000;
  font-size: 28px;
  line-height: 30px;
  letter-spacing: -0.8px;
  flex: 1;
}

.see-all-tickets {
  font-size: 15.5px;
  letter-spacing: -0.25px;
  text-decoration: underline;
  margin-left: 12px;
  flex: 0 0 auto;
}

.refresh-data {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: -0.41px;
  flex: 0 0 auto;
}

.refresh-data svg {
  fill: rgba(0, 0, 0, 0.6);
  margin-right: 1px;
}

.refresh-data:hover {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.85);
}

.refresh-data:hover svg {
  fill: rgba(0, 0, 0, 0.85);
}

.banner {
  color: #FFFFFF;
  font-size: 14.5px;
  letter-spacing: -0.20px;
  text-align: center;
  line-height: 18px;
  padding: 15px 18px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  border-radius: 2px;
}

.banner::before {
  content: "";
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  margin-top: -3px;
  opacity: 0.4;
  display: inline-block;
}

.banner.banner--info {
  background-color: #3F536E;
}

.banner.banner--info::before {
  background-image: url('../../images/tickets/banner-info-icon.svg');
}

.banner.banner--warn {
  background-color: #D75F06;
}

.banner.banner--warn::before {
  background-image: url('../../images/tickets/banner-warn-icon.svg');
}

.banner-spacer {
  width: 2px;
  display: inline-block;
}

main {
  margin-top: 38px;
}

footer {
  text-align: center;
  margin-top: 34px;
  flex: 0 0 auto;
}

.navigation {
  list-style-type: none;
  line-height: 19px;
}

.navigation li {
  margin: 0 10px;
  display: inline-block;
}

.navigation li a {
  font-size: 13px;
  letter-spacing: -0.2px;
  text-decoration: underline;
}

@media screen and (max-width: 480px) {
  .field-attach {
    padding-left: 18px;
    padding-right: 18px;
    display: block;
  }

  .field-attach .file-list {
    margin-right: 0;
  }

  .field-attach .file-list li {
    justify-content: center;
  }

  .field-attach .file-button {
    padding-top: 6px;
    padding-bottom: 6px;
    display: block;
  }

  .field-attach[data-has-files="true"] .file-button {
    padding-top: 14px;
  }

  header {
    flex-direction: column;
  }

  .title-action h1 {
    text-align: center;
  }

  .see-all-tickets {
    margin-left: 0;
    margin-top: 8px;
  }

  .banner {
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .banner::before {
    margin-right: 8px;
  }

  main {
    margin-top: 28px;
  }

  footer {
    margin-top: 22px;
  }
}

@keyframes file-list-uploading-spinner {
  to {
    transform: rotate(360deg);
  }
}
body {
  display: flex;
  flex-direction: column;
}

.wrapper {
  min-height: 380px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.open-ticket {
  flex: 0 0 auto;
  margin-left: 12px;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 0 auto;
}

.menu-filters {
  margin-left: 6px;
  list-style-type: none;
  flex: 1;
}

.menu-filter {
  display: inline-block;
}

.menu-filter a {
  font-size: 15px;
  padding: 10px 12px;
  color: #000000;
  letter-spacing: -0.23px;
  display: inline-block;
  border-radius: 2px;
  transition: none;
}

.menu-filter a:hover,
.menu-filter a:active {
  margin-left: -6px;
  margin-right: -6px;
  padding-left: 18px;
  padding-right: 18px;
}

.menu-filter a:hover {
  background-color: #F4F7F9;
  text-decoration: none;
}

.menu-filter a:active {
  background-color: #ECF1F4;
}

.menu-filter.menu-filter--active a {
  color: #FFFFFF;
  background-color: var(--theme-accent);
  margin: 0 12px;
  padding-left: 30px;
  padding-right: 30px;
}

.menu-filter:first-of-type.menu-filter--active a {
  margin-left: -6px;
}

.refresh-data {
  margin-left: 12px;
  margin-right: 10px;
}

.tickets {
  margin-top: 20px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  min-height: 100px;
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ticket,
.tickets-legend,
.tickets-controls {
  padding-left: 28px;
  padding-right: 20px;
}

.tickets-legend {
  color: #878787;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  font-size: 13.5px;
  letter-spacing: -0.25px;
  line-height: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.tickets-none {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tickets-none-indicator {
  text-align: center;
  padding: 8px 10px;
}

.tickets-none-indicator h4 {
  color: rgba(0, 0, 0, 0.7);
  font-size: 18px;
  line-height: 20px;
  letter-spacing: -0.15px;
}

.tickets-none-indicator p {
  color: rgba(0, 0, 0, 0.5);
  font-size: 15px;
  line-height: 17px;
  margin-top: 9px;
}

.tickets-list {
  list-style-type: none;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.tickets-list::after {
  content: "";
  height: 18px;
  display: block;
}

.tickets-controls {
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding-top: 6px;
  padding-bottom: 6px;
  flex: 0 0 auto;
}

.tickets-controls .controls-browse {
  display: flex;
  justify-content: flex-end;
}

.tickets-controls .controls-browse .button {
  margin-left: 7px;
  padding: 9px 11px;
}

.tickets-controls .controls-browse .button:first-child {
  margin-left: 0;
}

.ticket {
  color: #000000;
  line-height: 22px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  padding-top: 9px;
  padding-bottom: 9px;
  display: flex;
  align-items: center;
}

.ticket:nth-child(odd) {
  background-color: #FFFFFF;
}

.ticket:nth-child(odd):hover {
  background-color: #FCFCFC;
}

.ticket:nth-child(even) {
  background-color: #FBFBFB;
}

.ticket:nth-child(even):hover {
  background-color: #F8F8F8;
}

.tickets-legend .legend-part,
.ticket .ticket-part {
  padding-right: 12px;
}

.tickets-legend .legend-part:last-of-type,
.ticket .ticket-part:last-of-type {
  padding-right: 0;
}

.tickets-legend .legend-subject,
.ticket .ticket-subject {
  flex: 0.5;
}

.tickets-legend .legend-date,
.ticket .ticket-date {
  flex: 0.25;
}

.tickets-legend .legend-status,
.ticket .ticket-status {
  flex: 0.15;
}

.tickets-legend .legend-actions,
.ticket .ticket-actions {
  min-width: 48px;
  flex: 0.1;
}

.ticket .ticket-part {
  overflow: hidden;
}

.ticket .ticket-void {
  color: rgba(0, 0, 0, 0.3);
}

.ticket .ticket-subject p:nth-child(1) {
  font-size: 14.5px;
  letter-spacing: -0.35px;
}

.ticket .ticket-subject p:nth-child(2) {
  font-size: 13.5px;
  color: #878787;
  letter-spacing: -0.32px;
}

.ticket .ticket-date p:nth-child(1) {
  font-size: 14px;
  letter-spacing: -0.35px;
}

.ticket .ticket-date p:nth-child(2) {
  font-size: 13px;
  letter-spacing: -0.32px;
}

.ticket .ticket-actions {
  overflow: visible;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 480px) {
  .open-ticket {
    width: 100%;
    margin-left: 0;
    margin-top: 14px;
  }

  .menu-filters {
    display: flex;
  }

  .menu-filter {
    flex: 1;
  }

  .menu-filter a {
    text-align: center;
    display: block;
  }

  .refresh-data {
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    margin-left: 18px;
    padding-left: 15px;
    margin-right: 4px;
    padding-bottom: 3px;
    padding-top: 3px;
  }

  .tickets {
    margin-top: 16px;
  }

  .tickets-controls .controls-browse {
    justify-content: center;
  }
}
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center', CcTicketCenter);
