import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-img/cc-img.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-zone/cc-zone.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

/** @type {Application[]} */
const SKELETON_APPLICATIONS = [
  { name: '??????????????????', link: '', instance: { variant: {} } },
  { name: '???????????????????????', link: '', instance: { variant: {} } },
  { name: '????????????????????', link: '', instance: { variant: {} } },
];

/**
 * @typedef {import('../common.types.d.ts').Application} Application
 */

/**
 * A component to display applications linked to an add-on.
 *
 * ## Details
 *
 * * When applications is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * @cssdisplay block
 */
export class CcAddonLinkedApps extends LitElement {

  static get properties () {
    return {
      applications: { type: Array },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {Application[]|null} Sets the linked applications. */
    this.applications = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;
  }

  render () {

    const skeleton = (this.applications == null);
    const applications = skeleton ? SKELETON_APPLICATIONS : this.applications;
    const hasData = (!this.error && (applications.length > 0));
    const emptyData = (!this.error && (applications.length === 0));

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-linked-apps.title')}</div>

        ${hasData ? html`
          <div>${i18n('cc-addon-linked-apps.details')}</div>

          ${applications.map((application) => html`
            <div class="application">
              <cc-img class="logo"
                ?skeleton=${skeleton}
                src=${ifDefined(application.instance.variant.logo)}
                title="${ifDefined(application.instance.variant.name)}"
              ></cc-img>
              <cc-flex-gap class="details">
                <span class="name">${ccLink(application.link, application.name, skeleton)}</span>
                <cc-zone mode="small" .zone="${application.zone}"></cc-zone>
              </cc-flex-gap>
            </div>
          `)}
        ` : ''}

        ${emptyData ? html`
          <div class="cc-block_empty-msg">${i18n('cc-addon-linked-apps.no-linked-applications')}</div>
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-addon-linked-apps.loading-error')}</cc-error>
        ` : ''}
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
          align-items: flex-start;
          display: flex;
          line-height: 1.6rem;
        }

        .logo {
          border-radius: 0.25rem;
          flex: 0 0 auto;
          height: 1.6rem;
          width: 1.6rem;
        }

        .details {
          --cc-align-items: center;
          --cc-gap: 0.5rem;
          margin-left: 0.5rem;
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
