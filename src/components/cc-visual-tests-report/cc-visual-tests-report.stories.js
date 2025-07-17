import { visualTestsResults } from '../../stories/fixtures/visual-tests-results.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-tests-report.js';

export default {
  tags: ['autodocs'],
  title: '🧐 Visual tests/<cc-visual-tests-report>',
  component: 'cc-visual-tests-report',
};

const conf = {
  component: 'cc-visual-tests-report',
  css: `
    :host {
      max-width: 100% !important;
      padding: 0 !important;
    }
  `,
  tests: {
    accessibility: {
      enable: true,
      // the skip-link target is not found because of Shadow DOM but we rely on JS to fix the issue anyway
      ignoredRules: ['skip-link'],
    },
  },
};

/**
 * @typedef {import('./cc-visual-tests-report.js').CcVisualTestsReport} CcVisualTestsReport
 * @typedef {import('./visual-tests-report.types.js').VisualTestsReport} VisualTestsReport
 */

/** @type {VisualTestsReport} */
const report = {
  expectationMetadata: {
    commitReference: 'f64e54562466dab10393a4d4a3ac167989c40d7f',
    lastUpdated: '2025-07-11T06:27:20Z',
  },
  actualMetadata: {
    commitReference: '2aa26a75d3a6472c7230b590701785610c5d02ff',
    lastUpdated: '2025-07-11T06:36:20Z',
  },
  branchName: 'fake-branch-scope/fake-branch',
  prNumber: '42',
  repositoryName: 'fake-repository',
  repositoryOwner: 'CleverCloud',
  workflowId: '16173159455',
  impactedComponents: [...new Set(visualTestsResults.map((result) => result.componentTagName))],
  results: visualTestsResults,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcVisualTestsReport>[]} */
  items: [
    {
      report,
    },
  ],
  /** @param {CcVisualTestsReport} component */
  onUpdateComplete: (component) => {
    component.addEventListener('click', (e) => {
      const linkElement = /** @type {HTMLAnchorElement|null} */ (
        e.composedPath().find((element) => element instanceof HTMLAnchorElement)
      );

      if (
        linkElement != null &&
        linkElement.origin === window.location.origin &&
        linkElement.pathname.startsWith('/test-result/')
      ) {
        e.preventDefault();
        const testResultId = linkElement.pathname.split('/').pop();

        component.activeTestResultId = testResultId;
      }
    });
  },
});
