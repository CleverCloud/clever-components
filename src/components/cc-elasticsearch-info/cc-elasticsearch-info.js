import '../cc-img/cc-img.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const infoSvg = new URL('../../assets/info.svg', import.meta.url).href;

const ELASTICSEARCH_LOGO_URL = 'https://assets.clever-cloud.com/logos/elastic.svg';
const KIBANA_LOGO_URL = 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg';
const ELASTICSEARCH_DOCUMENTATION = 'https://www.clever-cloud.com/doc/addons/elastic/';

/**
 * @typedef {import('./cc-elasticsearch-info.types.js').Link} Link
 */

/**
 * A component to display various links (Documentation, kibana, APM) for an elasticsearch service.
 *
 * ## Details
 *
 * * You need to list the links you want to display in `links`.
 * * You can omit the `href` property while you wait for the real link, a skeleton UI (loading hint) will be displayed.
 *
 * @cssdisplay block
 */
export class CcElasticsearchInfo extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      links: { type: Array },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Display an error message. */
    this.error = false;

    /** @type {Link[]|null} Sets the different links. */
    this.links = null;
  }

  render () {

    const links = this.links ?? [];
    const elasticsearchLink = links.find(({ type }) => type === 'elasticsearch');
    const kibanaLink = links.find(({ type }) => type === 'kibana');
    const apmLink = links.find(({ type }) => type === 'apm');

    return html`

      <cc-block ribbon=${i18n('cc-elasticsearch-info.info')} no-head>

        ${!this.error ? html`
          <div class="info-text">${i18n('cc-elasticsearch-info.text')}</div>

          <div class="link-list">
            ${ccLink(ELASTICSEARCH_DOCUMENTATION, html`
              <cc-img src="${infoSvg}"></cc-img><span>${i18n('cc-elasticsearch-info.link.doc')}</span>
            `)}
            ${elasticsearchLink != null ? html`
              ${ccLink(elasticsearchLink.href, html`
                <cc-img src="${ELASTICSEARCH_LOGO_URL}"></cc-img>
                <span class="${classMap({ skeleton: (elasticsearchLink.href == null) })}">${i18n('cc-elasticsearch-info.link.elasticsearch')}</span>
              `)}
            ` : ''}
            ${kibanaLink != null ? html`
              ${ccLink(kibanaLink.href, html`
                <cc-img src="${KIBANA_LOGO_URL}"></cc-img>
                <span class="${classMap({ skeleton: (kibanaLink.href == null) })}">${i18n('cc-elasticsearch-info.link.kibana')}</span>
              `)}
            ` : ''}
            ${apmLink != null ? html`
              ${ccLink(apmLink.href, html`
                <cc-img src="${APM_LOGO_URL}"></cc-img>
                <span class="${classMap({ skeleton: (apmLink.href == null) })}">${i18n('cc-elasticsearch-info.link.apm')}</span>
              `)}
            ` : ''}
          </div>
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-elasticsearch-info.error')}</cc-error>
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

        .link-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .cc-link {
          display: flex;
          align-items: center;
        }

        cc-img {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
          margin-right: 0.5em;
          border-radius: var(--cc-border-radius-default, 0.25em);
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
