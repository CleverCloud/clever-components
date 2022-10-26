import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class CcLog extends LitElement {
  static get properties () {
    return {
      log: { type: Object },
      wrap: { type: Boolean },
    };
  }

  constructor () {
    super();

    this.log = null;
    this.wrap = true;
  }

  _onClick () {
    const listener = (e) => {
      e.clipboardData.setData('text/markdown', '`' + this.log.message + '`');
      e.clipboardData.setData('text/html', '<code>' + this.log.message + '</code>');
      e.clipboardData.setData('text/plain', this.log.message);
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  firstUpdated (_changedProperties) {
    const listener = () => {
      this._onClick();
    };
    this.shadowRoot.addEventListener('click', listener);
    this._removeClickListener = () => {
      this.shadowRoot.removeEventListener('click', listener);
    };
  }

  disconnectedCallback () {
    this._removeClickListener?.();
  }

  render () {
    return html`
      <span class="timestamp">${this.log.timestamp}</span>
      <span class="message ${classMap({ wrap: this.wrap })}">${this.log.message}</span>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: inline;
        }

        :hover {
          background-color: var(--cc-color-bg-neutral);
          cursor: pointer;
        }
        
        .message {
          flex: 1;
          white-space: nowrap;
        }
        
        .message.wrap {
          white-space: normal;          
        }

        .timestamp {
          color: #777;
          margin-right: 0.3em;
          -webkit-user-select: none;
          user-select: none;
        }
      `];
  }
}

window.customElements.define('cc-log', CcLog);
