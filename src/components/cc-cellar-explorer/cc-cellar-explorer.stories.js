import { random } from '../../lib/utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-cellar-explorer.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Cellar Explorer/<cc-cellar-explorer-beta>',
  component: 'cc-cellar-explorer-beta',
};

/**
 * @import { CcCellarExplorer } from './cc-cellar-explorer.js'
 * @import { CellarBucket, CellarBucketState, CellarBucketDetailsState } from './cc-cellar-explorer.types.js'
 */

/** @type {CellarBucket} */
const bucket1 = {
  name: `bucket-1`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sizeInBytes: random(150_000, 2_000_000),
  objectsCount: random(1_000, 1_000_000),
  versioning: 'enabled',
};

/** @type {CellarBucketState} */
const bucket1State = {
  state: 'idle',
  type: 'bucket',
  ...bucket1,
};

/** @type {CellarBucketDetailsState} */
const bucket1Details = {
  state: 'idle',
  ...bucket1,
};

/** @type {CellarBucket} */
const bucketEmpty = {
  name: `bucket-empty`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sizeInBytes: 0,
  objectsCount: 0,
  versioning: 'enabled',
};

/** @type {CellarBucketState} */
const bucketEmptyState = {
  state: 'idle',
  type: 'bucket',
  ...bucketEmpty,
};

/** @type {CellarBucketDetailsState} */
const bucketEmptyDetails = {
  state: 'idle',
  ...bucketEmpty,
};

/**
 * @param {number|Array<string>} count
 * @returns {Array<CellarBucketState>}
 */
function buckets(count) {
  /**
   * @param {string} name
   * @returns {CellarBucketState}
   */
  const toBucket = (name) => ({
    type: 'bucket',
    state: 'idle',
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeInBytes: random(150_000, 2_000_000),
    objectsCount: random(1_000, 1_000_000),
  });
  if (typeof count === 'number') {
    return [...Array(count)].map((_, i) => toBucket(`bucket-${i + 1}`));
  }

  return count.map(toBucket);
}

const conf = {
  component: 'cc-cellar-explorer-beta',
  // language=CSS
  css: `cc-cellar-explorer-beta {
    height: 400px;
  }`,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 50,
          items: buckets(50),
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const loadingBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loading',
        },
      },
    },
  ],
});

export const errorBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'error',
        },
      },
    },
  ],
});

export const fewBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 3,
          items: buckets(3),
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const emptyBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const filter = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 50,
          items: buckets([
            'bucket-1',
            'bucket-10',
            'bucket-11',
            'bucket-12',
            'bucket-13',
            'bucket-14',
            'bucket-15',
            'bucket-16',
            'bucket-17',
            'bucket-18',
            'bucket-19',
          ]),
          filter: 'bucket-1',
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const emptyFilteredBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 50,
          items: [],
          filter: '???',
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const addBucket = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
          createForm: {
            type: 'idle',
            bucketName: 'new-bucket',
          },
        },
      },
    },
  ],
});

export const addBucketWithErrorAlreadyExists = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
          createForm: {
            type: 'idle',
            bucketName: 'new-bucket',
            error: 'bucket-already-exists',
          },
        },
      },
    },
  ],
});

export const addBucketWithErrorInvalidName = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
          createForm: {
            type: 'idle',
            bucketName: 'invalid-bucket-name-$^',
            error: 'bucket-name-invalid',
          },
        },
      },
    },
  ],
});

export const addBucketWithErrorTooManyBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
          createForm: {
            type: 'idle',
            bucketName: 'new-bucket',
            error: 'too-many-buckets',
          },
        },
      },
    },
  ],
});

export const addingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 0,
          items: [],
          sort: { column: 'name', direction: 'asc' },
          createForm: {
            type: 'creating',
            bucketName: 'new-bucket',
          },
        },
      },
    },
  ],
});

export const fetchingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 50,
          items: buckets(50).map((b, i) => (i === 0 ? { ...b, state: 'fetching' } : b)),
          sort: { column: 'name', direction: 'asc' },
        },
      },
    },
  ],
});

export const detailsBucket = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucket1State],
          sort: { column: 'name', direction: 'asc' },
          details: bucket1Details,
        },
      },
    },
  ],
});

export const detailsBucketEmpty = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucketEmptyState],
          sort: { column: 'name', direction: 'asc' },
          details: bucketEmptyDetails,
        },
      },
    },
  ],
});

export const detailsBucketVersioningEnabled = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucket1State],
          sort: { column: 'name', direction: 'asc' },
          details: { ...bucket1Details, versioning: 'enabled' },
        },
      },
    },
  ],
});

export const detailsBucketVersioningDisabled = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucket1State],
          sort: { column: 'name', direction: 'asc' },
          details: { ...bucket1Details, versioning: 'disabled' },
        },
      },
    },
  ],
});

export const detailsBucketVersioningSuspended = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucket1State],
          sort: { column: 'name', direction: 'asc' },
          details: { ...bucket1Details, versioning: 'suspended' },
        },
      },
    },
  ],
});

export const deletingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        list: {
          level: 'buckets',
          type: 'loaded',
          total: 1,
          items: [bucketEmptyState],
          sort: { column: 'name', direction: 'asc' },
          details: { ...bucketEmptyDetails, state: 'deleting' },
        },
      },
    },
  ],
});
