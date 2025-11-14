import { visualTestsResults } from '../../stories/fixtures/visual-tests-results.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-tests-report-entry.js';

export default {
  tags: ['autodocs'],
  title: '🧐 Visual tests/<cc-visual-tests-report-entry>',
  component: 'cc-visual-tests-report-entry',
};

const conf = {
  component: 'cc-visual-tests-report-entry',
  css: `
    :host {
      max-width: 100% !important;
    }
  `,
};

/**
 * @import { CcVisualTestsReportEntry } from './cc-visual-tests-report-entry.js'
 */

const visualTestResult = visualTestsResults.find(({ id }) => id === 'cc-article-list-data-loaded-desktop-chromium');

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcVisualTestsReportEntry>[]} */
  items: [
    {
      testResult: visualTestResult,
    },
  ],
});

export const comparison = makeStory(conf, {
  /** @type {Partial<CcVisualTestsReportEntry>[]} */
  items: [
    {
      testResult: visualTestResult,
      viewerMode: 'comparison',
    },
  ],
});

export const diff = makeStory(conf, {
  /** @type {Partial<CcVisualTestsReportEntry>[]} */
  items: [
    {
      testResult: visualTestResult,
      viewerMode: 'diff',
    },
  ],
});
