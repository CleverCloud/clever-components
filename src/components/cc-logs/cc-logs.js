import './cc-log.js';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';

export class CcLogs extends LitElement {
  static get properties () {
    return {
      logs: { type: Array },
      limit: { type: Number },
      follow: { type: Boolean },
      followOnScroll: { type: Boolean, attribute: 'follow-on-scroll' },
      wrapLines: { type: Boolean, attribute: 'wrap-line' },
      withVirtualizer: { type: Boolean, attribute: 'with-virtualizer' },
      withRepeat: { type: Boolean, attribute: 'with-repeat' },
      customMetadataRenderers: { type: Object, attribute: 'custom-metadata-renderers' },
    };
  }

  constructor () {
    super();

    this.logs = [];
    this.limit = 0;
    this.follow = false;
    this.followOnScroll = false;
    this.wrapLines = false;
    this.withVirtualizer = true;
    this.withRepeat = false;
    this.customMetadataRenderers = {};

    /** @type {Ref<HTMLElement>} */
    this._logsRef = createRef();
  }

  scrollBottom () {
    window.requestAnimationFrame(() => {
      const element = this._logsRef.value;
      if (element != null) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  _getScrollListener () {
    if (!this.followOnScroll) {
      return null;
    }

    let lastKnownScrollPosition = 0;
    let ticking = false;

    const listener = (e, scrollPosition) => {
      const old = this.follow;
      this.follow = scrollPosition + e.offsetHeight >= e.scrollHeight - 10;
      if (old !== this.follow) {
        console.log('follow', this.follow);
      }
    };

    return (e) => {
      const element = e.target;
      lastKnownScrollPosition = element.scrollTop;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          listener(element, lastKnownScrollPosition);
          ticking = false;
        });

        ticking = true;
      }
    };
  }

  clear () {
    this.logs = [];
  }

  addLog (log) {
    this.addLogs([log]);
  }

  addLogs (logs) {
    const newLogs = [...this.logs, ...logs];
    if (this.limit > 0) {
      this.logs = newLogs.slice(-this.limit);
    }
    else {
      this.logs = newLogs;
    }
  }

  count () {
    return this.logs?.length ?? 0;
  }

  updated (_changedProperties) {
    if (_changedProperties.has('logs') || _changedProperties.has('follow')) {
      if (this.follow) {
        this.scrollBottom();
      }
    }
  }

  render () {
    const __refName = this._logsRef;

    return html`
      <div id="logs" ${ref(__refName)} @scroll=${this._getScrollListener()}>
        ${this._renderBigList(this.logs, (log) => this._renderLog(log), this.withVirtualizer, this.withRepeat)}
      </div>
    `;
  }

  _renderLog (log) {
    return html`
      <cc-log class="${classMap({ wrap: this.wrapLines })}" 
              .log=${log} 
              .wrap=${this.wrapLines}
              .customMetadataRenderers=${this.customMetadataRenderers}
      ></cc-log>
    `;
  }

  _renderBigList (items, renderItem, withVirtualizer, withRepeat) {
    if (withVirtualizer) {
      return virtualize({
        scroller: true,
        items: items,
        keyFunction: (it) => it.id ?? it.timestamp,
        renderItem: renderItem,
      });
    }
    return withRepeat
      ? repeat(items, (it) => it.id ?? it.timestamp, renderItem)
      : items.map(renderItem);
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
        }
        
        #logs {
          flex: 1;
          display: block;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.9em;
          overflow: auto;
        }

        cc-log {
          white-space: nowrap;
        }
        cc-log:not(:last-child) {
          padding-bottom: 0.25em;
        }
        
        cc-log.wrap {
          white-space: normal;
        }
        
        .cursor::after {
          animation: cursor-blink 1.5s steps(2) infinite;
          background: #777;
          content: "";
          display: inline-block;
          height: 20px;
          width: 8px;
        }

        @keyframes cursor-blink {
          0% {
            opacity: 0;
          }
        }
      `];
  }
}

window.customElements.define('cc-logs', CcLogs);
