import '../atoms/cc-expand.js';
import '../atoms/cc-loader.js';
import runningSvg from './running.svg';
import startingSvg from './starting.svg';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { animate, QUICK_SHRINK } from '../lib/animate.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { instanceDetails, tileStyles } from '../styles/info-tiles.js';

const statusImg = {
  running: runningSvg,
  deploying: startingSvg,
};

/**
 * A "tile" component to display current status of running de deploying instances for a given app.
 *
 * ## Details
 *
 * * When `instances` is null, a loader is displayed
 *
 * ## Properties
 *
 * | Property    | Attribute     | Type             | Description
 * | --------    | ---------     | ----             | -----------
 * | `instances` |               | `InstancesState` | describe the current state of running and deploying instances
 * | `error`     | `error`       | `boolean`        | display an error message
 *
 * ### `InstancesState`
 *
 * ```
 * {
 *   running: Instance[],
 *   deploying: Instance[],
 * }
 * ```
 *
 * ### `Instance`
 *
 * ```
 * {
 *   flavourName: string,
 *   count: number
 * }
 * ```
 *
 * *WARNING*: The "Properties" table below is broken
 *
 * @prop {Object} instances - BROKEN
 * @attr {Boolean} error - display an error message
 */
export class CcInfoInstances extends LitElement {

  static get properties () {
    return {
      instances: { type: Object, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  static get skeletonInstances () {
    return {
      running: [],
      deploying: [],
    };
  }

  _getStatusLabel (type) {
    if (type === 'running') {
      return i18n('cc-info-instances.status.running');
    }
    if (type === 'deploying') {
      return i18n('cc-info-instances.status.deploying');
    }
  }

  _renderInstances (instances, type) {
    return instances.length ? html`
      <div class="instances" data-type=${type}>
        <!-- image has a presentation role => alt="" -->
        <img class="instances_status-img" src=${statusImg[type]} alt="">
        <span class="instances_status">${this._getStatusLabel(type)}</span>
        ${instances.map(({ flavorName, count }) => html`
          <span class="size-label">${flavorName}<span class="count-bubble">${count}</span></span>
        `)}
      </div>
    ` : '';
  }

  render () {

    const skeleton = (this.instances == null);
    const isLoading = skeleton && !this.error;
    const instances = skeleton ? CcInfoInstances.skeletonInstances : this.instances;

    const runningInstancesCount = instances.running.map((a) => a.count).reduce((a, b) => a + b, 0);
    const deployingInstancesCount = instances.deploying.map((a) => a.count).reduce((a, b) => a + b, 0);
    const emptyData = !skeleton && !this.error && (runningInstancesCount === 0) && (deployingInstancesCount === 0);

    // NOTE: This does not handle the case where someone has different flavors running or deploying
    if (this._lastRunningCount !== runningInstancesCount) {
      this.updateComplete.then(() => {
        // This is not supported in Safari yet but it's purely decorative so let's keep it like that
        animate(this.shadowRoot, '.instances[data-type=running] .count-bubble', ...QUICK_SHRINK);
        this._lastRunningCount = runningInstancesCount;
      });
    }

    if (this._lastDeployingCount !== deployingInstancesCount) {
      this.updateComplete.then(() => {
        // This is not supported in Safari yet but it's purely decorative so let's keep it like that
        animate(this.shadowRoot, '.instances[data-type=deploying] .count-bubble', ...QUICK_SHRINK);
        this._lastDeployingCount = deployingInstancesCount;
      });
    }

    return html`
      <div class="tile_title">${i18n('cc-info-instances.title')}</div>
      
      ${!this.error && !emptyData ? html`
        <div class="tile_body">
          <cc-expand>
            ${this._renderInstances(instances.running, 'running')}
            ${this._renderInstances(instances.deploying, 'deploying')}
          </cc-expand>
          
          <!-- in this case, a loader is better than a skeleton screen since we're not so sure about the future state -->
          ${isLoading ? html`
            <cc-loader></cc-loader>
          ` : ''}
        </div>
      ` : ''}
      
      ${emptyData ? html`
        <div class="tile_message">${i18n('cc-info-instances.empty')}</div>
      ` : ''}

      ${this.error ? html`
        <div class="tile_message"><img class="icon-img" src=${warningSvg} alt="">${i18n('cc-info-instances.error')}</div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      iconStyles,
      instanceDetails,
      // language=CSS
      css`
        cc-expand {
          width: 100%;
        }

        .instances {
          align-items: center;
          display: flex;
          width: 100%;
        }

        .instances[data-type=running] {
          --status-color: #2faa60;
        }

        @keyframes deploying {
          from {
            opacity: 0.85;
          }

          to {
            opacity: 1;
          }
        }

        .instances[data-type=deploying] {
          --status-color: #2b96fd;
          animation-direction: alternate;
          animation-duration: 500ms;
          animation-iteration-count: infinite;
          animation-name: deploying;
        }

        .instances_status-img {
          height: 1.75rem;
          width: 1.75rem;
        }

        .instances_status {
          color: var(--status-color);
          flex: 1 1 0;
          font-size: 1.2rem;
          margin-left: 0.25rem;
        }

        .size-label {
          margin: var(--bubble-r);
          position: relative;
        }

        .count-bubble {
          background-color: var(--status-color);
          bottom: calc(var(--bubble-d) / -2);
          position: absolute;
          right: calc(var(--bubble-d) / -2);
        }
      `,
    ];
  }
}

window.customElements.define('cc-info-instances', CcInfoInstances);
