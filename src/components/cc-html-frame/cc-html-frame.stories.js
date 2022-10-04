import './cc-html-frame.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-html-frame>',
  component: 'cc-html-frame',
};

const conf = {
  component: 'cc-html-frame',
  // language=CSS
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
      title: 'Hello world document',
      innerHTML: `<template><h1>Hello World</h1></template>`,
    },
  ],
});

export const heightAndWidth = makeStory(conf, {
  items: [
    {
      title: 'Hello world document',
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

export const loading = makeStory(conf, {
  items: [{ loading: true, title: 'loading' }],
});

export const script = makeStory(conf, {
  docs: 'By default, scripts inside the inner `<iframe>` are executed.',
  items: [
    {
      title: 'Hello world document',
      innerHTML: `
        <template>
          <h1>Hello World</h1>
          <script>
            document.body.innerHTML += '<p>By default, scripts inside the inner <code>&lt;iframe&gt;</code> are executed.</p>';
            document.body.innerHTML += '<p>Script injection!!!</p>';
          </script>
        </template>
      `,
    },
  ],
});

// Store something in local storage so we can test if it's available in the frame.
window.localStorage.setItem('cc-html-frame-example', 'from-parent-window');

export const sameOrigin = makeStory(conf, {
  docs: 'By default, the inner `<iframe>` shares the same origin as the parent window and therefore has access to the same local storage.',
  items: [
    {
      title: 'Hello world document',
      innerHTML: `
        <template>
          <h1>Hello World</h1>
          <p>By default, the inner <code>&lt;iframe&gt;</code> shares the same origin as the parent window and therefore has access to the same local storage.</p>
          <script>
            document.body.innerHTML += '<p>From local storage: ' + window.localStorage.getItem('cc-html-frame-example') + '</p>';
          </script>
        </template>
      `,
    },
  ],
});

export const sandbox = makeStory(conf, {
  docs: 'You can use the same `sandbox` attribute as with a normal `<iframe>`. When set to `sandbox=""`, many things inside the iframe are disabled, including scripts.',
  items: [
    {
      title: 'Hello world document',
      sandbox: '',
      innerHTML: `
        <template>
          <h1>Hello World</h1>
          <p>You can use the same <code>sandbox</code> attribute as with a normal <code>&lt;iframe&gt;</code>. When set to <code>sandbox=""</code>, many things inside the iframe are disabled, including scripts.</p>
          <script>
            document.body.innerHTML += '<p>Script injection!!!</p>';
          </script>
        </template>
      `,
    },
  ],
});

export const sandboxWithAllowScripts = makeStory(conf, {
  docs: 'You can use the same `sandbox` attribute as with a normal `<iframe>`. When set to `sandbox="allow-scripts"`, the scripts will run but access to APIs like local storage or cookies will still be disabled.',
  items: [
    {
      title: 'Hello world document',
      sandbox: 'allow-scripts',
      innerHTML: `
        <template>
          <h1>Hello World</h1>
          <p>You can use the same <code>sandbox</code> attribute as with a normal <code>&lt;iframe&gt;</code>. When set to <code>sandbox="allow-scripts"</code>, the scripts will run but access to APIs like local storage or cookies will still be disabled.</p>
          <script>
            document.body.innerHTML += '<p>Script injection!!!</p>';
            document.body.innerHTML += '<p>From local storage: ' + window.localStorage.getItem('cc-html-frame-example') + '</p>';
          </script>
        </template>
      `,
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{ loading: true }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.innerHTML = `
        <template>
          <h1>Hello cats 1</h1>
          ${Array.from({ length: 100 }, (a, i) => `<img src="https://placekitten.com/${200 + i}/${300 + i}">`).join('\n')}
        </template>
      `;
    }),
    storyWait(5000, ([component]) => {
      component.innerHTML = `
        <template>
          <h1>Hello cats 2</h1>
          ${Array.from({ length: 100 }, (a, i) => `<img src="https://placekitten.com/${250 + i}/${350 + i}">`).join('\n')}
        </template>
      `;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  heightAndWidth,
  defaultCss,
  loading,
  script,
  sameOrigin,
  sandbox,
  sandboxWithAllowScripts,
  simulations,
});
