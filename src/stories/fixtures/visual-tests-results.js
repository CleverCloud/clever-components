/**
 * @param {string} baseName
 * @returns {import('../../components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestScreenshots}
 */
const getScreenshotUrls = (baseName) => {
  const basePath = '../../stories/assets/';
  return {
    expectationScreenshotUrl: new URL(`${basePath}${baseName}-expectation.png`, import.meta.url).href,
    actualScreenshotUrl: new URL(`${basePath}${baseName}-actual.png`, import.meta.url).href,
    diffScreenshotUrl: new URL(`${basePath}${baseName}-diff.png`, import.meta.url).href,
  };
};

/** @satisfies {import('../../components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult[]} */
export const visualTestsResults = /** @type {const} */ ([
  {
    id: 'cc-addon-admin-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-addon-admin-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },
  {
    id: 'cc-addon-admin-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },

  {
    id: 'cc-addon-admin-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-addon-admin-skeleton-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },

  {
    id: 'cc-addon-admin-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },

  {
    id: 'cc-img-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-img-default-story-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },
  {
    id: 'cc-img-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },

  {
    id: 'cc-img-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },

  {
    id: 'cc-img-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-img-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },

  {
    id: 'cc-badge-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-badge',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-button-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-button-skeleton-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },
  {
    id: 'cc-button-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },
  {
    id: 'cc-article-list-data-loaded-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-article-list',
    storyName: 'dataLoaded',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-article-list-data-loaded-desktop'),
  },
  {
    id: 'cc-article-list-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-article-list',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-article-list-default-story-mobile'),
  },
  {
    id: 'cc-addon-backups-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-backups',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-addon-backups-default-story-desktop'),
  },
  {
    id: 'cc-addon-backups-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-backups',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-addon-backups-default-story-mobile'),
  },
  {
    id: 'cc-domain-management-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-domain-management-default-story-desktop'),
  },
  {
    id: 'cc-domain-management-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-domain-management-default-story-mobile'),
  },
  {
    id: 'cc-domain-management-empty-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'empty',
    viewportType: 'desktop',
    screenshots: getScreenshotUrls('cc-domain-management-empty-desktop'),
  },
  {
    id: 'cc-domain-management-empty-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'empty',
    viewportType: 'mobile',
    screenshots: getScreenshotUrls('cc-domain-management-empty-mobile'),
  },
]);
