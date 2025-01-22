import { StoryFn as StoryFnFromStorybook } from '@storybook/web-components';
import { CSSResult, LitElement } from 'lit';
import { CcBeta } from 'src/components/cc-beta/cc-beta.js';

export function MakeStory<TagName extends keyof HTMLElementTagNameMap>(
  defaultConfig: Config<TagName>,
  storyConfig: Config<TagName>,
): StoryFnCleverComponents<keyof HTMLElementTagNameMap>;

type ComponentProps<TagName extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[TagName]>;
type Component<TagName extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[TagName];

interface Config<TagName extends keyof HTMLElementTagNameMap> {
  name?: string;
  docs?: string;
  css?: string | CSSResult;
  dom?: (container: HTMLElement) => void;
  component?: TagName;
  items?: ComponentProps<TagName>[] | (() => ComponentProps<TagName>[]);
  simulations?: Array<ReturnType<typeof StoryWait<TagName>>>;
  argTypes?: StoryFnFromStorybook['argTypes'];
  displayMode?: 'block' | 'flex-wrap';
  beta?: boolean;
  onUpdateComplete?: (component: Component<TagName>, index: number) => void;
}

export function StoryWait<TagName extends keyof HTMLElementTagNameMap>(
  delay: number,
  callback: (components: Component<TagName>[]) => void,
): {
  delay: number;
  callback: (components: Component<TagName>[]) => void;
};

type StoryWaitReturnType<TagName extends keyof HTMLElementTagNameMap> = ReturnType<typeof StoryWait<TagName>>;

type StoryFnParams = Parameters<StoryFnFromStorybook>;

export type StoryFnCleverComponents<TagName extends keyof HTMLElementTagNameMap> = {
  args: ComponentProps<TagName>;
  argTypes: Config<TagName>['argTypes'];
  parameters?: {
    docs: {
      description: {
        story: Config<TagName>['docs'] | '';
      };
      source: {
        code: string;
      };
    };
  };
  docs?: Config<TagName>['docs'];
  css?: Config<TagName>['css'];
  component?: TagName;
  items?: ComponentProps<TagName>[];
  storyName: Config<TagName>['name'];
  (
    storyArgs: Parameters<StoryFnFromStorybook>[0],
    context: Parameters<StoryFnFromStorybook>[1],
  ): HTMLElement | LitElement | CcBeta;
};

export function GetSourceCode<TagName extends keyof HTMLElementTagNameMap>(
  component: TagName,
  items: ComponentProps<TagName>,
  dom: Config<TagName>['dom'],
): string;

export function CreateStoryItem<TagName extends keyof HTMLElementTagNameMap>(
  storyFn: StoryFnCleverComponents<TagName>,
  props: ComponentProps<TagName>,
  itemIndex: number,
): Component<TagName>;

export function AssignPropsToElement<ElementToAssign extends Element>(
  element: ElementToAssign,
  props: Partial<ElementToAssign>,
): ElementToAssign;
