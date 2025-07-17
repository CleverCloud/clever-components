const ccArticleListDataLoadedDesktopExpectation = new URL('../../stories/assets/cc-article-list-data-loaded-desktop-expectation.png', import.meta.url).href;
const ccArticleListDataLoadedDesktopActual = new URL('../../stories/assets/cc-article-list-data-loaded-desktop-actual.png', import.meta.url).href;
const ccArticleListDataLoadedDesktopDiff = new URL('../../stories/assets/cc-article-list-data-loaded-desktop-diff.png', import.meta.url).href;

const ccArticleListDefaultStoryMobileExpectation = new URL('../../stories/assets/cc-article-list-default-story-mobile-expectation.png', import.meta.url).href;
const ccArticleListDefaultStoryMobileActual = new URL('../../stories/assets/cc-article-list-default-story-mobile-actual.png', import.meta.url).href;
const ccArticleListDefaultStoryMobileDiff = new URL('../../stories/assets/cc-article-list-default-story-mobile-diff.png', import.meta.url).href;

const ccAddonBackupsDefaultStoryDesktopExpectation = new URL('../../stories/assets/cc-addon-backups-default-story-desktop-expectation.png', import.meta.url).href;
const ccAddonBackupsDefaultStoryDesktopActual = new URL('../../stories/assets/cc-addon-backups-default-story-desktop-actual.png', import.meta.url).href;
const ccAddonBackupsDefaultStoryDesktopDiff = new URL('../../stories/assets/cc-addon-backups-default-story-desktop-diff.png', import.meta.url).href;

const ccAddonBackupsDefaultStoryMobileExpectation = new URL('../../stories/assets/cc-addon-backups-default-story-mobile-expectation.png', import.meta.url).href;
const ccAddonBackupsDefaultStoryMobileActual = new URL('../../stories/assets/cc-addon-backups-default-story-mobile-actual.png', import.meta.url).href;
const ccAddonBackupsDefaultStoryMobileDiff = new URL('../../stories/assets/cc-addon-backups-default-story-mobile-diff.png', import.meta.url).href;

const ccDomainManagementDefaultStoryDesktopExpectation = new URL('../../stories/assets/cc-domain-management-default-story-desktop-expectation.png', import.meta.url).href;
const ccDomainManagementDefaultStoryDesktopActual = new URL('../../stories/assets/cc-domain-management-default-story-desktop-actual.png', import.meta.url).href;
const ccDomainManagementDefaultStoryDesktopDiff = new URL('../../stories/assets/cc-domain-management-default-story-desktop-diff.png', import.meta.url).href;

const ccDomainManagementDefaultStoryMobileExpectation = new URL('../../stories/assets/cc-domain-management-default-story-mobile-expectation.png', import.meta.url).href;
const ccDomainManagementDefaultStoryMobileActual = new URL('../../stories/assets/cc-domain-management-default-story-mobile-actual.png', import.meta.url).href;
const ccDomainManagementDefaultStoryMobileDiff = new URL('../../stories/assets/cc-domain-management-default-story-mobile-diff.png', import.meta.url).href;

const ccDomainManagementEmptyDesktopExpectation = new URL('../../stories/assets/cc-domain-management-empty-desktop-expectation.png', import.meta.url).href;
const ccDomainManagementEmptyDesktopActual = new URL('../../stories/assets/cc-domain-management-empty-desktop-actual.png', import.meta.url).href;
const ccDomainManagementEmptyDesktopDiff = new URL('../../stories/assets/cc-domain-management-empty-desktop-diff.png', import.meta.url).href;

const ccDomainManagementEmptyMobileExpectation = new URL('../../stories/assets/cc-domain-management-empty-mobile-expectation.png', import.meta.url).href;
const ccDomainManagementEmptyMobileActual = new URL('../../stories/assets/cc-domain-management-empty-mobile-actual.png', import.meta.url).href;
const ccDomainManagementEmptyMobileDiff = new URL('../../stories/assets/cc-domain-management-empty-mobile-diff.png', import.meta.url).href;


/** @satisfies {import('../../components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult[]} */
export const visualTestsResults = /** @type {const} */ ([
  {
    id: 'cc-addon-admin-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-addon-admin-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-addon-admin-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },

  {
    id: 'cc-addon-admin-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-addon-admin-skeleton-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-addon-admin',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },

  {
    id: 'cc-addon-admin-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-admin',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },

  {
    id: 'cc-img-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-img-default-story-mobile-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-img-default-story-desktop-firefox',
    browserName: 'firefox',
    componentTagName: 'cc-img',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },

  {
    id: 'cc-img-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },

  {
    id: 'cc-img-disabled-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-img-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-img',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },

  {
    id: 'cc-badge-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-badge',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-button-skeleton-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-button-skeleton-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'skeleton',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-button-disabled-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-button',
    storyName: 'disabled',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-article-list-data-loaded-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-article-list',
    storyName: 'dataLoaded',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDataLoadedDesktopExpectation,
      actualScreenshotUrl: ccArticleListDataLoadedDesktopActual,
      diffScreenshotUrl: ccArticleListDataLoadedDesktopDiff,
    },
  },
  {
    id: 'cc-article-list-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-article-list',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccArticleListDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccArticleListDefaultStoryMobileActual,
      diffScreenshotUrl: ccArticleListDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-addon-backups-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-backups',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccAddonBackupsDefaultStoryDesktopExpectation,
      actualScreenshotUrl: ccAddonBackupsDefaultStoryDesktopActual,
      diffScreenshotUrl: ccAddonBackupsDefaultStoryDesktopDiff,
    },
  },
  {
    id: 'cc-addon-backups-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-addon-backups',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccAddonBackupsDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccAddonBackupsDefaultStoryMobileActual,
      diffScreenshotUrl: ccAddonBackupsDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-domain-management-default-story-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'defaultStory',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccDomainManagementDefaultStoryDesktopExpectation,
      actualScreenshotUrl: ccDomainManagementDefaultStoryDesktopActual,
      diffScreenshotUrl: ccDomainManagementDefaultStoryDesktopDiff,
    },
  },
  {
    id: 'cc-domain-management-default-story-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'defaultStory',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccDomainManagementDefaultStoryMobileExpectation,
      actualScreenshotUrl: ccDomainManagementDefaultStoryMobileActual,
      diffScreenshotUrl: ccDomainManagementDefaultStoryMobileDiff,
    },
  },
  {
    id: 'cc-domain-management-empty-desktop-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'empty',
    viewportType: 'desktop',
    screenshots: {
      expectationScreenshotUrl: ccDomainManagementEmptyDesktopExpectation,
      actualScreenshotUrl: ccDomainManagementEmptyDesktopActual,
      diffScreenshotUrl: ccDomainManagementEmptyDesktopDiff,
    },
  },
  {
    id: 'cc-domain-management-empty-mobile-chromium',
    browserName: 'chromium',
    componentTagName: 'cc-domain-management',
    storyName: 'empty',
    viewportType: 'mobile',
    screenshots: {
      expectationScreenshotUrl: ccDomainManagementEmptyMobileExpectation,
      actualScreenshotUrl: ccDomainManagementEmptyMobileActual,
      diffScreenshotUrl: ccDomainManagementEmptyMobileDiff,
    },
  },
]);
