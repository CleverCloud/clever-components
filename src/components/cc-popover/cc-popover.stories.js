import {
  iconRemixArrowLeftDownLine as iconArrowLeftDown,
  iconRemixArrowLeftUpLine as iconArrowLeftUp,
  iconRemixArrowRightDownLine as iconArrowRightDown,
  iconRemixArrowRightUpLine as iconArrowRightUp,
} from '../../assets/cc-remix.icons.js';

import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-popover>',
  component: 'cc-popover',
};

const conf = {
  component: 'cc-popover',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-popover {
      margin: 2.5em;
    }

    cc-popover div {
      white-space: nowrap;
    }
  `,
};

const items = [
  {
    innerHTML: '<div>This is the popover content</div>',
    hideText: true,
    icon: iconArrowLeftUp,
    position: 'top-right',
    accessibleName: 'Toggle popover',
  },
  {
    innerHTML: '<div>This is the popover content</div>',
    hideText: true,
    icon: iconArrowRightUp,
    position: 'top-left',
    accessibleName: 'Toggle popover',
  },
  {
    innerHTML: '<div>This is the popover content</div>',
    hideText: true,
    icon: iconArrowLeftDown,
    position: 'bottom-right',
    accessibleName: 'Toggle popover',
  },
  {
    innerHTML: '<div>This is the popover content</div>',
    hideText: true,
    icon: iconArrowRightDown,
    position: 'bottom-left',
    accessibleName: 'Toggle popover',
  },
];

export const defaultStory = makeStory(conf, {
  items,
});

export const withButtonText = makeStory(conf, {
  items: items.map((item) => ({
    ...item,
    hideText: false,
    icon: null,
    innerHTML: `<span slot="button-text">Click me</span>${item.innerHTML}`,
    accessibleName: 'Click me to toggle popover',
  })),
});

export const withButtonTextAndIcon = makeStory(conf, {
  items: items.map((item) => ({
    ...item,
    hideText: false,
    innerHTML: `<span slot="button-text">Click me</span>${item.innerHTML}`,
    accessibleName: 'Click me to toggle popover',
  })),
});

enhanceStoriesNames({
  defaultStory,
  withButtonText,
  withButtonTextAndIcon,
});
