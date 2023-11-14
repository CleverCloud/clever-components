import './cc-header-orga.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Overview/<cc-header-orga>',
  component: 'cc-header-orga',
};

const conf = {
  component: 'cc-header-orga',
};

const DEFAULT_ORGA = {
  state: 'loaded',
  name: 'ACME corporation world',
  avatar: 'http://placekitten.com/350/350',
  cleverEnterprise: true,
  emergencyNumber: '+33 6 00 00 00 00',
};

export const defaultStory = makeStory(conf, {
  items: [{
    orga: DEFAULT_ORGA,
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    orga: {
      state: 'loading',
    },
  }],
});

export const error = makeStory(conf, {
  items: [{
    orga: {
      state: 'error',
    },
  }],
});

export const dataLoadedWithClassicClient = makeStory(conf, {
  items: [{
    orga: {
      ...DEFAULT_ORGA,
      cleverEnterprise: false,
      emergencyNumber: null,
    },
  }],
});

export const dataLoadedWithClassicClientNoAvatar = makeStory(conf, {
  items: [{
    orga: {
      ...DEFAULT_ORGA,
      avatar: null,
      cleverEnterprise: false,
      emergencyNumber: null,
    },
  }],
});

export const dataLoadedWithEnterpriseClient = makeStory(conf, {
  items: [{
    orga: {
      ...DEFAULT_ORGA,
      emergencyNumber: null,
    },
  }],
});

export const dataLoadedWithEnterpriseClientEmergencyNumber = makeStory(conf, {
  items: [{
    orga: DEFAULT_ORGA,
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(3000, ([component, componentNoAvatar, componentError]) => {
      component.orga = DEFAULT_ORGA;
      componentNoAvatar.orga = {
        ...DEFAULT_ORGA,
        avatar: null,
      };
      componentError.orga = { state: 'error' };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoadedWithClassicClient,
  dataLoadedWithClassicClientNoAvatar,
  dataLoadedWithEnterpriseClient,
  dataLoadedWithEnterpriseClientEmergencyNumber,
  simulations,
});
