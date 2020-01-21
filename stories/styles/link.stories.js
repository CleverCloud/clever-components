import docsPage from './link.mdx';
import { linkStyles } from '../../components/styles/link.js';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '🎨 Styles|link',
  parameters: { docs: { page: docsPage } },
};

export const defaultStory = makeStory({
  css: linkStyles,
  dom: (container) => {
    container.innerHTML = `
      <a class="cc-link" href="https://example.com">This is a link using the link styles</a>
    `;
  },
});
