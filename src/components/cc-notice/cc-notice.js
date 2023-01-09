import { css, html, LitElement } from 'lit';
import '../cc-img/cc-img.js';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

const closeSvg = new URL('../../assets/close-gray.svg', import.meta.url).href;
const dangerSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;
const infoSvg = new URL('../../assets/information-fill.svg', import.meta.url).href;
const successSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const warningSvg = new URL('../../assets/alert-fill.svg', import.meta.url).href;

/**
 * @typedef {import('./cc-notice.types.js').NoticeIntent} NoticeIntent
 */

/**
 * A component to display a block with a title and a message with different modes (info, success, danger, warning).
 *
 * You can also close it and override the message or the icon if needed.
 *
 * @cssdisplay block
 *
 * @slot icon - Icon slot to override the default one provided.
 * @slot message - Message slot to override the message if you want more than just a short text.
 *
 * @event {CustomEvent} cc-notice:dismiss - Fires to inform that the notice should be dismissed.
 */
export class CcNotice extends LitElement {

  static get properties () {
    return {
      closeable: { type: Boolean },
      heading: { type: String },
      intent: { type: String, reflect: true },
      message: { type: String },
      noIcon: { type: Boolean, attribute: 'no-icon' },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Makes the notice closeable. */
    this.closeable = false;

    /** @type {string|null} The title of the notice. */
    this.heading = null;

    /** @type {NoticeIntent} The intent of the notice. */
    this.intent = 'info';

    /** @type {string} The content of the message of the notice. */
    this.message = null;

    /** @type {boolean} Remove icon if you don't want it. */
    this.noIcon = false;
  }

  _getIcon () {
    if (this.intent === 'danger') {
      return dangerSvg;
    }
    if (this.intent === 'info') {
      return infoSvg;
    }
    if (this.intent === 'success') {
      return successSvg;
    }
    if (this.intent === 'warning') {
      return warningSvg;
    }
  }

  _getIconAlt () {
    if (this.intent === 'danger') {
      return i18n('cc-notice.icon-alt.danger');
    }
    if (this.intent === 'info') {
      return i18n('cc-notice.icon-alt.info');
    }
    if (this.intent === 'success') {
      return i18n('cc-notice.icon-alt.success');
    }
    if (this.intent === 'warning') {
      return i18n('cc-notice.icon-alt.warning');
    }
  }

  _onCloseButtonClick () {
    dispatchCustomEvent(this, 'dismiss');
  }

  render () {

    const layout = {
      'no-icon': this.heading != null && this.noIcon,
      'no-heading': this.heading == null && !this.noIcon,
      'message-only': this.heading == null && this.noIcon,
      closeable: this.closeable,
    };

    return html`
      <div class="wrapper ${classMap(layout)}">
        ${!this.noIcon ? html`
          <slot name="icon">
            <img src="${this._getIcon()}" alt="${this._getIconAlt()}" class="notice-icon">
          </slot>
        ` : ''}
        ${this.heading != null ? html`
          <div class="heading">
            ${this.heading}
          </div>
        ` : ''}
        <div class="message-container">
          <slot name="message">
            <p>${this.message}</p>
          </slot>
        </div>
        ${this.closeable ? html`
            <button class="close-button"
              @click=${this._onCloseButtonClick}
              title="${i18n('cc-toast.close')}">
              <img src="${closeSvg}" alt="${i18n('cc-notice.close')}">
            </button>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          position: relative;
          display: grid;
          align-items: center;
          padding: 0.75em;
          border-radius: 0.25em;
          gap: 0.5em;
          grid-template-areas: 
            'icon heading'
            '.    message';
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          line-height: 1.4;
        }

        :host([intent='success']) .wrapper {
          border: 1px solid var(--cc-color-border-success-weak);
          background-color: var(--cc-color-bg-success-weaker);
        }

        :host([intent='warning']) .wrapper {
          border: 1px solid var(--cc-color-border-warning-weak);
          background-color: var(--cc-color-bg-warning-weaker);
        }

        :host([intent='info']) .wrapper {
          border: 1px solid var(--cc-color-border-primary-weak);
          background-color: var(--cc-color-bg-primary-weaker);
        }

        :host([intent='danger']) .wrapper {
          border: 1px solid var(--cc-color-border-danger-weak);
          background-color: var(--cc-color-bg-danger-weaker);
        }

        .wrapper.closeable {
          padding-right: 2em;
        }
        
        .wrapper.no-icon {
          grid-template-areas:
            'heading'
            'message';
        }
        
        .wrapper.no-heading {
          grid-template-areas: 'icon message';
          grid-template-columns: auto 1fr;
          grid-template-rows: auto;
        }
        
        .wrapper.message-only {
          grid-template-areas: 'message';
          grid-template-columns: auto;
          grid-template-rows: auto;
        }

        .heading {
          font-weight: bold;
          grid-area: heading;
        }
        
        .message-container {
          grid-area: message;
        }
        
        .message-container p {
          margin: 0;
        }

        .notice-icon {
          width: 1.5em;
          height: 1.5em;
          grid-area: icon;
        }

        .close-button {
          position: absolute;
          top: 0.5em;
          right: 0.5em;
          width: auto;
          height: auto;
          padding: 0.2em;
          border: none;
          background-color: transparent;
          border-radius: 0.15em;
          cursor: pointer;
        }
        
        :host([intent='success']) .close-button:hover {
          background-color: var(--cc-color-bg-success-hovered);
        }
        
        :host([intent='warning']) .close-button:hover {
          background-color: var(--cc-color-bg-warning-hovered);
        }
        
        :host([intent='info']) .close-button:hover {
          background-color: var(--cc-color-bg-primary-hovered);
        }
        
        :host([intent='danger']) .close-button:hover {
          background-color: var(--cc-color-bg-danger-hovered);
        }
        
        .close-button:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .close-button img {
          display: block;
          width: 1em;
          height: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-notice', CcNotice);
