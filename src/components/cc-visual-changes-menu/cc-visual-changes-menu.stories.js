import { makeStory } from '../../stories/lib/make-story.js';
import './cc-visual-changes-menu.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Utility/<cc-visual-changes-menu>',
  component: 'cc-visual-changes-menu',
};

const conf = {
  component: 'cc-visual-changes-menu',
  css: `
    :host {
      max-width: 100% !important;
    }
  `,
};

/**
 * @typedef {import('./cc-visual-changes-menu.js').CcVisualChangesMenu} CcVisualChangesMenu
 * @typedef {import('../cc-visual-changes-report-entry/cc-visual-changes-report-entry.types.js').VisualChangesTestResult} VisualChangesTestResult
 */

const baseImgSrc = new URL('../../stories/assets/cc-addon-admin-base.png', import.meta.url).href;
const changedImgSrc = new URL('../../stories/assets/cc-addon-admin-changes.png', import.meta.url).href;
const diffImgSrc = new URL('../../stories/assets/cc-addon-admin-diff.png', import.meta.url).href;
const baseMobileImgSrc = new URL('../../stories/assets/cc-addon-admin-mobile-base.png', import.meta.url).href;
const changedMobileImgSrc = new URL('../../stories/assets/cc-addon-admin-mobile-changes.png', import.meta.url).href;
const diffMobileImgSrc = new URL('../../stories/assets/cc-addon-admin-mobile-diff.png', import.meta.url).href;

/** @type {VisualChangesTestResult[]} */
const baseResults = [
  // cc-addon-admin stories
  {
    id: 'cc-addon-admin-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Added mobile-chromium for defaultStory (cc-addon-admin)
  {
    id: 'cc-addon-admin-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },
  // Added desktop-firefox for defaultStory (cc-addon-admin)
  {
    id: 'cc-addon-admin-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile for defaultStory (cc-addon-admin)

  {
    id: 'cc-addon-admin-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile-chromium for skeleton (cc-addon-admin)
  {
    id: 'cc-addon-admin-skeleton-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },
  // Removed desktop-firefox for skeleton

  {
    id: 'cc-addon-admin-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile for disabled (cc-addon-admin)

  // cc-img stories
  {
    id: 'cc-img-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile-chromium for defaultStory (cc-img)
  {
    id: 'cc-img-default-story-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },
  // Added desktop-firefox for defaultStory (cc-img)
  {
    id: 'cc-img-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed desktop-firefox for disabled (cc-img)

  {
    id: 'cc-img-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile for skeleton (cc-img)

  {
    id: 'cc-img-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed desktop-firefox for disabled (cc-img)
  {
    id: 'cc-img-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },

  // cc-badge stories
  {
    id: 'cc-badge-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-badge',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  // Removed mobile for defaultStory (cc-button)
  {
    id: 'cc-button-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      baselineScreenshotUrl: baseImgSrc,
      changesScreenshotUrl: changedImgSrc,
      diffScreenshotUrl: diffImgSrc,
    },
  },
  {
    id: 'cc-button-skeleton-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },
  // Removed desktop for disabled (cc-button)
  {
    id: 'cc-button-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: {
      baselineScreenshotUrl: baseMobileImgSrc,
      changesScreenshotUrl: changedMobileImgSrc,
      diffScreenshotUrl: diffMobileImgSrc,
    },
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcVisualChangesMenu>>} */
  items: [
    {
      testResults: baseResults,
    },
  ],
});
