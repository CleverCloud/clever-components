import { LitElement, css, html } from 'lit';
import { iconRemixExpandLeftRightFill as iconSlider } from '../../assets/cc-remix.icons.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement & { type: 'range' }>} HTMLInputRangeEvent
 */

/**
 * A component to compare two images with a slider.
 *
 * ## Details
 *
 * * This component renders two images on top of each other.
 * * A slider can be moved horizontally to reveal one image or the other.
 * * This is useful to compare two versions of an image, for instance a "before" and an "after".
 *
 * @cssdisplay block
 */
export class CcImgComparator extends LitElement {
  static get properties() {
    return {
      baseImgSrc: { type: String, attribute: 'base-img-src' },
      baseImgText: { type: String, attribute: 'base-img-text' },
      comparisonImgSrc: { type: String, attribute: 'changed-img-src' },
      comparisonImgText: { type: String, attribute: 'changed-img-text' },
      _revealPercentage: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} */
    this.baseImgSrc = null;

    /** @type {string|null} */
    this.baseImgText = null;

    /** @type {string|null} */
    this.comparisonImgSrc = null;

    /** @type {string|null} */
    this.comparisonImgText = null;

    /** @type {number} */
    this._revealPercentage = 50;
  }

  /** @param {HTMLInputRangeEvent} e */
  _onSlide(e) {
    this._revealPercentage = Number(e.target.value);
  }

  render() {
    const baseImgPercentage = 100 - this._revealPercentage;
    return html`
      <div class="img-wrapper">
        <div class="base-img" style="clip-path: inset(0 ${baseImgPercentage}% 0 0">
          <div class="heading">${this.baseImgText}</div>
          <img src="${this.baseImgSrc}" alt="${this.baseImgText}" />
        </div>
        <div class="changed-img" style="clip-path: inset(0 0 0 ${this._revealPercentage}%)">
          <div class="heading">${this.comparisonImgText}</div>
          <img src="${this.comparisonImgSrc}" alt="${this.comparisonImgText}" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          @input="${this._onSlide}"
          aria-label="Sliding left reveals more of the image with changes while sliding right reveals more of the base image"
        />
        <cc-icon .icon="${iconSlider}" style="left: ${this._revealPercentage}%"></cc-icon>
        <div class="separator" style="left: ${this._revealPercentage}%"></div>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: block;
        }

        .img-wrapper {
          align-items: center;
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: grid;
          grid-template-areas: 'img';
          height: 100%;
          justify-content: center;
          margin-inline: auto;
          max-width: max-content;
          min-height: 0;
          position: relative;
        }

        .base-img,
        .changed-img {
          display: grid;
          grid-area: img;
          position: relative;
        }

        .heading {
          font-size: 0.9em;
          font-style: italic;
          padding: 1em;
          position: absolute;
        }

        .base-img .heading {
          left: 2em;
          top: 0;
        }

        .changed-img .heading {
          right: 2em;
          top: 0;
        }

        img {
          max-height: 100%;
          max-width: 100%;
          order: -1;
          width: auto;
        }

        input {
          height: 100%;
          opacity: 0;
          position: absolute;
          width: 100%;
          z-index: 2;
        }

        cc-icon {
          background-color: #fff;
          border: solid 1px var(--cc-color-border-neutral, #bfbfbf);
          border-radius: 50%;
          display: flex;
          padding: 0.5em;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .separator {
          background-color: var(--cc-color-border-neutral, #bfbfbf);
          border: solid 2px #fff;
          box-sizing: border-box;
          height: 100%;
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          width: 5px;
        }

        input:focus-visible + cc-icon {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input:hover + cc-icon {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }
      `,
    ];
  }
}

customElements.define('cc-img-comparator', CcImgComparator);
