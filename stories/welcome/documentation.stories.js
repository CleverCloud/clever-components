import changelog from '../../CHANGELOG.md';
import contributing from '../../CONTRIBUTING.md';
import readme from '../../README.md';
import release from '../../RELEASE.md';
import { markdownToDom, markdownToReact } from '../lib/markdown.js';
import { storiesOf } from '@storybook/web-components';

// TODO: It would be even better if we could load simple markdown files
export function createDocsStories (kind, stories) {
  Object.entries(stories).forEach(([name, markdownText]) => {
    storiesOf(kind + '|' + name, module)
      .addParameters({
        options: { showPanel: false },
      })
      .add('Page', () => markdownToDom(markdownText).element, {
        docsOnly: true,
        docs: {
          page: () => markdownToReact(markdownText),
        },
      });
  });
}

createDocsStories('📌  HOME', {
  Changelog: changelog,
  Contributing: contributing,
  // Small trick to put readme first ;-)
  ' Readme': readme,
  Release: release,
});
