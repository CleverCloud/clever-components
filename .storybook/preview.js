import customElements from '../.components-docs/custom-elements.json';
import { addDecorator, addParameters, configure, setCustomElements } from '@storybook/web-components';
import { i18nKnob } from '../stories/lib/i18n-knob.js';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

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

addParameters({
  options: {
    storySort: (a, b) => {
      if (a[1].kind !== b[1].kind) {
        return a[1].kind.localeCompare(b[1].kind, undefined, { numeric: true });
      }
      return -1;
    },
  },
  a11y: {
    restoreScroll: true,
  },
  viewport: { viewports },
});

setCustomElements(customElements);

// We cannot use main.js (stories: []) yet because of the HMR config for web-components
const req = require.context('../stories', true, /\.stories\.(js|mdx)$/);
configure(req, module);

// Force full reload instead of HMR for Web Components
// https://github.com/storybookjs/storybook/tree/next/app/web-components
if (module.hot) {
  module.hot.accept(req.id, () => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}
