import '../atoms/cc-toggle.js';
import './cc-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

/**
 * World map of access logs with two modes (blinking dots or heatmap)
 *
 * ## Details
 *
 * * This component wraps `<cc-map>` with a clickable toggle for the mode
 * * It has predefined i18n label the toggle and the legend (to display logs)
 * * It emits an event `cc-logsmap:mode` when the mode changes
 *
 * ## Methods
 *
 * * `addPoints(points: Point[], options?: PointsOptions)` Look at `<cc-map>` `addPoints()` docs
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
 * @fires {String} cc-logsmap:mode - the selected mode ('points' or 'heatmap')
 *
 * @attr {Number} center-lat - Place the latitude view/center of the map
 * @attr {Number} center-lon - Place the longitude view/center of the map
 * @attr {Number} view-zoom - Place the view/center zoom of the map
 * @attr {String} mode - 'points' (default) or 'heatmap'
 * @attr {Array} heatmapPoints - TODO
 * @attr {Boolean} loading - display a loader
 * @attr {Boolean} error - display an error message
 */
export class CcLogsMap extends LitElement {

  static get properties () {
    return {
      centerLat: { type: Number, attribute: 'center-lat' },
      centerLon: { type: Number, attribute: 'center-lon' },
      viewZoom: { type: Number, attribute: 'view-zoom' },
      mode: { type: String },
      heatmapPoints: { type: Array, attribute: false },
      loading: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true },
      orgaName: { type: String, attribute: 'orga-name' },
      appName: { type: String, attribute: 'app-name' },
    };
  }

  constructor () {
    super();
    // Centered on Paris by default
    this.centerLat = 48.9;
    this.centerLon = 2.4;
    this.viewZoom = 2;
    this.mode = 'points';
    this.heatmapPoints = [];
    this.loading = false;
    this.error = false;
  }

  static get modes () {
    return [
      { label: i18n('cc-logsmap.mode.points'), value: 'points' },
      { label: i18n('cc-logsmap.mode.heatmap'), value: 'heatmap' },
    ];
  }

  addPoints (...params) {
    this.shadowRoot.querySelector('cc-map').addPoints(...params);
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
        .choices=${CcLogsMap.modes}
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
        border-radius: 0.25rem;
        border: 1px solid #ccc;
        display: block;
        overflow: hidden;
        position: relative;
      }

      cc-toggle {
        position: absolute;
        left: 0.5rem;
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
