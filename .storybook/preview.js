import '../src/stories/lib/i18n-control.js';
import { setCustomElementsManifest } from '@web/storybook-prebuilt/web-components.js';
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

// Use emojis to sort story categories/kinds
// Docs, then components, then stuffs for devs (mixins and inner styles)
const EMOJI_SORT = ['🏠', '📌', '🧬', '🛠', '🔀', '🕹', '♻️'];

export const parameters = {
  options: {
    storySort: (a, b) => {
      if (a[1].kind !== b[1].kind) {
        const aEmojiKind = EMOJI_SORT.indexOf(a[1].kind.slice(0, 2)) + a[1].kind;
        const bEmojiKind = EMOJI_SORT.indexOf(b[1].kind.slice(0, 2)) + b[1].kind;
        return aEmojiKind.localeCompare(bEmojiKind, undefined, { numeric: true });
      }
      return -1;
    },
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
