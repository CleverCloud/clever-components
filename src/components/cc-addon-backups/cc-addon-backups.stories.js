import './cc-addon-backups.js';
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

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-backups>',
  component: 'cc-addon-backups',
};

const conf = {
  component: 'cc-addon-backups',
};

export const defaultStory = makeStory(conf, {
  items: [{ state: backupsNewElasticsearchState }],
});

export const skeleton = makeStory(conf, {
  items: [{
    state: {
      type: 'loading',
    },
  }],
});

export const error = makeStory(conf, {
  items: [{
    state: {
      type: 'error',
    },
  }],
});

export const empty = makeStory(conf, {
  items: [{
    state: {
      ...backupsNewElasticsearchState,
      backups: [],
    },
  }],
});

export const dataLoadedWithNewElasticsearch = makeStory(conf, {
  items: [{ state: backupsNewElasticsearchState }],
});

export const dataLoadedWithNewElasticsearchAndSmallbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsNewElasticsearchState,
      backups: backupsNewElasticsearchState.backups.slice(0, 1),
    },
  }],
});

export const dataLoadedWithOldElasticsearch = makeStory(conf, {
  items: [{ state: backupsOldElasticsearchState }],
});

export const dataLoadedWithOldElasticsearchAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsOldElasticsearchState,
      backups: [
        ...backupsOldElasticsearchState.backups,
        ...backupsOldElasticsearchState.backups,
        ...backupsOldElasticsearchState.backups,
        ...backupsOldElasticsearchState.backups,
      ],
    },
  }],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [{ state: backupsPostgresqlState }],
});

export const dataLoadedWithPostgresqlAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsPostgresqlState,
      backups: [
        ...backupsPostgresqlState.backups,
        ...backupsPostgresqlState.backups,
        ...backupsPostgresqlState.backups,
        ...backupsPostgresqlState.backups,
      ],
    },
  }],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [{ state: backupsMysqlState }],
});

export const dataLoadedWithMysqlAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsMysqlState,
      backups: [
        ...backupsMysqlState.backups,
        ...backupsMysqlState.backups,
        ...backupsMysqlState.backups,
        ...backupsMysqlState.backups,
      ],
    },
  }],
});

export const dataLoadedWithMongodb = makeStory(conf, {
  items: [{ state: backupsMongodbState }],
});

export const dataLoadedWithMongodbAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsMongodbState,
      backups: [
        ...backupsMongodbState.backups,
        ...backupsMongodbState.backups,
        ...backupsMongodbState.backups,
        ...backupsMongodbState.backups,
      ],
    },
  }],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [{ state: backupsRedisState }],
});

export const dataLoadedWithRedisAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsRedisState,
      backups: [
        ...backupsRedisState.backups,
        ...backupsRedisState.backups,
        ...backupsRedisState.backups,
        ...backupsRedisState.backups,
      ],
    },
  }],
});

export const dataLoadedWithJenkins = makeStory(conf, {
  items: [{ state: backupsJenkinsState }],
});

export const dataLoadedWithJenkinsAndBigbackups = makeStory(conf, {
  items: [{
    state: {
      ...backupsJenkinsState,
      backups: [
        ...backupsJenkinsState.backups,
        ...backupsJenkinsState.backups,
        ...backupsJenkinsState.backups,
        ...backupsJenkinsState.backups,
      ],
    },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentEmpty, componentError]) => {
      component.state = backupsNewElasticsearchState;
      componentEmpty.state = { ...backupsNewElasticsearchState, backups: [] };
      componentError.state = {
        type: 'error',
      };
    }),
  ],
});
