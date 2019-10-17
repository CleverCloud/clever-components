import '../atoms/cc-loader.js';
import leaflet from 'leaflet';
// 'leaflet.heat' needs to be imported after 'leaflet'
import 'leaflet.heat';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { leafletStyles } from '../styles/leaflet.js';
import { WORLD_GEOJSON } from './world-110m.geo.js';

/**
 * World map showing blinking dots or heatmaps
 *
 * ## Methods
 *
 * * `addPoints(points: Point[], options?: PointsOptions)`
 *
 * ## Classes
 *
 * ### Point
 *
 * ```
 * {
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   count?: number,        // Number of occurences for this location (default: 1)
 *   delay?: number|string, // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
 *   tooltip?: string,      // Tooltip when the point is hovered
 * }
 * ```
 *
 * ### PointsOptions
 *
 * ```
 * {
 *   spreadDuration?: boolean|number, // Spread points appearance over a time window (in ms)
 * }
 * ```
 *
 * ## Properties
 *
 * | Property        | Attribute       | Type             | Description
 * | --------        | ---------       | ----             | -----------
 * | `centerLat`     | `center-lat`    | `number`         | Place the latitude view/center of the map
 * | `centerLon`     | `center-lon`    | `number`         | Place the longitude view/center of the map
 * | `viewZoom`      | `view-zoom`     | `number`         | Place the view/center zoom of the map [1-6]
 * | `mode`          | `mode`          | `string`         | mode of the map ['points', 'heatmap']
 * | `heatmapPoints` | `heatmapPoints` | `HeatmapPoint[]` | Data to draw the heatmap to show points
 * | `loading`       | `loading`       | `boolean`        | display a loader
 * | `error`         | `error`         | `boolean`        | display an error message
 *
 * ### HeatmapPoint
 *
 * ```
 * {
 *   lat: number,   // Latitude
 *   lon: number,   // Longitude
 *   count: number, // Number of occurences for this location
 * }
 * ```
 *
 * *WARNING*: The "Properties" table below is broken
 *
 * @slot - Legend and/or details for the map (displayed at the bottom)
 *
 * @attr {Number} center-lat - Place the latitude view/center of the map
 * @attr {Number} center-lon - Place the longitude view/center of the map
 * @attr {Number} view-zoom - Place the view/center zoom of the map
 * @attr {String} mode - 'points' (default) or 'heatmap'
 * @attr {Array} heatmapPoints - TODO
 * @attr {Boolean} loading - display a loader
 * @attr {Boolean} error - display an error message
 */
export class CcMap extends LitElement {

