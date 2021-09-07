import './cc-zone.js';
import '../maps/cc-map.js';
import '../maps/cc-map-marker-server.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { scrollChildIntoParent } from '../lib/dom.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { PRIVATE_ZONE, sortZones } from '../lib/zone.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

const SKELETON_ZONES = new Array(6).fill(null);

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
      _sortedZones: { type: Array },
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

    if (!Array.isArray(this._sortedZones)) {
      return;
    }

    // Filter out private zones from the map for now as they may be at the same coordinates and overlap
    this._points = this._sortedZones
      .filter((zone) => !zone.tags.includes(PRIVATE_ZONE))
      .map((zone) => ({
        name: zone.name,
        lat: zone.lat,
        lon: zone.lon,
        marker: { tag: 'cc-map-marker-server', state: this._getState(zone.name) },
        tooltip: { tag: 'cc-zone', zone, mode: 'small' },
        zIndexOffset: this._getZIndexOffset(zone.name),
      }));

    this._legend = this._sortedZones.some((zone) => zone.tags.includes(PRIVATE_ZONE))
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
        const zone = this._sortedZones.find((z) => z.name === this._hovered);
        this._map.panInside(zone.lat, zone.lon);
      }
      else if (this.selected != null) {
        const zone = this._sortedZones.find((z) => z.name === this.selected);
        this._map.panInside(zone.lat, zone.lon);
      }
    }, 200);
  }

  _scrollChildIntoParent (name) {
    const parent = this.shadowRoot.querySelector(`.zone-list-wrapper`);
    const child = this.shadowRoot.querySelector(`input[id=${name}]`);
    scrollChildIntoParent(parent, child);
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
      this._sortedZones = sortZones(this.zones);
      this._updatePoints();
    }

    super.updated(changedProperties);
  }

  render () {

    const skeleton = (this._sortedZones == null);
    const zones = skeleton ? SKELETON_ZONES : this._sortedZones;

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
            ${repeat(zones, (z) => z?.name ?? '', (z) => this._renderZoneInput(z))}
          </div>
        ` : ''}
      </div>
    `;
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
