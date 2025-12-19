import { objects } from '../../stories/fixtures/cellar.js';
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
    height: 400px;
  }`,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        objects: objects(50),
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

export const fewObjects = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        objects: objects(3),
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
        objects: [],
      },
    },
  ],
});

export const filter = makeStory(conf, {
  /** @type {Partial<CcCellarObjectList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        bucketName: 'bucket-1',
        objects: objects([
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
        objects: [],
        filter: '???',
      },
    },
  ],
});
