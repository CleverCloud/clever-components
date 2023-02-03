import './cc-log-poc.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export class CcLogsDom extends LitElement {
  static get properties () {
    return {
      limit: { type: Number },
      follow: { type: Boolean },
      wrapLines: { type: Boolean, attribute: 'wrap-line' },
    };
  }

  constructor () {
    super();

    this.limit = 0;
    this.follow = false;
    this.wrapLines = false;

    /** @type {Ref<HTMLElement>} */
    this._logsRef = createRef();
  }

  _scrollBottom () {
    window.requestAnimationFrame(() => {
      const element = this._logsRef.value;
      if (element != null) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  clear () {
    this._logsRef.value.innerHTML = '';
  }

  addLog (log) {
    this.addLogs([log]);
  }

  addLogs (logs) {
    for (const log of logs) {
      const $log = document.createElement('cc-log-poc');
      $log.log = log;
      $log.wrap = this.wrapLines;
      this._logsRef.value.appendChild($log);
    }

    if (this.limit > 0 && this._logsRef.value.childElementCount > this.limit) {
      const toRemove = this._logsRef.value.childElementCount - this.limit;

      for (let i = 0; i < toRemove; i++) {
        this._logsRef.value.firstElementChild.remove();
      }
    }

    if (this.follow) {
      this._scrollBottom();
    }
  }

  count () {
    return this._logsRef.value?.childElementCount || 0;
  }

  updated (_changedProperties) {
    if (_changedProperties.has('follow') && this.follow) {
      this._scrollBottom();
    }
  }

  render () {
    const __refName = this._logsRef;

    return html`
      <div id="logs" ${ref(__refName)}></div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
        }

        #logs {
          align-items: stretch;
          display: flex;
          flex: 1;
          flex-direction: column;
          flex-wrap: nowrap;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.9em;
          gap: 0.15em;
          overflow: auto;
        }

        cc-log {
          white-space: nowrap;
        }

        cc-log.wrap {
          white-space: normal;
        }
      `];
  }
}

window.customElements.define('cc-logs-dom', CcLogsDom);
