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
import '../cc-block/cc-block.js';
import '../cc-img-diff-viewer/cc-img-diff-viewer.js';
import '../cc-img/cc-img.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-visual-changes-report-entry.types.js').VisualChangesTestResult} VisualChangesTestResult
 * @typedef {import('./cc-visual-changes-report-entry.types.js').VisualChangesTestReport} VisualChangesTestReport
 * @typedef {import('./cc-visual-changes-report-entry.types.js').VisualChangesScreenshots} VisualChangesScreenshots
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

export class CcVisualChangesReportEntry extends LitElement {
  static get properties() {
    return {
      testResult: { type: Object, attribute: 'test-result' },
      viewerMode: { type: String, attribute: 'viewer-mode' },
    };
  }

  constructor() {
    super();

    /** @type {VisualChangesTestResult|null} */
    this.testResult = null;

    /** @type {typeof CHOICES[number]['value']} */
    this.viewerMode = DEFAULT_CHOICE;
  }

  /** @param {CcSelectEvent<typeof CHOICES[number]['value']>} _ */
  _onSelect({ detail: choice }) {
    this.viewerMode = choice;
  }

  render() {
    if (this.testResult == null) {
      return '';
    }

    const { componentTagName, storyName, viewportType, browserName, screenshots } = this.testResult;
    const formattedStoryName = enhanceStoryName(camelCaseToHuman(storyName));
    return html`
      <header class="header">
        <div class="main-heading">
          <span><cc-icon .icon="${iconRemixCodeLine}"></cc-icon> ${componentTagName}</span>
          <span>&nbsp;| ${formattedStoryName}</span>
          <cc-icon .icon="${VIEWPORT_ICONS[viewportType]}" a11y-name="${viewportType}"></cc-icon>
          <cc-icon .icon="${BROWSER_ICONS[browserName.toLowerCase()]}" a11y-name="${browserName}"></cc-icon>
        </div>
        <cc-toggle .choices="${CHOICES}" @cc-select="${this._onSelect}" .value="${this.viewerMode}"></cc-toggle>
      </header>
      <div class="image-viewer">
        ${this.viewerMode === 'diff' ? this._renderThreeWayDiff(screenshots) : ''}
        ${this.viewerMode === 'comparison'
          ? html`
              <cc-img-diff-viewer
                base-img-src="${screenshots.baselineScreenshotUrl}"
                base-img-text="Baseline"
                changed-img-src="${screenshots.changesScreenshotUrl}"
                changed-img-text="Changes"
              ></cc-img-diff-viewer>
            `
          : ''}
      </div>
    `;
  }

  /** @param {VisualChangesScreenshots} _ */
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
          grid-template-rows: max-content 1fr;
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
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
          font-weight: bold;
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
          max-height: 30rem;
          width: 100%;
          object-fit: contain;
        }

        .three-way-diff__side-by-side a {
          width: 45%;
          min-width: min(16em, 100%);
          flex: 1 1 45%;
          box-sizing: border-box;
          overflow: hidden;
          border: solid 1px var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
        }

        .diff {
          display: block;
          overflow: hidden;
          border: solid 1px var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
        }

        cc-img-diff-viewer {
          border: solid 1px var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
        }
      `,
    ];
  }
}

customElements.define('cc-visual-changes-report-entry', CcVisualChangesReportEntry);
