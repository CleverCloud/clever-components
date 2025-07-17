export interface VisualTestResult {
  id: string;
  componentTagName: string;
  storyName: string;
  viewportType: ViewportType;
  browserName: BrowserName;
  screenshots: VisualTestScreenshots;
}

export type BrowserName = 'chrome' | 'chromium' | 'firefox' | 'safari' | 'webkit';

export interface VisualTestScreenshots {
  expectationScreenshotUrl: string;
  diffScreenshotUrl: string;
  actualScreenshotUrl: string;
}

export type ViewportType = 'mobile' | 'desktop';

export interface VisualTestsReport {
  expectationMetadata: {
    commitReference: string;
    lastUpdated: string;
  };
  actualMetadata: {
    commitReference: string;
    lastUpdated: string;
  };
  workflowId: string;
  prNumber: string;
  branchName: string;
  repositoryName: string;
  repositoryOwner: string;
  impactedComponents: Array<HTMLElement['tagName']>;
  results: VisualTestResult[];
}
