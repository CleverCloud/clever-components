import { setCustomElementsManifest } from '@storybook/web-components-vite';
// Any CSS file import automagically generates a `<link rel="stylesheet" href="bundledCssFile">` in the story iframe
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/vs.css';
// @ts-ignore not worth helping TS understand this is valid since we don't need to type check this module
// eslint-disable-next-line n/no-missing-import
import customElementsManifest from '../dist/custom-elements.json';
import { AutodocsTemplate } from '../src/stories/lib/autodocs-template.jsx';
import '../src/stories/lib/i18n-control.js';
import '../src/styles/default-theme.css';

/**
 * @typedef {import('@storybook/web-components-vite').Preview} Preview
 * @typedef {import('storybook/viewport').ViewportMap} ViewportMap
 */

setCustomElementsManifest(customElementsManifest);

/** @type {Partial<ViewportMap>} */
const viewports = {};
Array.from(new Array(10)).map((_, i) => {
  const w = 350 + i * 100;
  viewports['w' + w] = {
    type: 'desktop',
    name: w + 'px',
    styles: {
      width: w + 'px',
      height: '90%',
    },
  };
});

const availableLanguages = [
  { value: 'en', title: 'English' },
  { value: 'fr', title: 'Français' },
  { value: 'missing', title: '🤬 Missing' },
];

const availableViewModes = [
  { value: 'default', title: 'Default' },
  { value: 'console', title: 'Console' },
];

/** @type {Preview} */
const preview = {
  parameters: {
    docs: {
      page: AutodocsTemplate,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Readme',
          '🏡 Getting Started',
          [
            'Breaking down',
            'Use via CDN',
            'Install via NPM',
            'Manual installation',
            'Accessibility',
            'Design tokens',
            'Smart components',
            'Notification system',
            'Breaking change policy',
            'Browser support',
            'Changelog',
          ],
          '📖 Guidelines',
          '🖋 Copywriting',
          '👋 Contributing',
          [
            'Contribute',
            'Web Components guidelines',
            'Smart Component guidelines',
            'Quick accessibility reminders',
            'Tasks',
            'Translate and localize',
            'Writing stories',
            'Test',
            'Previews',
            'Release',
            'Browser support',
            'Tools',
            'Resources',
          ],
          '📌 Architecture Decision Records',
          '🧬 Atoms',
          '🧬 Molecules',
          '*',
          '🚧 Beta',
          '🕸️ Web Features',
          '🕹️ Controllers',
          '♻️ Templates',
        ],
      },
    },
    viewport: { options: viewports },
  },
  initialGlobals: {
    locale: 'en',
    viewMode: 'default',
  },
  globalTypes: {
    locale: {
      name: 'Language',
      description: 'i18n language',
      toolbar: {
        icon: 'globe',
        items: availableLanguages,
      },
    },
    viewMode: {
      name: 'View Mode',
      description: 'Preview context',
      toolbar: {
        icon: 'browser',
        items: availableViewModes,
      },
    },
  },
  decorators: [
    (storyFn, context) => {
      document.body.classList.toggle('console-mode', context.globals.viewMode === 'console');
      return storyFn();
    },
  ],
};

export default preview;
