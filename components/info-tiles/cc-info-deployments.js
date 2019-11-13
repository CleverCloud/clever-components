import '../atoms/cc-datetime-relative.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';
import { tileStyles } from '../styles/info-tiles.js';

/**
 * A "tile" component to display a list of deployments (status, humanized time ago and logs link)
 *
 * ## Details

 * When `deployments` is null, a skeleton screen UI pattern is displayed (loading hint)
 *
 * ## Properties
 *
 * | Property      | Attribute      | Type             | Description
 * | --------      | ---------      | ----             | -----------
 * | `deployments` |                | `Deployment[]`   | List of deployments to display
 * | `error`       | `error`        | `boolean`        | display an error message
 *
 * ### `Deployment`
 *
 * ```
 * {
 *   state: string,
 *   action: string,
 *   date: string,
 *   logsUrl: string,
 * }
 * ```
 *
 * *WARNING*: The "Properties" table below is broken
 *
 * @prop {Array} deployments - BROKEN
 * @attr {Boolean} error - display an error message
 */
export class CcInfoDeployments extends LitElement {

  static get properties () {
    return {
      deployments: { type: Array, attribute: false },
      error: { type: Boolean, reflect: true },
    };
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
        ? i18n('cc-info-deployments.state.stopped')
        : i18n('cc-info-deployments.state.started');
    }
    if (state === 'FAIL') {
      return i18n('cc-info-deployments.state.failed');
    }
    if (state === 'CANCELLED') {
      return i18n('cc-info-deployments.state.cancelled');
    }
    return state;
  }

  render () {

    const skeleton = (this.deployments == null);
    const deployments = skeleton ? CcInfoDeployments.skeletonDeploys : this.deployments;
    const hasData = (!this.error && (deployments.length > 0));
    const emptyData = (!this.error && (deployments.length === 0));

    return html`
      <div class="tile_title">${i18n('cc-info-deployments.title')}</div>
      
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
            <a class="link" href=${ifDefined(d.logsUrl)}>
              <span class=${classMap({ skeleton })}>logs</span>
            </a>
          `)}
        </div>
      ` : ''}
        
      ${emptyData ? html`
        <div class="tile_message">${i18n('cc-info-deployments.empty')}</div>
      ` : ''}

      ${this.error ? html`
        <div class="tile_message">${i18n('cc-info-deployments.error')}</div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      skeleton,
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

        .link {
          color: #2b96fd;
          text-decoration: underline;
        }

        [title] {
          cursor: help;
        }

        .skeleton {
          background-color: #bbb;
        }

        .link .skeleton {
          background-color: #2b96fd;
        }
      `,
    ];
  }
}

window.customElements.define('cc-info-deployments', CcInfoDeployments);
