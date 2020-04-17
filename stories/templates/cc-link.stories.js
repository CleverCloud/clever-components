import { render } from 'lit-html';
import { skeleton as skeletonStyles } from '../../components/styles/skeleton.js';
import { ccLink, linkStyles } from '../../components/templates/cc-link.js';
import { makeStory } from '../lib/make-story.js';
import docsPage from './cc-link.mdx';

export default {
  title: '♻️ Templates|ccLink()',
  parameters: { docs: { page: docsPage } },
};

const conf = {
  css: [linkStyles, skeletonStyles].join(''),
};

export const defaultStory = makeStory(conf, {
  dom: (container) => render(ccLink('https://example.com', 'This is an outside link using the link styles'), container),
});

export const innerLink = makeStory(conf, {
  dom: (container) => render(ccLink('/other-page', 'This is an inside link using the link styles'), container),
});

export const skeleton = makeStory(conf, {
  dom: (container) => render(ccLink('https://example.com', 'This is a link using the link styles', true), container),
});
