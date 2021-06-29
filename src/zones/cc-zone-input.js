import './cc-zone.js';
import '../maps/cc-map.js';
import '../maps/cc-map-marker-server.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { scrollChildIntoParent } from '../lib/dom.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

const SKELETON_ZONES = new Array(6).fill(null);
const CLEVER_CLOUD_ZONE = 'infra:clever-cloud';
const PRIVATE_ZONE = 'scope:private';

/**
 * A input component to select a zone with a map and a list.
 *
 * ## Details
 *
 * * When `zones` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * Zones are sorted in the list using `tags`. Clever Cloud, then private, then regular alphanumeric sort on the city name.
 *
 * ## Type definitions
 *
 * ```js
 * interface Zone {
 *   name: string,          // Unique code/identifier for the zone
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
 *   city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
 *   country: string,       // Name of the country in english: "France", "Canada", "United States"...
 *   displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
 *   tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
 * }
 * ```
 *
 * @cssdisplay grid
 *
 * @prop {Boolean} error - Displays an error message.
 * @prop {String} selected - Sets the `name` of the selected zone.
 * @prop {Zone[]} zones - Sets the list of available zones.
 *
 * @event {CustomEvent<String>} cc-zone-input:input - Fires the `name` of the selected zone whenever the selection changes.
 */
