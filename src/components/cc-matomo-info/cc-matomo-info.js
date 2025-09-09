import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';

/** @type {{ [key: string]: null }} */
const SKELETON_INFO = { matomoUrl: null, phpUrl: null, mysqlUrl: null, redisUrl: null };

const MATOMO_LOGO_URL = 'https://assets.clever-cloud.com/logos/matomo.svg';
const PHP_LOGO_URL = 'https://assets.clever-cloud.com/logos/php.svg';
const MYSQL_LOGO_URL = 'https://assets.clever-cloud.com/logos/mysql.svg';
const REDIS_LOGO_URL = 'https://assets.clever-cloud.com/logos/redis.svg';
const MATOMO_DOCUMENTATION = generateDocsHref('/deploy/addon/matomo/');

/**
 * @typedef {import('./cc-matomo-info.types.js').MatomoInfoState} MatomoInfoState
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component to display information (Documentation, access, links, ...) for a Matomo service.
 *
 * @cssdisplay block
 */
export class CcMatomoInfo extends LitElement {
  static get properties() {
    return {
      matomoLogoUrl: { type: String, attribute: 'matomo-logo-url' },
      mysqlLogoUrl: { type: String, attribute: 'mysql-logo-url' },
      phpLogoUrl: { type: String, attribute: 'php-logo-url' },
      redisLogoUrl: { type: String, attribute: 'redis-logo-url' },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {MatomoInfoState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {string} Sets the matomo logo */
    this.matomoLogourl = MATOMO_LOGO_URL;

    /** @type {string} Sets the php logo */
    this.matomoLogoUrl = PHP_LOGO_URL;

    /** @type {string} Sets the mysql logo */
    this.mysqlLogoUrl = MYSQL_LOGO_URL;

    /** @type {string} Sets the redis logo */
    this.redisLogoUrl = REDIS_LOGO_URL;
  }

  render() {
    const skeleton = this.state.type === 'loading';
    const { matomoUrl, phpUrl, mysqlUrl, redisUrl } = this.state.type === 'loaded' ? this.state : SKELETON_INFO;

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-matomo-info.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="ribbon">${i18n('cc-matomo-info.info')}</div>
        <div slot="header" class="info-text">${i18n('cc-matomo-info.heading')}</div>

        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-matomo-info.open-matomo.title')}</div>
          <div slot="info">${i18n('cc-matomo-info.open-matomo.text')}</div>
          <div>
            ${this._renderImageLink(this.matomoLogourl, matomoUrl, i18n('cc-matomo-info.open-matomo.link'), skeleton)}
          </div>
        </cc-block-section>

        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-matomo-info.about.title')}</div>
          <div slot="info">${i18n('cc-matomo-info.about.text')}</div>
          <div class="application-list">
            ${this._renderImageLink(this.matomoLogoUrl, phpUrl, i18n('cc-matomo-info.link.php'), skeleton)}
            ${this._renderImageLink(this.mysqlLogoUrl, mysqlUrl, i18n('cc-matomo-info.link.mysql'), skeleton)}
            ${this._renderImageLink(this.redisLogoUrl, redisUrl, i18n('cc-matomo-info.link.redis'), skeleton)}
          </div>
        </cc-block-section>

        <div slot="footer-right">
          <cc-link href="${MATOMO_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-matomo-info.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {string} imageUrl
   * @param {string|null} linkUrl
   * @param {string} linkText
   * @param {boolean} skeleton
   * @returns {TemplateResult}
   * @private
   */
  _renderImageLink(imageUrl, linkUrl, linkText, skeleton) {
    return html`
      <div>
        <cc-link href="${linkUrl}" .image=${imageUrl} ?skeleton=${skeleton}>
          <span> ${linkText}</span>
        </cc-link>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1em;

          display: block;
        }

        [slot='info'] p:first-child {
          margin-top: 0;
        }

        [slot='info'] p:last-child {
          margin-bottom: 0;
        }

        cc-link {
          align-items: center;
          display: inline-flex;
        }

        cc-link::part(img) {
          border-radius: var(--cc-border-radius-default, 0.25em);
          flex: 0 0 auto;
          height: 1.5em;
          width: 1.5em;
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        .application-list > * {
          margin-bottom: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-matomo-info', CcMatomoInfo);
