import { addDecorator, addParameters, configure } from '@storybook/html';
import { i18nKnob } from '../stories/lib/i18n-knob';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

// Add global language selector knob on each story
addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

addDecorator(withA11y);

addParameters({
  options: {
    storySort: (a, b) => {
      if (a[1].parameters.fileName === b[1].parameters.fileName) {
        if (a[1].name === 'Default') {
          return -1;
        }
        if (b[1].name === 'Default') {
          return 1;
        }
      }
      return a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
    },
  },
  a11y: {
    restoreScroll: true,
  },
});

// We cannot use main.js (stories: []) yet because of the HMR config for web-components
const req = require.context('../stories', true, /\.stories\.js$/);
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
