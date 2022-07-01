import '../../src/atoms/cc-badge.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const infoSvg = new URL('../../src/assets/info.svg', import.meta.url);
const warningSvg = new URL('../../src/assets/warning.svg', import.meta.url);
const errorSvg = new URL('../../src/assets/error.svg', import.meta.url);
const tickSvg = new URL('../../src/assets/tick.svg', import.meta.url);
const badgeSvg = new URL('../../src/assets/badge-white.svg', import.meta.url);

const baseItems = [
  {
    intent: 'info',
    weight: 'dimmed',
    innerHTML: 'this is info',
  },
  {
    intent: 'success',
    weight: 'dimmed',
    innerHTML: 'this is success',
  },
  {
    intent: 'danger',
    weight: 'dimmed',
    innerHTML: 'this is danger',
  },
  {
    intent: 'warning',
    weight: 'dimmed',
    innerHTML: 'this is warning',
  },
  {
    intent: 'neutral',
    weight: 'dimmed',
    innerHTML: 'this is neutral',
  },
];

export default {
  title: '🧬 Atoms/<cc-badge>',
  component: 'cc-badge',
};

const conf = {
  component: 'cc-badge',
  // language=CSS
  css: `cc-badge {
    margin-right: 1em;
    margin-bottom: 1em;
  }`,
};

export const dimmed = makeStory(conf, {
  items: baseItems,
});

export const outlined = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'outlined' })),
});

export const strong = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'strong' })),
});

export const icons = makeStory(conf, {
  items: [
    {
      intent: 'info',
      weight: 'dimmed',
      innerHTML: 'this is info',
      iconSrc: infoSvg,
      iconAlt: 'Info',
    },
    {
      intent: 'success',
      weight: 'outlined',
      innerHTML: 'this is success',
      iconSrc: tickSvg,
      iconAlt: 'Success',
    },
    {
      intent: 'danger',
      weight: 'outlined',
      innerHTML: 'this is danger',
      iconSrc: errorSvg,
      iconAlt: 'Error',
    },
    {
      intent: 'warning',
      weight: 'strong',
      innerHTML: 'this is warning',
      iconSrc: warningSvg,
      iconAlt: 'Warning',
    },
    {
      intent: 'neutral',
      weight: 'strong',
      innerHTML: 'this is neutral',
      iconSrc: badgeSvg,
    },
  ],
});

export const circleWithNumber = makeStory(conf, {
  items: [
    {
      intent: 'info',
      weight: 'dimmed',
      innerHTML: '1',
      circle: true,
    },
    {
      intent: 'success',
      weight: 'outlined',
      innerHTML: '2',
      circle: true,
    },
    {
      intent: 'danger',
      weight: 'outlined',
      innerHTML: '10',
      circle: true,
    },
    {
      intent: 'warning',
      weight: 'strong',
      innerHTML: '5',
      circle: true,
    },
    {
      intent: 'neutral',
      weight: 'strong',
      innerHTML: '1',
      circle: true,
    },
  ],
});

enhanceStoriesNames({
  dimmed,
  outlined,
  strong,
  icons,
  circleWithNumber,
});
