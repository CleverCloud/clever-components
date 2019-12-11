import changelogMd from '../../CHANGELOG.md';
import contributingMd from '../../CONTRIBUTING.md';
import readmeMd from '../../README.md';
import { markdownToDom } from '../lib/markdown.js';
import { storiesOf } from '@storybook/html';

const guidesReq = require.context('../../docs/guides', true, /.+md$/);

const documentationAsStories = storiesOf('0. Welcome|Documentation & guides', module)
  .addParameters({
    options: {
      showPanel: false,
    },
  });

documentationAsStories.add('README', () => markdownToDom(readmeMd).element);
documentationAsStories.add('Contributing', () => markdownToDom(contributingMd).element);
documentationAsStories.add('Changelog', () => markdownToDom(changelogMd).element);

// We still use storiesOf() here because we don't want to list all ADRs statically
guidesReq.keys().forEach((filename) => {
  const markdownText = guidesReq(filename).default;
  const { title, element } = markdownToDom(markdownText);
  documentationAsStories.add(title, () => element);
});
