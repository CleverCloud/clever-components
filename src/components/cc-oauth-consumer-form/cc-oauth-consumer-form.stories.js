import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-form.js';

export default {
  tags: ['autodocs'],
  title: '🛠 oAuth Consumer/<cc-oauth-consumer-form>',
  component: 'cc-oauth-consumer-form',
};

const conf = {
  component: 'cc-oauth-consumer-form',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'idle-create',
      },
    },
  ],
});

export const create = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'idle-create',
      },
    },
  ],
});

export const update = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'idle-update',
      },
    },
  ],
});

export const creating = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'creating',
      },
    },
  ],
});

export const updating = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'updating',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'error',
      },
    },
  ],
});

export const deleting = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'deleting',
      },
    },
  ],
});

export const dataLoaded = makeStory(conf, {});
