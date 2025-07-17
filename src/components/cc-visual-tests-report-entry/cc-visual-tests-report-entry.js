import { LitElement, css, html } from 'lit';
import {
  iconRemixChromeLine,
  iconRemixCodeLine,
  iconRemixComputerLine,
  iconRemixFirefoxLine,
  iconRemixSafariLine,
  iconRemixSmartphoneLine,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToSpacedCapitalized } from '../../lib/change-case.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-img-comparator/cc-img-comparator.js';
import '../cc-link/cc-link.js';
import '../cc-toggle/cc-toggle.js';

/** @satisfies {Choice[]} */
const CHOICES = /** @type {const} */ ([
  {
    label: 'Three way diff',
    value: 'diff',
  },
  {
    label: 'Image comparison',
    value: 'comparison',
  },
]);

const DEFAULT_CHOICE = 'diff';

const BROWSER_ICONS = /** @type {const} */ ({
  chrome: iconRemixChromeLine,
  chromium: iconRemixChromeLine,
  firefox: iconRemixFirefoxLine,
  safari: iconRemixSafariLine,
  webkit: iconRemixSafariLine,
});

const VIEWPORT_ICONS = /** @type {const} */ ({
  desktop: iconRemixComputerLine,
  mobile: iconRemixSmartphoneLine,
});

/**
 * @typedef {import('../cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult} VisualTestResult
 * @typedef {import('../cc-visual-tests-report/visual-tests-report.types.js').VisualTestScreenshots} VisualTestScreenshots
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 */

/**
 * A component that displays a single visual test result.
 *
 * ## Details
 *
 * It shows:
 * - a header with the component name, story name, viewport and browser,
 * - a viewer that can be switched between a three-way diff (expectation, actual, diff) and an image comparator.
 *
 * When `testResult` is null, the component is empty.
 *
 * @cssdisplay grid
 */
export class CcVisualTestsReportEntry extends LitElement {
  static get properties() {
    return {
      testResult: { type: Object, attribute: 'test-result' },
      viewerMode: { type: String, attribute: 'viewer-mode' },
    };
  }

  constructor() {
    super();

    /** @type {VisualTestResult|null} */
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
    const formattedStoryName = enhanceStoryName(camelCaseToSpacedCapitalized(storyName));

    return html`
      <header class="header">
        <div class="main-heading">
          <span>
            <cc-icon .icon="${iconRemixCodeLine}"></cc-icon>
            <span>${componentTagName}</span>
          </span>
          <span>&nbsp;| ${formattedStoryName}</span>
          <cc-icon .icon="${VIEWPORT_ICONS[viewportType]}" a11y-name="${viewportType}"></cc-icon>
          <cc-icon .icon="${BROWSER_ICONS[browserName]}" a11y-name="${browserName}"></cc-icon>
        </div>
        <cc-toggle .choices="${CHOICES}" @cc-select="${this._onSelect}" .value="${this.viewerMode}"></cc-toggle>
      </header>
      <div class="image-viewer">
        ${this.viewerMode === 'diff' ? this._renderThreeWayDiff(screenshots) : ''}
        ${this.viewerMode === 'comparison'
          ? html`
              <cc-img-comparator
                base-img-src="${screenshots.expectationScreenshotUrl}"
                base-img-text="Expectation"
                changed-img-src="${screenshots.actualScreenshotUrl}"
                changed-img-text="Actual"
              ></cc-img-comparator>
            `
          : ''}
      </div>
    `;
  }

  /** @param {VisualTestScreenshots} _ */
  _renderThreeWayDiff({ expectationScreenshotUrl, actualScreenshotUrl, diffScreenshotUrl }) {
    return html`
      <div class="three-way-diff">
        <div class="three-way-diff__side-by-side">
          <div class="viewbox viewbox--half">
            <div class="heading">
              <cc-link href="${expectationScreenshotUrl}">Expectation</cc-link>
            </div>
            <img class="viewbox__img" src="${expectationScreenshotUrl}" alt="" />
          </div>
          <div class="viewbox viewbox--half">
            <div class="heading">
              <cc-link href="${actualScreenshotUrl}">Actual</cc-link>
            </div>
            <img class="viewbox__img" src="${actualScreenshotUrl}" alt="" />
          </div>
        </div>
        <div class="viewbox">
          <div class="heading">
            <cc-link href="${diffScreenshotUrl}">Diff</cc-link>
          </div>
          <img class="viewbox__img" src="${diffScreenshotUrl}" alt="" />
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          gap: 1em;
          grid-template-rows: max-content 1fr;
        }

        cc-icon {
          flex: 0 0 auto;
        }

        .header {
          display: flex;
          flex-wrap: wrap;
          gap: 2em;
          justify-content: space-between;
        }

        .main-heading {
          align-items: center;
          color: var(--cc-color-text-primary-strongest, #012a51);
          display: flex;
          flex-wrap: wrap;
          font-size: 1.2em;
          font-weight: bold;
        }

        .main-heading cc-icon {
          margin-left: 0.5em;
        }

        .main-heading span {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .heading {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          font-weight: bold;
          padding: 1em;
        }

        .three-way-diff {
          display: grid;
          gap: 1em;
        }

        .three-way-diff__side-by-side {
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .viewbox {
          border: solid 1px var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          overflow: hidden;
        }

        .viewbox--half {
          flex: 1 1 45%;
          min-width: min(16em, 100%);
          overflow: hidden;
          width: 45%;
        }

        .viewbox__img {
          display: block;
          max-height: 30rem;
          max-width: 100%;
          object-fit: contain;
          width: 100%;
        }

        .diff {
          border: solid 1px var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: block;
        }

        cc-img-comparator {
          border: solid 1px var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          margin-inline: auto;
          max-width: max-content;
          overflow: hidden;
        }
      `,
    ];
  }
}

customElements.define('cc-visual-tests-report-entry', CcVisualTestsReportEntry);
