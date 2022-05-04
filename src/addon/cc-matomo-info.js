import '../atoms/cc-img.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const infoSvg = new URL('../assets/info.svg', import.meta.url).href;

const MATOMO_LOGO_URL = 'https://assets.clever-cloud.com/logos/matomo.svg';
const PHP_LOGO_URL = 'https://assets.clever-cloud.com/logos/php.svg';
const MYSQL_LOGO_URL = 'https://assets.clever-cloud.com/logos/mysql.svg';
const REDIS_LOGO_URL = 'https://assets.clever-cloud.com/logos/redis.svg';
const MATOMO_DOCUMENTATION = 'https://www.clever-cloud.com/doc/deploy/addon/matomo/';

/**
 * A component to display various informations (Documentation, access, links, ...) for a Matomo service.
 *
 * @cssdisplay block
 */
export class CcMatomoInfo extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      matomoLink: { type: String, attribute: 'matomo-link' },
      mysqlLink: { type: String, attribute: 'mysql-link' },
      phpLink: { type: String, attribute: 'php-link' },
      redisLink: { type: String, attribute: 'redis-link' },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Display an error message. */
    this.error = false;

    /** @type {string|null} Provides the HTTP link of the Matomo service. */
    this.matomoLink = null;

    /** @type {string|null} Provides the HTTP link of the MySQL add-on. */
    this.mysqlLink = null;

    /** @type {string|null} Provides the HTTP link of the PHP app. */
    this.phpLink = null;

    /** @type {string|null} Provides the HTTP link of the Redis add-on. */
    this.redisLink = null;
  }

  render () {
    return html`

      <cc-block ribbon=${i18n('cc-matomo-info.info')} no-head>
        ${!this.error ? html`
          <div class="info-text">${i18n('cc-matomo-info.heading')}</div>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.open-matomo.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.open-matomo.text')}</div>
            <div>${this._renderLink(MATOMO_LOGO_URL, this.matomoLink, i18n('cc-matomo-info.open-matomo.link'))}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.documentation.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.documentation.text')}</div>
            <div>${this._renderLink(infoSvg, MATOMO_DOCUMENTATION, i18n('cc-matomo-info.documentation.link'))}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-matomo-info.about.title')}</div>
            <div slot="info">${i18n('cc-matomo-info.about.text')}</div>
            <div class="application-list">
              ${this._renderLink(PHP_LOGO_URL, this.phpLink, i18n('cc-matomo-info.link.php'))}
              ${this._renderLink(MYSQL_LOGO_URL, this.mysqlLink, i18n('cc-matomo-info.link.mysql'))}
              ${this._renderLink(REDIS_LOGO_URL, this.redisLink, i18n('cc-matomo-info.link.redis'))}
            </div>
          </cc-block-section>
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-matomo-info.error')}</cc-error>
        ` : ''}

      </cc-block>
    `;
  }

  // TODO: replace this with future cc-link component
  _renderLink (iconUrl, linkUrl, linkText) {
    return html`
      <div>
        ${ccLink(linkUrl, html`
          <cc-img src=${iconUrl}></cc-img>
          <span class="${classMap({ skeleton: (linkUrl == null) })}">${linkText}</span>
        `)}
      </div>
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          display: block;
        }

        [slot="info"] p:first-child {
          margin-top: 0;
        }

        [slot="info"] p:last-child {
          margin-bottom: 0;
        }

        .cc-link {
          align-items: center;
          display: inline-flex;
        }

        cc-img {
          border-radius: 0.25rem;
          flex: 0 0 auto;
          height: 1.5rem;
          margin-right: 0.5rem;
          width: 1.5rem;
        }

        .application-list > * {
          margin-bottom: 0.5em;
        }

        cc-error {
          text-align: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-matomo-info', CcMatomoInfo);
