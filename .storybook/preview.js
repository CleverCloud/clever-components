import customElements from '../.components-docs/custom-elements.json';
import { addDecorator, addParameters, configure, setCustomElements } from '@storybook/web-components';
import { i18nKnob } from '../stories/lib/i18n-knob.js';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { setMarkdownDocs } from '../stories/lib/make-story.js';

addDecorator(withKnobs);

// Add global language selector knob on each story
addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

addDecorator(withA11y);

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
const EMOJI_SORT = ['📌', '🧬', '🛠', '🔀', '♻️'];

addParameters({
  options: {
    showRoots: true,
    storySort: (a, b) => {
      if (a[1].kind !== b[1].kind) {
        const aEmojiKind = EMOJI_SORT.indexOf(a[1].kind.slice(0, 2)) + a[1].kind;
        const bEmojiKind = EMOJI_SORT.indexOf(b[1].kind.slice(0, 2)) + b[1].kind;
        return aEmojiKind.localeCompare(bEmojiKind, undefined, { numeric: true });
      }
      return -1;
    },
  },
  // a11y: false,
  // When enabled with live-reload, the scroll jumps a lot :-(
  a11y: {
    restoreScroll: true,
  },
  viewport: { viewports },
});

// Temporary patch for default values and redundancy
function addDefaultValue (def) {
  def.defaultValue = def.default;
}

customElements.tags.forEach((tagDefinition) => {
  (tagDefinition.attributes || []).forEach((def) => addDefaultValue(def));
  (tagDefinition.properties || []).forEach((def) => addDefaultValue(def));
});

setCustomElements(customElements);

// We cannot use main.js (stories: []) yet because of the HMR config for web-components
const csfStories = require.context('../stories', true, /\.stories\.(js|mdx)$/);
const mdxDocsPages = require.context('../docs', true, /\.mdx$/);
const markdownDocs = require.context('../.components-docs', false, /\.md$/);

markdownDocs.keys().forEach((k) => {
  const component = k.replace(/^\.\/(.*)\.md$/, '$1');
  const md = markdownDocs(k).default;
  setMarkdownDocs(component, md);
});

configure([csfStories, mdxDocsPages], module);

// Force full reload instead of HMR for Web Components
// https://github.com/storybookjs/storybook/tree/next/app/web-components
if (module.hot) {
  module.hot.accept([csfStories.id, mdxDocsPages.id, markdownDocs.id], (...a) => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}
