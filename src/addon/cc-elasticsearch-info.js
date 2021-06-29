import '../atoms/cc-img.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const infoSvg = new URL('../assets/info.svg', import.meta.url).href;

const ELASTICSEARCH_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg';
const KIBANA_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg';
const ELASTICSEARCH_DOCUMENTATION = 'https://www.clever-cloud.com/doc/addons/elastic/';

/**
 * A component to display various links (Documentation, kibana, APM) for an elasticsearch service.
 *
 * ## Details
 *
 * * You need to list the links you want to display in `links`.
 * * You can omit the `href` property while you wait for the real link, a skeleton UI (loading hint) will be displayed.
 *
 * ## Type definitions
 *
 * ```js
 * interface Link {
 *   type: "elasticsearch"|"kibana"|"apm",
 *   href?: string,
 * }
 * ```
 *
 * @cssdisplay grid
 *
 * @prop {Link[]} links - Sets the different links.
 * @prop {Boolean} error - Display an error message.
 */
export class CcElasticsearchInfo extends LitElement {

  static get properties () {
    return {
      links: { type: Array, attribute: 'links' },
      error: { type: Boolean, attribute: 'error' },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  render () {

    const links = this.links || [];
    const elasticsearchLink = links.find(({ type }) => type === 'elasticsearch');
    const kibanaLink = links.find(({ type }) => type === 'kibana');
    const apmLink = links.find(({ type }) => type === 'apm');

    return html`

      <div class="info-ribbon">${i18n('cc-elasticsearch-info.info')}</div>

      ${!this.error ? html`
        <div class="info-text">${i18n('cc-elasticsearch-info.text')}</div>
        
        <cc-flex-gap class="link-list">
          ${ccLink(ELASTICSEARCH_DOCUMENTATION, html`
            <cc-img src="${infoSvg}"></cc-img><span>${i18n('cc-elasticsearch-info.link.doc')}</span>
          `)}
          ${elasticsearchLink != null ? html`
            ${ccLink(elasticsearchLink.href, html`
              <cc-img src="${ELASTICSEARCH_LOGO_URL}"></cc-img><span class="${classMap({ skeleton: (elasticsearchLink.href == null) })}">${i18n('cc-elasticsearch-info.link.elasticsearch')}</span>
            `)}
          ` : ''}
          ${kibanaLink != null ? html`
            ${ccLink(kibanaLink.href, html`
              <cc-img src="${KIBANA_LOGO_URL}"></cc-img><span class="${classMap({ skeleton: (kibanaLink.href == null) })}">${i18n('cc-elasticsearch-info.link.kibana')}</span>
            `)}
          ` : ''}
          ${apmLink != null ? html`
            ${ccLink(apmLink.href, html`
              <cc-img src="${APM_LOGO_URL}"></cc-img><span class="${classMap({ skeleton: (apmLink.href == null) })}">${i18n('cc-elasticsearch-info.link.apm')}</span>
            `)}
          ` : ''}
        </cc-flex-gap>
      ` : ''}

      ${this.error ? html`
        <cc-error>${i18n('cc-elasticsearch-info.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: grid;
          grid-gap: var(--cc-gap);
          overflow: hidden;
          padding: var(--cc-gap);
          padding-left: 4rem;
          position: relative;
        }

        .cc-link {
          align-items: center;
          display: flex;
        }

        cc-img {
          border-radius: 0.25rem;
          flex: 0 0 auto;
          height: 1.5rem;
          margin-right: 0.5rem;
          width: 1.5rem;
        }

        .info-ribbon {
          --height: 1.5rem;
          --width: 8rem;
          --r: -45deg;
          --translate: 1.6rem;
          background: #3A3871;
          color: white;
          font-size: 0.9rem;
          font-weight: bold;
          height: var(--height);
          left: calc(var(--width) / -2);
          line-height: var(--height);
          position: absolute;
          text-align: center;
          top: calc(var(--height) / -2);
          transform: rotate(var(--r)) translateY(var(--translate));
          width: var(--width);
          z-index: 2;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }

        cc-error {
          text-align: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-elasticsearch-info', CcElasticsearchInfo);
