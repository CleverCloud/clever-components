import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';

const ELASTICSEARCH_LOGO_URL = 'https://assets.clever-cloud.com/logos/elastic.svg';
const KIBANA_LOGO_URL = 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg';
const ELASTICSEARCH_DOCUMENTATION = generateDocsHref('/addons/elastic/');
const linksSortOrder = ['elasticsearch', 'kibana', 'apm'];

/**
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoState} ElasticSearchInfoState
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoStateLoaded} ElasticSearchInfoStateLoaded
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoStateLoading} ElasticSearchInfoStateLoading
 * @typedef {import('./cc-elasticsearch-info.types.js').LinkType} LinkType
 * @typedef {import('./cc-elasticsearch-info.types.js').LinkLoading} LinkLoading
 * @typedef {import('./cc-elasticsearch-info.types.js').LinkLoaded} LinkLoaded
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component to display various links (Documentation, kibana, APM) for an elasticsearch service.
 *
 * ## Details
 *
 * * You need to list the links you want to display in `links`.
 *
 * @cssdisplay block
 */
export class CcElasticsearchInfo extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {ElasticSearchInfoState} Sets the state of the component */
    this.state = {
      type: 'loading',
      links: [{ type: 'elasticsearch' }, { type: 'kibana' }, { type: 'apm' }],
    };
  }

  /**
   * @param {LinkType} linkType
   * @returns {string} the corresponding translation
   * @private
   */
  _getLinkText(linkType) {
    switch (linkType) {
      case 'elasticsearch':
        return i18n('cc-elasticsearch-info.link.elasticsearch');
      case 'kibana':
        return i18n('cc-elasticsearch-info.link.kibana');
      case 'apm':
        return i18n('cc-elasticsearch-info.link.apm');
    }
  }

  /**
   * @param {LinkType} linkType
   * @returns {string} the corresponding logo URL
   * @private
   */
  _getLogo(linkType) {
    switch (linkType) {
      case 'elasticsearch':
        return ELASTICSEARCH_LOGO_URL;
      case 'kibana':
        return KIBANA_LOGO_URL;
      case 'apm':
        return APM_LOGO_URL;
    }
  }

  /**
   * @param {Array<LinkLoaded|LinkLoading>} links
   * @returns {Array<LinkLoaded|LinkLoading>} sorted Links
   */
  _getSortedLinks(links) {
    return links.sort((a, b) => {
      return linksSortOrder.indexOf(a.type) - linksSortOrder.indexOf(b.type);
    });
  }

  render() {
    const skeleton = this.state.type === 'loading';

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-elasticsearch-info.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="ribbon">${i18n('cc-elasticsearch-info.info')}</div>
        <div slot="content" class="info-text">${i18n('cc-elasticsearch-info.text')}</div>

        <div slot="content" class="link-list">${this._renderLinks(this.state.links, skeleton)}</div>

        <div slot="footer-right">
          <cc-link href="${ELASTICSEARCH_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-elasticsearch-info.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {LinkLoaded[]|LinkLoading[]} links
   * @param {Boolean} skeleton
   * @returns {TemplateResult[]}
   * @private
   */
  _renderLinks(links, skeleton) {
    const sortedLinks = this._getSortedLinks(links);

    return sortedLinks.map(
      ({ href, type }) => html`
        <cc-link href="${href}" image="${this._getLogo(type)}">
          <span class="${classMap({ skeleton })}">${this._getLinkText(type)}</span>
        </cc-link>
      `,
    );
  }

  static get styles() {
    return [
      skeletonStyles,
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

        cc-link {
          align-items: center;
          display: flex;
        }

        cc-link::part(img) {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 1.5em;
          width: 1.5em;
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-elasticsearch-info', CcElasticsearchInfo);
