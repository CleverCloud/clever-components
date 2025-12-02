import { visualTestsResults } from '../../stories/fixtures/visual-tests-results.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-tests-report-menu.js';

export default {
  tags: ['autodocs'],
  title: '🧐 Visual tests/<cc-visual-tests-report-menu>',
  component: 'cc-visual-tests-report-menu',
};

const conf = {
  component: 'cc-visual-tests-report-menu',
  css: `
    :host {
      max-width: 100% !important;
    }

    cc-visual-tests-report-menu {
      max-width: 20em;
      border-right: solid 1px var(--cc-color-border-neutral-weak);
      background-color: var(--cc-color-bg-neutral);
    }
  `,
};

/**
 * @import { CcVisualTestsReportMenu } from './cc-visual-tests-report-menu.js'
 */

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcVisualTestsReportMenu>>} */
  items: [
    {
      testsResults: visualTestsResults,
    },
  ],
});

export const preselectedMenuEntry = makeStory(conf, {
  /** @type {Array<Partial<CcVisualTestsReportMenu>>} */
  items: [
    {
      testsResults: visualTestsResults,
      activeTestResultId: visualTestsResults[1].id,
    },
  ],
});
