import '../cc-badge/cc-badge.js';
import { css, html, LitElement } from 'lit';

export class CcLogPoc extends LitElement {
  static get properties () {
    return {
      log: { type: Object },
      excludeMetadata: { type: Array },
      customMetadataRenderers: { type: Object, attribute: 'custom-metadata-renderers' },
    };
  }

  constructor () {
    super();

    this.log = null;
    this.excludeMetadata = [];
    this.customMetadataRenderers = {};
    this._defaultMetadataRenderer = (key, value) => html`<cc-badge>${key}: ${value}</cc-badge>`;
  }

  _onClick () {
    console.log(this.log);

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
      ${this._renderMetadata(this.log, this.excludeMetadata || [])}
      <span class="message">${this.log.message}</span>
    `;
  }

  _renderMetadata (log, exclude) {
    if (log.metadata == null) {
      return null;
    }

    return Object.entries(log.metadata)
      .filter(([key]) => !exclude.includes(key))
      .map(([key, v]) => this._renderSingleMetadata(key, v, log));
  }

  _renderSingleMetadata (key, value, log) {
    return (this.customMetadataRenderers[key] ?? this._defaultMetadataRenderer)(key, value, log);
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
          
        }
        
        cc-badge {
          margin-left: 0.3em;
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

window.customElements.define('cc-log-poc', CcLogPoc);
