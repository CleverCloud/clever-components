import '../../src/overview/cc-header-orga.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

function orga (name, avatar, cleverEnterprise, emergencyNumber) {
  return { name, avatar, cleverEnterprise, emergencyNumber };
}

export default {
  title: '🛠 Overview/<cc-header-orga>',
  component: 'cc-header-orga',
};

const conf = {
  component: 'cc-header-orga',
  css: `
    cc-header-orga:not(:last-child) {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ orga: orga('ACME corporation world', 'http://placekitten.com/350/350', true, '+33 6 00 00 00 00') }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithClassicClient = makeStory(conf, {
  items: [{ orga: orga('ACME startup', 'http://placekitten.com/200/200', false, null) }],
});

export const dataLoadedWithClassicClientNoAvatar = makeStory(conf, {
  items: [{ orga: orga('ACME startup', null, false, null) }],
});

export const dataLoadedWithEnterpriseClient = makeStory(conf, {
  items: [{ orga: orga('ACME corporation digital', 'http://placekitten.com/300/300', true, null) }],
});

export const dataLoadedWithEnterpriseClientEmergencyNumber = makeStory(conf, {
  items: [{ orga: orga('ACME corporation world', 'http://placekitten.com/350/350', true, '+33 6 00 00 00 00') }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(3000, ([component, componentNoAvatar, componentError]) => {
      component.orga = orga('ACME corporation', 'http://placekitten.com/200/200', true, null);
      componentNoAvatar.orga = orga('ACME corporation (no avatar)', null, true, null);
      componentError.error = true;
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
