import '../atoms/cc-flex-gap.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

const SKELETON_STATISTICS = {
  private_active_users: 15,
  public_active_users: 120,
  storage: 698980762,
  price: 17.50,
};

/**
 * A component that shows a summary of our Heptapod SaaS offer
 *
 * * 🎨 default CSS display: `flex`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/saas/cc-heptapod-info.js)
 *
 * ## Details
 *
 * * When `loading` is true, a skeleton screen UI pattern will be displayed for statistics.
 * * When `statistics` is nullish, a text saying that you do not use the service is displayed. Otherwise, usage numbers will be displayed.
 * * When `error` is true, an error message is displayed saying that the component's data failed to load.
 *
 * ## Type definitions
 *
 * ```js
 * interface Statistics {
 *   private_active_users: number,
 *   public_active_users: number,
 *   storage: number,
 *   price: float
 * }
 * ```
 *
 * @prop {Boolean} loading - The data is loading
 * @prop {Boolean} error - The data failed to load
 * @prop {Statistics} statistics - An object having the usage statistics of this heptapod SaaS
 */
export class CcHeptapodInfo extends LitElement {

  static get properties () {
    return {
      loading: { type: Boolean, attribute: true },
      error: { type: Boolean, attribute: true },
      statistics: { type: Object, attribute: false },
    };
  }

  constructor () {
    super();
    this.loading = true;
    this.error = false;
    this.statistics = null;
  }

  render () {
    const error = (this.error === true);
    const skeleton = (this.loading === true && error === false);
    const statistics = (skeleton ? SKELETON_STATISTICS : this.statistics);
    const dataLoaded = (skeleton === false && error === false);

    return html`
      <cc-block>
        <div slot="title">Heptapod</div>
        <div class="header">
          <img src="https://static-assets.cellar.services.clever-cloud.com/logos/heptapod.svg" alt="heptapod logo" title="heptapod logo" class="heptapod-logo"/>
          <div class="header-content">
            <div class="heptapod-name">Heptapod</div>
            <div class="heptapod-url"><a href="https://heptapod.host" rel="noreferrer noopener">https://heptapod.host</a></div>
          </div>
        </div>
        <div class="description">
          ${i18n('cc-heptapod-info.description')}
        </div>

        ${error === true ? html`
          <cc-error>${i18n('cc-heptapod-info.error-loading')}</cc-error>
        ` : ''
        }

        ${statistics !== null || skeleton === true ? html`
          <cc-flex-gap class="pricing">
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })} ">${statistics.private_active_users}</div>
              <div class="${classMap({ skeleton })}">${i18n('cc-heptapod-info.private-active-users-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.public_active_users}</div>
              <div class="${classMap({ skeleton })}">${i18n('cc-heptapod-info.public-active-users-description')}</div>
            </div>
            <div class="storage-size pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.storage-bytes', statistics.storage)}</div>
              <div class="${classMap({ skeleton })}">${i18n('cc-heptapod-info.storage-description')}</div>
            </div>
            <div class="monthly-pricing pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.price-value', statistics.price)}</div>
              <div class="${classMap({ skeleton })}">${i18n('cc-heptapod-info.price-description')}</div>
            </div>
          </cc-flex-gap>
        ` : ''}

        ${statistics === null && dataLoaded === true ? html`
          <div class="no-statistics">${i18n('cc-heptapod-info.not-in-use')}</div>
        ` : ''}

      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          max-width: 600px;
        }

        .header {
          display: flex;
        }

        .header-content {
          margin-left: 20px;
        }

        img.heptapod-logo {
          height: 50px;
          width: 50px;
        }

        .pricing {
          --cc-gap: 1rem;
        }

        .pricing-item {
          flex: 1 1 auto;
          text-align: center;
        }

        .pricing-item-value {
          font-weight: bold;
          margin-bottom: 2px;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-heptapod-info', CcHeptapodInfo);
