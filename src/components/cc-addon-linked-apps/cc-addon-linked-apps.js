import '../cc-img/cc-img.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import '../cc-zone/cc-zone.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

/** @type {LinkedApplication[]} */
const SKELETON_APPLICATIONS = [
  { name: '??????????????????', link: '' },
  { name: '???????????????????????', link: '' },
  { name: '????????????????????', link: '' },
];

/**
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsState} AddonLinkedAppsState
 */

/**
 * A component to display applications linked to an add-on.
 *
 * @cssdisplay block
 */
export class CcAddonLinkedApps extends LitElement {

  static get properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {AddonLinkedAppsState} Sets the linked applications state. */
    this.state = { type: 'loading' };
  }

  _getErrorContent () {
    return html`
      <cc-notice intent="warning" message="${i18n('cc-addon-linked-apps.loading-error')}"></cc-notice>
    `;
  }

  _getEmptyContent () {
    return html`
      <div>${i18n('cc-addon-linked-apps.details')}</div>
      <div class="cc-block_empty-msg">${i18n('cc-addon-linked-apps.no-linked-applications')}</div>
    `;
  }

  render () {
    if (this.state.type === 'error') {
      return this._renderView(this._getErrorContent());
    }

    const skeleton = (this.state.type === 'loading');
    const linkedApps = skeleton ? SKELETON_APPLICATIONS : this.state.linkedApplications;
    const hasData = (linkedApps.length > 0);

    if (!hasData) {
      return this._renderView(this._getEmptyContent());
    }

    const content = html`
      <div>${i18n('cc-addon-linked-apps.details')}</div>

      ${linkedApps.map((linkedApp) => html`
        <div class="application">
          <cc-img class="logo"
            ?skeleton=${skeleton}
            src=${ifDefined(linkedApp.variantLogoUrl)}
            title="${ifDefined(linkedApp.variantName)}"
          ></cc-img>
          <div class="details">
            <span class="name">${ccLink(linkedApp.link, linkedApp.name, skeleton)}</span>
            <cc-zone mode="small" .zone="${linkedApp.zone}"></cc-zone>
          </div>
        </div>
      `)}
    `;

    return this._renderView(content);
  }

  _renderView (content) {
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-linked-apps.title')}</div>
        ${content}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .application {
          display: flex;
          align-items: flex-start;
          line-height: 1.6em;
        }

        .logo {
          width: 1.6em;
          height: 1.6em;
          flex: 0 0 auto;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .details {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-left: 0.5em;
          gap: 0.5em;
        }

        /* SKELETON */

        .name.skeleton {
          background-color: #bbb;
        }

        [title] {
          cursor: help;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-linked-apps', CcAddonLinkedApps);
