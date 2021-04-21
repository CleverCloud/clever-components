import '../../src/atoms/cc-html-frame.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-html-frame>',
  component: 'cc-html-frame',
};

const conf = {
  component: 'cc-html-frame',
  css: `
    cc-html-frame {
      background-color: white;
      border: 1px solid black;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      title: 'hello world document',
      innerHTML: `<template><h1>Hello World</h1></template>`,
    },
  ],
});

export const heightAndWidth = makeStory(conf, {
  items: [
    {
      title: 'hello world document',
      innerHTML: '<template><h1>Hello World</h1></template>',
      style: 'height: 600px; width: 400px',
    },
  ],
});

export const defaultCss = makeStory(conf, {
  css: ``,
  items: [
    {
      title: 'hello world document',
      innerHTML: '<template><h1>Hello World</h1></template>',
    },
  ],
});

export const script = makeStory(conf, {
  items: [
    {
      title: 'hello world document',
      innerHTML: `<template><h1>Hello World</h1><script>document.querySelector('h1').innerHTML+=' (with-script)'</script></template>`,
    },
  ],
});

export const sandbox = makeStory(conf, {
  items: [
    {
      title: 'hello world document',
      sandbox: '',
      innerHTML: `<template><h1>Hello World</h1><script>document.querySelector('h1').innerHTML+=' (with-script)'</script></template>`,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  heightAndWidth,
  defaultCss,
  script,
  sandbox,
});
