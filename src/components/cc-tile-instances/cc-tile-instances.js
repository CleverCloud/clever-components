import '../cc-expand/cc-expand.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconCleverRunning as iconRunning,
  iconCleverStarting as iconStarting,
} from '../../assets/cc-clever.icons.js';
import { iconRemixAlertFill as iconAlert } from '../../assets/cc-remix.icons.js';
import { animate, QUICK_SHRINK } from '../../lib/animate.js';
import { i18n } from '../../lib/i18n.js';
import { instanceDetailsStyles, tileStyles } from '../../styles/info-tiles.js';
import { waitingStyles } from '../../styles/waiting.js';

const statusIcon = {
  running: iconRunning,
  deploying: iconStarting,
};

/** @type {InstancesState} */
const SKELETON_INSTANCES = {
  running: [],
  deploying: [],
};

/**
 * @typedef {import('../common.types.js').InstancesState} InstancesState
 */

/**
 * A "tile" component to display current status of running and deploying instances for a given app.
 *
 * ## Details
 *
 * * When `instances` is nullish, a loader is displayed.
 *
 * @cssdisplay grid
 */
export class CcTileInstances extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      instances: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {InstancesState|null} Sets the current state of running and deploying instances. */
    this.instances = null;
  }

  _getStatusLabel (type) {
    if (type === 'running') {
      return i18n('cc-tile-instances.status.running');
    }
    if (type === 'deploying') {
      return i18n('cc-tile-instances.status.deploying');
    }
  }

  render () {

    const skeleton = (this.instances == null);
    const isLoading = skeleton && !this.error;
    const instances = skeleton ? SKELETON_INSTANCES : this.instances;

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
      <div class="tile_title">${i18n('cc-tile-instances.title')}</div>

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
        <cc-notice class="tile_message" intent="info" message="${i18n('cc-tile-instances.empty')}"></cc-notice>
      ` : ''}

      ${this.error ? html`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${iconAlert}" accessible-name="${i18n('cc-tile-instances.error.icon-a11y-name')}" class="icon-warning"></cc-icon>
            <p>${i18n('cc-tile-instances.error')}</p>
          </div>
        </div>
      ` : ''}
    `;
  }

  _renderInstances (instances, type) {
    return instances.length ? html`
      <div class="instances ${classMap({ 'cc-waiting': type === 'deploying' })}" data-type=${type}>
        <cc-icon class="instances_status-img ${type}" .icon=${statusIcon[type]}></cc-icon>
        <span class="instances_status">${this._getStatusLabel(type)}</span>
        ${instances.map(({ flavorName, count }) => html`
          <span class="size-label">${flavorName}<span class="count-bubble">${count}</span></span>
        `)}
      </div>
    ` : '';
  }

  static get styles () {
    return [
      tileStyles,
      instanceDetailsStyles,
      waitingStyles,
      // language=CSS
      css`
        cc-expand {
          width: 100%;
        }

        .instances {
          display: flex;
          width: 100%;
          align-items: center;
        }

        .instances[data-type='running'] {
          --cc-icon-color: var(--color-legacy-green);
          --status-color: var(--color-legacy-green);
        }

        .instances[data-type='deploying'] {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --status-color: var(--color-legacy-blue);
        }

        .instances_status-img {
          --cc-icon-size: 1.75em;
        }

        .instances_status {
          flex: 1 1 0;
          margin-left: 0.25em;
          color: var(--status-color, #000);
          font-size: 1.2em;
        }

        .size-label {
          position: relative;
          margin: var(--bubble-r);
        }

        .count-bubble {
          position: absolute;
          right: calc(var(--bubble-d) / -2);
          bottom: calc(var(--bubble-d) / -2);
          background-color: var(--status-color, #000);
        }

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-instances', CcTileInstances);
