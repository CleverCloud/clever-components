import '../cc-expand/cc-expand.js';
import '../cc-loader/cc-loader.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { animate, QUICK_SHRINK } from '../../lib/animate.js';
import { i18n } from '../../lib/i18n.js';
import { instanceDetailsStyles, tileStyles } from '../../styles/info-tiles.js';
import { waitingStyles } from '../../styles/waiting.js';

const runningSvg = new URL('../../assets/running.svg', import.meta.url).href;
const startingSvg = new URL('../../assets/starting.svg', import.meta.url).href;

const statusImg = {
  running: runningSvg,
  deploying: startingSvg,
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
        <div class="tile_message">${i18n('cc-tile-instances.empty')}</div>
      ` : ''}

      ${this.error ? html`
        <cc-error class="tile_message">${i18n('cc-tile-instances.error')}</cc-error>
      ` : ''}
    `;
  }

  _renderInstances (instances, type) {
    return instances.length ? html`
      <div class="instances ${classMap({ 'cc-waiting': type === 'deploying' })}" data-type=${type}>
        <!-- image has a presentation role => alt="" -->
        <img class="instances_status-img" src=${statusImg[type]} alt="">
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
          align-items: center;
          display: flex;
          width: 100%;
        }

        .instances[data-type=running] {
          --status-color: var(--color-legacy-green);
        }

        .instances[data-type=deploying] {
          --status-color: var(--color-legacy-blue);
        }

        .instances_status-img {
          height: 1.75em;
          width: 1.75em;
        }

        .instances_status {
          color: var(--status-color, #000000);
          flex: 1 1 0;
          font-size: 1.2em;
          margin-left: 0.25em;
        }

        .size-label {
          margin: var(--bubble-r);
          position: relative;
        }

        .count-bubble {
          background-color: var(--status-color, #000000);
          bottom: calc(var(--bubble-d) / -2);
          position: absolute;
          right: calc(var(--bubble-d) / -2);
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-instances', CcTileInstances);
