import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';

/** @type {Statistics} */
const SKELETON_STATISTICS = {
  privateActiveUsers: 15,
  publicActiveUsers: 120,
  storage: 698980762,
  price: 17.5,
};

const HEPTAPOD_DOCUMENTATION = generateDocsHref('/addons/heptapod/');
const HEPTAPOD_LOGO_URL = 'https://assets.clever-cloud.com/logos/heptapod.svg';

/**
 * @typedef {import('./cc-heptapod-info.types.js').Statistics} Statistics
 * @typedef {import('./cc-heptapod-info.types.js').HeptapodInfoState} HeptapodInfoState
 * @typedef {import('./cc-heptapod-info.types.js').HeptapodInfoStateLoaded} HeptapodInfoStateLoaded
 * @typedef {import('./cc-heptapod-info.types.js').HeptapodInfoStateLoading} HeptapodInfoStateLoading
 */

/**
 * A component that shows a summary of our Heptapod SaaS offer.
 *
 * @cssdisplay block
 */
export class CcHeptapodInfo extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {HeptapodInfoState} Set the state of the component. */
    this.state = { type: 'loading' };
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">Heptapod</div>
        <div slot="content" class="header">
          <img class="header-logo" src=${HEPTAPOD_LOGO_URL} alt="heptapod logo" title="heptapod logo" />
          <div class="header-content">
            <div>Heptapod</div>
            <div><cc-link href="https://heptapod.host">https://heptapod.host</cc-link></div>
          </div>
        </div>
        <div slot="content" class="description">${i18n('cc-heptapod-info.description')}</div>

        ${this.state.type === 'error'
          ? html`
              <cc-notice
                slot="content"
                intent="warning"
                message="${i18n('cc-heptapod-info.error-loading')}"
              ></cc-notice>
            `
          : ''}
        ${this.state.type === 'not-used'
          ? html` <div slot="content" class="no-statistics">${i18n('cc-heptapod-info.not-in-use')}</div> `
          : ''}
        ${this.state.type === 'loading' ? this._renderStatistics(SKELETON_STATISTICS, true) : ''}
        ${this.state.type === 'loaded' ? this._renderStatistics(this.state.statistics, false) : ''}

        <div slot="footer-right">
          <cc-link href="${HEPTAPOD_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-heptapod-info.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {Statistics} statistics
   * @param {boolean} skeleton
   * @private
   */
  _renderStatistics(statistics, skeleton) {
    return html`
      <div slot="content" class="pricing">
        <div class="pricing-item">
          <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.privateActiveUsers}</div>
          <div>${i18n('cc-heptapod-info.private-active-users-description')}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${classMap({ skeleton })}">${statistics.publicActiveUsers}</div>
          <div>${i18n('cc-heptapod-info.public-active-users-description')}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${classMap({ skeleton })}">
            ${i18n('cc-heptapod-info.storage-bytes', statistics)}
          </div>
          <div>${i18n('cc-heptapod-info.storage-description')}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${classMap({ skeleton })}">
            ${i18n('cc-heptapod-info.price-value', statistics)}
          </div>
          <div>${i18n('cc-heptapod-info.price-description')}</div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
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
          flex-wrap: wrap;
          gap: 0.5em 1em;
        }

        .header-logo {
          height: 3.25em;
          width: 3.25em;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pricing {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .pricing-item {
          color: var(--cc-color-text-weak);
          flex: 1 1 auto;
          text-align: center;
        }

        .pricing-item-value {
          color: var(--cc-color-text-primary-highlight);
          display: inline-block;
          font-weight: bold;
        }

        .no-statistics {
          color: var(--cc-color-text-weak);
          font-style: italic;
          margin: 0.2em;
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
