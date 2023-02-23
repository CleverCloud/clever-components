import './cc-logs-deployment.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import { css, html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import {
  iconRemixBuilding_3Fill as instanceDedicatedBuildIcon,
} from '../../assets/cc-remix.icons.js';
import { _renderStepLabel } from './stepRender.js';

/**
 *
 *  *
 *  *
 * @cssdisplay block
 */
export class CcLogsDeploymentMultiComponent extends LitElement {

  static get properties () {
    return {
      reason: { type: Array },
      instances: { type: Array },
      done: { type: Array },
      _openedInstances: { type: Array },
    };
  }

  constructor () {
    super();
    this.reason = [];
    this.instances = [];
    this.done = [];
    this._openedInstances = [];
  }

  _isOpened (instanceId) {
    return this._openedInstances.findIndex((id) => id === instanceId) !== -1;
  }

  _getInstance (instanceId) {
    return this.instances.find((i) => i.id === instanceId);
  }

  _onDetailInstanceClick (e) {
    const instanceId = e.target.dataset.instance;
    console.log(instanceId);
    if (this._isOpened(instanceId)) {
      this._openedInstances = this._openedInstances.filter((i) => i !== instanceId);
    }
    else {
      this._openedInstances = [...this._openedInstances, instanceId];
    }
  }

  reset () {
    this.reason = [];
    this.instances = [];
    this.done = [];
  }

  setSteps (instanceId, steps) {
    const instance = this._getInstance(instanceId);

    this.instances = [
      ...this.instances.filter((i) => i.id !== instanceId),
      {
        ...instance,
        steps,
      },
    ];
  }

  render () {
    return html`
      ${this._renderReason()}
      ${this._renderInstances()}
      ${this._renderDone()}
    `;
  }

  _renderReason () {
    return html`
      <div class="reason">
        <cc-logs-deployment .steps=${this.reason}></cc-logs-deployment>
      </div>
    `;
  }

  _renderInstances () {
    const instances = [...this.instances].sort((i1, i2) => {
      if (i1.dedicatedBuildInstance) {
        return -1;
      }
      if (i2.dedicatedBuildInstance) {
        return 1;
      }
      return i1.instanceNumber - i2.instanceNumber;
    });

    return html`
      <div class="instances">
        ${repeat(instances, (instance) => instance.id, (instance) => {
          const lastStep = instance.steps == null || instance.steps.length === 0 ? null : instance.steps[instance.steps.length - 1];
          const isOpened = this._isOpened(instance.id);
          const isDone = lastStep != null && lastStep.final && lastStep.state === 'done';

          return html`
            <div class="instance">
              <div class="instance-header">
                ${isDone
                  ? '✅'
                  : html`
                    <cc-loader></cc-loader>
                  `
                }
                <div class="instance-name">
                  ${instance.dedicatedBuildInstance ? html`
                  <cc-icon .icon=${instanceDedicatedBuildIcon}></cc-icon>
                ` : ''}
                  ${instance.name}
                </div>
                ${lastStep != null ? html`
                  ${!isDone ? html`
                    <span class="instance-last-step">${_renderStepLabel(lastStep)}</span>
                  ` : ''}
                  <div class="spacer"></div>
                  <cc-button
                    ?link=${true}
                    @cc-button:click=${this._onDetailInstanceClick}
                    data-instance="${instance.id}"
                  >
                    ${isOpened ? 'Hide detail' : 'Show detail'}
                  </cc-button>
                ` : ''}
              </div>
              ${isOpened ? html`
                <cc-logs-deployment .steps=${instance.steps}></cc-logs-deployment>` : null}
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderDone () {
    return html`
      <div class="done">
        <cc-logs-deployment .steps=${this.done}></cc-logs-deployment>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        /* region INSTANCE */

        .left {
          flex: 1;
        }

        .instances {
          display: flex;
          flex-direction: column;
          gap: 0.8em;
        }

        .instance {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-primary-weak);
          border-radius: 0.3em;
          gap: 0.5em;
        }

        .instance-header {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .instance cc-loader {
          width: 20px;
          height: 20px;
        }

        .instance-name {
          color: var(--cc-color-text-primary);
          font-weight: bold;
        }

        .spacer {
          flex: 1;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-logs-deployment-multi', CcLogsDeploymentMultiComponent);
