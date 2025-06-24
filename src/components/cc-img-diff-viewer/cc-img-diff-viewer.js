/* eslint-disable lit-a11y/img-redundant-alt */
import { LitElement, css, html } from 'lit';
import { iconRemixExpandLeftRightFill as iconSlider } from '../../assets/cc-remix.icons.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement & { type: 'range' }>} HTMLInputRangeEvent
 */

export class CcImgDiffViewer extends LitElement {
  static get properties() {
    return {
      baseImgSrc: { type: String, attribute: 'base-img-src' },
      baseImgText: { type: String, attribute: 'base-img-text' },
      changedImgSrc: { type: String, attribute: 'changed-img-src' },
      changedImgText: { type: String, attribute: 'changed-img-text' },
      _changedImgPercentage: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} */
    this.baseImgSrc = null;

    /** @type {string|null} */
    this.baseImgText = null;

    /** @type {string|null} */
    this.changedImgSrc = null;

    /** @type {string|null} */
    this.changedImgText = null;

    this._changedImgPercentage = '50';
  }

  /** @param {HTMLInputRangeEvent} e */
  _onSlide(e) {
    this._changedImgPercentage = e.target.value;
  }

  render() {
    const baseImgPercentage = 100 - Number(this._changedImgPercentage);
    return html`
      <div class="img-wrapper">
        <div class="base-img" style="clip-path: inset(0 ${baseImgPercentage}% 0 0">
          <div class="heading">${this.baseImgText}</div>
          <img src="${this.baseImgSrc}" alt="${this.baseImgText}" />
        </div>
        <div class="changed-img" style="clip-path: inset(0 0 0 ${this._changedImgPercentage}%)">
          <div class="heading">${this.changedImgText}</div>
          <img src="${this.changedImgSrc}" alt="${this.changedImgText}" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          @input="${this._onSlide}"
          aria-label="Sliding left reveals more of the image with changes while sliding right reveals more of the base image"
        />
        <cc-icon .icon="${iconSlider}" style="left: ${this._changedImgPercentage}%"></cc-icon>
        <div class="separator" style="left: ${this._changedImgPercentage}%"></div>
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
          display: grid;
          grid-template-areas: 'img';
          position: relative;
          align-items: center;
          justify-content: flex-start;
          border-radius: var(--cc-border-radius-default);
          border: solid 1px var(--cc-color-border-neutral);
        }

        .base-img,
        .changed-img {
          grid-area: img;
          display: grid;
        }

        .heading {
          padding: 1em;
          font-style: italic;
        }

        .changed-img .heading {
          justify-self: flex-end;
        }

        img {
          width: 100%;
          order: -1;
        }

        input {
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 2;
          opacity: 0;
        }

        cc-icon {
          position: absolute;
          top: 50%;
          border: solid 1px var(--cc-color-border-neutral);
          display: flex;
          padding: 0.5em;
          border-radius: 50%;
          z-index: 1;
          transform: translate(-50%, -50%);
          background-color: #fff;
        }

        .separator {
          position: absolute;
          top: 0;
          height: 100%;
          width: 1px;
          background-color: var(--cc-color-border-neutral-weak);
          transform: translateX(-50%);
        }

        input:focus-visible + cc-icon {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }
      `,
    ];
  }
}

window.customElements.define('cc-img-diff-viewer', CcImgDiffViewer);
