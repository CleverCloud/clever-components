import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

/** @type {Statistics} */
const SKELETON_STATISTICS = {
  privateActiveUsers: 15,
  publicActiveUsers: 120,
  storage: 698980762,
  price: 17.50,
};

const HEPTAPOD_LOGO_URL = 'https://assets.clever-cloud.com/logos/heptapod.svg';

/**
 * @typedef {import('./cc-heptapod-info.types.js').Statistics} Statistics
 */

/**
 * A component that shows a summary of our Heptapod SaaS offer.
 *
 * ## Details
 *
 * * When `statistics` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * @cssdisplay block
 */
export class CcHeptapodInfo extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      statistics: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {Statistics|null} Sets the usage statistics of this heptapod SaaS or `"not-used"` to display a message explaining the service is not used. */
    this.statistics = null;
  }

  render () {
    const skeleton = (this.statistics == null);
    const statistics = skeleton ? SKELETON_STATISTICS : this.statistics;
    const isNotUsed = (this.statistics === 'not-used');

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

        ${!this.error && !isNotUsed ? html`
          <cc-flex-gap class="pricing">
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.privateActiveUsers}</div>
              <div>${i18n('cc-heptapod-info.private-active-users-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.publicActiveUsers}</div>
              <div>${i18n('cc-heptapod-info.public-active-users-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.storage-bytes', statistics)}</div>
              <div>${i18n('cc-heptapod-info.storage-description')}</div>
            </div>
            <div class="pricing-item">
              <div class="pricing-item-value ${classMap({ skeleton })}">${i18n('cc-heptapod-info.price-value', statistics)}</div>
              <div>${i18n('cc-heptapod-info.price-description')}</div>
            </div>
          </cc-flex-gap>
        ` : ''}

        ${!this.error && isNotUsed ? html`
          <div class="no-statistics">${i18n('cc-heptapod-info.not-in-use')}</div>
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-heptapod-info.error-loading')}</cc-error>
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
          display: block;
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
          width: 3.25em;
          height: 3.25em;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 1em;
        }

        .pricing {
          --cc-gap: 1em;
        }

        .pricing-item {
          flex: 1 1 auto;
          color: var(--cc-color-text-weak);
          text-align: center;
        }

        .pricing-item-value {
          display: inline-block;
          color: var(--cc-color-text-primary-highlight);
          font-weight: bold;
        }

        .no-statistics {
          margin: 0.2em;
          color: var(--cc-color-text-weak);
          font-style: italic;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
          color: transparent;
        }
      `,
    ];
  }
}

window.customElements.define('cc-heptapod-info', CcHeptapodInfo);
