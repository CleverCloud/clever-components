import { fileDetailsState, fileState, objects } from '../../stories/fixtures/cellar.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-cellar-object-list.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Cellar Explorer/<cc-cellar-object-list-beta>',
  component: 'cc-cellar-object-list-beta',
};

/**
 * @import { CcCellarObjectList } from './cc-cellar-object-list.js'
 */

const conf = {
  component: 'cc-cellar-object-list-beta',
  // language=CSS
  css: `cc-cellar-object-list-beta {
    height: 500px;
  }`,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: objects(2, 30),
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loading',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'error',
        bucketName: 'bucket-1',
      },
    },
  ],
});

export const bucketRootDir = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: [],
        objects: objects(2, 30),
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const fewObjects = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: objects(0, 3),
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [],
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const filtering = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'filtering',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        filter: 'object-1',
      },
    },
  ],
});

export const filtered = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: objects(2, [
          'object-1',
          'object-10',
          'object-11',
          'object-12',
          'object-13',
          'object-14',
          'object-15',
          'object-16',
          'object-17',
          'object-18',
          'object-19',
        ]),
        filter: 'object-1',
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const emptyFiltered = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [],
        filter: '???',
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const fetchingObject = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: objects(2, 30).map((o, i) => (i === 3 ? { ...o, state: 'fetching' } : o)),
        hasPrevious: false,
        hasNext: false,
      },
    },
  ],
});

export const detailsOctetFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsTextFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('txt', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('txt', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsImageFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('jpg', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('jpg', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsArchiveFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('zip', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('zip', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsPdfFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('pdf', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('pdf', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsAudioFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('mp3', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('mp3', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const detailsVideoFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('mp4', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: fileDetailsState('mp4', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
      },
    },
  ],
});

export const deletingFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: {
          ...fileDetailsState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
          state: 'deleting',
        },
      },
    },
  ],
});

export const downloadingFile = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        path: ['dir-1', 'dir-1-1', 'dir-1-1-1'],
        objects: [fileState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1'])],
        hasPrevious: false,
        hasNext: false,
        details: {
          ...fileDetailsState('dat', ['dir-1', 'dir-1-1', 'dir-1-1-1']),
          state: 'downloading',
        },
      },
    },
  ],
});
