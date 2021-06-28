import '../stories/lib/i18n-control.js';
import ceJson from './custom-elements-manifest.js';

// Temporary hack, waiting for `setCustomElements` to be exposed
// Then waiting for new Custom Elements Manifest support
window.__STORYBOOK_CUSTOM_ELEMENTS__ = ceJson;

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
const EMOJI_SORT = ['🏠', '📌', '🧬', '🛠', '🔀', '♻️'];

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
