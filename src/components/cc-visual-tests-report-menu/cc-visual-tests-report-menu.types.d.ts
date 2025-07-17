import { VisualTestResult } from '../cc-visual-tests-report/visual-tests-report.types.js';

export type VisualTestsReportMenuViewportEntry = {
  viewportType: VisualTestResult['viewportType'];
  browserName: VisualTestResult['browserName'];
  id: string;
};

export type VisualTestsReportMenuStoryEntry = {
  storyName: string;
  viewports: Array<VisualTestsReportMenuViewportEntry>;
};

export type VisualTestsReportMenuComponentEntry = {
  componentTagName: string;
  stories: Array<VisualTestsReportMenuStoryEntry>;
};

export type VisualTestsReportMenuEntries = Array<VisualTestsReportMenuComponentEntry>;
