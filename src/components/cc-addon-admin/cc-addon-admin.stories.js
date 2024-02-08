import './cc-addon-admin.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-admin>',
  component: 'cc-addon-admin',
};

const conf = {
  component: 'cc-addon-admin',
};

const addon = {
  name: 'Awesome addon (PROD)',
  tags: ['foo:bar', 'simple-tag'],
};

export const defaultStory = makeStory(conf, {
  items: [{
    state: {
      type: 'loaded',
      name: addon.name,
      tags: addon.tags,
    },
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    state: {
      type: 'loading',
    },
  }],
});

export const waitingWithUpdatingName = makeStory(conf, {
  items: [{
    state: {
      type: 'updatingName',
      name: addon.name,
      tags: addon.tags,
    },
  }],
});

export const waitingWithUpdatingTags = makeStory(conf, {
  items: [{
    state: {
      type: 'updatingTags',
      name: addon.name,
      tags: addon.tags,
    },
  }],
});

export const waitingWithDeleting = makeStory(conf, {
  items: [{
    state: {
      type: 'deleting',
      name: addon.name,
      tags: addon.tags,
    },
  }],
});
export const errorWithLoading = makeStory(conf, {
  items: [{
    state: {
      type: 'error',
    },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        name: addon.name,
        tags: addon.tags,
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        name: 'My new Addon Name',
        tags: addon.tags,
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'updatingName',
        name: 'My new Addon Name',
        tags: addon.tags,
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        name: 'My new Addon Name',
        tags: addon.tags,
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        name: 'My new Addon Name',
        tags: [...addon.tags, 'new-tag'],
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'updatingTags',
        name: 'My new Addon Name',
        tags: [...addon.tags, 'new-tag'],
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        name: 'My new Addon Name',
        tags: [...addon.tags, 'new-tag'],
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component, componentError]) => {
      component.state = {
        type: 'deleting',
        name: 'My new Addon Name',
        tags: [...addon.tags, 'new-tag'],
      };
      componentError.state = { type: 'error' };
    }),
  ],
});
