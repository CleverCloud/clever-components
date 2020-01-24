import '../atoms/cc-datetime-relative.js';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { skeleton } from '../styles/skeleton.js';
import { tileStyles } from '../styles/info-tiles.js';

/**
 * A "tile" component to display a list of deployments (status, humanized time ago and logs link).
 *
 * ## Details
 *
 * * When `deployments` is nullish, a skeleton screen UI pattern is displayed (loading hint)
 *
 * ## Type definitions
 *
 * ```js
 * interface Deployment {
 *   state: string,
 *   action: string,
 *   date: string,
 *   logsUrl: string,
 * }
 * ```
 *
 * @prop {Deployment[]} deployments - Sets the list of the last deployments (it's up to you to only pass 2 or 3).
 * @prop {Boolean} error - Displays an error message.
 */
export class CcTileDeployments extends LitElement {

  static get properties () {
    return {
      deployments: { type: Array, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonDeploys () {
    return [
      { state: '???????', date: '??????????' },
      { state: '??????', date: '???????????' },
    ];
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
    const deployments = skeleton ? CcTileDeployments.skeletonDeploys : this.deployments;
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
        <div class="tile_message"><img class="icon-img" src=${warningSvg} alt="">${i18n('cc-tile-deployments.error')}</div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      iconStyles,
      skeleton,
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
