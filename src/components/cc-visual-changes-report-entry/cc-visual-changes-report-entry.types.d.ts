export interface VisualChangesTestResult {
  id: string;
  componentTagName: string;
  storyName: string;
  viewportType: string;
  browserName: string;
  screenshots: VisualChangesScreenshots;
}

export interface VisualChangesScreenshots {
  baselineScreenshotUrl: string;
  diffScreenshotUrl: string;
  changesScreenshotUrl: string;
}
