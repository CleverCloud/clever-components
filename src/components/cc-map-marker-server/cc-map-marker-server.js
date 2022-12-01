import { css, LitElement, svg } from 'lit';

/**
 * @typedef {import('./cc-map-marker-server.types.js').MarkerStateType} MarkerStateType
 */

/**
 * A map marker displayed as a server inside a bubble with blinking dots for LEDs when state is "selected".
 *
 * ## Technical details
 *
 * * `size`, `anchor` and `tooltip` are readonly.
 *
 * @cssdisplay inline-block
 */
export class CcMapMarkerServer extends LitElement {

  static get properties () {
    return {
      anchor: { type: Array },
      size: { type: Array },
      state: { type: String, reflect: true },
      tooltip: { type: Array },
    };
  }

  constructor () {
    super();

    /** @type {Array} Exposes the coordinates of the "tip" of the marker, relative to its top left corner: `[x, y]` (used by `<cc-map>`) */
    this.anchor = [16, 32];

    /** @type {Array} Exposes the size of the marker: `[width, height]` (used by `<cc-map>`) */
    this.size = [32, 32];

    /** @type {MarkerStateType} Sets the state of the marker */
    this.state = 'default';

    /** @type {Array} Exposes the coordinates from which tooltips will "open", relative to the marker anchor: `[width, height]` (used by `<cc-map>`) */
    this.tooltip = [0, -32];
  }

  render () {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 100">
        <!-- You got to love this "simple" SVG gradient syntax ;-) -->
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" class="gradient-1"/>
          <stop offset="65%" class="gradient-2"/>
          <stop offset="100%" class="gradient-3"/>
        </linearGradient>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1h90c2 0 4 2 4 4v75c0 2-2 4-4 4H60L50 99 40 84H5c-2.2 0-4-2-4-4V5c0-2 2-4 4-4z"/>
        <rect width="70" height="18" x="15" y="17" rx="4" ry="4"/>
        <circle cx="24" cy="26" r="4" fill="#fff"/>
        <circle cx="37" cy="26" r="4" fill="#fff"/>
        <circle cx="50" cy="26" r="4" fill="#fff"/>
        <circle cx="63" cy="26" r="4" fill="#fff"/>
        <circle cx="76" cy="26" r="4" fill="#fff"/>
        <rect width="70" height="18" x="15" y="50" rx="4" ry="4"/>
        <circle cx="24" cy="59" r="4" fill="#fff"/>
        <circle cx="37" cy="59" r="4" fill="#fff"/>
        <circle cx="50" cy="59" r="4" fill="#fff"/>
        <circle cx="63" cy="59" r="4" fill="#fff"/>
        <circle cx="76" cy="59" r="4" fill="#fff"/>
      </svg>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          /* Make sure container size adapts to inner div */
          display: inline-block;
        }

        svg {
          display: block;
          width: 32px;
          /* 
            Exception to the "rem everywhere rule" because of the way leaflet positions markers and tooltips, 
            same as this.size
          */
          height: 32px;
          /* A filter:drop-shadow will match the shape, a box-shadow would just be a rectangle */
          filter: drop-shadow(0 0 2px #555);
        }

        :host(:not([state='default'])) svg {
          transform: scale(1.2);
          transform-origin: center bottom;
        }

        :host([state='selected']) svg {
          filter: drop-shadow(0 0 2px #e307d9);
        }

        path {
          fill: #999;
          stroke: #333;
        }

        :host([state='selected']) path {
          fill: url('#gradient');
          stroke: #000;
        }

        .gradient-1 {
          stop-color: #f19175;
        }

        .gradient-2 {
          stop-color: #cf3942;
        }

        .gradient-3 {
          stop-color: #e307d9;
        }

        rect {
          fill: #333;
        }

        :host(:not([state='default'])) rect {
          fill: #000;
        }

        :host([state='selected']) circle {
          animation: var(--duration) var(--delay) infinite led-half;
        }

        circle:nth-of-type(2) {
          --duration: 0.9s;
          --delay: 0.25s;
        }

        circle:nth-of-type(3) {
          --duration: 1.1s;
          --delay: 0.5s;
        }

        circle:nth-of-type(4) {
          --duration: 0.8s;
          --delay: 0.75s;
        }

        circle:nth-of-type(6) {
          --duration: 0.95s;
          --delay: 0.15s;
        }

        circle:nth-of-type(8) {
          --duration: 0.85s;
          --delay: 0.45s;
        }

        circle:nth-of-type(9) {
          --duration: 1.05s;
          --delay: 0.65s;
        }

        circle:nth-of-type(10) {
          --duration: 0.75s;
          --delay: 0.95s;
        }

        @keyframes led-half {

          0% {
            visibility: hidden;
          }

          20% {
            visibility: hidden;
          }

          100% {
            visibility: visible;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-map-marker-server', CcMapMarkerServer);
