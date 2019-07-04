import { addDecorator, addParameters, configure } from '@storybook/html';
import { i18nKnob } from '../stories/lib/i18n-knob';
import { withKnobs } from '@storybook/addon-knobs';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withKnobs);

// Add global language selector knob on each story
addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

addParameters({
  options: {
    enableShortcuts: true,
  },
});

function loadStories () {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
