import { LitElement, css, html } from 'lit';
import {
  iconRemixChromeLine,
  iconRemixCodeLine,
  iconRemixComputerLine,
  iconRemixFirefoxLine,
  iconRemixSafariLine,
  iconRemixSmartphoneLine,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToHuman } from '../../lib/change-case.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-img-diff-viewer/cc-img-diff-viewer.js';
import '../cc-img/cc-img.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-visual-change-report-entry.types.js').VisualChangeScreenshots} VisualChangeScreenshots
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 */

/** @satisfies {Choice[]} */
const CHOICES = /** @type {const} */ ([
  {
    label: 'Image comparison',
    value: 'comparison',
  },
  {
    label: 'Three way diff',
    value: 'diff',
  },
]);

const DEFAULT_CHOICE = 'comparison';

const BROWSER_ICONS = {
  chrome: iconRemixChromeLine,
  chromium: iconRemixChromeLine,
  firefox: iconRemixFirefoxLine,
  safari: iconRemixSafariLine,
  webkit: iconRemixSafariLine,
};

const VIEWPORT_ICONS = {
  desktop: iconRemixComputerLine,
  mobile: iconRemixSmartphoneLine,
};

export class CcVisualChangeReportEntry extends LitElement {
  static get properties() {
    return {
      browserName: { type: String, attribute: 'browser-name' },
      componentTagName: { type: String, attribute: 'component-tag-name' },
      screenshots: { type: Object },
      storyName: { type: String, attribute: 'story-name' },
      viewerMode: { type: String, attribute: 'viewer-mode' },
      viewportType: { type: String, attribute: 'viewport-type' },
    };
  }

  constructor() {
    super();

    /** @type {string|null} */
    this.componentTagName = null;

    /** @type {string|null} */
    this.storyName = null;

    /** @type {string|null} */
    this.viewportType = null;

    /** @type {string|null} */
    this.browserName = null;

    /** @type {VisualChangeScreenshots} */
    this.screenshots = null;

    /** @type {typeof CHOICES[number]['value']} */
    this.viewerMode = DEFAULT_CHOICE;
  }

  /** @param {CcSelectEvent<typeof CHOICES[number]['value']>} _ */
  _onSelect({ detail: choice }) {
    this.viewerMode = choice;
  }

  render() {
    const formattedStoryName = enhanceStoryName(camelCaseToHuman(this.storyName));
    return html`
      <header class="header">
        <div class="main-heading">
          <span><cc-icon .icon="${iconRemixCodeLine}"></cc-icon> ${this.componentTagName}</span>
          <span>&nbsp;| ${formattedStoryName}</span>
          <cc-icon .icon="${VIEWPORT_ICONS[this.viewportType]}" a11y-name="${this.viewportType}"></cc-icon>
          <cc-icon .icon="${BROWSER_ICONS[this.browserName]}" a11y-name="${this.browserName}"></cc-icon>
        </div>
        <cc-toggle .choices="${CHOICES}" @cc-select="${this._onSelect}" .value="${this.viewerMode}"></cc-toggle>
      </header>
      <div class="image-viewer">
        ${this.viewerMode === 'diff' ? this._renderThreeWayDiff(this.screenshots) : ''}
        ${this.viewerMode === 'comparison'
          ? html`
              <cc-img-diff-viewer
                base-img-src="${this.screenshots.baselineScreenshotUrl}"
                changed-img-src="${this.screenshots.changesScreenshotUrl}"
              ></cc-img-diff-viewer>
            `
          : ''}
      </div>
    `;
  }

  /** @param {VisualChangeScreenshots} _ */
  _renderThreeWayDiff({ baselineScreenshotUrl, changesScreenshotUrl, diffScreenshotUrl }) {
    return html`
      <div class="three-way-diff">
        <div class="three-way-diff__side-by-side">
          <a href="${baselineScreenshotUrl}">
            <div class="heading">Baseline</div>
            <img class="baseline" src="${baselineScreenshotUrl}" alt="" />
          </a>
          <a href="${changesScreenshotUrl}">
            <div class="heading">Changes</div>
            <img class="changes" src="${changesScreenshotUrl}" alt="" />
          </a>
        </div>
        <a class="diff" href="${diffScreenshotUrl}">
          <div class="heading">Diff</div>
          <img src="${diffScreenshotUrl}" alt="" />
        </a>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          gap: 1em;
        }

        cc-icon {
          flex: 0 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2em;
        }

        .main-heading {
          font-size: 1.6em;
          /* font-variant: small-caps; */
          font-weight: bold;
          color: var(--cc-color-text-primary-strong);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .main-heading cc-icon {
          margin-left: 0.5em;
        }

        .main-heading span {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .heading {
          padding: 1em;
          font-weight: bold;
          background-color: var(--cc-color-bg-neutral);
        }

        .three-way-diff {
          display: grid;
          gap: 1em;
        }

        .three-way-diff__side-by-side {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          box-sizing: border-box;
        }

        img {
          display: block;
          max-width: 100%;
          height: auto;
          width: 100%;
        }

        .three-way-diff__side-by-side a {
          width: 45%;
          min-width: min(16em, 100%);
          flex: 1 1 45%;
          box-sizing: border-box;
          border: solid 1px var(--cc-color-border-neutral-weak);
        }

        .diff {
          display: block;
          border: solid 1px var(--cc-color-border-neutral-weak);
        }
      `,
    ];
  }
}

window.customElements.define('cc-visual-change-report-entry', CcVisualChangeReportEntry);
