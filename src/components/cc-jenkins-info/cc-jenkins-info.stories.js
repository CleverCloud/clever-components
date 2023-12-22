import './cc-jenkins-info.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-jenkins-info>',
  component: 'cc-jenkins-info',
};

const conf = {
  component: 'cc-jenkins-info',
};

const jenkinsLink = 'https://my-jenkins.example.com';
const jenkinsManageLink = 'https://my-jenkins.example.com/manage';
const differentVersions = { current: 'v2.1.3', available: 'v2.1.4' };
const sameVersions = { current: 'v2.1.3', available: 'v2.1.3' };

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        jenkinsLink,
        jenkinsManageLink,
        versions: sameVersions,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const dataLoadedWithSameVersion = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        jenkinsLink,
        jenkinsManageLink,
        versions: sameVersions,
      },
    },
  ],
});

export const dataLoadedWithDifferentVersions = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        jenkinsLink,
        jenkinsManageLink,
        versions: differentVersions,
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [
    {},
    {},
    {},
  ],
  simulations: [
    storyWait(2000, ([componentUpToDate, componentWithUpdate, componentError]) => {
      componentUpToDate.state = { type: 'loaded', jenkinsLink, jenkinsManageLink, versions: sameVersions };
      componentWithUpdate.state = { type: 'loaded', jenkinsLink, jenkinsManageLink, versions: differentVersions };
      componentError.state = { type: 'error' };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithSameVersion,
  dataLoadedWithDifferentVersions,
  simulations,
});
