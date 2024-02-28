import './cc-logs-control.js';
import '../cc-input-text/cc-input-text.js';
import { makeStory } from '../../stories/lib/make-story.js';

import { createFakeLogs, CUSTOM_METADATA_RENDERERS } from '../cc-logs/fake-logs.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-control-beta>',
  component: 'cc-logs-control-beta',
};

const conf = {
  component: 'cc-logs-control-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-control-beta {
      height: 800px;
    }
  `,
};

const metadataDisplay = {
  ip: {
    label: 'Display IP address',
    hidden: true,
  },
  level: {
    label: 'Display log level',
    hidden: false,
  },
};
export const defaultStory = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
    },
  ],
});

export const withHeaderSlot = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      innerHTML: `<cc-input-text inline label="Filter" slot="header" style="width: 100%"></cc-input-text>`,
    },
  ],
});

export const withoutMetadataDisplay = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
    },
  ],
});

export const withNonDefaultPalette = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      palette: 'Everblush',
    },
  ],
});

export const withNonDefaultStripAnsi = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      stripAnsi: true,
    },
  ],
});

export const withNonDefaultWrapLines = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      wrapLines: true,
    },
  ],
});

export const withNonDefaultTimezone = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      timezone: 'local',
    },
  ],
});

export const withNonDefaultDateDisplay = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      dateDisplay: 'datetime-short',
    },
  ],
});
