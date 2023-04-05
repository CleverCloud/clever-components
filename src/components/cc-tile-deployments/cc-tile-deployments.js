import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-icon/cc-icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixAlertFill as iconAlert,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { tileStyles } from '../../styles/info-tiles.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const SKELETON_DEPLOYS = [
  { state: '???????', date: '??????????' },
  { state: '??????', date: '???????????' },
];

/**
 * @typedef {import('./cc-tile-deployments.types.js').Deployment} Deployment
 */

/**
 * A "tile" component to display a list of deployments (status, humanized time ago and logs link).
 *
 * ## Details
 *
 * * When `deployments` is nullish, a skeleton screen UI pattern is displayed (loading hint)
 *
 * @cssdisplay grid
 */
export class CcTileDeployments extends LitElement {

  static get properties () {
    return {
      deployments: { type: Array },
      error: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();

    /** @type {Deployment[]|null} Sets the list of the last deployments (it's up to you to only pass 2 or 3) */
    this.deployments = null;

    /** @type {boolean} Displays an error message */
    this.error = false;
  }

  _getStateLabel (state, action) {
    if (state === 'OK') {
      return (action === 'UNDEPLOY')
        ? i18n('cc-tile-deployments.state.stopped')
        : i18n('cc-tile-deployments.state.started');
    }
    if (state === 'FAIL') {
      return i18n('cc-tile-deployments.state.failed');
    }
    if (state === 'CANCELLED') {
      return i18n('cc-tile-deployments.state.cancelled');
    }
    return state;
  }

  render () {

    const skeleton = (this.deployments == null);
    const deployments = skeleton ? SKELETON_DEPLOYS : this.deployments;
    const hasData = (!this.error && (deployments.length > 0));
    const emptyData = (!this.error && (deployments.length === 0));

    return html`
      <div class="tile_title">${i18n('cc-tile-deployments.title')}</div>

      ${hasData ? html`
        <div class="tile_body">
          <!-- We don't really need to repeat and key by -->
          ${deployments.map((d) => html`
            <div class="state" data-state=${d.state}>
              <span class=${classMap({ skeleton })}>${this._getStateLabel(d.state, d.action)}</span>
            </div>
            <div class="date">
              ${skeleton ? html`
                <span class="skeleton">${d.date}</span>
              ` : ''}
              ${!skeleton ? html`
                <cc-datetime-relative datetime=${d.date}></cc-datetime-relative>
              ` : ''}
            </div>
            <div>
              ${ccLink(d.logsUrl, 'logs', skeleton)}
            </div>
          `)}
        </div>
      ` : ''}

      ${emptyData ? html`
        <div class="tile_message">${i18n('cc-tile-deployments.empty')}</div>
      ` : ''}

      ${this.error ? html`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${iconAlert}" accessible-name="${i18n('cc-tile-deployments.error.icon-a11y-name')}" class="icon-warning"></cc-icon>
            <p>${i18n('cc-tile-deployments.error')}</p>
          </div>
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        .tile_body {
          align-items: start;
          justify-content: space-between;
          grid-gap: 1em;
          grid-template-columns: auto auto auto;
        }

        .state {
          font-weight: bold;
        }

        .state[data-state='CANCELLED'] {
          color: var(--cc-color-text-warning);
        }

        .state[data-state='FAIL'] {
          color: var(--cc-color-text-danger);
        }

        .state[data-state='OK'] {
          color: var(--cc-color-text-success);
        }

        [title] {
          cursor: help;
        }

        .skeleton {
          background-color: #bbb;
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

window.customElements.define('cc-tile-deployments', CcTileDeployments);
