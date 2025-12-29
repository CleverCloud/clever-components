import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @import { TemplateResult, PropertyValues } from 'lit'
 */

/**
 * A component displaying the console navigation menu.
 *
 * @cssdisplay block
 */
export class CcConsoleMenu extends LitElement {
  static get properties() {
    return {
      logoUrl: { type: String, attribute: 'logo-url' },
      name: { type: String },
      orgas: { type: Array },
      resources: { type: Array },
      settings: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {string} Console's logo URL  */
    this.logoUrl = null;

    /** @type {string} Console's name  */
    this.name = null;

    this.settings = null;

    this.resources = null;

    this.orgas = null;
  }

  render() {
    const isEmpty = this.resources != null && this.resources.length === 0;

    return html`
      <div class="header">
        <a href="/" class="home-link">
          <cc-img src="${this.logoUrl}"></cc-img>
          ${this.name}
        </a>
      </div>
      <div class="divider"></div>
      <div class="orgas">${this.orgas?.map((link) => this._renderLink(link))}</div>
      <div class="divider"></div>
      <div class="create">my create</div>
      <div class="divider"></div>
      <div class="resources">
        ${this.resources?.map((link) => this._renderLink(link))}
        ${isEmpty ? html`<div class="empty">${i18n('cc-console-menu.resources.empty')}</div>` : ''}
      </div>
      <div class="divider"></div>
      <div class="settings">${this.settings?.map((link) => this._renderLink(link))}</div>
    `;
  }

  _renderLink(link) {
    return html`
      <a class="link ${classMap({ 'link--selected': link.selected === true })}" href="${link.path}">
        ${link.icon != null ? html`<cc-icon .icon="${link.icon}"></cc-icon>` : ''}
        <span>${link.name}</span>
      </a>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          background-color: #151b2e;
          box-sizing: border-box;
          color: #fff;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0.5em;
        }

        .home-link {
          align-items: center;
          color: #fff;
          display: flex;
          gap: 0.5em;
          text-decoration: none;
        }

        .home-link cc-img {
          height: 2em;
          width: 2em;
        }

        .divider {
          background-color: #333;
          height: 1px;
          margin: 0.5em 0;
          width: 100%;
        }

        .resources {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
        }

        .link {
          align-items: center;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: inherit;
          display: flex;
          gap: 0.5em;
          margin-top: 0.5em;
          padding: 0.5em;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .link:hover {
          background-color: rgb(255 255 255 / 10%);
        }

        .link--selected {
          background-color: #456080;
          border-left: 3px solid var(--cc-color-border-primary, #3569aa);
          padding-left: calc(0.5em - 3px);
        }

        /* .link--selected:hover {
          background-color: ;
        } */

        .empty {
          color: var(--cc-color-text-weak);
          font-style: italic;
          padding: 1em;
          text-align: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-console-menu', CcConsoleMenu);
