import '../atoms/cc-toggle.js';
import './cc-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

/**
 * World map of access logs with two modes: blinking dots or heatmap.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/maps/cc-logsmap.js)
 *
 *
 * ## Details
 *
 * * This component wraps `<cc-map>` with a clickable toggle for the mode.
 * * It has predefined i18n label for the toggle and the legend (to display logs).
 * * The legend is contextualized to an organization or an app so you MUST set either `orgaName` or `appName` but not both.
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
 * @prop {String} appName - Sets the name of the app for which we display the logs (don't use it with `orgaName`).
 * @prop {Number} centerLat - Sets the latitude center of the map.
 * @prop {Number} centerLon - Sets the longitude center of the map.
 * @prop {Boolean} error - Displays an error message (can be combined with `loading`).
 * @prop {HeatmapPoint[]} heatmapPoints - Sets the list of points used to draw the heatmap.
 * @prop {Boolean} loading - Displays a loader on top of the map (can be combined with `error`).
 * @prop {"points"|"heatmap"} mode - Sets map mode: `"points"` for blinking temporary dots and `"heatmap"` for a heatmap.
 * @prop {String} orgaName - Sets the name of the organization for which we display the logs (don't use it with `appName`).
 * @prop {Number} viewZoom - Sets the zoom of the map (between 1 and 6).
 *
 * @event {"points"|"heatmap"} cc-logsmap:mode - Fires the selected mode whenever the toggle changes.
 */
export class CcLogsMap extends LitElement {

  static get properties () {
    return {
      appName: { type: String, attribute: 'app-name' },
      centerLat: { type: Number, attribute: 'center-lat' },
      centerLon: { type: Number, attribute: 'center-lon' },
      error: { type: Boolean, reflect: true },
      heatmapPoints: { type: Array },
      loading: { type: Boolean, reflect: true },
      mode: { type: String },
      orgaName: { type: String, attribute: 'orga-name' },
      viewZoom: { type: Number, attribute: 'view-zoom' },
    };
  }

  constructor () {
    super();
    // Centered on Paris by default
    this.centerLat = 48.9;
    this.centerLon = 2.4;
    this.error = false;
    // this.heatmapPoints = [];
    this.loading = false;
    this.mode = 'points';
    this.viewZoom = 2;
  }

  /**
   * Add several points to the map for the live blinking dots mode.
   * @param {Point[]} points - List of points.
   * @param {PointsOptions} options - Options to spread the display of the different points over time.
   */
  addPoints (...params) {
    this.shadowRoot.querySelector('cc-map').addPoints(...params);
  }

  _getModes () {
    return [
      { label: i18n('cc-logsmap.mode.points'), value: 'points' },
      { label: i18n('cc-logsmap.mode.heatmap'), value: 'heatmap' },
    ];
  }

  _getLegend () {
    if (this.mode === 'points') {
      return (this.appName == null)
        ? i18n('cc-logsmap.legend.points', { orgaName: this.orgaName })
        : i18n('cc-logsmap.legend.points.app', { appName: this.appName });
    }
    return (this.appName == null)
      ? i18n('cc-logsmap.legend.heatmap', { orgaName: this.orgaName })
      : i18n('cc-logsmap.legend.heatmap.app', { appName: this.appName });
  }

  render () {
    return html`
      <cc-toggle
        .choices=${this._getModes()}
        value=${this.mode}
        @cc-toggle:input=${this._onModeChange}
      ></cc-toggle>
      <cc-map
        center-lat=${this.centerLat}
        center-lon=${this.centerLon}
        view-zoom=${this.viewZoom}
        mode=${this.mode}
        ?loading=${this.loading}
        ?error=${this.error}
        .heatmapPoints=${this.heatmapPoints}
      >${this._getLegend()}</cc-map>
    `;
  }

  _onModeChange ({ detail: mode }) {
    this.mode = mode;
    dispatchCustomEvent(this, 'mode', this.mode);
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        display: block;
        height: 15rem;
        overflow: hidden;
        position: relative;
        width: 20rem;
      }

      cc-toggle {
        left: 0.5rem;
        position: absolute;
        top: 0.5rem;
        z-index: 2;
      }

      cc-map {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 1;
      }
    `;
  }
}

window.customElements.define('cc-logsmap', CcLogsMap);
