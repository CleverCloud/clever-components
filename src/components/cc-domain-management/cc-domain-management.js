import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixCheckLine as iconValid,
  iconRemixErrorWarningLine as iconError,
  iconRemixExternalLinkLine as iconLink,
  iconRemixSettings_4Line as iconOptions,
  iconRemixShieldCheckFill as iconSecure,
  iconRemixFlaskLine as iconTest,
} from '../../assets/cc-remix.icons.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { publicSuffixList } from './public-suffix-list.js';
import { tldList } from './tld-list.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-button/cc-button.js';
import '../cc-loader/cc-loader.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-popover/cc-popover.js';
import '../cc-block-section/cc-block-section.js';

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
      state: { type: Object },
      _paginatedDomains: { type: Array, state: true },
      _currentPage: { type: Number, state: true },
      _domainSuggestions: { type: Array, state: true },
      _baseDomains: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {} ...*/
    this.state = { type: 'loading' };

    this._paginatedDomains = [];

    this._domainSuggestions = [];

    this._baseDomains = [];

    this._currentPage = 0;
  }

  /**
   * @template T
   * @param {[]} array
   * @param {number} itemsPerPage
   * @returns {Array<Array<T>>}
   */
  _paginateArray (array, itemsPerPage) {
    const paginatedArray = [];
    for (let i = itemsPerPage; i < array.length + itemsPerPage; i += itemsPerPage) {
      paginatedArray.push(array.slice(Math.max(i - itemsPerPage, 0), i));
    }
    return paginatedArray;
  }

  /**
   * @param {Event & { detail: string }} event
   */
  _onDomainInput ({ detail: value }) {
    this._domainSuggestions = [];

    if (value.endsWith('.')) {
      // TODO: get rid of *.cleverapps.io domains
      this._domainSuggestions = this._baseDomains.map((domain) => {
        const newValue = value.replace(/\.$/, '');
        return newValue + '.' + domain;
      });
    }

    if (value.includes('.') && !value.endsWith('.')) {
      const potentialDomain = value.split('.').slice(-1)[0];
      // TODO: get rid of *.cleverapps.io domains
      this._domainSuggestions = this._baseDomains.filter((domain) => {
        return domain.startsWith(potentialDomain);
      }).map((domain) => {
        const newValue = value.replace(new RegExp(potentialDomain + '$'), domain);
        return newValue;
      });
    }
  }

  _onPathInput ({ target, detail: value }) {
    if (!value.startsWith('/')) {
      target.value = '/' + value;
    }
  }

  _onDomainPaste (event) {
    console.log(event);
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    console.log(paste);
    const pasteValueAsURL = new URL('https://' + paste);
    console.log(pasteValueAsURL);
    const path = pasteValueAsURL.pathname;
    if (path != null && path.length > 0) {
      console.log(path);
      console.log(event.target);
      console.log(pasteValueAsURL.hostname);

      event.target.value = pasteValueAsURL.hostname;
    }
  }

  /**
   * @param {CcDomainManagementPropertyValues} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has('state') && this.state.domains != null && this.state.domains.length > 0) {
      this._paginatedDomains = this._paginateArray(this.state.domains, 10);
      this._currentPage = 0;
      this._filteredDomains = this.state.domains;
      const domainsToBeMerged = [...this.state.domains.map((domain) => {
        const domainAsUrl = new URL('https://' + domain.name);
        const hostname = domainAsUrl.hostname;
        if (hostname.includes('cleverapps.io')) {
          return 'cleverapps.io';
        }
        const publicSuffixes = publicSuffixList.filter((publicSuffix) => {
          return hostname.endsWith(publicSuffix) && publicSuffix.length > 0;
        });
        const tld = tldList.find((tld) => {
          return hostname.endsWith(tld) && tld.length > 0;
        });
        const publicSuffix = publicSuffixes?.sort((a, b) => b.length - a.length)[0];
        const removeEtld = new RegExp(`.+(?=\\.${publicSuffix ?? tld})`, 'gm');
        const domainWithoutEtld = hostname.match(removeEtld)?.[0];
        const domainWithoutEtldAndSubdomains = domainWithoutEtld.split('.').slice(-1)[0];

        return domainWithoutEtldAndSubdomains + '.' + (publicSuffix ?? tld);
      }), 'cleverapps.io'];
      this._baseDomains = [...new Set(domainsToBeMerged)];
    }
  }

  render () {
    return html`              
      <div class="wrapper">
        <cc-block>
          <div slot="title">Add a domain</div>
          <div>
            <form>
              <cc-input-text class="add-domain" label="Domain" @paste=${this._onDomainPaste} @cc-input-text:input=${this._onDomainInput}>
                ${this._domainSuggestions.length > 0 ? html`
                  <ul slot="help" class="suggestion-list">
                    <li>--- suggestions ---</li>
                    ${this._domainSuggestions.map((domainSuggestion) => html`
                      <li tabindex="-1" class=${classMap({ 'test-only': domainSuggestion.includes('cleverapps.io') })}>
                        ${domainSuggestion} 
                        ${domainSuggestion.includes('cleverapps.io') ? html`
                          <span class="test-only"> <cc-icon .icon=${iconTest}></cc-icon> Testing purposes only</span>
                        ` : ''}</li>
                    `)}
                  </ul>
                ` : ''}
              </cc-input-text>
              <cc-input-text label="Path" @cc-input-text:input=${this._onPathInput}></cc-input-text>
              <cc-button>Add domain</cc-button>
            </form>
            <p>Amet deleniti ipsum incidunt similique pariatur Sunt temporibus dolores iure nulla corrupti Adipisci explicabo architecto nesciunt dolorum consequuntur assumenda. Nulla asperiores eius odio vitae dolorem Necessitatibus vitae praesentium alias minima</p>
            <p>Amet deleniti ipsum incidunt similique pariatur Sunt temporibus dolores iure nulla corrupti Adipisci explicabo architecto nesciunt dolorum consequuntur assumenda. Nulla asperiores eius odio vitae dolorem Necessitatibus vitae praesentium alias minima</p>
          </div>
        </cc-block>

        <cc-block>
          <div slot="title">Manage your domains</div>

          ${this.state.type === 'loading' ? html`
            <cc-loader></cc-loader>
          ` : ''}

          ${this.state.type === 'loaded' && this.state.domains.length > 0 ? html`
            <cc-input-text label="Filter the domain list"></cc-input-text>
            ${this._renderDomainList(this._paginatedDomains[this._currentPage])}
          ` : ''}
        </cc-block>
        <!---->
        <!-- <cc-block> -->
        <!--   <div slot="title">Configure your DNS</div> -->
        <!--   <cc-block-section> -->
        <!--     <div slot="title">CNAME</div> -->
        <!--     <div slot="info"> -->
        <!--       <p>Dolor eligendi ipsum asperiores sit est? At vel impedit doloremque dolore eum? Quidem alias porro libero atque distinctio, quasi Nobis sunt atque sapiente animi molestias! Dolor maxime amet error enim.</p> -->
        <!--     </div> -->
        <!--     <div> -->
        <!--       <cc-input-text readonly clipboard value="domain.par.clever-cloud.com."></cc-input-text> -->
        <!--     </div> -->
        <!--   </cc-block-section> -->
        <!--   <cc-block-section> -->
        <!--     <div slot="title">A RECORDS</div> -->
        <!--     <div slot="info"> -->
        <!--       <p>Dolor eligendi ipsum asperiores sit est? At vel impedit doloremque dolore eum? Quidem alias porro libero atque distinctio, quasi Nobis sunt atque sapiente animi molestias! Dolor maxime amet error enim.</p> -->
        <!--       <p>Dolor eligendi ipsum asperiores sit est? At vel impedit doloremque dolore eum? Quidem alias porro libero atque distinctio, quasi Nobis sunt atque sapiente animi molestias! Dolor maxime amet error enim.</p> -->
        <!--     </div> -->
        <!--     <div class="a-records"> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.103"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--       <cc-input-text readonly clipboard value="46.252.181.104"></cc-input-text> -->
        <!--     </div> -->
        <!--   </cc-block-section> -->
        <!-- </cc-block> -->
      </div>
    `;
  }

  _renderDomainList (domains) {
    return html`
      <div class="domains">
        ${domains.map((domain) => html`
          <div class="domain">
            <span class="domain-name">
              ${domain.name}
              ${domain.primary ? html`<cc-badge>primary</cc-badge>` : ''}
            </span>
            <a class="cc-link" href="https://${domain.name}" title="Open https://${domain.name}">
              <span>https://${domain.name}</span>
              <cc-icon .icon=${iconLink}></cc-icon>
              <span class="visually-hidden">https://${domain.name}</span>
            </a>
            <cc-badge 
              .icon=${domain.dnsKO ? iconError : iconValid}
              intent=${domain.dnsKO ? 'danger' : 'success'}
              weight="${domain.dnsKO ? 'strong' : 'outlined'}"
            >
              DNS config
            </cc-badge>
            <cc-popover a11y-name="Options" position="bottom-right" class="buttons">
              <cc-icon slot="button-content" .icon=${iconOptions}></cc-icon>
              <div class="options">
                ${domain.dnsKO ? html`<cc-button primary>Troubleshoot</cc-button>` : ''}
                ${!domain.primary ? html`<cc-button primary outlined>Mark as primary</cc-button>` : ''}
                <cc-button danger outlined>Delete</cc-button>
              </div>
            </cc-popover>
          </div>
        `)}
      </div>
      <nav role="navigation" aria-label="domain list pages">
        <ul>
          ${this._currentPage > 0 ? html`
            <li><a class="cc-link" href="">Previous page</a></li>
            ` : ''}

          ${this._paginatedDomains.map((_, pageNumber) => {
            if (pageNumber === this._currentPage) {
              return html`
                <li aria-current="page">Page ${pageNumber + 1}</li>
              `;
            }
            return html`<li><a href="${pageNumber + 1}">Page ${pageNumber + 1}</a></li>`;
          })}

          ${this._currentPage < this._paginatedDomains.length ? html`
            <li><a class="cc-link" href="">Next page</a></li>
          ` : ''}
        </ul>
      </nav>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      accessibilityStyles,
      css`
        :host {
          display: block;
        }

        .add-domain {
          position: relative;
        }

        li.test-only {
          background-color: var(--cc-color-bg-neutral);
          margin-inline: -0.5em;
          padding-inline: 1em !important;
        }

        span.test-only {
          color: var(--cc-color-text-primary);
        }

        .suggestion-list {
          position: absolute;
          z-index: 2;
          top: 100%;
          left: 0;
          overflow: auto;
          width: 100%;
          max-height: 12em;
          box-sizing: border-box;
          padding: 0 0.5em;
          background-color: var(--cc-color-bg-default);
          box-shadow: 1px 1px 2px 2px #0003;
          list-style: none;
        }

        .suggestion-list li:first-of-type {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }

        .suggestion-list li {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 0.2em 0.5em;
          gap: 0.3em;
        }

        p {
          margin-block: 0.5em;
        }

        .wrapper {
          display: grid;
          gap: 1.5em;
        }

        .success {
          color: var(--cc-color-text-primary);
        }

        form {
          display: flex;
          align-items: start;
          margin-bottom: 2.5em;
          gap: 0.5em;
        }

        cc-input-text {
          flex: 1 1 0;
        }

        form cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        .domains {
          display: grid;
          align-content: center;
          align-items: center;
          /** justify-content: space-between; */
          gap: 1em 3em;
          grid-auto-flow: row;
          grid-template-columns: 1fr max-content max-content auto;
        }

        .domain {
          display: contents;
        }

        .domain-name {
          font-size: 1.1em;
        }

        .domains a {
          padding: 0.5em 1.5em;
        }

        .buttons {
          display: flex;
          margin-left: auto;
          gap: 0.5em;
        }

        .options {
          display: grid;
          width: max-content;
          gap: 0.5em;
        }

        nav ul {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          list-style: none;
        }

        nav ul li:not(:last-of-type)::after {
          margin-left: 0.5em;
          content: '|';
        }

        .a-records {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .a-records cc-input-text {
          flex: 0 0 auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-domain-management', CcDomainManagement);
