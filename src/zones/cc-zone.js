import '../atoms/cc-flex-gap.js';
import '../atoms/cc-img.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { getFlagUrl, getInfraProviderLogoUrl } from '../lib/remote-assets.js';
import { skeletonStyles } from '../styles/skeleton.js';

/** @type {Zone} */
const SKELETON_ZONE = {
  name: 'name',
  country: '????????????',
  city: '??????????',
  tags: ['????????', '????????????'],
};

const PRIVATE_ZONE = 'scope:private';

/**
 * @typedef {import('./types.js').ModeType} ModeType
 * @typedef {import('../types.js').Zone} Zone
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

    /** @type {ModeType} Sets the mode of the component. */
    this.mode = 'default';

    /** @type {Zone|null} Sets the different details of the zone. */
    this.zone = null;
  }

  // This is a bit irregular to do this but we need to reuse this text logic in a <select>.
  // Moving this to a separated module feels overkill right now.
  static getText (zone) {
    const { title, subtitle } = CcZone._getTextParts(zone);
    return [title, subtitle].filter((a) => a != null).join(', ');
  }

  static _getTextParts (zone) {
    return (zone.tags.includes(PRIVATE_ZONE) && zone.displayName != null)
      ? { title: zone.displayName }
      : { title: zone.city, subtitle: i18n('cc-zone.country', { code: zone.countryCode, name: zone.country }) };
  }

  render () {

    const skeleton = (this.zone == null);
    const zone = skeleton ? SKELETON_ZONE : this.zone;
    const { title, subtitle } = CcZone._getTextParts(zone);
    const infraTag = zone.tags.find((t) => t.startsWith('infra:'));
    const infraProviderSlug = infraTag?.split(':')[1] ?? null;

    return html`
      <cc-img class="flag" ?skeleton=${skeleton} src=${ifDefined(getFlagUrl(zone.countryCode))} text=${ifDefined(zone.countryCode)}></cc-img>
      <div class="wrapper-details-logo">
        <div class="wrapper-details">
          <div class="details">
            <span class="title ${classMap({ skeleton })}">${title}</span>
            <span class="subtitle ${classMap({ skeleton })}">${subtitle}</span>
          </div>
          ${infraProviderSlug != null ? html`
            <cc-img class="infra-logo" src=${ifDefined(getInfraProviderLogoUrl(infraProviderSlug))} text=${ifDefined(infraProviderSlug)}></cc-img>
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

        :host([mode="small"]),
        :host([mode="small-infra"]) {
          --lh: 1em;
        }

        .flag {
          border-radius: 0.15em;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
          display: inline-block;
          height: var(--lh);
          margin-right: 1em;
          width: 2em;
        }

        :host([mode="small"]) .flag,
        :host([mode="small-infra"]) .flag {
          margin-right: 0.5em;
          width: 1.33em;
        }

        .wrapper-details-logo {
          flex: 1 1 0;
          min-height: var(--lh);
        }

        .wrapper-details {
          display: flex;
        }

        .details {
          align-self: center;
          flex: 1 1 0;
          line-height: var(--lh);
        }

        :host([mode="small"]) .title,
        :host([mode="small"]) .subtitle,
        :host([mode="small-infra"]) .title,
        :host([mode="small-infra"]) .subtitle {
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
          height: var(--lh);
          margin-left: 0.5em;
          width: 4em;
        }

        :host([mode="small"]) .tag-list,
        :host([mode="small"]) .infra-logo,
        :host([mode="small-infra"]) .tag-list {
          display: none;
        }

        .tag-list {
          --cc-gap: 0.5em;
        }

        .tag {
          background-color: var(--cc-zone-tag-bgcolor, var(--cc-color-bg-soft, #eeeeee));
          border: 1px solid var(--cc-zone-tag-bdcolor, transparent);
          border-radius: 0.25em;
          border-radius: 0.25rem;
          box-sizing: border-box;
          font-family: var(--cc-ff-monospace);
          font-size: 0.8em;
          line-height: 1.5;
          margin-top: 0.5em;
          padding: 0.1em 0.3em;
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
