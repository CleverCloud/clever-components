import '../cc-loader/cc-loader.js';
import { css, html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

function formatDuration (ms) {
  if (ms < 1000) {
    return 'less than one second';
  }

  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
}

export class CcLogsDeploymentEventBased extends LitElement {
  static get properties () {
    return {
      nodes: { type: Array },
    };
  }

  constructor () {
    super();
    /**
     * @type {Array<LogEventNode>}
     */
    this.nodes = [];
  }

  render () {
    console.log(this.nodes);
    return html`
      ${repeat(this.nodes, (n) => n.path, (n) => this._renderItem(n))}
    `;
  }

  /**
   * @param {LogEventNode} item
   */
  _renderItem (item) {
    if (item.type === 'step') {
      return this._renderStep(item);
    }
    if (item.type === 'info') {
      return this._renderInfo(item);
    }
  }

  /**
   * @param {StepNode} stepNode
   */
  _renderStep (stepNode) {
    return html`
      <div class="node step ${`level-${stepNode.level}`}">
        <div class="header">
          ${stepNode.endEvent == null
            ? html`<cc-loader></cc-loader>`
            : stepNode.endEvent.code === 'SUCCESS' ? html`✅` : html`❌`
          }
          <div class="name">${stepNode.name}</div>
          ${stepNode.endEvent != null ? html`
            <div class="duration">${formatDuration(stepNode.endEvent.timestamp - stepNode.startEvent.timestamp)}</div>
          ` : ''}
        </div>
        ${stepNode.children?.length > 0 ? html`
          <div class="children">
            ${stepNode.children.map((child) => this._renderItem(child))}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * @param {InfoNode} infoNode
   */
  _renderInfo (infoNode) {
    return html`
      <div class="node info ${`level-${infoNode.level}`}">ℹ <span class="name">${infoNode.name} ${infoNode.event.code}</span></div>`;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .name {
          flex: 1;
        }
        
        .node.level-0 .name {
          font-size: 2em;
        }

        .node.level-1 .name {
          font-size: 1.4em;
        }

        .node.level-2 .name {
          font-size: 1em;
        }
        
        .children {
          margin-left: 1.5em;
        }
        
        cc-loader {
          width: 1em;
          height: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-logs-deployment-event-based', CcLogsDeploymentEventBased);
