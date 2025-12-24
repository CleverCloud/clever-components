import { css, html, LitElement } from 'lit';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-dialog-confirm-form/cc-dialog-confirm-form.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

/**
 * @import { AddonAdminState, AddonAdminStateLoaded, AddonAdminStateLoading, AddonAdminStateSaving } from './cc-console-menu.types.js'
 * @import { CcTagsChangeEvent } from '../cc-input-text/cc-input-text.events.js'
 * @import { TemplateResult, PropertyValues } from 'lit'
 */

/**
 * A component displaying the admin interface of an add-on to edit its name or delete the add-on.
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
      <div class="resources">${this.resources?.map((link) => this._renderLink(link))}</div>
      <div class="divider"></div>
      <div class="settings">${this.settings?.map((link) => this._renderLink(link))}</div>
    `;
  }

  _renderLink(link) {
    return html`
      <a class="link" href="${link.path}">
        ${link.icon != null ? html` <cc-icon .icon="${link.icon}"></cc-icon> ` : ''}
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
          color: #fff;
          display: block;
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

        .link {
          align-items: center;
          color: inherit;
          display: flex;
          gap: 0.5em;
          /* TODO: this is temporary */
          margin-top: 0.5em;
          text-decoration: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-console-menu', CcConsoleMenu);
