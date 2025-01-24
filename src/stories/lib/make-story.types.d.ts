import { ArgTypes, StoryFn as StoryFnFromStorybook } from '@storybook/web-components';
import { CSSResult, LitElement } from 'lit';
import { CcBeta } from 'src/components/cc-beta/cc-beta.js';

type ComponentProps<TagName extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[TagName]>;
type Component<TagName extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[TagName];

export type MakeStoryOptions<
  StoryComponentTagName extends keyof HTMLElementTagNameMap,
  StoryComponent = Component<StoryComponentTagName>,
  StoryComponentProps = ComponentProps<StoryComponentTagName>,
> = {
  argTypes?: ArgTypes<StoryComponent>;
  beta?: boolean;
  component: StoryComponentTagName;
  css?: CSSResult | string;
  displayMode?: 'block' | 'flex-wrap';
  docs?: string;
  dom?: (container: HTMLElement) => void;
  items?: StoryComponentProps[] | (() => StoryComponentProps[]);
  name?: string;
  onUpdateComplete?: (component: StoryComponent, index: number) => void;
  simulations?: Array<{
    delay: number;
    callback: (components: StoryComponent[]) => void;
  }>;
};

export interface AnnotatedStoryFunction<TagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  component: TagName;
  argTypes: ArgTypes<ComponentProps<TagName>>;
  args: ComponentProps<TagName>;
  items: ComponentProps<TagName>[];
  css: CSSResult | string;
  docs: string;
  parameters: StoryFnFromStorybook['parameters'];
  storyName?: string;
  (
    storyArgs: Parameters<StoryFnFromStorybook>[0],
    context: Parameters<StoryFnFromStorybook>[1],
  ): HTMLElement | LitElement | CcBeta;
}

export type StoryWait<Component extends HTMLElement> = (
  delay: number,
  callback: (components: Component[]) => void,
) => { delay: number; callback: (components: Component[]) => void };
