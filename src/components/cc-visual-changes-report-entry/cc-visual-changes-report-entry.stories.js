import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-changes-report-entry.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Utility/<cc-visual-changes-report-entry>',
  component: 'cc-visual-changes-report-entry',
};

const conf = {
  component: 'cc-visual-changes-report-entry',
  css: `
    :host {
      max-width: 100% !important;
    }
  `,
};

const baseImgSrc = new URL('../../stories/assets/cc-addon-admin-base.png', import.meta.url).href;
const changedImgSrc = new URL('../../stories/assets/cc-addon-admin-changes.png', import.meta.url).href;
const diffImgSrc = new URL('../../stories/assets/cc-addon-admin-diff.png', import.meta.url).href;

const baseTestResult = {
  id: '1',
  browserName: 'chromium',
  componentTagName: 'cc-addon-admin',
  storyName: 'defaultStory',
  viewportType: 'desktop',
  screenshots: {
    baselineScreenshotUrl: baseImgSrc,
    changesScreenshotUrl: changedImgSrc,
    diffScreenshotUrl: diffImgSrc,
  },
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      testResult: baseTestResult,
    },
  ],
});

export const comparison = makeStory(conf, {
  items: [
    {
      testResult: baseTestResult,
      viewerMode: 'comparison',
    },
  ],
});

export const diff = makeStory(conf, {
  items: [
    {
      testResult: baseTestResult,
      viewerMode: 'diff',
    },
  ],
});
