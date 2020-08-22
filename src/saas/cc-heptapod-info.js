import '../atoms/cc-flex-gap.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';
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

const HEPTAPOD_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/heptapod.svg';

/**
 * A component that shows a summary of our Heptapod SaaS offer.
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
 *   price: number,
 * }
 * ```
 *
 * @prop {Boolean} error - Displays an error message.
 * @prop {Boolean} loading - Indicates that the data is loading.
 * @prop {Statistics} statistics - Sets the usage statistics of this heptapod SaaS.
 */
export class CcHeptapodInfo extends LitElement {

  static get properties () {
    return {
      loading: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true },
      statistics: { type: Object },
    };
  }

  constructor () {
    super();
    this.loading = true;
    this.error = false;
    this.statistics = null;
  }

  render () {
    const skeleton = (this.loading && !this.error);
    const statistics = (skeleton ? SKELETON_STATISTICS : this.statistics);
    const dataLoaded = (!skeleton && !this.error);

    return html`
      <cc-block>
        <div slot="title">Heptapod</div>
        <div class="header">
          <img class="header-logo" src=${HEPTAPOD_LOGO_URL} alt="heptapod logo" title="heptapod logo">
          <div class="header-content">
            <div>Heptapod</div>
            <div>${ccLink('https://heptapod.host', 'https://heptapod.host')}</div>
          </div>
        </div>
        <div class="description">
          ${i18n('cc-heptapod-info.description')}
        </div>

        ${this.error ? html`
          <cc-error>${i18n('cc-heptapod-info.error-loading')}</cc-error>
        ` : ''}

        ${statistics != null || skeleton ? html`
          <cc-flex-gap class="pricing">
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.private_active_users}</div>
              <div>${i18n('cc-heptapod-info.private-active-users-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.public_active_users}</div>
              <div>${i18n('cc-heptapod-info.public-active-users-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.storage-bytes', statistics.storage)}</div>
              <div>${i18n('cc-heptapod-info.storage-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.price-value', statistics.price)}</div>
              <div>${i18n('cc-heptapod-info.price-description')}</div>
            </div>
          </cc-flex-gap>
        ` : ''}

        ${statistics == null && dataLoaded ? html`
          <div class="no-statistics">${i18n('cc-heptapod-info.not-in-use')}</div>
        ` : ''}

      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          max-width: 600px;
        }
        
        .header,
        .description,
        .pricing {
          line-height: 1.5;
        }

        .header {
          display: flex;
        }

        .header-logo {
          height: 3.25rem;
          width: 3.25rem;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 1rem;
        }


        .pricing {
          --cc-gap: 1rem;
        }

        .pricing-item {
          flex: 1 1 auto;
          text-align: center;
        }

        .pricing-item-value {
          display: inline-block;
          font-weight: bold;
        }

        .no-statistics {
          color: #555;
          font-style: italic;
          margin: 0.2rem;
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
