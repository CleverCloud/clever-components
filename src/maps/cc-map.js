import '../atoms/cc-loader.js';
import '../molecules/cc-error.js';
import leaflet from 'leaflet';
// 'leaflet.heat' needs to be imported after 'leaflet'
import 'leaflet.heat';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { leafletStyles } from '../styles/leaflet.js';
import { WORLD_GEOJSON } from './world-110m.geo.js';

// Generated with https://components.ai/color-scale/
// Canvas at #F5F5F5 (map country color)
// From #40B970 to #003814 with 8 steps
const COLOR_PALETTE = [
  '#40b970',
  '#36a562',
  '#2c9254',
  '#237f46',
  '#1a6c39',
  '#115a2c',
  '#084920',
  '#003814',
];

/**
 * World map with two modes: blinking dots or heatmap.
 *
 * ## Details
 *
 * * The component has a default height of 15rem and a default width 20rem but this can be overridden with CSS.
 *
 * ## Type definitions
 *
 * ```js
 * interface Point {
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   count?: number,        // Number of occurences for this location (default: 1)
 *   delay?: number|string, // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
 *   tooltip?: string,      // Tooltip when the point is hovered
 * }
 * ```
 *
 * ```js
 * interface PointsOptions {
 *   spreadDuration?: boolean|number, // Spread points appearance over a time window (in ms)
 * }
 * ```
 *
 * ```js
 * interface HeatmapPoint {
 *   lat: number,   // Latitude
 *   lon: number,   // Longitude
 *   count: number, // Number of occurences for this location
 * }
 * ```
 *
 * @prop {Number} centerLat - Sets the latitude center of the map.
 * @prop {Number} centerLon - Sets the longitude center of the map.
 * @prop {Boolean} error - Displays an error message (can be combined with `loading`).
 * @prop {HeatmapPoint[]} heatmapPoints - Sets the list of points used to draw the heatmap.
 * @prop {Boolean} loading - Displays a loader on top of the map (can be combined with `error`).
 * @prop {"points"|"heatmap"} mode - Sets map mode: `"points"` for blinking temporary dots and `"heatmap"` for a heatmap.
 * @prop {Number} viewZoom - Sets the zoom of the map (between 1 and 6).
 *
 * @slot - The legend and/or details for the map (displayed at the bottom).
 */
export class CcMap extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      centerLat: { type: Number, attribute: 'center-lat' },
      centerLon: { type: Number, attribute: 'center-lon' },
      error: { type: Boolean, reflect: true },
      heatmapPoints: { type: Array, attribute: false },
      loading: { type: Boolean, reflect: true },
      mode: { type: String },
      viewZoom: { type: Number, attribute: 'view-zoom', reflect: true },
    };
  }

  constructor () {
    super();
    // Centered on Paris by default
    this.centerLat = 48.9;
    this.centerLon = 2.4;
    this.error = false;
    this.loading = false;
    this.mode = 'points';
    this.viewZoom = 2;
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

  get heatmapPoints () {
    return this._heatmapPoints;
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
    this._heatmapPoints = newVal;
    // Wait for the first update that the map is made
    (this._map == null)
      ? this.updateComplete.then(() => this._updateHeatmap(newVal))
      : this._updateHeatmap(newVal);
  }

  /**
   * Add several points to the map for the live blinking dots mode.
   * @param {Point[]} points - List of points.
   * @param {PointsOptions} options - Options to spread the display of the different points over time.
   */
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

    if (!Array.isArray(newPoints)) {
      return;
    }

    const counts = newPoints.map(({ count }) => count);
    const maxCount = (newPoints.length > 0)
      ? Math.max(...counts)
      : 1;

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

    const colorVariables = this._getColorVariables(totalCount);

    // Prepare new marker
    const dotIcon = leaflet.divIcon({
      html: `<div class="dot" style="${colorVariables}"></div>`,
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

  _getColorVariables (numberOfRequests) {

    // Let's take the total number of requests for a given set of coordinates
    // We want to have visible differences of colors between 1 request and 10 requests but also between 20, 50 or 400...
    // Applying a logarithm helps to notice the importance of a given location
    // Distributing colors on a limited set of colors also helps
    // @see COLOR_PALETTE for the details

    // With 8 colors, this gives us those boundaries (color index: nb or requests)
    // 0:    1.00
    // 1:    2.71
    // 2:    7.38
    // 3:   20.08
    // 4:   54.59
    // 5:  148.41
    // 6:  403.42
    // 7: 1096.63

    const rawColorIndex = Math.floor(Math.log(numberOfRequests));
    // If floor(log(value)) is bigger than number of colors in palette, we just use the max (darkest color)
    const colorIndex = Math.min(rawColorIndex, COLOR_PALETTE.length);

    const hexColor = COLOR_PALETTE[colorIndex];

    // The map needs 3 variants of colors for the bubble animation (different transparencies)
    return [
      `--dot-color: ${hexColor}ff`,
      `--dot-color-half: ${hexColor}66`,
      `--dot-color-zero: ${hexColor}00`,
    ].join(';');
  }

  /**
   * @private
   */
  onResize () {
    this._map.invalidateSize();
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

    const noHeatmapPoints = (!this.error && this.mode === 'heatmap' && this.heatmapPoints != null && this.heatmapPoints.length === 0);
    const errorMode = this.loading ? 'loading' : 'info';

    return html`
      <div id="cc-map-container" class=${classMap({ 'no-data': noHeatmapPoints })}></div>
      <div class="legend ${classMap({ 'no-data': noHeatmapPoints })}"><slot></slot></div>
      ${this.loading && !this.error ? html`
      <cc-loader class="loader"></cc-loader>
    ` : ''}
      ${this.error || noHeatmapPoints ? html`
        <div class="msg-container">
          ${this.error ? html`
            <cc-error mode=${errorMode}>${i18n('cc-map.error')}</cc-error>
          ` : ''}
          ${noHeatmapPoints ? html`
            <div class="msg">${i18n('cc-map.no-points')}</div>
          ` : ''}
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
          height: 15rem;
          position: relative;
          width: 20rem;
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
        #cc-map-container.no-data,
        :host([loading]) .legend,
        :host([error]) .legend,
        .legend.no-data {
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

        .msg-container {
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

        cc-error,
        .msg {
          max-width: 80%;
        }

        .msg {
          align-items: center;
          background-color: white;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          box-shadow: 0 0 1rem #aaa;
          display: flex;
          justify-content: center;
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
