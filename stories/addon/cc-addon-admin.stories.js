import '../../src/addon/cc-addon-admin.js';
import notes from '../../.components-docs/cc-addon-admin.md';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon|<cc-addon-admin>',
  component: 'cc-addon-admin',
  parameters: { notes },
};

const conf = {
  component: 'cc-addon-admin',
  events: ['cc-addon-admin:update-name', 'cc-addon-admin:delete-addon', 'cc-addon-admin:update-tags'],
  css: `
    cc-addon-admin {
      margin-bottom: 1rem;
    }
  `,
};

const addon = {
  name: 'Awesome addon (PROD)',
  tags: ['foo:bar', 'simple-tag'],
};

export const defaultStory = makeStory(conf, {
  items: [{ addon }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const saving = makeStory(conf, {
  items: [{ addon, saving: true }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{ error: 'loading' }],
});

export const errorWithSaving = makeStory(conf, {
  items: [{ addon, error: 'saving' }],
});

export const simulations = makeStory(conf, {
  items: [{}, { saving: true }, {}],
  simulations: [
    storyWait(2000, ([component, componentSaving, componentError]) => {
      component.addon = addon;
      componentSaving.saving = false;
      componentSaving.error = 'saving';
      componentError.error = 'loading';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  saving,
  errorWithLoading,
  errorWithSaving,
  simulations,
});
