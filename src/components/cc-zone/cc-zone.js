import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-img/cc-img.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/** @type {Zone} */
const SKELETON_ZONE = {
  name: 'name',
  country: '????????????',
  city: '??????????',
  tags: ['????????', '????????????'],
};

const PRIVATE_ZONE = 'scope:private';

/**
 * @typedef {import('./cc-zone.types.js').ZoneModeType} ZoneModeType
 * @typedef {import('../common.types.js').Zone} Zone
 */

/**
 * A display component to show information about a zone.
 *
 * ## Details
 *
 * * When `zone` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * When a tag prefixed with `infra:` is used, the corresponding logo is displayed.
 * * When the `scope:private` tag is used, the optional `displayName` of the zone will be used instead of the City + Country.
 * * If the browser supports it, the `countryCode` will be used to display a translated version of the country's name.
 *
 * @cssdisplay flex
 *
 * @cssprop {Color} --cc-zone-default-text-color - Default text color (title and tags) (defaults to #000)
 * @cssprop {Color} --cc-zone-subtitle-color - Text color of the subtitle (country name) (defaults to #555)
 * @cssprop {Color} --cc-zone-tag-bdcolor - Border color of the tags (defaults to transparent)
 * @cssprop {Color} --cc-zone-tag-bgcolor - Background color of the tags (defaults to rgba(50, 50, 255, 0.15))
 */
export class CcZone extends LitElement {

  static get properties () {
    return {
      mode: { type: String, reflect: true },
      zone: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {ZoneModeType} Sets the mode of the component. */
    this.mode = 'default';

    /** @type {Zone|null} Sets the different details of the zone. */
    this.zone = null;
  }

  // This is a bit irregular to do this but we need to reuse this text logic in a <select>.
  // Moving this to a separated module feels overkill right now.
  static getText (zone) {
    const { title, subtitle, infra } = CcZone._getTextParts(zone);
    const titleAndSubtitle = [title, subtitle].filter((a) => a != null).join(', ');
    return (infra != null)
      ? `${titleAndSubtitle} (${infra})`
      : titleAndSubtitle;
  }

  static _getTextParts (zone) {
    if (zone.tags.includes(PRIVATE_ZONE) && zone.displayName != null) {
      return { title: zone.displayName };
    }

    const infraTag = zone.tags.find((t) => t.startsWith('infra:'));
    const infraSlug = infraTag?.split(':')[1] ?? null;
    return {
      title: zone.city,
      subtitle: i18n('cc-zone.country', { code: zone.countryCode, name: zone.country }),
      infra: infraSlug,
    };
  }

  render () {

    const skeleton = (this.zone == null);
    const zone = skeleton ? SKELETON_ZONE : this.zone;
    const { title, subtitle, infra } = CcZone._getTextParts(zone);

    return html`
      <cc-img class="flag" ?skeleton=${skeleton} src=${ifDefined(getFlagUrl(zone.countryCode))} text=${ifDefined(zone.countryCode)}></cc-img>
      <div class="wrapper-details-logo">
        <div class="wrapper-details">
          <div class="details">
            <span class="title ${classMap({ skeleton })}">${title}</span>
            <span class="subtitle ${classMap({ skeleton })}">${subtitle}</span>
          </div>
          ${infra != null ? html`
            <cc-img class="infra-logo" src=${getInfraProviderLogoUrl(infra)} text=${infra}></cc-img>
          ` : ''}
        </div>
        <cc-flex-gap class="tag-list">
          ${zone.tags.map((t) => html`<span class="tag ${classMap({ skeleton })}">${t}</span>`)}
        </cc-flex-gap>
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --lh: 1.5em;

          display: flex;
        }

        :host([mode='small']),
        :host([mode='small-infra']) {
          --lh: 1em;
        }

        .flag {
          display: inline-block;
          width: 2em;
          height: var(--lh);
          margin-right: 1em;
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-shadow: 0 0 3px rgb(0 0 0 / 40%);
        }

        :host([mode='small']) .flag,
        :host([mode='small-infra']) .flag {
          width: 1.33em;
          margin-right: 0.5em;
        }

        .wrapper-details-logo {
          min-height: var(--lh);
          flex: 1 1 0;
        }

        .wrapper-details {
          display: flex;
        }

        .details {
          flex: 1 1 0;
          align-self: center;
          line-height: var(--lh);
        }

        :host([mode='small']) .title,
        :host([mode='small']) .subtitle,
        :host([mode='small-infra']) .title,
        :host([mode='small-infra']) .subtitle {
          font-size: 0.8em;
        }

        .title {
          font-weight: bold;
        }

        .subtitle {
          color: var(--cc-zone-subtitle-color, var(--cc-color-text-weak));
        }

        .infra-logo {
          --cc-img-fit: contain;

          width: 4em;
          height: var(--lh);
          margin-left: 0.5em;
        }

        :host([mode='small']) .tag-list,
        :host([mode='small']) .infra-logo,
        :host([mode='small-infra']) .tag-list {
          display: none;
        }

        .tag-list {
          --cc-gap: 0.5em;
        }

        .tag {
          box-sizing: border-box;
          padding: 0.1em 0.3em;
          border: 1px solid var(--cc-zone-tag-bdcolor, transparent);
          margin-top: 0.5em;
          background-color: var(--cc-zone-tag-bgcolor, var(--cc-color-bg-soft, #eee));
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          font-size: 0.8em;
          line-height: 1.5;
        }

        .skeleton {
          color: transparent !important;
        }

        .skeleton:not(.tag) {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-zone', CcZone);
