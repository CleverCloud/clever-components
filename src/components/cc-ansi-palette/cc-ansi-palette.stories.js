import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import './cc-ansi-palette.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Logs/<cc-ansi-palette>',
  component: 'cc-ansi-palette',
};

const conf = {
  component: 'cc-ansi-palette',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: defaultPalette,
    },
  ],
});

export const withEverblushPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: everblushPalette,
    },
  ],
});

export const withHyoobPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: hyoobPalette,
    },
  ],
});
export const withNightOwlPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: nightOwlPalette,
    },
  ],
});
export const withOneLightPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: oneLightPalette,
    },
  ],
});
export const withTokyoNightLightPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: tokyoNightLightPalette,
    },
  ],
});
