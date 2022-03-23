import '../atoms/cc-img.js';
import '../atoms/cc-input-text.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import '../zones/cc-zone.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

/** @type {Addon} */
const SKELETON_ADDON = {
  name: '??????????????????????????',
  provider: {},
  plan: {
    name: '?????????',
  },
  creationDate: 0,
};

const SKELETON_VERSION = '????????';

/**
 * @typedef {import('./types.js').Addon} Addon
 * @typedef {import('../types.js').Zone} Zone
 */

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * ## Details
 *
 * * When `addon` or `version` are null, a skeleton screen UI pattern is displayed (loading hint) on the corresponding zone.
 *
 * @cssdisplay block
 */
export class CcHeaderAddon extends LitElement {

  static get properties () {
    return {
      addon: { type: Object },
      error: { type: Boolean },
      noVersion: { type: Boolean, attribute: 'no-version' },
      version: { type: String },
      zone: { type: Object },
    };
  };

  constructor () {
    super();

    /** @type {Addon} Sets add-on details and config. */
    this.addon = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {string|null} Sets version of add-on. */
    this.version = null;

    /** @type {boolean} Hides the version. */
    this.noVersion = false;

    /** @type {Zone|null} Sets add-on zone. */
    this.zone = null;
  }

  render () {

    const skeleton = (this.addon == null);
    const addon = skeleton ? SKELETON_ADDON : this.addon;

    const skeletonVersion = (this.version == null);
    const version = skeletonVersion ? SKELETON_VERSION : this.version;

    const creationDateShort = i18n('cc-header-addon.creation-date.short', { date: addon.creationDate });
    const creationDateFull = skeleton ? undefined : i18n('cc-header-addon.creation-date.full', { date: addon.creationDate });

    return html`
      ${!this.error ? html`
        <cc-flex-gap class="main">

          <cc-img class="logo" src="${ifDefined(addon.provider.logoUrl)}"
            ?skeleton=${skeleton} text="${addon.provider.name}" title="${ifDefined(addon.provider.name)}"></cc-img>
          <div class="details">
            <div class="name"><span class="${classMap({ skeleton })}">${addon.name}</span></div>
            <cc-flex-gap>
              <cc-input-text readonly clipboard value="${ifDefined(addon.id)}" ?skeleton=${skeleton}></cc-input-text>
              <cc-input-text readonly clipboard value="${ifDefined(addon.realId)}" ?skeleton=${skeleton}></cc-input-text>
            </cc-flex-gap>
          </div>

          <cc-flex-gap class="description">
            <div class="description-item">
              <div class="description-label">${i18n('cc-header-addon.plan')}</div>
              <div class="${classMap({ skeleton })}">${addon.plan.name}</div>
            </div>
            ${!this.noVersion ? html`
              <div class="description-item">
                <div class="description-label">${i18n('cc-header-addon.version')}</div>
                <div class="${classMap({ skeleton: skeletonVersion })}">${version}</div>
              </div>
            ` : ''}
            <div class="description-item">
              <div class="description-label">${i18n('cc-header-addon.creation-date')}</div>
              <div class="${classMap({ skeleton })}" title="${ifDefined(creationDateFull)}">${creationDateShort}</div>
            </div>
          </cc-flex-gap>
        </cc-flex-gap>

        <cc-flex-gap class="messages">
          <cc-zone .zone=${this.zone} mode="small-infra"></cc-zone>
        </cc-flex-gap>
      ` : ''}

      ${this.error ? html`
        <cc-error></img>${i18n('cc-header-addon.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: block;
        }

        .main {
          padding: var(--cc-gap);
        }

        .logo {
          border-radius: 0.25rem;
          height: 3.25rem;
          width: 3.25rem;
        }

        .details {
          flex: 1 1 0;
        }

        .name,
        .description-label {
          margin-bottom: 0.35rem;
        }

        .name {
          font-size: 1.1rem;
          font-weight: bold;
          min-width: 12rem;
        }

        .description {
          align-self: center;
        }

        .description-item {
          flex: 1 1 auto;
        }

        .description-label {
          font-weight: bold;
        }

        cc-error {
          padding: var(--cc-gap);
          text-align: center;
        }

        .messages {
          --cc-gap: 0.5rem;
          --cc-align-items: center;
          align-items: center;
          background-color: var(--color-bg-primary-light);
          box-shadow: inset 0 6px 6px -6px #a4b1c9;
          box-sizing: border-box;
          color: #2e2e2e;
          font-size: 0.9rem;
          font-style: italic;
          justify-content: end;
          padding: 0.6rem 1rem;
        }

        cc-zone {
          font-style: normal;
          white-space: nowrap;
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-header-addon', CcHeaderAddon);
