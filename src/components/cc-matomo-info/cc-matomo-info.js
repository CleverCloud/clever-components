import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const MATOMO_LOGO_URL = 'https://assets.clever-cloud.com/logos/matomo.svg';
const PHP_LOGO_URL = 'https://assets.clever-cloud.com/logos/php.svg';
const MYSQL_LOGO_URL = 'https://assets.clever-cloud.com/logos/mysql.svg';
const REDIS_LOGO_URL = 'https://assets.clever-cloud.com/logos/redis.svg';
const MATOMO_DOCUMENTATION = 'https://www.clever-cloud.com/doc/deploy/addon/matomo/';

/**
 * @typedef {import('./cc-matomo-info.types.js').MatomoInfoState} MatomoInfoState
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('../common.types.js').IconModel} IconModel
 */

/**
 * A component to display various information (Documentation, access, links, ...) for a Matomo service.
 *
 * @cssdisplay block
 */
export class CcMatomoInfo extends LitElement {

  static get properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {MatomoInfoState} Sets the state of the component. */
    this.state = { type: 'loading' };
  }

  render () {

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-matomo-info.error')}"></cc-notice>`;
    }

    return html`

      <cc-block ribbon=${i18n('cc-matomo-info.info')} no-head>
          <div class="info-text">${i18n('cc-matomo-info.heading')}</div>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.open-matomo.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.open-matomo.text')}</div>
            <div>${this._renderImageLink(MATOMO_LOGO_URL, this.state.matomoUrl, i18n('cc-matomo-info.open-matomo.link'))}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.documentation.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.documentation.text')}</div>
            <div>${this._renderIconLink(iconInfo, MATOMO_DOCUMENTATION, i18n('cc-matomo-info.documentation.link'))}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.about.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.about.text')}</div>
            <div class="application-list">
              ${this._renderImageLink(PHP_LOGO_URL, this.state.phpUrl, i18n('cc-matomo-info.link.php'))}
              ${this._renderImageLink(MYSQL_LOGO_URL, this.state.mysqlUrl, i18n('cc-matomo-info.link.mysql'))}
              ${this._renderImageLink(REDIS_LOGO_URL, this.state.redisUrl, i18n('cc-matomo-info.link.redis'))}
            </div>
          </cc-block-section>
      </cc-block>
    `;
  }

  // TODO: replace this with future cc-link component
  /**
   * @param {string} imageUrl
   * @param {string} linkUrl
   * @param {string} linkText
   * @returns {TemplateResult}
   * @private
   */
  _renderImageLink (imageUrl, linkUrl, linkText) {
    return html`
      <div>
        ${ccLink(linkUrl, html`
          <cc-img src=${imageUrl}></cc-img>
          <span class="${classMap({ skeleton: (this.state.type === 'loading') })}">${linkText}</span>
        `)}
      </div>
    `;
  }

  /**
   * @param {IconModel} icon
   * @param {string} linkUrl
   * @param {string} linkText
   * @returns {TemplateResult}
   * @private
   */
  _renderIconLink (icon, linkUrl, linkText) {
    return html`
      <div>
        ${ccLink(linkUrl, html`
          <cc-icon size="lg" .icon=${icon}></cc-icon>
          <span>${linkText}</span>
        `)}
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
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

        .cc-link {
          display: inline-flex;
          align-items: center;
        }

        cc-img {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
          margin-right: 0.5em;
          border-radius: var(--cc-border-radius-default, 0.25em);
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
