import '../../src/addon/cc-jenkins-info.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-jenkins-info>',
  component: 'cc-jenkins-info',
};

const conf = {
  component: 'cc-jenkins-info',
  css: `
    cc-jenkins-info {
      margin-bottom: 1rem;
    }
  `,
};

const jenkinsLink = 'https://my-jenkins.example.com';
const jenkinsManageLink = 'https://my-jenkins.example.com/manage';
const differentVersions = { current: 'v2.1.3', available: 'v2.1.4' };
const sameVersions = { current: 'v2.1.3', available: 'v2.1.3' };

export const defaultStory = makeStory(conf, {
  items: [{ jenkinsLink, jenkinsManageLink, versions: sameVersions }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const errorStory = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithSameVersion = makeStory(conf, {
  items: [{ jenkinsLink, jenkinsManageLink, versions: sameVersions }],
});

export const dataLoadedWithDifferentVersions = makeStory(conf, {
  items: [{ jenkinsLink, jenkinsManageLink, versions: differentVersions }],
});

export const simulations = makeStory(conf, {
  items: [
    {},
    {},
    {},
  ],
  simulations: [
    storyWait(2000, ([componentUpToDate, componentWithUpdate, componentError]) => {
      componentUpToDate.jenkinsLink = jenkinsLink;
      componentUpToDate.jenkinsManageLink = jenkinsManageLink;
      componentUpToDate.versions = sameVersions;

      componentWithUpdate.jenkinsLink = jenkinsLink;
      componentWithUpdate.jenkinsManageLink = jenkinsManageLink;
      componentWithUpdate.versions = differentVersions;

      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorStory,
  dataLoadedWithSameVersion,
  dataLoadedWithDifferentVersions,
  simulations,
});
