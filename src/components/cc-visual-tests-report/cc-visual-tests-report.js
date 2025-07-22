import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixGitBranchLine as iconBranch,
  iconRemixGitCommitLine as iconCommit,
  iconRemixCalendarScheduleLine as iconDate,
  iconRemixGitPullRequestLine as iconPr,
  iconRemixFlowChart as iconWorkflow,
} from '../../assets/cc-remix.icons.js';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import { generateDevHubHref } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-visual-tests-report-entry/cc-visual-tests-report-entry.js';
import '../cc-visual-tests-report-menu/cc-visual-tests-report-menu.js';

const DATE_FORMATTER_SHORT = new DateFormatter('datetime-short', 'local');

/**
 * @typedef {import('./visual-tests-report.types.js').VisualTestsReport} VisualTestsReport
 * @typedef {import('./visual-tests-report.types.js').VisualTestResult} VisualTestResult
 * @typedef {import('lit').PropertyValues<CcVisualTestsReport>} CcVisualTestsReportPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement & { tagName: 'MAIN' }>} HTMLMainElementRef
 */

/**
 * A component that displays a visual testing report.
 *
 * ## Details
 *
 * This component is designed to display a comprehensive report of visual regression tests.
 * It features a navigation menu on the left to browse through different test results and a main content area on the right to display the selected test result entry along with its metadata.
 *
 * @cssdisplay grid
 */
export class CcVisualTestsReport extends LitElement {
  static get properties() {
    return {
      activeTestResultId: { type: String, attribute: 'active-test-result-id' },
      report: { type: Object },
    };
  }
  constructor() {
    super();

    /** @type {typeof this.report['results'][number]['id']} */
    this.activeTestResultId = null;

    /** @type {VisualTestsReport} */
    this.report = null;

    /** @type {HTMLMainElementRef} */
    this._mainElementRef = createRef();

    /** @type {VisualTestResult[]} */
    this._sortedTestResults = [];
  }

  /**
   * @param {VisualTestResult[]} testResults
   * @returns {VisualTestResult[]}
   */
  _sortTestResults(testResults) {
    return [...testResults].sort((a, b) => {
      const componentCompare = a.componentTagName.localeCompare(b.componentTagName);
      if (componentCompare !== 0) {
        return componentCompare;
      }
      // If componentTagNames are the same, sort by storyName
      if (a.storyName === 'defaultStory' && b.storyName !== 'defaultStory') {
        return -1;
      }
      if (a.storyName !== 'defaultStory' && b.storyName === 'defaultStory') {
        return 1;
      }
      const storyCompare = a.storyName.localeCompare(b.storyName);
      if (storyCompare !== 0) {
        return storyCompare;
      }
      // If storyNames are the same, sort by viewportType
      const browserNameCompare = a.browserName.localeCompare(b.browserName);
      if (browserNameCompare !== 0) {
        return browserNameCompare;
      }
      // If viewportTypes are the same, sort by browserName
      return a.viewportType.localeCompare(b.viewportType);
    });
  }

  /**
   * Links referencing anchor inside Shadow DOM don't work natively (even when both the link and the anchor are within the same Shadow root)
   * see https://github.com/WICG/webcomponents/issues/1048
   */
  _skipToMain() {
    this._mainElementRef.value?.focus();
  }

