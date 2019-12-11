import '../../components/env-var/env-var-full.js';
import notes from '../../.components-docs/env-var-full.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions(
  'env-var-form:submit',
  'env-var-full:dismissed-error',
  'env-var-form:restart-app',
);

export default {
  title: '2. Environment variables|<env-var-full>',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = new Promise(() => null);
  return envVar;
});

export const appLoadedAddonLoading = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  envVar.addons = [
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
  ];
  return envVar;
});

export const appLoadedAddonLoaded = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  envVar.addons = [
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
  ];
  return envVar;
});

export const appLoadedAddonLoadedRestartButton = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  envVar.restartApp = true;
  envVar.addons = [
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
  ];
  return envVar;
});

export const errorWithLoading = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = Promise.reject(new Error());
  envVar.addons = [
    {
      id: 'foo',
      name: 'Fooooooo',
      variables: Promise.reject(new Error()),
    },
    {
      id: 'bar',
      name: 'Baaaaaar',
      variables: Promise.reject(new Error()),
    },
  ];
  return envVar;
});

export const appSavingAddonLoading = withActions(() => {
  const envVar = document.createElement('env-var-full');
  envVar.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  setTimeout(() => {
    envVar.variables = Promise.reject(new Error());
  }, 0);
  envVar.addons = [
    {
      id: 'foo',
      name: 'Fooooooo',
      variables: Promise.reject(new Error()),
    },
    {
      id: 'bar',
      name: 'Baaaaaar',
      variables: Promise.reject(new Error()),
    },
  ];
  return envVar;
});

appLoadedAddonLoading.story = { name: '👍 App loaded / ⌛ Add-on loading' };
appLoadedAddonLoaded.story = { name: '👍 App loaded / 👍 Add-on loaded' };
appLoadedAddonLoadedRestartButton.story = { name: '👍 App loaded / 👍 Add-on loaded (restart button)' };
appSavingAddonLoading.story = { name: '⌛ App saving / ⌛ Add-on loading' };
enhanceStoriesNames({ skeleton, errorWithLoading });
