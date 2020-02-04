import '../../components/addon/cc-addon-backups.js';
import notes from '../../.components-docs/cc-addon-backups.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

const backups = {
  providerId: 'es-addon',
  restoreCommand: 'curl -XPOST https://my-service.services.clever-cloud.com/_snapshot/cc_backup_repository/snapshot_1/_restore',
  esAddonBackupRepositoryUrl: 'https://example.com/es-addon-backup-repository-url',
  list: [
    {
      createdAt: new Date('2019-11-17 03:00'),
      expiresAt: new Date('2019-11-27 03:00'),
    },
    {
      createdAt: new Date('2019-11-18 03:30'),
      expiresAt: new Date('2019-11-28 03:30'),
    },
    {
      createdAt: new Date('2019-11-19 03:00'),
      expiresAt: new Date('2019-11-29 03:00'),
    },
    {
      createdAt: new Date('2019-11-20 03:00'),
      expiresAt: new Date('2019-11-30 03:00'),
    },
    {
      createdAt: new Date('2019-11-21 03:00'),
    },
  ],
};

export default {
  title: '🛠 Addon|<cc-addon-backups>',
  component: 'cc-addon-backups',
  parameters: { notes },
};

const conf = {
  component: 'cc-addon-backups',
  css: `
    cc-addon-backups {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ backups }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const empty = makeStory(conf, {
  items: [{ backups: { ...backups, list: [] } }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNone, componentError]) => {
      component.backups = backups;
      componentNone.backups = { ...backups, list: [] };
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  empty,
  simulations,
});