  /** @param {CcVisualTestsReportPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('report')) {
      this._sortedTestResults = this._sortTestResults(this.report.results);
    }
  }

  render() {
    if (this.report == null) {
      return '';
    }

    const { repositoryOwner, repositoryName, prNumber, workflowId, branchName, expectationMetadata, actualMetadata } =
      this.report;
    const activeTestResult =
      this._sortedTestResults.find((result) => result.id === this.activeTestResultId) ?? this._sortedTestResults[0];

    return html`
      <a class="skip-link" href="#main-content" @click="${this._skipToMain}">Skip to content</a>
      <div class="left">
        <header>
          <a
            class="storybook-link"
            href="${generateDevHubHref('clever-components/?path=/docs/readme--docs')}"
            title="Clever Components - Storybook - new window"
            target="_blank"
            rel="noopener"
          >
            <cc-img
              src="https://assets.clever-cloud.com/login-assets/img/logo.svg"
              a11y-name="Clever Components - Storybook"
            ></cc-img>
          </a>
          <h1>Visual tests report</h1>
        </header>
        <nav aria-label="Visual tests report menu">
          <cc-visual-tests-report-menu
            .testsResults="${this._sortedTestResults}"
            active-test-result-id="${activeTestResult.id}"
          ></cc-visual-tests-report-menu>
        </nav>
      </div>
      <main id="main-content" tabindex="-1" ${ref(this._mainElementRef)}>
        ${this._renderMetadata({
          repositoryOwner,
          repositoryName,
          prNumber,
          workflowId,
          branchName,
          expectationMetadata,
          actualMetadata,
        })}
        <cc-visual-tests-report-entry .testResult="${activeTestResult}"></cc-visual-tests-report-entry>
      </main>
    `;
  }

  /** @param {Omit<VisualTestsReport, 'results' | 'impactedComponents'>} _ */
  _renderMetadata({
    repositoryOwner,
    repositoryName,
    prNumber,
    workflowId,
    branchName,
    expectationMetadata,
    actualMetadata,
  }) {
    return html`
      <cc-block toggle="close">
        <h2 slot="header-title">Metadata</h2>
        <cc-block-section slot="content">
          <h3 slot="title">General info</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconPr}"></cc-icon>
                <span>PR Number</span>
              </dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/pulls/${prNumber}">
                  <span class="visually-hidden">Access PR -</span>
                  ${prNumber}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconBranch}"></cc-icon>
                <span>Branch</span>
              </dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/tree/${branchName}">
                  <span class="visually-hidden">Access branch -</span>
                  ${branchName}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconWorkflow}"></cc-icon>
                <span>Workflow</span>
              </dt>
              <dd class="metadata-list__item__value">
                <cc-link href="https://github.com/${repositoryOwner}/${repositoryName}/actions/runs/${workflowId}">
                  <span class="visually-hidden">Access workflow -</span>
                  ${workflowId}
                </cc-link>
              </dd>
            </div>
          </dl>
        </cc-block-section>
        <cc-block-section slot="content">
          <h3 slot="title">Expectation</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconCommit}"></cc-icon>
                <span>Commit sha</span>
              </dt>
              <dd class="metadata-list__item__value">
                <cc-link
                  href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${expectationMetadata.commitReference}"
                >
                  <span class="visually-hidden">Access expectation commit -</span>
                  ${expectationMetadata.commitReference.slice(0, 7)}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconDate}"></cc-icon>
                <span>Last update</span>
              </dt>
              <dd class="metadata-list__item__value">
                <span>${DATE_FORMATTER_SHORT.format(new Date(expectationMetadata.lastUpdated))}</span>
                <cc-datetime-relative datetime="${expectationMetadata.lastUpdated}"></cc-datetime-relative>
              </dd>
            </div>
          </dl>
        </cc-block-section>
        <cc-block-section slot="content">
          <h3 slot="title">Actual</h3>
          <dl class="metadata-list">
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconCommit}"></cc-icon>
                <span>Commit sha</span>
              </dt>
              <dd class="metadata-list__item__value">
                <cc-link
                  href="https://github.com/${repositoryOwner}/${repositoryName}/commit/${actualMetadata.commitReference}"
                >
                  <span class="visually-hidden">Access actual commit -</span>
                  ${actualMetadata.commitReference.slice(0, 7)}
                </cc-link>
              </dd>
            </div>
            <div class="metadata-list__item">
              <dt class="metadata-list__item__name">
                <cc-icon .icon="${iconDate}"></cc-icon>
                <span>Last update</span>
              </dt>
              <dd class="metadata-list__item__value">
                <span>${DATE_FORMATTER_SHORT.format(new Date(actualMetadata.lastUpdated))}</span>
                <cc-datetime-relative datetime="${actualMetadata.lastUpdated}"></cc-datetime-relative>
              </dd>
            </div>
          </dl>
        </cc-block-section>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: grid;
          grid-template-columns: min(20em, 100%) 1fr;
          grid-template-rows: 1fr;
        }

        dl,
        dt,
        dd,
        h1,
        h2,
        h3,
        h4 {
          margin: 0;
          padding: 0;
        }

        .skip-link {
          background-color: #fff;
          left: -9999px;
          padding: 1em;
          position: absolute;
          top: 1em;
        }

        .skip-link:focus {
          left: 1em;
          z-index: 1;
        }

        .left {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border-right: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          display: grid;
          grid-template-rows: auto auto 1fr;
          height: 100svh;
          position: sticky;
          top: 0;
        }

        header {
          align-items: center;
          display: grid;
          gap: 1em;
          grid-template-columns: 2em 1fr;
          padding: 1.5em 1em;
        }

        h1 {
          font-size: 1.3em;
        }

        .storybook-link {
          align-items: center;
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          text-decoration: none;
        }

        .storybook-link:focus-visible {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .storybook-link cc-img {
          --cc-img-fit: contain;

          height: 2em;
          width: 2em;
        }

        nav {
          height: 100%;
          min-height: 0;
        }

        cc-visual-tests-report-menu {
          height: 100%;
          min-height: 0;
        }

        main {
          box-sizing: border-box;
          display: grid;
          gap: 2em;
          grid-template-rows: max-content 1fr;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 1em;
          scrollbar-gutter: stable;
        }

        h3 {
          font-size: 1em;
        }

        cc-block-section {
          margin-top: 0;
          padding-top: 1em;
        }

        .metadata-list {
          --bdw: 2px;
          --color: var(--cc-color-bg-primary, #3569aa);
          --padding: 0.5em;

          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .metadata-list__item {
          background-color: var(--color);
          border: var(--bdw) solid var(--color);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-wrap: wrap;
          font-size: 0.8em;
        }

        .metadata-list__item__name,
        .metadata-list__item__value {
          box-sizing: border-box;
          flex: 1 1 auto;
          font-weight: bold;
          padding: calc(var(--padding) / 2) var(--padding);
          text-align: center;
        }

        .metadata-list__item__name {
          align-items: center;
          color: var(--cc-color-text-inverted, #fff);
          display: flex;
          gap: 0.5em;
        }

        .metadata-list__item__value {
          align-items: center;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-small, 0.15em);
          color: var(--cc-color-text-primary, #3569aa);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        cc-datetime-relative {
          border-inline-start: solid 2px var(--cc-color-bg-primary, #3569aa);
          font-style: italic;
          padding-left: 0.5em;
        }
      `,
    ];
  }
}

customElements.define('cc-visual-tests-report', CcVisualTestsReport);
