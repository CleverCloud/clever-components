import {
  bucket1Details,
  bucket1State,
  bucketEmptyDetails,
  bucketEmptyState,
  buckets,
} from '../../stories/fixtures/cellar.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-cellar-bucket-list.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Cellar Explorer/<cc-cellar-bucket-list-beta>',
  component: 'cc-cellar-bucket-list-beta',
};

/**
 * @import { CcCellarBucketList } from './cc-cellar-bucket-list.js'
 */

const conf = {
  component: 'cc-cellar-bucket-list-beta',
  // language=CSS
  css: `cc-cellar-bucket-list-beta {
    height: 400px;
  }`,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 50,
        buckets: buckets(50),
        sort: { column: 'name', direction: 'asc' },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const fewBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 3,
        buckets: buckets(3),
        sort: { column: 'name', direction: 'asc' },
      },
    },
  ],
});

export const emptyBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
      },
    },
  ],
});

export const filter = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 50,
        buckets: buckets([
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
  ],
});

export const emptyFilteredBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 50,
        buckets: [],
        filter: '???',
        sort: { column: 'name', direction: 'asc' },
      },
    },
  ],
});

export const addBucket = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
        createForm: {
          type: 'idle',
          bucketName: 'new-bucket',
        },
      },
    },
  ],
});

export const addBucketWithErrorAlreadyExists = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
        createForm: {
          type: 'idle',
          bucketName: 'new-bucket',
          error: 'bucket-already-exists',
        },
      },
    },
  ],
});

export const addBucketWithErrorInvalidName = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
        createForm: {
          type: 'idle',
          bucketName: 'invalid-bucket-name-$^',
          error: 'bucket-name-invalid',
        },
      },
    },
  ],
});

export const addBucketWithErrorTooManyBuckets = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
        createForm: {
          type: 'idle',
          bucketName: 'new-bucket',
          error: 'too-many-buckets',
        },
      },
    },
  ],
});

export const addingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 0,
        buckets: [],
        sort: { column: 'name', direction: 'asc' },
        createForm: {
          type: 'creating',
          bucketName: 'new-bucket',
        },
      },
    },
  ],
});

export const fetchingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 50,
        buckets: buckets(50).map((b, i) => (i === 0 ? { ...b, state: 'fetching' } : b)),
        sort: { column: 'name', direction: 'asc' },
      },
    },
  ],
});

export const detailsBucket = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucket1State],
        sort: { column: 'name', direction: 'asc' },
        details: bucket1Details,
      },
    },
  ],
});

export const detailsBucketEmpty = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucketEmptyState],
        sort: { column: 'name', direction: 'asc' },
        details: bucketEmptyDetails,
      },
    },
  ],
});

export const detailsBucketVersioningEnabled = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucket1State],
        sort: { column: 'name', direction: 'asc' },
        details: { ...bucket1Details, versioning: 'enabled' },
      },
    },
  ],
});

export const detailsBucketVersioningDisabled = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucket1State],
        sort: { column: 'name', direction: 'asc' },
        details: { ...bucket1Details, versioning: 'disabled' },
      },
    },
  ],
});

export const detailsBucketVersioningSuspended = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucket1State],
        sort: { column: 'name', direction: 'asc' },
        details: { ...bucket1Details, versioning: 'suspended' },
      },
    },
  ],
});

export const deletingBucket = makeStory(conf, {
  /** @type {Partial<CcCellarBucketList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        total: 1,
        buckets: [bucketEmptyState],
        sort: { column: 'name', direction: 'asc' },
        details: { ...bucketEmptyDetails, state: 'deleting' },
      },
    },
  ],
});
