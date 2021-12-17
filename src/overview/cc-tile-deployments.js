import '../atoms/cc-datetime-relative.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const SKELETON_DEPLOYS = [
  { state: '???????', date: '??????????' },
  { state: '??????', date: '???????????' },
];

/**
 * @typedef {import('./types.js').Deployment} Deployment
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
        <cc-error class="tile_message">${i18n('cc-tile-deployments.error')}</cc-error>
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
          grid-gap: 1rem;
          grid-template-columns: auto auto auto;
          justify-content: space-between;
        }

        .state {
          color: #fff;
          font-weight: bold;
        }

        .state[data-state="CANCELLED"] {
          color: #b06d0f;
        }

        .state[data-state="FAIL"] {
          color: #cc0028;
        }

        .state[data-state="OK"] {
          color: #2faa60;
        }

        [title] {
          cursor: help;
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-deployments', CcTileDeployments);
