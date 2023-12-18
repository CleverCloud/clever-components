import '../cc-block/cc-block.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import { css, html, LitElement } from 'lit';

/**
 * @typedef {import('../common.types.js').Addon} Addon
 */

export class CcTicketCenterMessage extends LitElement {

  static get properties () {
    return {
      authorName: { type: String },
      authorPicture: { type: String },
      message: { type: Object },
      messageOrigin: { type: String },
      messageDate: { type: Date },
      error: { type: String },
      _skeleton: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    this.authorName = null;
    this.authorPicture = null;
    this.message = null;
    this.messageDate = null;
    this.messageOrigin = null;
    this.error = null;
  }

  messageOriginDisplay () {
    if (this.messageOrigin === 'customer') {
      return 'Vous';
    }
    else {
      return 'Clever Cloud';
    }
  }

  render () {
    console.log(this);
    const date = this.messageDate?.toISOString();
    return html`
      <cc-block>
        <div slot="title">${this.messageOriginDisplay()}</div>
        <cc-datetime-relative slot="button" datetime=${date}></cc-datetime-relative>
        <div class="messageContent">${this.message}</div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center-message', CcTicketCenterMessage);