export class CcZoneInput extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      selected: { type: String },
      zones: { type: Array },
      _centerLat: { type: Number },
      _centerLon: { type: Number },
      _hovered: { type: String },
      _legend: { type: String },
      _points: { type: Array },
    };
  }

  constructor (props) {
    super(props);
    this.error = false;
    /** @protected */
    this.breakpoints = {
      width: [600],
    };
    this._legend = '';
    this._points = [];
  }

  _updatePoints () {

    if (!Array.isArray(this.zones)) {
      return;
    }

    // Filter out private zones from the map for now as they may be at the same coordinates and overlap
    this._points = this.zones
      .filter((zone) => !zone.tags.includes(PRIVATE_ZONE))
      .map((zone) => ({
        name: zone.name,
        lat: zone.lat,
        lon: zone.lon,
        marker: { tag: 'cc-map-marker-server', state: this._getState(zone.name) },
        tooltip: { tag: 'cc-zone', zone, mode: 'small' },
        zIndexOffset: this._getZIndexOffset(zone.name),
      }));

    this._legend = this.zones.some((zone) => zone.tags.includes(PRIVATE_ZONE))
      ? i18n('cc-zone-input.private-map-warning')
      : '';
  }

  _getState (zoneName) {
    if (this.selected === zoneName) {
      return 'selected';
    }
    if (this._hovered === zoneName) {
      return 'hovered';
    }
    return 'default';
  }

  _getZIndexOffset (zoneName) {
    if (this.selected === zoneName) {
      return 200;
    }
    if (this._hovered === zoneName) {
      return 250;
    }
    return 0;
  }

  // 1. Clever Cloud zones "infra:clever-cloud"
  // 2. Private zones "scope:private"
  // 3. Alphanum sort on city
  _sortZones (zones) {
    return [...zones].sort((a, b) => {
      if (a == null || b == null) {
        return 0;
      }
      const aIsCcZone = a.tags.includes(CLEVER_CLOUD_ZONE);
      const bIsCcZone = b.tags.includes(CLEVER_CLOUD_ZONE);
      if (aIsCcZone !== bIsCcZone) {
        return aIsCcZone ? -1 : 1;
      }
      const aIsPrivateZone = a.tags.includes(PRIVATE_ZONE);
      const bIsPrivateZone = b.tags.includes(PRIVATE_ZONE);
      if (aIsCcZone && bIsCcZone) {
        if (aIsPrivateZone !== bIsPrivateZone) {
          return aIsPrivateZone ? 1 : -1;
        }
        if (aIsPrivateZone && bIsPrivateZone) {
          return (a.displayName || '').localeCompare((b.displayName || ''));
        }
      }
      if (aIsPrivateZone !== bIsPrivateZone) {
        return aIsPrivateZone ? -1 : 1;
      }
      return a.city.localeCompare(b.city);
    });
  }

  _onSelect (name) {
    this.selected = name;
    dispatchCustomEvent(this, 'input', this.selected);
  }

  _onListHover (name) {
    this._hovered = name;
    this._updatePoints();
    this._panMap();
  }

  _onMarkerHover (name) {
    this._hovered = name;
    this._updatePoints();
    this._scrollChildIntoParent(this._hovered || this.selected);
  }

  _panMap () {
    clearTimeout(this._panMapTimeout);
    this._panMapTimeout = setTimeout(() => {
      if (this._hovered != null) {
        const zone = this.zones.find((z) => z.name === this._hovered);
        this._map.panInside(zone.lat, zone.lon);
      }
      else if (this.selected != null) {
        const zone = this.zones.find((z) => z.name === this.selected);
        this._map.panInside(zone.lat, zone.lon);
      }
    }, 200);
  }

  _scrollChildIntoParent (name) {
    const parent = this.shadowRoot.querySelector(`.zone-list-wrapper`);
    const child = this.shadowRoot.querySelector(`input[id=${name}]`);
    scrollChildIntoParent(parent, child);
  }

  _renderZoneInput (zone) {

    // Simplified template without label/input when skeleton is enabled
    if (zone == null) {
      return html`
        <div class="zone">
          <div class="label">
            <cc-zone></cc-zone>
          </div>
        </div>
      `;
    }

    return html`
      <div class="zone-choice">
        <input
          type="radio"
          name="zone"
          .value=${zone.name}
          id=${zone.name}
          .checked=${zone.name === this.selected}
          @change=${(e) => this._onSelect(zone.name)}
        >
        <label
          for=${zone.name}
          class="label ${classMap({ hovered: zone.name === this._hovered })}"
          @mouseenter=${() => this._onListHover(zone.name)}
          @mouseleave=${() => this._onListHover()}
        >
          <cc-zone .zone=${zone}></cc-zone>
        </label>
      </div>
    `;
  }

  firstUpdated () {
    this._map = this.shadowRoot.querySelector('cc-map');
  }

  // updated and not udpate because we need this._map before
  updated (changedProperties) {

    if (changedProperties.has('selected')) {
      this._updatePoints();
      this._scrollChildIntoParent(this.selected);
      // This could move the map while just after a marker is clicked but it should be a good thing in most cases
      this._panMap();
    }

    if (changedProperties.has('zones')) {
      this._updatePoints();
    }

    super.updated(changedProperties);
  }

  render () {

    const skeleton = (this.zones == null);
    const zones = skeleton ? SKELETON_ZONES : this.zones;

    // Try to zoom out and center the map
    return html`
      <cc-map
        view-zoom="1"
        center-lat="35"
        .points=${this._points}
        ?loading=${skeleton && !this.error}
        @cc-map:marker-click=${(e) => this._onSelect(e.detail.name)}
        @cc-map:marker-enter=${(e) => this._onMarkerHover(e.detail.name)}
        @cc-map:marker-leave=${(e) => this._onMarkerHover()}
      >${this._legend}
      </cc-map>
      <div class="zone-list-wrapper">
        ${this.error ? html`
          <cc-error>${i18n('cc-zone-input.error')}</cc-error>
        ` : ''}
        ${!this.error ? html`
          <div class="zone-list">
            ${repeat(zones, (z) => z != null ? z.name : '', (z) => this._renderZoneInput(z))}
          </div>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          box-sizing: border-box;
          display: flex;
          overflow: hidden;
        }

        cc-map,
        .zone-list-wrapper {
          flex-grow: 1;
        }

        cc-map {
          border-right: 1px solid #bcc2d1;
          flex-basis: 0;
          height: 100%;
          width: 100%;
        }

        :host([w-lt-600]) cc-map,
        :host([error]) cc-map {
          display: none;
        }

        .zone-list-wrapper {
          box-sizing: border-box;
          height: 100%;
          overflow: auto;
        }

        :host(:not([error])[w-gte-600]) .zone-list-wrapper {
          flex-basis: 24rem;
          max-width: 24rem;
        }

        :host([error]) .zone-list-wrapper {
          display: flex;
          padding: 1rem;
        }

        :host([error]) cc-error {
          margin: auto;
        }

        .zone-list {
          margin: 0.5rem;
        }

        .zone-list:not(:hover):focus-within {
          border-radius: 0.25rem;
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        .zone-choice {
          display: grid;
          overflow: hidden;
        }

        input,
        .label {
          grid-area: 1 / 1 / 2 / 2;
        }

        input {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          border: 0;
          box-sizing: border-box;
          display: block;
          margin: -0.5rem;
          outline: none;
        }

        .label {
          border: 2px solid var(--bd-color, transparent);
          border-radius: 0.25rem;
          box-sizing: border-box;
          display: block;
          padding: 0.5rem;
        }

        label {
          cursor: pointer;
        }

        input:checked + .label {
          --bd-color: #2b96fd;
        }

        label.hovered,
        input:hover + .label {
          background: #f3f3f3;
        }

        cc-zone {
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-zone-input', CcZoneInput);
