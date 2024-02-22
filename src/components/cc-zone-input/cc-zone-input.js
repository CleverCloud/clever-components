import '../cc-zone/cc-zone.js';
import '../cc-map/cc-map.js';
import '../cc-notice/cc-notice.js';
import '../cc-map-marker-server/cc-map-marker-server.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { scrollChildIntoParent } from '../../lib/dom.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { PRIVATE_ZONE, sortZones } from '../../lib/zone.js';

const SKELETON_ZONES = new Array(6).fill(null);
const BREAKPOINTS = [600];

/**
 * @typedef {import('../common.types.js').Point} Point
 * @typedef {import('../common.types.js').Zone} Zone
 */

/**
 * A input component to select a zone with a map and a list.
 *
 * ## Details
 *
 * * When `zones` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * Zones are sorted in the list using `tags`. Clever Cloud, then private, then regular alphanumeric sort on the city name.
 *
 * @cssdisplay grid
 *
 * @fires {CustomEvent<string>} cc-zone-input:input - Fires the `name` of the selected zone whenever the selection changes.
 */
export class CcZoneInput extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      selected: { type: String },
      zones: { type: Array },
      _hovered: { type: String, state: true },
      _legend: { type: String, state: true },
      _points: { type: Array, state: true },
      _sortedZones: { type: Array, state: true },
    };
  }

  constructor (props) {
    super(props);

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {string|null} Sets the `name` of the selected zone. */
    this.selected = null;

    /** @type {Zone[]|null} Sets the list of available zones. */
    this.zones = null;

    /** @type {string|null} */
    this._hovered = null;

    /** @type {string} */
    this._legend = '';

    /** @type {Point[]} */
    this._points = [];

    /** @type {Zone[]|null} */
    this._sortedZones = null;

    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
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
        marker: { tag: 'cc-map-marker-server', state: this._getState(zone.name), keyboard: false },
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
          <cc-notice intent="warning" message="${i18n('cc-zone-input.error')}"></cc-notice>
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
          display: flex;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-map,
        .zone-list-wrapper {
          flex-grow: 1;
        }

        cc-map {
          width: 100%;
          height: 100%;
          flex-basis: 0;
          border-right: 1px solid var(--cc-color-border-neutral, #aaa);
        }

        :host([w-lt-600]) cc-map,
        :host([error]) cc-map {
          display: none;
        }

        .zone-list-wrapper {
          overflow: auto;
          height: 100%;
          box-sizing: border-box;
        }

        :host(:not([error])[w-gte-600]) .zone-list-wrapper {
          max-width: 24em;
          flex-basis: 24em;
        }
        
        :host([error]) {
          border: none;
        }

        :host([error]) cc-notice {
          width: 100%;
          margin: auto;
        }

        .zone-list {
          margin: 0.5em;
        }

        .zone-list:not(:hover):focus-within {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
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
          display: block;
          box-sizing: border-box;
          border: 0;
          margin: -0.5em;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }

        .label {
          display: block;
          box-sizing: border-box;
          padding: 0.5em;
          border: 2px solid var(--bd-color, transparent);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        label {
          cursor: pointer;
        }

        input:checked + .label {
          --bd-color: var(--cc-color-bg-primary-highlight, #000);
        }

        label.hovered,
        input:hover + .label {
          background: var(--cc-color-bg-neutral, #f9f9f9);
        }

        cc-zone {
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-zone-input', CcZoneInput);
