import changelog from '../../CHANGELOG.md';
import contributing from '../../CONTRIBUTING.md';
import readme from '../../README.md';
import release from '../../RELEASE.md';
import { storiesOf } from '@storybook/web-components';
import { markdownToDom, markdownToReact } from '../lib/markdown';
import { formatStoryName } from '../lib/story-names.js';

// TODO: It would be even better if we could load simple markdown files
export function createDocsStories (kind, stories) {
  Object.entries(stories).forEach(([name, markdownText]) => {
    const storyName = formatStoryName(name);
    storiesOf(kind + '|' + storyName, module)
      .addParameters({
        options: { showPanel: false },
      })
      .add('page', () => markdownToDom(markdownText).element, {
        docs: { page: () => markdownToReact(markdownText) },
      });
  });
}

createDocsStories('0. Welcome', {
  readme,
  changelog,
  contributing,
  release,
});
