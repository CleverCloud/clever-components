import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-input-text/cc-input-text.js';
import './cc-logs-control.js';

import { createFakeLogs, CUSTOM_METADATA_RENDERERS } from '../../stories/fixtures/logs.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-control-beta>',
  component: 'cc-logs-control-beta',
};

/**
 * @typedef {import('./cc-logs-control.js').CcLogsControl} CcLogsControl
 */

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
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
  items: [
    {
      follow: true,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
    },
  ],
});

export const withNonDefaultPalette = makeStory(conf, {
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
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
  /** @type {Array<Partial<CcLogsControl>>} */
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

export const withLeftSlot = makeStory(conf, {
  /** @type {Array<Partial<CcLogsControl>>} */
  items: [
    {
      follow: true,
      metadataDisplay: metadataDisplay,
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: createFakeLogs(100, { longMessage: true, ansi: true }),
      innerHTML: `
        <div slot="left" style="width: 12em;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      `,
    },
  ],
});
