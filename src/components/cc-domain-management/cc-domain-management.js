import { css, html, LitElement } from 'lit';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-button/cc-button.js';
import { publicSuffixList } from './public-suffix-list.js';
import { tldList } from './tld-list.js';

/**
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('./cc-domain-management.types.js').DataListOption} DataListOption
 * @typedef {import('lit').PropertyValues<CcDomainManagement>} CcDomainManagementPropertyValues
 */

/**
 * A component to highlight a small chunk of text.
 *
 * @cssdisplay inline-block
 */
export class CcDomainManagement extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

  }

  /**
   * @param {Event & { target: CcInputText }} event
   */
  _onDomainBlur ({ target }) {
    console.log('blurrr');
    const value = target.value;
    // trouver Path
    // trouver publicSuffix
    // trouver Tld
    // trouver domaine
    // trouver subDomain
    const domainAsUrl = new URL('https://' + value);
    const path = domainAsUrl.pathname;
    const hostname = domainAsUrl.hostname;
    const publicSuffixes = publicSuffixList.filter((publicSuffix) => {
      return hostname.endsWith(publicSuffix) && publicSuffix.length > 0;
    });
    const tld = tldList.find((tld) => {
      return hostname.endsWith(tld) && tld.length > 0;
    });
    const publicSuffix = publicSuffixes?.sort((a, b) => b.length - a.length)[0];

    console.log({ path, hostname, eTld: publicSuffix ?? tld });
    // const lastPart = splitDomain.slice(-1)[0];
    // const tld = tldList.find((tld) => tld === lastPart.toUpperCase());
    //
    // if (splitDomain.length > 1 && (publicSuffix !== undefined || tld !== undefined)) {
    //   const domain = {
    //     eTld:
    //     domain: splitDomain.slice(-2)[0],
    //   };
    // }

    // extract public list
    // on prend le reste et on découpe par "."
    // juste après le etld, on aura le domaine
    // et après le ou les sous-domaines
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">Add a domain</div>
        <cc-input-text id="toto" label="Domain name" @blur=${this._onDomainBlur}></cc-input-text>
        <cc-button>Add domain</cc-button>
        <div class="live-preview">

        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      css`

      `,
    ];
  }
}

window.customElements.define('cc-domain-management', CcDomainManagement);
