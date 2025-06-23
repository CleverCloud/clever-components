type TestsByBrowser = {
  browserName: string;
  testResult: TestFailure;
};

type TestFailure = {
  baselineScreenshotUrl: string;
  changesScreenshotUrl: string;
  diffScreenshotUrl: string;
};

type ViewportType = 'mobile' | 'desktop';

type TestsByViewportType = {
  viewportType: ViewportType;
  tests: TestsByBrowser[];
};

export type TestsByStories = {
  storyName: string;
  viewports: TestsByViewportType[];
};

export interface VisualRegressionTestResult {
  componentTagName: string;
  fileName: string;
  stories: TestsByStories[];
}

// Intermediate merging types for hierarchical test aggregation

export type ResultByBrowser = {
  [browserName: string]: TestFailure;
};

export type ResultByViewport = {
  [viewportType in ViewportType]?: ResultByBrowser;
};

export type ResultByStory = {
  [storyName: string]: ResultByViewport;
};

export interface ResultByComponent {
  [componentTagName: string]: {
    fileName: string;
    stories: ResultByStory;
  };
}
