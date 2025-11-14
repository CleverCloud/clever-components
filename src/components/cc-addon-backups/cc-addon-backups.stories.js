import {
  backupsJenkinsState,
  backupsMongodbState,
  backupsMysqlState,
  backupsNewElasticsearchState,
  backupsOldElasticsearchState,
  backupsPostgresqlState,
  backupsRedisState,
} from '../../stories/fixtures/addon-backups-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-backups.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-backups>',
  component: 'cc-addon-backups',
};

const conf = {
  component: 'cc-addon-backups',
};

/**
 * @import { CcAddonBackups } from './cc-addon-backups.js'
 * @import { AddonBackupsStateLoaded, AddonBackupsStateLoading, AddonBackupsStateError } from './cc-addon-backups.types.js'
 */

export const defaultStory = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsNewElasticsearchState,
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateError} */
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsNewElasticsearchState,
        backups: [],
      },
    },
  ],
});

export const dataLoadedWithNewElasticsearch = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsNewElasticsearchState,
    },
  ],
});

export const dataLoadedWithNewElasticsearchAndSmallbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsNewElasticsearchState,
        backups: backupsNewElasticsearchState.backups.slice(0, 1),
      },
    },
  ],
});

export const dataLoadedWithOldElasticsearch = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsOldElasticsearchState,
    },
  ],
});

export const dataLoadedWithOldElasticsearchAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsOldElasticsearchState,
        backups: [
          ...backupsOldElasticsearchState.backups,
          ...backupsOldElasticsearchState.backups,
          ...backupsOldElasticsearchState.backups,
          ...backupsOldElasticsearchState.backups,
        ],
      },
    },
  ],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsPostgresqlState,
    },
  ],
});

export const dataLoadedWithPostgresqlAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsPostgresqlState,
        backups: [
          ...backupsPostgresqlState.backups,
          ...backupsPostgresqlState.backups,
          ...backupsPostgresqlState.backups,
          ...backupsPostgresqlState.backups,
        ],
      },
    },
  ],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsMysqlState,
    },
  ],
});

export const dataLoadedWithMysqlAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsMysqlState,
        backups: [
          ...backupsMysqlState.backups,
          ...backupsMysqlState.backups,
          ...backupsMysqlState.backups,
          ...backupsMysqlState.backups,
        ],
      },
    },
  ],
});

export const dataLoadedWithMongodb = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsMongodbState,
    },
  ],
});

export const dataLoadedWithMongodbAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsMongodbState,
        backups: [
          ...backupsMongodbState.backups,
          ...backupsMongodbState.backups,
          ...backupsMongodbState.backups,
          ...backupsMongodbState.backups,
        ],
      },
    },
  ],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsRedisState,
    },
  ],
});

export const dataLoadedWithRedisAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsRedisState,
        backups: [
          ...backupsRedisState.backups,
          ...backupsRedisState.backups,
          ...backupsRedisState.backups,
          ...backupsRedisState.backups,
        ],
      },
    },
  ],
});

export const dataLoadedWithJenkins = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: backupsJenkinsState,
    },
  ],
});

export const dataLoadedWithJenkinsAndBigbackups = makeStory(conf, {
  items: [
    {
      addonId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {AddonBackupsStateLoaded} */
      state: {
        ...backupsJenkinsState,
        backups: [
          ...backupsJenkinsState.backups,
          ...backupsJenkinsState.backups,
          ...backupsJenkinsState.backups,
          ...backupsJenkinsState.backups,
        ],
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonBackups[]} components */
      ([component, componentEmpty, componentError]) => {
        component.state = backupsNewElasticsearchState;
        componentEmpty.state = { ...backupsNewElasticsearchState, backups: [] };
        componentError.state = {
          type: 'error',
        };
      },
    ),
  ],
});
