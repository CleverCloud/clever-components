import '../src/stories/lib/i18n-control.js';
import { setCustomElementsManifest } from '@web/storybook-prebuilt/web-components.js';
import { storybookMenuSort } from './menu-descriptor.js';
import customElementsManifest from '../dist/custom-elements.json';
import { getAvailableLanguages } from '../src/lib/i18n.js';

setCustomElementsManifest(customElementsManifest);

const viewports = {};
Array
  .from(new Array(10))
  .map((_, i) => {
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

export const parameters = {
  options: {
    storySort: storybookMenuSort
  },
  viewport: { viewports },
};

const availableLanguages = Object
  .entries(getAvailableLanguages())
  .map(([title, value]) => ({ value, title }));

export const globalTypes = {
  locale: {
    name: 'Language',
    description: 'i18n language',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: availableLanguages,
    },
  },
};
