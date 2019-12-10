import { addDecorator, addParameters, configure } from '@storybook/html';
import { create } from '@storybook/theming';
import { i18nKnob } from '../stories/lib/i18n-knob';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

// Add global language selector knob on each story
addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

// should only be added once
// best place is in config.js
addDecorator(withA11y);

const cleverTheme = create({
  brandTitle: 'Clever Cloud components',
  brandUrl: 'https://www.clever-cloud.com',
  brandImage: 'https://www.clever-cloud.com/images/brand-assets/logos/v2/logo_on_white.svg',
});

addParameters({
  options: {
    showPanel: true,
    enableShortcuts: true,
    theme: cleverTheme,
    storySort: (a, b) => {
      return a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
    },
  },
  a11y: {
    restoreScroll: true,
  },
});

// Automatically import all files ending in *.stories.js
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
