import type { AnnotatedStoryFn } from '@storybook/csf';
import type { StoryObj, WebComponentsRenderer } from '@storybook/web-components';

export type StoryParams = StoryObj['parameters'];

export type AccessibilityTestOptions = {
  tests: {
    accessibility: {
      enable: boolean;
      ignoredRules: Array<string>;
    };
    visualRegressions: {
      enable: boolean;
      imagesToPreload?: Array<string>;
    };
  };
};

export type AnnotatedStoryFnClever = AnnotatedStoryFn<WebComponentsRenderer> & {
  parameters: StoryParams & AccessibilityTestOptions;
};

export type RawStoriesModule = {
  default: {
    component: keyof HTMLElementTagNameMap;
  };
} & { [storyName: string]: AnnotatedStoryFnClever } & {};

export type ArrayOfStoryFunctions = Array<{ storyName: string; storyFunction: AnnotatedStoryFnClever }>;

export type ModuleEntryWithStoryFunction = [storyName: string, storyFunction: AnnotatedStoryFnClever];
