import { css, html, LitElement } from 'lit-element';

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
 * A map marker displayed as a blinking dot with color grading depending on the value of `count`.
 *
 * ## Technical details
 *
 * * `size`, `anchor` and `tooltip` are readonly.
 * * `size` and `anchor` will help `<cc-map>` to center the dot on the exact GPS position.
 * * `tooltip` will help `<cc-map>` to place the tooltip's tip at the center of the dot.
 *
 * 🎨 default CSS display: `inline-block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/maps/cc-map-marker-dot.js)
 *
 * @prop {Number} count - Sets an abstract value for this marker to vary the color grading.
 *
 * @cssprop {Number} --cc-map-marker-dot-size - The size of the dot (defaults to 6px).
 */

export class CcMapMarkerDot extends LitElement {

  static get properties () {
    return {
      count: { type: Number, reflect: true },
      _color: { type: String },
    };
  }

  constructor () {
    super();
    /** @readonly */
    this.size = [16, 16];
    /** @readonly */
    this.anchor = [8, 8];
    /** @readonly */
    this.tooltip = [0, 0];
  }

  get count () {
    return this._count;
  }

  set count (newVal) {
    const oldVal = this._count;
    this._count = newVal;
    this.requestUpdate('count', oldVal);
    this._color = this._getColorFromCount(newVal);
  }

  _getColorFromCount (count) {

    // This blinking dot is mainly used to display the number of HTTP requests received at a given location on a map
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

    const rawColorIndex = Math.floor(Math.log(count));
    // If floor(log(value)) is bigger than number of colors in palette, we just use the max (darkest color)
    const colorIndex = Math.min(rawColorIndex, COLOR_PALETTE.length - 1);

    return COLOR_PALETTE[colorIndex];
  }

  render () {
    // When we do this:
    // <div style="--dot-color: ${this._color}ff; --dot-color-half: ${this._color}66; --dot-color-zero: ${this._color}00"></div>
    // The template minifier removes the double quotes and the template is broken
    return html`
      <div style=${`--dot-color:${this._color}ff;--dot-color-half:${this._color}66;--dot-color-zero:${this._color}00`}></div>
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

        div {
          --dot-size: var(--cc-map-marker-dot-size, 6px);
          animation: pulse 2s infinite;
          background: var(--dot-color);
          border-radius: 50%;
          cursor: pointer;
          height: var(--dot-size);
          width: var(--dot-size);
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

window.customElements.define('cc-map-marker-dot', CcMapMarkerDot);
