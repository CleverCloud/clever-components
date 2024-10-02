import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';
import { enhanceStoryName } from '../src/stories/lib/story-names';

// We could create an addon to provide a control that would switch between dark / light
// but it would only switch the UI theme, not the stories so right now it's not worth it
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const cleverTheme = create({
  base: isDarkMode ? 'dark' : 'light',
  brandTitle: 'Clever Cloud components',
  brandUrl: 'https://www.clever-cloud.com/doc/',
  brandImage: isDarkMode ? 'imgs/logo-clever-dark.svg' : 'imgs/logo-clever-light.svg',
});

addons.setConfig({
  theme: cleverTheme,
  sidebar: {
    collapsedRoots: ['📖-guidelines', '🖋-copywriting', '👋-contributing', '📌-architecture-decision-records'],
    renderLabel: ({ name, type }) => (type === 'story' ? enhanceStoryName(name) : name),
  },
});
