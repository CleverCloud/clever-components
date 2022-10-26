import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
// import '@lit-labs/virtualizer/lit-virtualizer.js';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const deletedSvg = new URL('../../assets/delete.svg', import.meta.url).href;
const stoppingSvg = new URL('../../assets/stopped.svg', import.meta.url).href;
const deployingSvg = new URL('../../assets/starting.svg', import.meta.url).href;
const runningSvg = new URL('../../assets/running.svg', import.meta.url).href;
const buildSvg = new URL('../../assets/tools-fill.svg', import.meta.url).href;
const upSvg = new URL('../../assets/up.svg', import.meta.url).href;
const rocketSvg = new URL('../../assets/rocket.svg', import.meta.url).href;

export class CcLogsPoc extends LitElement {
  static get properties () {
    return {
      logs: { type: Array },
      instances: { type: Array },
      selectedInstances: { type: Array },
      limit: { type: Number },
      _visibleLogs: { type: Array },
      _follow: { type: Array },
    };
  }

  constructor () {
    super();

    this.instances = [];
    this.logs = [];
    this.selectedInstances = [];
    this.limit = 500;
    this._visibleLogs = [];
    this._follow = true;
  }

  onInstanceClick (instance) {
    if (this.isInstanceSelected(instance)) {
      this.selectedInstances = this.selectedInstances.filter((instanceId) => instanceId !== instance.id);
    }
    else {
      this.selectedInstances = [...this.selectedInstances, instance.id];
    }
  }

  _onLogClick (log) {
    console.log(log);
    function listener (e) {
      e.clipboardData.setData('text/markdown', '`' + log.message + '`');
      e.clipboardData.setData('text/html', '<code>' + log.message + '</code>');
      e.clipboardData.setData('text/plain', log.message);
      e.preventDefault();
    }
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    // navigator.clipboard.writeText(log.message).then(() => {
    //
    // });
  }

