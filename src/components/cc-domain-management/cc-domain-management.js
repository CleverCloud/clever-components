import { css, html, LitElement } from 'lit';
import {
  iconRemixCheckLine as iconValid,
  iconRemixErrorWarningLine as iconError,
  iconRemixExternalLinkLine as iconLink,
  iconRemixSettings_4Line as iconOptions,
  iconRemixShieldCheckFill as iconSecure,
} from '../../assets/cc-remix.icons.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-button/cc-button.js';
import '../cc-loader/cc-loader.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

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
    };
  }

  constructor () {
    super();

    /** @type {} ...*/
    this.state = { type: 'loading' };

  }

  /**
   * @param {Event & { target: CcInputText }} event
   */
  _onDomainBlur ({ target }) {
  }

  render () {
    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="title">Add a domain</div>
          <form>
            <cc-input-text label="Domain">
            </cc-input-text>
            <cc-input-text label="Path"></cc-input-text>
            <cc-button>Add domain</cc-button>
          </form>
        </cc-block>

        <cc-block>
          <div slot="title">Domain List <cc-button primary>Configure your DNS</cc-button></div>
          <cc-input-text label="filter the domain list"></cc-input-text>

          ${this.state.type === 'loading' ? html`
            <cc-loader></cc-loader>
          ` : ''}

          ${this.state.type === 'loaded' ? this._renderDomainList(this.state.domains) : ''}
        </cc-block>
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
                  <span>Open</span>
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
                ${!domain.tlsKO ? html`
                  <span class="success">
                    <cc-icon .icon=${iconSecure}></cc-icon>
                    TLS/SSL
                  </span>
                ` : html`<span></span>`}
                <div class="buttons">
                  <cc-button .icon=${iconOptions}>Options</cc-button>
                  <!-- ${domain.dnsKO ? html`<cc-button primary>Troubleshoot</cc-button>` : ''} -->
                  <!-- ${!domain.primary ? html`<cc-button primary outlined>Mark as primary</cc-button>` : ''} -->
                  <!-- <cc-button danger outlined>Delete</cc-button> -->
                </div>
              </div>
          `)
        }
      </div>
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

        div[slot='title'] {
          display: flex;
          justify-content: space-between;
        }

        .wrapper {
          display: grid;
          gap: 1.5em;
        }

        cc-badge[intent='success'] {
          --cc-icon-color: var(--cc-color-text-success);
        }

        .success {
          color: var(--cc-color-text-primary);
        }

        /* cc-badge[intent='danger'] { */
        /*   --cc-icon-color: var(--cc-color-text-danger); */
        /* } */
        
        form {
          display: flex;
          align-items: start;
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
          gap: 1em;
          grid-auto-flow: row;
          grid-template-columns: max-content max-content max-content max-content auto;
          align-items: center;
          align-content: center;
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

      `,
    ];
  }
}

window.customElements.define('cc-domain-management', CcDomainManagement);
