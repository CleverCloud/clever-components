import { makeStory } from '../../stories/lib/make-story.js';
import './cc-postgresql-admin.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-postgresql-admin>',
  component: 'cc-postgresql-admin',
};

/**
 * @import { CcPostgresqlAdmin } from './cc-postgresql-admin.js'
 * @import { PostgresqlCapabilities } from './cc-postgresql-admin.types.js'
 */

const conf = {
  component: 'cc-postgresql-admin',
};

/** @type {PostgresqlCapabilities} */
const DEDICATED_CAPABILITIES = {
  killConnections: true,
  resetPassword: true,
  resetDatabase: false,
  activateExtension: false,
  addReadOnlyUser: true,
  generateDirectHost: true,
  rebootInstances: true,
  promoteReplica: false,
  requestReplication: true,
};

/** @type {PostgresqlCapabilities} */
const SHARED_CAPABILITIES = {
  killConnections: true,
  resetPassword: true,
  resetDatabase: true,
  activateExtension: true,
  addReadOnlyUser: false,
  generateDirectHost: false,
  rebootInstances: false,
  promoteReplica: false,
  requestReplication: true,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        capabilities: DEDICATED_CAPABILITIES,
        connections: { type: 'loaded', count: 12 },
        readOnlyUsers: [
          { user: 'ureadonlyxyz', password: 'jNqQPGrsGCTBn5oJmWnr' },
          { user: 'ureadonlyabc', password: 'sTvBnZmWqLkRdXfGhJpK' },
        ],
        runningAction: null,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [{ state: { type: 'error' } }],
});

export const dataLoadedWithSharedPlan = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        capabilities: SHARED_CAPABILITIES,
        connections: { type: 'loaded', count: 1 },
        readOnlyUsers: [],
        runningAction: null,
      },
    },
  ],
});

export const dataLoadedWithReplica = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        capabilities: { ...DEDICATED_CAPABILITIES, promoteReplica: true, requestReplication: false },
        connections: { type: 'loaded', count: 0 },
        readOnlyUsers: [],
        runningAction: null,
      },
    },
  ],
});

export const dataLoadedWithConnectionsError = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        capabilities: DEDICATED_CAPABILITIES,
        connections: { type: 'error' },
        readOnlyUsers: [],
        runningAction: null,
      },
    },
  ],
});

export const waiting = makeStory(conf, {
  /** @type {Partial<CcPostgresqlAdmin>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        capabilities: DEDICATED_CAPABILITIES,
        connections: { type: 'loading' },
        readOnlyUsers: [],
        runningAction: 'add-read-only-user',
      },
    },
  ],
});
