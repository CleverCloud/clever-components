import { LitElement, html, css } from 'lit';
// TODO TEST iconRemixBuilding_4Line, iconRemixMapPinLine
import { iconRemixEarthLine as zoneIcon } from '../../src/assets/cc-remix.icons.js';
import './ct-zone-item.js';
import { PREFERRED_ZONE } from './preferred-items.js';

const WORDING = {
  LABEL: 'Select your zone',
};

const sortFn = (a, b) => {
  const COUNTRY_CODE = ['FR', 'PL', 'CA', 'SA', 'AU', 'SG'];
  return COUNTRY_CODE.indexOf(a.countryCode) - COUNTRY_CODE.indexOf(b.countryCode)
    || a.city.localeCompare(b.city)
    || a.name.localeCompare(b.name)
  ;
};

export class CtZonePicker extends LitElement {
  static get properties () {
    return {
      currentZone: { type: String, attribute: 'current-zone' },
      whitelist: { type: Array },
      zones: { type: Array },
      _sortedZones: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.zones = [];
    this.whitelist = [];
    this.currentZone = null;
    this._sortedZones = [];
  }

  willUpdate (_changedProperties) {
    if (this.zones == null || this.whitelist == null) {
      return;
    }

    this._sortedZones = this.zones?.length > 0
      ? this.zones.toSorted(sortFn)
      : []
    ;
    if (this.whitelist.length > 0) {
      this._sortedZones = this._sortedZones.filter((zone) => this.whitelist.includes(zone.name));
    }
    this._fixCurrentZone();

    if (this.currentZone == null) {
      return;
    }

    const selectedZoneObject = this._sortedZones.find((zone) => zone.name === this.currentZone);
    if (selectedZoneObject == null) {
      return;
    }

    this.dispatchEvent(new CustomEvent('ct-zone-picker:zone-updated', {
      detail: selectedZoneObject,
      bubbles: true,
      composed: true,
    }));
  }

  _fixCurrentZone () {
    function isZoneAvailable (name, zones) {
      return zones.find((zone) => zone.name === name) != null;
    }

    const isCurrentZoneAvailable = isZoneAvailable(this.currentZone, this._sortedZones);
    if (isCurrentZoneAvailable) {
      return;
    }

    // TODO closest name instead? based on country?
    const isPreferredZoneAvailable = isZoneAvailable(PREFERRED_ZONE, this._sortedZones);
    if (isPreferredZoneAvailable) {
      this.currentZone = PREFERRED_ZONE;
      return;
    }

    // TODO closest name
    this.currentZone = this._sortedZones[0].name;
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('ct-zone-item:selected', this._onZoneSelected);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('ct-zone-item:selected', this._onZoneSelected);
  }

  _onZoneSelected (e) {
    this.currentZone = e.detail;
  }

  render () {
    return html`
      <ct-label-with-icon
        .icon="${zoneIcon}"
        .label="${WORDING.LABEL}"
      >
        <div class="zone-container">
        ${
          this._sortedZones.map((zone) => {
            return html`<ct-zone-item
              role="button"
              tabindex="0"
              ?selected=${this.currentZone === zone.name}
              name="${zone.name}"
              city="${zone.city}"
              country-code="${zone.countryCode}"
              .tags="${zone.tags}"
            ></ct-zone-item>`;
          })
        }
        </div>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        .zone-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          gap: 1em;
        }
      `,
    ];
  }
}

customElements.define('ct-zone-picker', CtZonePicker);