  _onLogScroll () {
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const listener = (e, scrollPosition) => {
      this._follow = scrollPosition + e.offsetHeight >= e.scrollHeight;
      console.log('follow', this._follow);
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

  isInstanceSelected (instance) {
    return this.selectedInstances.includes(instance.id);
  }

  addLog (log) {
    if (this.instances.find((i) => i.id === log.instance.id) == null) {
      this.instances = [log.instance, ...this.instances].sort((l1, l2) => l2.creationDate.getTime() - l1.creationDate.getTime());
    }
    this.logs = [...this.logs, log].slice(-this.limit * this.instances.length);
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('selectedInstances') || _changedProperties.has('logs')) {
      if (this.selectedInstances == null || this.selectedInstances.length === 0) {
        this._visibleLogs = this.logs;
      }
      else {
        this._visibleLogs = this.logs.filter((log) => this.isInstanceSelected(log.instance));
      }
      this._visibleLogs = this._visibleLogs.slice(-this.limit);

      if (this._follow) {
        setTimeout(() => {
          const element = this.shadowRoot.querySelector('#logs');
          element.scrollTop = element.scrollHeight;
        }, 0);
      }
    }
  }

  disconnectedCallback () {
    dispatchCustomEvent(this, 'disconnect');
  }

  render () {
    console.log('rendering', this._visibleLogs.length, this.logs.length);
    return html`
      <div id="instances">
        ${repeat(this.instances, (instance) => instance.id, (instance) => html`
          <button class="instance ${classMap({ selected: this.isInstanceSelected(instance) })}"
                  title="${instance.id}"
                  @click=${() => this.onInstanceClick(instance)}>
            ${instance.unknown ? this._renderUnknownInstance(instance) : this._renderInstance(instance)}
          </button>
        `)}
      </div>
      <div id="logs" @scroll=${this._onLogScroll()}>
        ${this._renderBigList(this._visibleLogs, (log) => this._renderLog(log), false)}
      </div>
    `;
  }

  _renderLog (log) {
    return html`<div class="log" @click="${() => this._onLogClick(log)}">
          <span class="timestamp">${log.timestamp}</span>
          <cc-badge>${log.instance.displayName}</cc-badge>
          <span class="message">${log.message}</span>
        </div>`;
  }

  _renderBigList (items, renderItem, withVirtualizer) {
    if (withVirtualizer) {
      return virtualize({
        scroller: true,
        items: this._visibleLogs,
        renderItem: renderItem,
      });
    }

    return items.map(renderItem);
  }

  _renderUnknownInstance (instance) {
    return html`<div class="instance-description">
      ?
      <cc-badge class="instance-index" circle>?</cc-badge>
      <div class="instance-name">${instance.displayName}</div>  
    </div>`;
  }

  _renderInstance (instance) {
    return html`<div class="instance-description">
      ${this._renderInstanceState(instance)}
      <cc-badge class="instance-index" circle>${instance.index}</cc-badge>
      <span class="instance-name">${instance.displayName}</span>
      ${instance.build ? html`<img src=${buildSvg} alt="build instance" class="build"/>` : html``}
    </div>
    <div class="instance-deployment">
      ${this._renderDeploymentState(instance)}
      <div class="instance-commit">${instance.commit.substring(0, 8)}</div>
      <div class="instance-date">
        <cc-datetime-relative .datetime=${instance.creationDate}></cc-datetime-relative>
      </div>  
    </div>`;
  }

  _renderInstanceState (instance) {
    if (instance.state === 'DELETED') {
      return html`<img class="instance-state" src=${deletedSvg} alt="deleted"/>`;
    }
    if (instance.state === 'STOPPING') {
      return html`<img class="instance-state" src=${stoppingSvg} alt="stopping"/>`;
    }
    if (instance.state === 'DEPLOYING') {
      return html`<img class="instance-state" src=${deployingSvg} alt="deploying"/>`;
    }
    if (instance.state === 'UP') {
      return html`<img class="instance-state" src=${runningSvg} alt="running"/>`;
    }
    return html`<span class="instance-state">${instance.state}</span>`;
  }

  _renderDeploymentState (instance) {
    if (instance.deployment?.action === 'UPSCALE') {
      return html`<img class="instance-state" src=${upSvg} alt="upscale"/>`;
    }
    if (instance.deployment?.action === 'DEPLOY') {
      return html`<img class="instance-state" src=${rocketSvg} alt="deploy"/>`;
    }
    return html``;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
      :host {
        display: flex;
        flex: 1;
        gap: 1em;
        max-height: 400px;
      }
      
      #instances {
        background-color: #eee;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        min-height: 0;
        overflow: auto;
        padding: 1em;
      }
      
      #logs {
        border: 1px solid #ccc;
        display: flex;
        flex: 1;
        flex-direction: column;
        font-family: var(--cc-ff-monospace, monospace);
        font-size: 0.9em;
        line-height: 1.6;
        min-height: 0;
        overflow: auto;
        padding: 0.3em;
      }
      
      
      .instance {
        background-color: var(--cc-color-bg-default);
        border: 1px solid #888;
        border-radius: var(--cc-button-border-radius, 0.15em);
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        font-family: inherit;
        font-size: unset;
        gap: 0.3em;
        justify-content: stretch;
        margin: 0;
        padding: 0.3em;
        text-align: unset;
      }

      .instance.selected {
        background-color: var(--cc-color-bg-neutral-active);
      }
      
      .instance-description {
        align-items: center;
        display: flex;
        gap: 0.3em;
        
      }
      
      .build {
        height: 1em;
      }
      
      .instance-state {
        height: 1em;
      }
      .instance-index {
        
      }
      .instance-name {
        flex: 1;
        justify-self: left;
      }
      
      .instance-deployment {
        align-items: center;
        color: var(--cc-color-text-weak);
        display: flex;
        gap: 0.3em;
      }
      
      .instance-commit {
        
      }
      .instance-date {
        justify-self: end;
      }
      
      .state {
        height: 1em;
      }
      
      .log:hover {
        background-color: var(--cc-color-bg-neutral);
        cursor: pointer;
      }
      
      .log .timestamp {
        color: #777;
        margin-right: 0.3em;
        -webkit-user-select: none;
        user-select: none;
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
window.customElements.define('cc-logs-poc', CcLogsPoc);
