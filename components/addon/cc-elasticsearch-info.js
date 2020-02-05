import '../atoms/cc-img.js';
import '../molecules/cc-error.js';
import infoSvg from '../overview/info.svg';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { skeleton } from '../styles/skeleton.js';

const ELASTICSEARCH_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg';
const KIBANA_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg';
const ELASTICSEARCH_DOCUMENTATION = 'https://www.clever-cloud.com/doc/addons/elastic/';

/**
 * A component to display various links (Documentation, kibana, APM) for an elasticsearch service.
 *
 * ## Details
 *
 * * When one of elasticsearchLink, kibanaLink or apmLink is nullish, a skeleton UI (loading hint) is displayed.
 * * When error is set, an error message is displayed.
 *
 * @prop {String} apmLink - Sets APM service link.
 * @prop {String} elasticsearchLink - Sets main elasticsearch service link.
 * @prop {Boolean} error - Display an error message.
 * @prop {Boolean} hideElasticsearchLink - Hides elasticsearch service link.
 * @prop {String} kibanaLink - Sets kibana service link.
 */
export class CcElasticsearchInfo extends LitElement {

  static get properties () {
    return {
      apmLink: { type: String, attribute: 'apm-link' },
      elasticsearchLink: { type: String, attribute: 'elasticsearch-link' },
      error: { type: Boolean, attribute: 'error' },
      hideElasticsearchLink: { type: Boolean, attribute: 'hide-elasticsearch-link' },
      kibanaLink: { type: String, attribute: 'kibana-link' },
    };
  }

  constructor () {
    super();
    this.error = false;
    this.hideElasticsearchLink = false;
  }

  render () {

    const skeleton = (!this.hideElasticsearchLink && this.elasticsearchLink == null) || (this.kibanaLink == null) || (this.apmLink == null);

    return html`

      <div class="info-ribbon">${i18n('cc-elasticsearch-info.info')}</div>

      ${!this.error ? html`
        <div class="info-text">${i18n('cc-elasticsearch-info.text')}</div>
        
        <div class="link-list">
          ${!this.hideElasticsearchLink ? html`
            ${ccLink(this.elasticsearchLink, html`
              <cc-img src="${ELASTICSEARCH_LOGO_URL}"></cc-img><span class="${classMap({ skeleton })}">${i18n('cc-elasticsearch-info.link.elasticsearch')}</span>
            `)}
          ` : ''}
          ${ccLink(this.kibanaLink, html`
            <cc-img src="${KIBANA_LOGO_URL}"></cc-img><span class="${classMap({ skeleton })}">${i18n('cc-elasticsearch-info.link.kibana')}</span>
          `)}
          ${ccLink(this.apmLink, html`
            <cc-img src="${APM_LOGO_URL}"></cc-img><span class="${classMap({ skeleton })}">${i18n('cc-elasticsearch-info.link.apm')}</span>
          `)}
          ${ccLink(ELASTICSEARCH_DOCUMENTATION, html`
            <cc-img src="${infoSvg}"></cc-img><span>${i18n('cc-elasticsearch-info.link.doc')}</span>
          `)}
        </div>
      ` : ''}

      ${this.error ? html`
        <cc-error>${i18n('cc-elasticsearch-info.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      linkStyles,
      // language=CSS
      css`
        :host {
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          display: grid;
          grid-gap: 1rem;
          overflow: hidden;
          padding: 1rem 1rem 1rem 4rem;
          position: relative;
        }

        .link-list {
          display: flex;
          flex-wrap: wrap;
          margin: -0.5rem -0.75rem;
        }

        .cc-link {
          align-items: center;
          display: flex;
          margin: 0.5rem 0.75rem;
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
