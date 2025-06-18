import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import '../cc-zone/cc-zone.js';

/** @type {LinkedApplication[]} */
const SKELETON_APPLICATIONS = [
  { name: '??????????????????', link: null, variantName: null, variantLogoUrl: null, zone: null },
  { name: '???????????????????????', link: null, variantName: null, variantLogoUrl: null, zone: null },
  { name: '????????????????????', link: null, variantName: null, variantLogoUrl: null, zone: null },
];

/**
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsState} AddonLinkedAppsState
 * @typedef {import('./cc-addon-linked-apps.types.js').LinkedApplication} LinkedApplication
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoading} ZoneStateLoading
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component to display applications linked to an add-on.
 *
 * @cssdisplay block
 */
export class CcAddonLinkedApps extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {AddonLinkedAppsState} Sets the linked applications state. */
    this.state = { type: 'loading' };
  }

  /**
   * @returns {TemplateResult}
   * @private
   */
  _getEmptyContent() {
    return html`
      <div slot="content">${i18n('cc-addon-linked-apps.details')}</div>
      <div slot="content" class="empty-msg">${i18n('cc-addon-linked-apps.no-linked-applications')}</div>
    `;
  }

  /**
   * @returns {TemplateResult}
   * @private
   */
  _getErrorContent() {
    return html`
      <cc-notice slot="content" intent="warning" message="${i18n('cc-addon-linked-apps.loading-error')}"></cc-notice>
    `;
  }

  /**
   * @param {Boolean} skeleton
   * @param {Zone} [zone]
   * @returns {ZoneStateLoaded|ZoneStateLoading}
   */
  _getZoneState(skeleton, zone) {
    if (skeleton) {
      return { type: 'loading' };
    }

    return { type: 'loaded', ...zone };
  }

  render() {
    if (this.state.type === 'error') {
      return this._renderView(this._getErrorContent());
    }

    const skeleton = this.state.type === 'loading';
    const linkedApps = this.state.type === 'loaded' ? this.state.linkedApplications : SKELETON_APPLICATIONS;
    const hasData = linkedApps.length > 0;

    if (!hasData) {
      return this._renderView(this._getEmptyContent());
    }

    const content = html`
      <div slot="content">${i18n('cc-addon-linked-apps.details')}</div>

      ${linkedApps.map(
        (linkedApp) => html`
          <div slot="content" class="application">
            <div class="details">
              <cc-link image="${ifDefined(linkedApp.variantLogoUrl)}" href="${linkedApp.link}" ?skeleton="${skeleton}">
                ${linkedApp.name}
              </cc-link>
              <cc-zone mode="small" .state="${this._getZoneState(skeleton, linkedApp.zone)}"></cc-zone>
            </div>
          </div>
        `,
      )}
    `;

    return this._renderView(content);
  }

  /**
   * @param {TemplateResult} content
   * @private
   */
  _renderView(content) {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-linked-apps.title')}</div>
        ${content}
      </cc-block>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-link::part(img) {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 1.6em;
          width: 1.6em;
        }

        .details {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }

        /* SKELETON */

        .name.skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-linked-apps', CcAddonLinkedApps);
