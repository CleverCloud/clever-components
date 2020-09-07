import '../atoms/cc-flex-gap.js';
import '../atoms/cc-img.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { getFlagUrl, getInfraProviderLogoUrl } from '../lib/remote-assets.js';
import { skeletonStyles } from '../styles/skeleton.js';

const SKELETON_ZONE = {
  name: 'name',
  country: '????????????',
  city: '??????????',
  tags: ['????????', '????????????'],
};

const PRIVATE_ZONE = 'scope:private';

/**
 * A display component to show information about a zone.
 *
 * * 🎨 default CSS display: `flex`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/zones/cc-zone.js)
 *
 * ## Details
 *
 * * When `zone` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * When a tag prefixed with `infra:` is used, the corresponding logo is displayed.
 * * When the `scope:private` tag is used, the optional `displayName` of the zone will be used instead of the City + Country.
 * * If the browser supports it, the `countryCode` will be used to display a translated version of the country's name.
 *
 * ## Type definitions
 *
 * ```js
 * interface Zone {
 *   countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "fr", "ca", "us"...
 *   city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
 *   country: string,       // Name of the country in english: "France", "Canada", "United States"...
 *   displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
 *   tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
 * }
 * ```
 *
 * @prop {"default"|"small"} mode - Sets the mode of the component.
 * @prop {Zone} zone - Sets the different details of the zone.
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
    this.mode = 'default';
  }

  render () {

    const skeleton = (this.zone == null);
    const zone = skeleton ? SKELETON_ZONE : this.zone;
    const title = (zone.tags.includes(PRIVATE_ZONE) && zone.displayName != null) ? zone.displayName : zone.city;
    const subtitle = (zone.tags.includes(PRIVATE_ZONE) && zone.displayName != null) ? '' : i18n('cc-zone.country', {
      code: zone.countryCode, name: zone.country,
    });
    const infraTag = zone.tags.find((t) => t.startsWith('infra:'));
    const infraProviderSlug = (infraTag != null) ? infraTag.split(':')[1] : null;

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
          --lh: 1.5rem;
          display: flex;
        }

        :host([mode="small"]) {
          --lh: 1rem;
          font-size: 0.8rem !important;
        }

        .flag {
          border-radius: 0.15rem;
          box-shadow: 0 0 3px #ccc;
          display: inline-block;
          height: var(--lh);
          margin-right: 1rem;
          width: 2rem;
        }

        :host([mode="small"]) .flag {
          margin-right: 0.5rem;
          width: 1.33rem;
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

        .title {
          font-weight: bold;
        }

        .subtitle {
          color: #555;
        }

        .infra-logo {
          --cc-img-fit: contain;
          height: var(--lh);
          width: 4rem;
        }

        :host([mode="small"]) .infra-logo,
        :host([mode="small"]) .tag-list {
          display: none;
        }

        .tag-list {
          --cc-gap: 0.5rem;
        }

        .tag {
          background-color: rgba(50, 50, 255, 0.15);
          border-radius: 0.25rem;
          box-sizing: border-box;
          font-family: monospace;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          padding: 0.1rem 0.3rem;
        }

        :host([mode="small"]) .tag {
          font-size: 0.7rem;
          margin-top: 0.25rem;
          padding: 0.1rem;
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