  static get properties () {
    return {
      centerLat: { type: Number, attribute: 'center-lat' },
      centerLon: { type: Number, attribute: 'center-lon' },
      viewZoom: { type: Number, attribute: 'view-zoom', reflect: true },
      mode: { type: String },
      loading: { type: Boolean, reflect: true },
      heatmapPoints: { type: Array, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();
    // Centered on Paris by default
    this.centerLat = 48.9;
    this.centerLon = 2.4;
    this.viewZoom = 2;
    this.mode = 'points';
    // Used for reatime points
    this._points = [];
    this._markers = {};
    this._colorIndex = 0;
  }

  get centerLat () {
    return this._centerLat;
  }

  get centerLon () {
    return this._centerLon;
  }

  get viewZoom () {
    return this._viewZoom;
  }

  get mode () {
    return this._mode;
  }

  set centerLat (newVal) {
    const oldVal = this._centerLat;
    this._centerLat = newVal;
    this.requestUpdate('centerLat', oldVal);
    if (this._map != null) {
      this._map.setView([newVal, this._centerLon]);
    }
  }

  set centerLon (newVal) {
    const oldVal = this._centerLon;
    this._centerLon = newVal;
    this.requestUpdate('centerLon', oldVal);
    if (this._map != null) {
      this._map.setView([this._centerLat, newVal]);
    }
  }

  set viewZoom (newVal) {
    const oldVal = this._viewZoom;
    this._viewZoom = newVal;
    this.requestUpdate('viewZoom', oldVal);
    if (this._map != null) {
      this._map.setZoom(newVal);
    }
  }

  set mode (newVal) {
    const oldVal = this._mode;
    this._mode = newVal;
    this.requestUpdate('mode', oldVal);
    this._resetCurrentLayer();
  }

  set heatmapPoints (newVal) {
    // Wait for the first update that the map is made
    (this._map == null)
      ? this.updateComplete.then(() => this._updateHeatmap(newVal))
      : this._updateHeatmap(newVal);
  }

  addPoints (points, options = {}) {

    // If a point is added before the map is set, wait
    if (this._map == null) {
      this.updateComplete.then(() => this.addPoints(points, options));
      return;
    }

    const { spreadDuration = false } = options;

    const timeStep = (spreadDuration !== false)
      ? Math.floor(spreadDuration / points.length)
      : 0;

    points.forEach((p, i) => {
      setTimeout(() => this._addPoint(p), timeStep * i);
    });
  }

  _resetCurrentLayer () {
    if (this._map != null) {
      (this._mode === 'heatmap')
        ? this._map.addLayer(this._heatLayer)
        : this._map.removeLayer(this._heatLayer);
      (this._mode === 'points')
        ? this._map.addLayer(this._pointsLayer)
        : this._map.removeLayer(this._pointsLayer);
    }
  }

  _updateHeatmap (newPoints) {

    const counts = newPoints.map(({ count }) => count);
    const maxCount = Math.max(...counts);

    const heatPoints = newPoints
      .map(({ lat, lon, count }) => [lat, lon, count]);

    const heatOptions = {
      blur: 7,
      max: maxCount,
      minOpacity: 0.3,
      radius: 8,
    };

    this._heatLayer
      .clearLayers()
      .addLayer(leaflet.heatLayer(heatPoints, heatOptions));
  }

  _addPoint ({ lat, lon, count = 1, delay = 1000, tooltip, country }) {

    const newPoint = { lat, lon, count, delay, tooltip, country, coords: [lat, lon].join(',') };
    this._points.push(newPoint);

    this._updateMarker(newPoint);

    if (typeof delay === 'number') {
      setTimeout(() => {
        this._points = this._points.filter((p) => p !== newPoint);
        this._updateMarker(newPoint);
      }, delay);
    }
  }

  _updateMarker (point) {

    // Remove marker if there's alreay one at the coordinates
    this._removeMarker(point);

    // Compute total count of the points at those coordinates
    // We don't use this value for the tooltip for now
    const totalCount = this._points
      .filter((p) => p.coords === point.coords)
      .map((p) => p.count)
      .reduce((a, b) => a + b, 0);

    // Don't add a new marker
    if (totalCount === 0) {
      return;
    }

    // Random color
    const colorIndex = this._colorIndex;
    this._colorIndex = (this._colorIndex + 1) % 8;

    // Prepare new marker
    const dotIcon = leaflet.divIcon({
      html: `<div class="dot" data-color-index="${colorIndex}"></div>`,
      iconSize: [30, 30],
      bgPos: [15, 15],
      className: 'cc-map-marker',
    });

    // Add marker to the map
    const marker = leaflet
      .marker([point.lat, point.lon], { icon: dotIcon })
      .addTo(this._pointsLayer);

    // Save marker for later
    this._markers[point.coords] = marker;

    // Prepare tooltip
    const allTooltips = this._points
      .filter((p) => p.coords === point.coords && p.tooltip != null && p.tooltip !== '')
      .map((p) => p.tooltip);

    const uniqueTooltips = Array.from(new Set(allTooltips));

    // Bind tooltip to the marker
    if (allTooltips.length > 0) {
      const suffix = (uniqueTooltips.length >= 3) ? '...' : '';
      const tooltipsStr = uniqueTooltips.slice(0, 3).join('<br>') + suffix;
      marker.bindTooltip(tooltipsStr, { direction: 'top' });
    }
  }

  _removeMarker (point) {
    const marker = this._markers[point.coords];
    if (marker != null) {
      this._pointsLayer.removeLayer(marker);
      delete this._markers[point.coords];
    }
  }

  connectedCallback () {
    super.connectedCallback();
    // Force leaflet to rerender when parent is resized
    this._ro = new ResizeObserver(() => this._map.invalidateSize());
    this._ro.observe(this);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this._ro.unobserve(this);
  }

  // Draw the Leaflet map
  firstUpdated () {

    const leafletOptions = {
      // Block view on the world
      attributionControl: false,
      doubleClickZoom: true,
      dragging: true,
      keyboard: true,
      maxBounds: [[-84, -180], [90, 180]],
      maxBoundsViscosity: 1,
      maxZoom: 6,
      minZoom: 1,
      zoomControl: true,
    };

    // Init map
    this._map = leaflet
      .map(this.renderRoot.getElementById('cc-map-container'), leafletOptions)
      .setView([this._centerLat, this._centerLon], this._viewZoom);

    this._map.on('zoomanim', (e) => {
      this.viewZoom = e.zoom;
    });

    // Place zoom controls
    this._map.zoomControl.setPosition('bottomright');

    // Init world map from geojson data
    leaflet
      .geoJSON(WORLD_GEOJSON, {
        style: { className: 'map-country' },
        pane: 'tilePane',
      })
      .addTo(this._map);

    // Init layers
    this._pointsLayer = leaflet.layerGroup();
    this._heatLayer = leaflet.layerGroup();
    this._resetCurrentLayer();
  }

  render () {
    return html`
      <div id="cc-map-container"></div>
      <div class="legend"><slot></slot></div>
      ${this.loading && !this.error ? html`
        <cc-loader class="loader"></cc-loader>
      ` : ''}
      ${this.error ? html`
        <div class="error-container">
          <div class="error-panel">
            ${this.loading ? html`
              <cc-loader class="error-loader"></cc-loader>
            ` : ''}
            <div class="error-message">${i18n('cc-map.error')}</div>
          </div>
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      leafletStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          height: 50px;
          position: relative;
        }

        #cc-map-container {
          flex: 1 1 0;
          width: 100%;
        }

        :host([loading]) .leaflet-control-container,
        :host([error]) .leaflet-control-container {
          display: none;
        }

        :host([loading]) #cc-map-container,
        :host([error]) #cc-map-container,
        :host([loading]) .legend,
        :host([error]) .legend {
          filter: blur(.1rem);
        }

        .leaflet-container {
          background-color: #aadaff;
          z-index: 1;
        }

        .map-country {
          fill: #f5f5f5;
          fill-opacity: 1;
          stroke: #ddd;
          stroke-width: 1;
        }

        :host(:not(:empty)) .legend {
          background-color: #f1f5ff;
          box-shadow: inset 0 6px 6px -6px #a4b1c9;
          box-sizing: border-box;
          color: #2e2e2e;
          font-size: 0.9rem;
          font-style: italic;
          padding: 0.4rem 1rem;
        }

        .loader {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          /* Over Leaflet */
          z-index: 2000;
        }

        .error-loader {
          height: 1.5rem;
          margin-right: 1rem;
          width: 1.5rem;
        }

        .error-container {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          /* Over Leaflet */
          z-index: 2000;
        }

        .error-panel {
          align-items: center;
          background-color: white;
          border-radius: 0.25rem;
          border: 1px solid #ccc;
          display: flex;
          justify-content: center;
          max-width: 80%;
          padding: 1rem;
        }

        .cc-map-marker {
          align-items: center;
          background: none;
          display: flex;
          justify-content: center;
        }

        .dot {
          animation: pulse 2s infinite;
          background: var(--dot-color);
          border-radius: 50%;
          color: #1a1a1a;
          cursor: pointer;
          height: var(--dot-size);
          line-height: var(--dot-size);
          position: relative;
          text-align: center;
          width: var(--dot-size);
        }

        :host([view-zoom="1"]) .dot {
          --dot-size: 6px;
        }

        :host([view-zoom="2"]) .dot {
          --dot-size: 8px;
        }

        :host([view-zoom="3"]) .dot {
          --dot-size: 10px;
        }

        :host([view-zoom="4"]) .dot {
          --dot-size: 12px;
        }

        :host([view-zoom="5"]) .dot {
          --dot-size: 14px;
        }

        :host([view-zoom="6"]) .dot {
          --dot-size: 16px;
        }

        /* This may seem a bit verbose but it gzips well and we have IDE integration */
        .dot[data-color-index="0"] {
          --dot-color: rgba(228, 26, 28, 1);
          --dot-color-half: rgba(228, 26, 28, 0.4);
          --dot-color-zero: rgba(228, 26, 28, 0.0);
        }

        .dot[data-color-index="1"] {
          --dot-color: rgba(55, 126, 184, 1);
          --dot-color-half: rgba(55, 126, 184, 0.4);
          --dot-color-zero: rgba(55, 126, 184, 0);
        }

        .dot[data-color-index="2"] {
          --dot-color: rgba(77, 175, 74, 1);
          --dot-color-half: rgba(77, 175, 74, 0.4);
          --dot-color-zero: rgba(77, 175, 74, 0);
        }

        .dot[data-color-index="3"] {
          --dot-color: rgba(152, 78, 163, 1);
          --dot-color-half: rgba(152, 78, 163, 0.4);
          --dot-color-zero: rgba(152, 78, 163, 0);
        }

        .dot[data-color-index="4"] {
          --dot-color: rgba(255, 127, 0, 1);
          --dot-color-half: rgba(255, 127, 0, 0.4);
          --dot-color-zero: rgba(255, 127, 0, 0);
        }

        .dot[data-color-index="5"] {
          --dot-color: rgba(190, 190, 51, 1);
          --dot-color-half: rgba(190, 190, 51, 0.4);
          --dot-color-zero: rgba(190, 190, 51, 0);
        }

        .dot[data-color-index="6"] {
          --dot-color: rgba(166, 86, 40, 1);
          --dot-color-half: rgba(166, 86, 40, 0.4);
          --dot-color-zero: rgba(166, 86, 40, 0);
        }

        .dot[data-color-index="7"] {
          --dot-color: rgba(190, 129, 160, 1);
          --dot-color-half: rgba(190, 129, 160, 0.4);
          --dot-color-zero: rgba(190, 129, 160, 0);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 var(--dot-color-half);
          }
          70% {
            box-shadow: 0 0 0 var(--dot-size) var(--dot-color-zero);
          }
          100% {
            box-shadow: 0 0 0 0 var(--dot-color-zero);
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-map', CcMap);
