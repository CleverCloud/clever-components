import '../../components/env-var/env-var-full.js';
import notes from '../../.components-docs/env-var-full.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

export default {
  title: '🛠 Environment variables|<env-var-full>',
  component: 'env-var-full',
  parameters: { notes },
};

const conf = {
  component: 'env-var-full',
};

export const skeleton = makeStory(conf, {
  items: [{ variables: new Promise(() => null) }],
});

export const appLoadedAddonLoading = makeStory(conf, {
  name: '👍 App loaded / ⌛ Add-on loading',
  items: [{
    variables: Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]),
    addons: [
      {
        id: 'foo',
        name: 'Fooooooo',
        variables: new Promise(() => null),
      },
      {
        id: 'bar',
        name: 'Baaaaaar',
        variables: new Promise(() => null),
      },
    ],
  }],
});

export const appLoadedAddonLoaded = makeStory(conf, {
  name: '👍 App loaded / 👍 Add-on loaded',
  items: [{
    variables: Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]),
    addons: [
      {
        id: 'foo',
        name: 'Fooooooo',
        variables: Promise.resolve([
          { name: 'FOO_VARIABLE_ONE', value: 'Value one' },
          { name: 'FOO_VARIABLE_TWO_TWO', value: 'Value two two' },
          { name: 'FOO_VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
        ]),
      },
      {
        id: 'bar',
        name: 'Baaaaaar',
        variables: Promise.resolve([
          { name: 'BAR_VARIABLE_ONE', value: 'Value one' },
          { name: 'BAR_VARIABLE_TWO_TWO', value: 'Value two two' },
          { name: 'BAR_VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
        ]),
      },
    ],
  }],
});

export const appLoadedAddonLoadedRestartButton = makeStory(conf, {
  name: '👍 App loaded / 👍 Add-on loaded (restart button)',
  items: [{
    variables: Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]),
    restartApp: true,
    addons: [
      {
        id: 'foo',
        name: 'Fooooooo',
        variables: Promise.resolve([
          { name: 'FOO_VARIABLE_ONE', value: 'Value one' },
          { name: 'FOO_VARIABLE_TWO_TWO', value: 'Value two two' },
          { name: 'FOO_VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
        ]),
      },
      {
        id: 'bar',
        name: 'Baaaaaar',
        variables: Promise.resolve([
          { name: 'BAR_VARIABLE_ONE', value: 'Value one' },
          { name: 'BAR_VARIABLE_TWO_TWO', value: 'Value two two' },
          { name: 'BAR_VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
        ]),
      },
    ],
  }],
});

export const errorWithLoading = makeStory(conf, {
  name: '🔥 App loading / 🔥 Add-on loading',
  items: [{
    addons: [
      {
        id: 'foo',
        name: 'Fooooooo',
      },
      {
        id: 'bar',
        name: 'Baaaaaar',
      },
    ],
  }],
  simulations: [
    storyWait(0, ([component]) => {
      component.variables = Promise.reject(new Error());
      component.addons = component.addons.map((addon) => {
        return { ...addon, variables: Promise.reject(new Error()) };
      });
    }),
  ],
});

export const errorWithSavingAppAndLoadingAddon = makeStory(conf, {
  name: '🔥 App saving / 🔥 Add-on loading',
  items: [{
    variables: Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]),
    addons: [
      {
        id: 'foo',
        name: 'Fooooooo',
      },
      {
        id: 'bar',
        name: 'Baaaaaar',
      },
    ],
  }],
  simulations: [
    storyWait(0, ([component]) => {
      component.variables = Promise.reject(new Error());
      component.addons = component.addons.map((addon) => {
        return { ...addon, variables: Promise.reject(new Error()) };
      });
    }),
  ],
});

enhanceStoriesNames({
  skeleton,
  appLoadedAddonLoading,
  appLoadedAddonLoaded,
  appLoadedAddonLoadedRestartButton,
  errorWithSavingAppAndLoadingAddon,
  errorWithLoading,
});
