import '../cc-img/cc-img.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import '../cc-zone/cc-zone.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

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
 * @typedef {import('../common.types.js').Addon} Addon
 * @typedef {import('../common.types.js').Zone} Zone
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
      error: { type: Boolean, reflect: true },
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
        <div class="main">

          <cc-img class="logo" src="${ifDefined(addon.provider.logoUrl)}"
            ?skeleton=${skeleton} accessible-name="${addon.provider.name}" title="${ifDefined(addon.provider.name)}"></cc-img>
          <div class="details">
            <div class="name"><span class="${classMap({ skeleton })}">${addon.name}</span></div>
            <div class="addon-id-inputs">
              <cc-input-text label=${i18n('cc-header-addon.id-label')} hidden-label readonly clipboard value="${ifDefined(addon.id)}" ?skeleton=${skeleton}></cc-input-text>
              <cc-input-text label=${i18n('cc-header-addon.id-label-alternative')} hidden-label readonly clipboard value="${ifDefined(addon.realId)}" ?skeleton=${skeleton}></cc-input-text>
            </div>
          </div>

          <div class="description">
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
          </div>
        </div>

        <div class="messages">
          <cc-zone .zone=${this.zone} mode="small-infra"></cc-zone>
        </div>
      ` : ''}

      ${this.error ? html`
        <cc-notice intent="warning" message="${i18n('cc-header-addon.error')}"></cc-notice>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1em;

          display: block;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }
        
        :host([error]) {
          border: none;
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          padding: 1em;
          gap: 1em;
        }

        .logo {
          width: 3.25em;
          height: 3.25em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .details {
          flex: 1 1 11em;
        }

        .name,
        .description-label {
          margin-bottom: 0.35em;
        }

        .name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .addon-id-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .description {
          display: flex;
          flex-wrap: wrap;
          align-self: center;
          gap: 1em;
        }

        .description-item {
          flex: 1 1 auto;
        }

        .description-label {
          font-weight: bold;
        }

        .messages {
          display: flex;
          box-sizing: border-box;
          flex-wrap: wrap;
          align-items: center;
          justify-content: end;
          padding: 0.7em 1.1em;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          font-size: 0.9em;
          gap: 0.57em;
        }

        cc-zone {
          font-style: normal;
          white-space: nowrap;
        }

        [title] {
          cursor: help;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
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
